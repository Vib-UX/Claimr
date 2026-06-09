import "server-only";
import {
  createPublicClient,
  createWalletClient,
  http,
  isAddress,
  type Address,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { monadTestnet } from "@/lib/chain";

/**
 * Server-only chain clients. The minter account mints POAPs to verified
 * attendees so claims are gasless for users. Never import this from client
 * components — it reads MINTER_PRIVATE_KEY.
 */

const RPC_URL = process.env.MONAD_RPC_URL ?? monadTestnet.rpcUrls.default.http[0];

const rawContract = process.env.NEXT_PUBLIC_POAP_CONTRACT_ADDRESS ?? "";
const rawKey = process.env.MINTER_PRIVATE_KEY ?? "";

export const POAP_ADDRESS: Address | null =
  isAddress(rawContract) &&
  rawContract.toLowerCase() !== "0x0000000000000000000000000000000000000000"
    ? (rawContract as Address)
    : null;

const minterKey = rawKey.startsWith("0x")
  ? (rawKey as `0x${string}`)
  : rawKey
    ? (`0x${rawKey}` as `0x${string}`)
    : null;

/** True when the backend can actually mint onchain. */
export const ONCHAIN_ENABLED = Boolean(POAP_ADDRESS && minterKey);

export const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http(RPC_URL),
});

export function getMinterWallet() {
  if (!minterKey) throw new Error("MINTER_PRIVATE_KEY is not configured");
  const account = privateKeyToAccount(minterKey);
  const walletClient = createWalletClient({
    account,
    chain: monadTestnet,
    transport: http(RPC_URL),
  });
  return { account, walletClient };
}
