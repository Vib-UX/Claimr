import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={cn("size-7", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="claimr-mark" x1="0" y1="0" x2="32" y2="32">
          <stop offset="0%" stopColor="var(--aurora-2)" />
          <stop offset="55%" stopColor="var(--aurora-1)" />
          <stop offset="100%" stopColor="var(--aurora-3)" />
        </linearGradient>
      </defs>
      <rect
        x="2"
        y="2"
        width="28"
        height="28"
        rx="9"
        fill="url(#claimr-mark)"
      />
      <path
        d="M16 7.4a6.1 6.1 0 0 1 6.1 6.1c0 4.3-6.1 10.8-6.1 10.8S9.9 17.8 9.9 13.5A6.1 6.1 0 0 1 16 7.4z"
        fill="white"
      />
      <path
        d="M13.1 13.5l2 2 3.7-3.9"
        stroke="var(--aurora-2)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function BrandWordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-display text-lg font-semibold tracking-tight",
        className,
      )}
    >
      Claimr
    </span>
  );
}
