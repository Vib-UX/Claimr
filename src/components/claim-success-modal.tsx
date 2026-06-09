"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import type { Claim } from "@/lib/types";
import { Modal } from "@/components/ui/modal";
import { buttonVariants } from "@/components/ui/button";
import { shortenAddress } from "@/lib/utils";

export function ClaimSuccessModal({
  open,
  onClose,
  claim,
}: {
  open: boolean;
  onClose: () => void;
  claim: Claim | null;
}) {
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => setReveal(true), 250);
      return () => clearTimeout(t);
    }
    setReveal(false);
  }, [open]);

  if (!claim) return null;

  return (
    <Modal open={open} onClose={onClose} className="max-w-md">
      <div className="relative">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-48"
          style={{
            background: `radial-gradient(70% 100% at 50% 0%, hsl(${claim.art.hue} 85% 60% / 0.35), transparent 70%)`,
          }}
        />
        <div className="relative px-6 pt-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_oklab,var(--monad)_16%,transparent)] px-3 py-1 text-xs font-medium text-[var(--monad-deep)] dark:text-[var(--monad)]"
          >
            <Sparkles className="size-3.5" />
            Claimed onchain
          </motion.div>

          {/* The captured moment pinned to IPFS (already composited with the
              collectible). Falls back to the generated collectible artwork when
              the attendee claimed without a photo. */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={reveal ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative mx-auto mt-3 w-full max-w-[230px] overflow-hidden rounded-2xl border border-border/60 shadow-lg"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={claim.metadata.image}
              alt={`Your captured moment at ${claim.eventTitle}`}
              className="aspect-[4/5] w-full bg-muted object-cover"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-1 bg-gradient-to-t from-black/55 to-transparent px-2.5 pb-2 pt-6">
              <Sparkles className="size-3 text-white/90" />
              <span className="text-[10px] font-medium text-white/90">
                Proof you were there
              </span>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="aurora-text font-display text-2xl font-bold"
          >
            Capture the moment.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mx-auto mt-1.5 max-w-xs text-sm text-muted-foreground"
          >
            Your proof of presence at{" "}
            <span className="font-medium text-foreground">{claim.eventTitle}</span>{" "}
            is now a verified onchain memory.
          </motion.p>
        </div>

        <div className="mt-6 space-y-3 px-6 pb-7">
          <div className="rounded-2xl border border-border bg-muted/40 p-3 text-left text-xs">
            <div className="flex items-center justify-between py-1">
              <span className="text-muted-foreground">Token</span>
              <span className="font-mono">#{claim.metadata.tokenId}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-muted-foreground">Wallet</span>
              <span className="font-mono">{shortenAddress(claim.wallet)}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-muted-foreground">Transaction</span>
              <a
                href={claim.blockExplorerUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-mono text-primary hover:underline"
              >
                {shortenAddress(claim.txHash)}
                <ArrowUpRight className="size-3" />
              </a>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              href="/profile"
              onClick={onClose}
              className={buttonVariants({ variant: "outline", className: "flex-1" })}
            >
              Done
            </Link>
            <Link
              href={`/collectible/${claim.metadata.tokenId}`}
              className={buttonVariants({ variant: "gradient", className: "flex-1" })}
            >
              View collectible
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
}
