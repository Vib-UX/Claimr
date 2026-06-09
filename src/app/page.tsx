import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EVENTS, FEATURED_EVENT } from "@/lib/mock/events";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { WhyClaimr } from "@/components/why-claimr";
import { EventCard } from "@/components/event-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <>
      <Hero event={FEATURED_EVENT} />

      {/* Featured events */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--monad)]">Featured</p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Upcoming events on Claimr
            </h2>
          </div>
          <Link
            href={`/event/${FEATURED_EVENT.slug}`}
            className="hidden text-sm font-medium text-primary hover:underline sm:inline"
          >
            View all
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {EVENTS.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
          <Link
            href={`/event/${FEATURED_EVENT.slug}`}
            className="flex min-h-[260px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/40 p-6 text-center transition hover:bg-card"
          >
            <p className="font-display font-semibold">Hosting an event?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Turn attendance into onchain memories.
            </p>
            <span className="mt-3 text-sm font-medium text-primary">
              Get started →
            </span>
          </Link>
        </div>
      </section>

      <HowItWorks />
      <WhyClaimr />

      {/* Closing CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border p-10 text-center sm:p-16">
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-80"
            style={{
              background:
                "radial-gradient(60% 80% at 50% 0%, color-mix(in oklab, var(--monad) 28%, transparent), transparent 65%)",
            }}
          />
          <h2 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-5xl">
            <span className="aurora-text">Claim your moment onchain.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Attend, verify, mint. Capture the moment as an NFT POAP and keep a
            collectible memory of every Monad event.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/claim"
              className={cn(buttonVariants({ variant: "gradient", size: "lg" }))}
            >
              Claim your moment
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href={`/event/${FEATURED_EVENT.slug}`}
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Explore event
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
