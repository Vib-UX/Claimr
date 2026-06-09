import { NextResponse } from "next/server";
import { PINATA_ENABLED, pinFile } from "@/lib/server/pinata";

/**
 * Pins a captured "moment" photo to IPFS via Pinata.
 *
 * The client sends the photo as a base64 data URL (the canvas export from the
 * capture screen). We decode it server-side and pin the bytes, returning the
 * CID / ipfs:// URI / gateway URL so the claim flow can use it as the NFT image.
 */

interface UploadBody {
  dataUrl?: string;
  filename?: string;
}

const MAX_BYTES = 12 * 1024 * 1024; // 12 MB — generous for a single photo.

export async function POST(req: Request) {
  if (!PINATA_ENABLED) {
    return NextResponse.json(
      { error: "IPFS uploads are not configured (missing PINATA_JWT)." },
      { status: 503 },
    );
  }

  let body: UploadBody;
  try {
    body = (await req.json()) as UploadBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { dataUrl, filename } = body;
  if (!dataUrl || typeof dataUrl !== "string") {
    return NextResponse.json({ error: "Missing image data" }, { status: 400 });
  }

  const match = /^data:([^;,]+)(;base64)?,(.*)$/s.exec(dataUrl);
  if (!match) {
    return NextResponse.json({ error: "Unsupported image format" }, { status: 400 });
  }

  const contentType = match[1] || "image/png";
  const isBase64 = Boolean(match[2]);
  const payload = match[3];

  const bytes = isBase64
    ? new Uint8Array(Buffer.from(payload, "base64"))
    : new Uint8Array(Buffer.from(decodeURIComponent(payload), "utf-8"));

  if (bytes.byteLength === 0) {
    return NextResponse.json({ error: "Empty image" }, { status: 400 });
  }
  if (bytes.byteLength > MAX_BYTES) {
    return NextResponse.json({ error: "Image too large" }, { status: 413 });
  }

  try {
    const ext = contentType.split("/")[1]?.split("+")[0] || "png";
    const name = filename || `claimr-moment-${Date.now()}.${ext}`;
    const result = await pinFile(bytes, name, contentType);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[upload] pin failed", err);
    return NextResponse.json(
      { error: "Failed to upload to IPFS. Please try again." },
      { status: 502 },
    );
  }
}
