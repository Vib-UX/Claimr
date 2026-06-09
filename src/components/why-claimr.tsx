"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Wallet,
  Navigation,
  Boxes,
  Zap,
  Bot,
} from "lucide-react";

const FEATURES = [
  {
    icon: Navigation,
    title: "Geofenced eligibility",
    desc: "Claims are gated to the venue, so every POAP is real proof of presence.",
  },
  {
    icon: Wallet,
    title: "Embedded wallets",
    desc: "Email sign-in provisions a wallet instantly. Onboarding without the jargon.",
  },
  {
    icon: ShieldCheck,
    title: "Verified attendance",
    desc: "Email, location, and guest-list checks before anything touches the chain.",
  },
  {
    icon: Boxes,
    title: "3D memory artifacts",
    desc: "Every claim reveals a tactile 3D collectible — a memory, not a coin.",
  },
  {
    icon: Zap,
    title: "Monad-native speed",
    desc: "Built on the fastest EVM. Claims confirm in the blink of an eye.",
  },
  {
    icon: Bot,
    title: "Humans & agents",
    desc: "A claim flow designed for people and autonomous agents to participate.",
  },
];

export function WhyClaimr() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-[var(--monad)]">Why Claimr</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Proof you were there.
          </h2>
          <p className="mt-3 text-muted-foreground">
            A consumer-grade event experience with onchain permanence underneath
            — calm on the surface, verifiable to the core.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <f.icon className="size-5 text-[var(--monad)]" />
              <h3 className="mt-3 font-display font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
