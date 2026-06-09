"use client";

import { motion } from "framer-motion";
import { LogIn, MapPin, Sparkles, Box } from "lucide-react";

const STEPS = [
  {
    icon: LogIn,
    title: "Sign in with email",
    desc: "Onboard in seconds and get a secure embedded wallet — no seed phrases, no extensions.",
  },
  {
    icon: MapPin,
    title: "Verify your presence",
    desc: "A geofenced check confirms you're really at the venue before you can claim.",
  },
  {
    icon: Sparkles,
    title: "Claim your moment",
    desc: "Mint a commemorative NFT POAP on Monad — proof you were there, onchain forever.",
  },
  {
    icon: Box,
    title: "Capture the memory",
    desc: "Reveal a 3D collectible memory artifact and keep it in your gallery.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-medium text-[var(--monad)]">How it works</p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          Attend, verify, mint.
        </h2>
        <p className="mt-3 text-muted-foreground">
          A premium claim flow designed for humans and agents alike — calm,
          high-trust, and onchain by the end.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.08 }}
            className="relative rounded-2xl border border-border bg-card p-5"
          >
            <span className="absolute right-4 top-4 font-display text-sm font-semibold text-muted-foreground/40">
              0{i + 1}
            </span>
            <span className="flex size-11 items-center justify-center rounded-xl bg-[color-mix(in_oklab,var(--monad)_14%,transparent)] text-[var(--monad-deep)] dark:text-[var(--monad)]">
              <step.icon className="size-5" />
            </span>
            <h3 className="mt-4 font-display font-semibold">{step.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
