import Link from "next/link";
import { BrandMark } from "@/components/brand-logo";
import { ACTIVE_CHAIN } from "@/lib/chain";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <BrandMark />
              <span className="font-display text-lg font-semibold">Claimr</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              A collectible memory for Monad events. Attend, verify, mint —
              proof you were there, onchain forever.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm sm:grid-cols-3">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <Link
              href="/event/monad-blitz-nyc"
              className="text-muted-foreground hover:text-foreground"
            >
              Featured event
            </Link>
            <Link href="/claim" className="text-muted-foreground hover:text-foreground">
              Claim
            </Link>
            <Link
              href="/profile"
              className="text-muted-foreground hover:text-foreground"
            >
              Collectibles
            </Link>
            <a
              href={ACTIVE_CHAIN.blockExplorers.default.url}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              Explorer
            </a>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border/70 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Claimr. Built for {ACTIVE_CHAIN.name}.</p>
          <p>Capture the moment. Proof you were there.</p>
        </div>
      </div>
    </footer>
  );
}
