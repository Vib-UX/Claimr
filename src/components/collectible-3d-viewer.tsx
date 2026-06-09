"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import type { CollectibleArt } from "@/lib/types";
import { cn } from "@/lib/utils";

const CollectibleScene = dynamic(
  () => import("@/components/three/collectible-scene"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    ),
  },
);

interface Props {
  art: CollectibleArt;
  reveal?: boolean;
  interactive?: boolean;
  className?: string;
  /** Show the "drag to explore" hint. */
  hint?: boolean;
  /** Optional captured-moment image rendered behind the rotating model. */
  imageUrl?: string;
  /** Explicit model to rotate (e.g. the event's Blitz collectible). */
  modelUrl?: string;
  /** Multiplier on the rotating model's size. */
  modelScale?: number;
}

export function Collectible3DViewer({
  art,
  reveal = true,
  interactive = true,
  className,
  hint = true,
  imageUrl,
  modelUrl,
  modelScale = 1,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-3xl",
        className,
      )}
    >
      {/* Ambient aura that adapts to the collectible hue */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(60% 60% at 50% 45%, hsl(${art.hue} 85% 60% / 0.28), transparent 70%)`,
        }}
      />
      {/* Captured moment behind the rotating model, when provided. */}
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt="Your captured moment"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0">
        <CollectibleScene
          art={art}
          reveal={reveal}
          interactive={interactive}
          modelUrl={modelUrl}
          modelScale={modelScale}
        />
      </div>
      {hint && interactive && (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
          <span className="rounded-full bg-background/70 px-3 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur">
            Drag to explore your memory artifact
          </span>
        </div>
      )}
    </motion.div>
  );
}
