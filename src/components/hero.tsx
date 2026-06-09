"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import type { ClaimrEvent } from "@/lib/types";
import { Collectible3DViewer } from "@/components/collectible-3d-viewer";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero({ event }: { event: ClaimrEvent }) {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient aurora background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--monad)_35%,transparent),transparent)] blur-2xl opacity-60" />
        <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--aurora-3)_35%,transparent),transparent)] blur-2xl opacity-50" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-12 pt-14 sm:px-6 lg:grid-cols-2 lg:gap-6 lg:px-8 lg:pb-20 lg:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-[var(--monad)]" />
            A collectible memory for Monad events
          </span>

          <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] tracking-tight text-balance sm:text-6xl">
            <span className="aurora-text">Capture the moment.</span>
          </h1>

          <p className="mt-5 max-w-xl text-lg text-muted-foreground text-balance">
            Claimr turns real-world attendance into a verified onchain memory
            with geofenced claims, embedded wallets, and collectible NFT POAPs on
            Monad.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/claim"
              className={cn(buttonVariants({ variant: "gradient", size: "lg" }))}
            >
              Claim your moment
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href={`/event/${event.slug}`}
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Explore event
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
            <span>
              <span className="font-display text-lg font-semibold text-foreground">
                {event.rsvpCount}
              </span>{" "}
              RSVPs
            </span>
            <span className="h-4 w-px bg-border" />
            <span>
              <span className="font-display text-lg font-semibold text-foreground">
                {event.claimCount}
              </span>{" "}
              moments claimed
            </span>
            <span className="h-4 w-px bg-border" />
            <span>Proof you were there</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative mx-auto w-full max-w-md"
        >
          <Collectible3DViewer art={event.collectible.art} />
          <div className="pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 text-center">
            <p className="text-xs font-medium text-muted-foreground">
              {event.collectible.name}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
