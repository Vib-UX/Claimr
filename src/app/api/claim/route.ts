import { NextResponse } from "next/server";
import { isAddress, parseEventLogs } from "viem";
import type { Claim, NFTMetadata } from "@/lib/types";
import { getEventBySlug } from "@/lib/mock/events";
import { checkGeofence, DEMO_FORCE_INSIDE_ZONE } from "@/lib/mock/geofence";
import { checkWhitelist } from "@/lib/mock/whitelist";
import { mintPoap } from "@/lib/mock/mint";
import { explorerTxUrl } from "@/lib/chain";
import { claimrPoapAbi, onchainEventId } from "@/lib/poap-abi";
import {
  ONCHAIN_ENABLED,
  POAP_ADDRESS,
  publicClient,
  getMinterWallet,
} from "@/lib/server/minter";

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "";
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET ?? "";

interface ClaimBody {
  slug: string;
  address: string;
  email?: string;
  coords?: { lat: number; lng: number };
  accessToken?: string;
}

async function verifyPrivyToken(accessToken?: string): Promise<boolean> {
  // Only enforce when both Privy server credentials and a token are present.
  if (!PRIVY_APP_ID || !PRIVY_APP_SECRET || !accessToken) return true;
  try {
    const { PrivyClient } = await import("@privy-io/server-auth");
    const privy = new PrivyClient(PRIVY_APP_ID, PRIVY_APP_SECRET);
    await privy.verifyAuthToken(accessToken);
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  let body: ClaimBody;
  try {
    body = (await req.json()) as ClaimBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { slug, address, email, coords, accessToken } = body;

  if (!address || !isAddress(address)) {
    return NextResponse.json({ error: "Invalid wallet address" }, { status: 400 });
  }

  const event = getEventBySlug(slug);
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  // 1. Identity
  if (!(await verifyPrivyToken(accessToken))) {
    return NextResponse.json({ error: "Identity verification failed" }, { status: 401 });
  }

  // 2. Geofence — require verified coordinates within the venue radius.
  if (!DEMO_FORCE_INSIDE_ZONE) {
    if (!coords) {
      return NextResponse.json(
        { error: "Location is required to verify your presence" },
        { status: 403 },
      );
    }
    const { inside, distanceMeters } = checkGeofence(
      coords,
      event.venue.center,
      event.venue.radiusMeters,
    );
    if (!inside) {
      return NextResponse.json(
        {
          error: `You're ~${Math.round(distanceMeters)}m away — claims are limited to within ${event.venue.radiusMeters}m of ${event.venue.name}.`,
        },
        { status: 403 },
      );
    }
  }

  // 3. Whitelist / email verification
  const wl = await checkWhitelist(email);
  if (!wl.whitelisted) {
    return NextResponse.json({ error: wl.reason }, { status: 403 });
  }

  const origin = new URL(req.url).origin;
  const tokenURI = `${origin}/api/metadata/${event.slug}`;
  const image = `${origin}/api/collectible/${event.slug}`;

  // 4a. Mock fallback (no contract / minter configured yet) — keeps the flow
  // working before deployment.
  if (!ONCHAIN_ENABLED || !POAP_ADDRESS) {
    const result = await mintPoap(event, address, email);
    const claim: Claim = {
      ...result.claim,
      metadata: { ...result.claim.metadata, image, metadataURI: tokenURI },
    };
    return NextResponse.json({ claim, onchain: false });
  }

  // 4b. Real onchain mint
  const eventIdHash = onchainEventId(event.id);

  try {
    const already = await publicClient.readContract({
      address: POAP_ADDRESS,
      abi: claimrPoapAbi,
      functionName: "hasClaimed",
      args: [eventIdHash, address],
    });
    if (already) {
      return NextResponse.json(
        { error: "This wallet already claimed this event" },
        { status: 409 },
      );
    }

    const { walletClient } = getMinterWallet();
    const hash = await walletClient.writeContract({
      address: POAP_ADDRESS,
      abi: claimrPoapAbi,
      functionName: "mintClaim",
      args: [address, eventIdHash, tokenURI],
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    const logs = parseEventLogs({
      abi: claimrPoapAbi,
      logs: receipt.logs,
      eventName: "Claimed",
    });
    const tokenId =
      logs.length > 0 ? String(logs[0].args.tokenId) : "0";

    const metadata: NFTMetadata = {
      tokenId,
      name: `${event.collectible.name} #${tokenId}`,
      description: event.collectible.description,
      image,
      eventId: event.id,
      metadataURI: tokenURI,
      attributes: [
        { trait_type: "Event", value: event.title },
        { trait_type: "Edition", value: event.collectible.art.edition },
        { trait_type: "City", value: event.venue.city },
        { trait_type: "Variant", value: event.collectible.art.variant },
        { trait_type: "Network", value: "Monad Testnet" },
        { trait_type: "Verification", value: "Geo + Email" },
      ],
    };

    const claim: Claim = {
      id: `claim_${tokenId}`,
      eventId: event.id,
      eventSlug: event.slug,
      eventTitle: event.title,
      wallet: address,
      email,
      txHash: hash,
      blockExplorerUrl: explorerTxUrl(hash),
      claimedAtISO: new Date().toISOString(),
      metadata,
      art: event.collectible.art,
    };

    return NextResponse.json({ claim, onchain: true });
  } catch (err) {
    console.error("[claim] mint failed", err);
    return NextResponse.json(
      { error: "Mint failed. Please try again." },
      { status: 500 },
    );
  }
}
