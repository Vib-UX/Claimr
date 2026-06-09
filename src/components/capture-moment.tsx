"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  X,
  Loader2,
  Download,
  Share2,
  RefreshCw,
  Sparkles,
  SwitchCamera,
  CameraOff,
  ScanLine,
  CloudUpload,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { CollectibleArt, PinnedImage } from "@/lib/types";
import { Button } from "@/components/ui/button";

const CollectibleScene = dynamic(
  () => import("@/components/three/collectible-scene"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="size-7 animate-spin text-white/70" />
      </div>
    ),
  },
);

type CameraStatus = "idle" | "requesting" | "granted" | "denied" | "unavailable";
type Facing = "user" | "environment";
type UploadStatus = "idle" | "uploading" | "pinned" | "error";

interface Props {
  open: boolean;
  onClose: () => void;
  art: CollectibleArt;
  eventTitle: string;
  /** Optional camera-specific models (rendered side by side over the feed). */
  modelUrls?: string[];
  /** Default camera. The selfie cam puts the user in frame with the collectible. */
  defaultFacing?: Facing;
  /**
   * Fired when the user chooses to mint after capturing the moment. When a photo
   * was captured and pinned to IPFS, the pinned image is passed through so it can
   * become the NFT's image.
   */
  onContinue: (captured?: PinnedImage) => void;
}

/** Source crop so the video fills a w×h box while preserving aspect (object-fit: cover). */
function coverCrop(sw: number, sh: number, dw: number, dh: number) {
  const sAspect = sw / sh;
  const dAspect = dw / dh;
  let cw: number;
  let ch: number;
  if (sAspect > dAspect) {
    ch = sh;
    cw = sh * dAspect;
  } else {
    cw = sw;
    ch = sw / dAspect;
  }
  return { sx: (sw - cw) / 2, sy: (sh - ch) / 2, sw: cw, sh: ch };
}

export function CaptureMoment({
  open,
  onClose,
  art,
  eventTitle,
  modelUrls,
  defaultFacing = "user",
  onContinue,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [status, setStatus] = useState<CameraStatus>("idle");
  const [facing, setFacing] = useState<Facing>(defaultFacing);
  const [photo, setPhoto] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [pinned, setPinned] = useState<PinnedImage | null>(null);

  useEffect(() => setMounted(true), []);

  // After the camera is live, run a brief "scanning the vicinity" pass before
  // revealing the collectible, so it feels placed in the space.
  useEffect(() => {
    if (status !== "granted") {
      setScanning(false);
      return;
    }
    setScanning(true);
    const t = setTimeout(() => setScanning(false), 2000);
    return () => clearTimeout(t);
  }, [status]);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const startCamera = useCallback(
    async (next: Facing) => {
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        setStatus("unavailable");
        return;
      }
      setStatus("requesting");
      try {
        stopStream();
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: next, width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setStatus("granted");
      } catch (err) {
        const name = (err as { name?: string })?.name;
        setStatus(name === "NotAllowedError" || name === "SecurityError" ? "denied" : "unavailable");
      }
    },
    [stopStream],
  );

  // Open / close lifecycle: lock scroll, start the camera, clean up on close.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    setPhoto(null);
    setPinned(null);
    setUploadStatus("idle");
    setFacing(defaultFacing);
    void startCamera(defaultFacing);
    return () => {
      document.body.style.overflow = "";
      stopStream();
    };
  }, [open, defaultFacing, startCamera, stopStream]);

  const flipCamera = () => {
    const next: Facing = facing === "user" ? "environment" : "user";
    setFacing(next);
    void startCamera(next);
  };

  // Pin the captured photo to IPFS (Pinata) so it can be used as the NFT image.
  const uploadMoment = useCallback(
    async (dataUrl: string) => {
      setUploadStatus("uploading");
      setPinned(null);
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dataUrl, filename: "claimr-moment.png" }),
        });
        if (!res.ok) throw new Error(`Upload failed (${res.status})`);
        const data = (await res.json()) as PinnedImage;
        setPinned(data);
        setUploadStatus("pinned");
      } catch {
        // Non-fatal: the user can still claim; the NFT just falls back to the
        // generated artwork instead of the photo.
        setUploadStatus("error");
      }
    },
    [],
  );

  const capture = useCallback(() => {
    const video = videoRef.current;
    const stage = stageRef.current;
    if (!video || !stage) return;
    const glCanvas = stage.querySelector("canvas");
    const rect = stage.getBoundingClientRect();
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    const W = Math.max(1, Math.round(rect.width * scale));
    const H = Math.max(1, Math.round(rect.height * scale));

    const out = document.createElement("canvas");
    out.width = W;
    out.height = H;
    const ctx = out.getContext("2d");
    if (!ctx) return;

    const vw = video.videoWidth;
    const vh = video.videoHeight;
    if (vw && vh) {
      const crop = coverCrop(vw, vh, W, H);
      ctx.save();
      if (facing === "user") {
        ctx.translate(W, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, W, H);
      ctx.restore();
    } else {
      ctx.fillStyle = "#0b0b12";
      ctx.fillRect(0, 0, W, H);
    }

    if (glCanvas) {
      ctx.drawImage(glCanvas, 0, 0, W, H);
    }

    // Subtle watermark so the saved moment is unmistakably a Claimr proof.
    const pad = Math.round(W * 0.04);
    ctx.font = `600 ${Math.round(W * 0.038)}px ui-sans-serif, system-ui, sans-serif`;
    ctx.textBaseline = "bottom";
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.shadowColor = "rgba(0,0,0,0.55)";
    ctx.shadowBlur = Math.round(W * 0.02);
    ctx.fillText("Claimr · Proof you were there", pad, H - pad);
    ctx.font = `500 ${Math.round(W * 0.028)}px ui-sans-serif, system-ui, sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.78)";
    ctx.fillText(eventTitle, pad, H - pad - Math.round(W * 0.058));

    try {
      const dataUrl = out.toDataURL("image/png");
      setPhoto(dataUrl);
      void uploadMoment(dataUrl);
    } catch {
      // Capture failed (rare). Leave live view active so the user can retry.
    }
  }, [facing, eventTitle, uploadMoment]);

  const sharePhoto = useCallback(async () => {
    if (!photo) return;
    try {
      const blob = await (await fetch(photo)).blob();
      const file = new File([blob], "claimr-moment.png", { type: "image/png" });
      const nav = navigator as Navigator & {
        canShare?: (data?: ShareData) => boolean;
      };
      if (nav.canShare?.({ files: [file] }) && nav.share) {
        await nav.share({
          files: [file],
          title: "Claimr · Capture the moment",
          text: `My proof of presence at ${eventTitle}.`,
        });
        return;
      }
    } catch {
      // Fall through to download on share failure / cancel.
    }
    const a = document.createElement("a");
    a.href = photo;
    a.download = "claimr-moment.png";
    a.click();
  }, [photo, eventTitle]);

  const handleClose = () => {
    stopStream();
    onClose();
  };

  if (!mounted || !open) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Stage: live camera + transparent 3D overlay (or captured still). */}
        <div ref={stageRef} className="absolute inset-0 overflow-hidden">
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className="absolute inset-0 h-full w-full object-cover"
            style={{ transform: facing === "user" ? "scaleX(-1)" : undefined }}
          />

          {/* The collectible floating over the real world. Hidden while previewing
              a still or during the initial scan. */}
          {!photo && status === "granted" && !scanning && (
            <div className="absolute inset-0">
              <CollectibleScene art={art} reveal interactive camera modelUrls={modelUrls} />
            </div>
          )}

          {/* Scanning the vicinity */}
          {!photo && status === "granted" && scanning && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-5">
              <div className="relative grid size-44 place-items-center">
                <motion.span
                  className="absolute inset-0 rounded-full border border-white/30"
                  animate={{ scale: [0.7, 1.15], opacity: [0.6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
                <motion.span
                  className="absolute inset-0 rounded-full border border-white/30"
                  animate={{ scale: [0.7, 1.15], opacity: [0.6, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: 1,
                  }}
                />
                <span className="absolute inset-6 rounded-full border border-white/40" />
                <motion.span
                  className="absolute inset-6 rounded-full"
                  style={{
                    background:
                      "conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.45) 60deg, transparent 120deg)",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                />
                <ScanLine className="size-7 text-white/85" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-white">
                  Scanning the vicinity…
                </p>
                <p className="mt-0.5 text-xs text-white/60">
                  Locating your collectible
                </p>
              </div>
            </div>
          )}

          {photo && (
            <img
              src={photo}
              alt="Captured moment"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          {/* Permission / error states */}
          {(status === "requesting" || status === "denied" || status === "unavailable") &&
            !photo && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-6 text-center">
                {status === "requesting" ? (
                  <div className="flex flex-col items-center gap-3 text-white/80">
                    <Loader2 className="size-7 animate-spin" />
                    <p className="text-sm">Opening your camera…</p>
                  </div>
                ) : (
                  <div className="max-w-xs space-y-3 text-white/85">
                    <CameraOff className="mx-auto size-8" />
                    <p className="font-medium">
                      {status === "denied"
                        ? "Camera access blocked"
                        : "Camera unavailable"}
                    </p>
                    <p className="text-sm text-white/65">
                      {status === "denied"
                        ? "Enable camera permission in your browser to capture the moment, or claim without a photo."
                        : "We couldn't reach a camera on this device. You can still claim your moment."}
                    </p>
                    {status === "denied" && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => startCamera(facing)}
                      >
                        <RefreshCw className="size-4" />
                        Try again
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
        </div>

        {/* Top bar */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 pt-[max(1rem,env(safe-area-inset-top))]">
          <div className="rounded-full bg-black/45 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="size-3.5" />
              Capture the moment
            </span>
          </div>
          <div className="flex items-center gap-2">
            {status === "granted" && !photo && (
              <button
                onClick={flipCamera}
                aria-label="Switch camera"
                className="inline-flex size-9 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition hover:bg-black/65"
              >
                <SwitchCamera className="size-4" />
              </button>
            )}
            <button
              onClick={handleClose}
              aria-label="Close"
              className="inline-flex size-9 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition hover:bg-black/65"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="absolute inset-x-0 bottom-0 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-10">
          <div className="mx-auto w-full max-w-md">
            {!photo ? (
              <>
                <div className="mb-4 flex items-center justify-center">
                  <button
                    onClick={capture}
                    disabled={status !== "granted" || scanning}
                    aria-label="Take photo"
                    className="grid size-[4.5rem] place-items-center rounded-full bg-white/15 ring-2 ring-white/80 backdrop-blur transition active:scale-95 disabled:opacity-40"
                  >
                    <span className="grid size-14 place-items-center rounded-full bg-white text-black">
                      <Camera className="size-6" />
                    </span>
                  </button>
                </div>
                <Button
                  variant="gradient"
                  size="lg"
                  className="w-full"
                  onClick={() => onContinue()}
                >
                  <Sparkles className="size-4" />
                  Claim your moment onchain
                </Button>
                <p className="mt-2 text-center text-xs text-white/60">
                  Snap a photo with your collectible, or claim without one
                </p>
              </>
            ) : (
              <>
                <div className="mb-3 flex items-center justify-center">
                  <IpfsStatusPill status={uploadStatus} pinned={pinned} />
                </div>
                <div className="mb-3 grid grid-cols-2 gap-2">
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => {
                      setPhoto(null);
                      setPinned(null);
                      setUploadStatus("idle");
                    }}
                  >
                    <RefreshCw className="size-4" />
                    Retake
                  </Button>
                  <Button variant="secondary" size="lg" onClick={sharePhoto}>
                    <Share2 className="size-4" />
                    Save / share
                  </Button>
                </div>
                <Button
                  variant="gradient"
                  size="lg"
                  className="w-full"
                  disabled={uploadStatus === "uploading"}
                  onClick={() => onContinue(pinned ?? undefined)}
                >
                  {uploadStatus === "uploading" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Sparkles className="size-4" />
                  )}
                  {uploadStatus === "uploading"
                    ? "Pinning to IPFS…"
                    : "Claim your moment onchain"}
                </Button>
                <button
                  onClick={sharePhoto}
                  className="mx-auto mt-2 flex items-center gap-1.5 text-xs text-white/60 hover:text-white/90"
                >
                  <Download className="size-3.5" />
                  Download to your device
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}

function IpfsStatusPill({
  status,
  pinned,
}: {
  status: UploadStatus;
  pinned: PinnedImage | null;
}) {
  if (status === "idle") return null;

  const base =
    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur";

  if (status === "uploading") {
    return (
      <span className={`${base} bg-black/45 text-white/90`}>
        <Loader2 className="size-3.5 animate-spin" />
        Pinning your moment to IPFS…
      </span>
    );
  }

  if (status === "error") {
    return (
      <span className={`${base} bg-[color-mix(in_oklab,red_30%,black)]/60 text-white`}>
        <AlertCircle className="size-3.5" />
        IPFS upload failed — you can still claim
      </span>
    );
  }

  return (
    <a
      href={pinned?.gatewayUrl}
      target="_blank"
      rel="noreferrer"
      className={`${base} bg-[color-mix(in_oklab,limegreen_28%,black)]/55 text-white hover:opacity-90`}
    >
      <CheckCircle2 className="size-3.5" />
      Pinned to IPFS
      <CloudUpload className="size-3.5 opacity-70" />
    </a>
  );
}
