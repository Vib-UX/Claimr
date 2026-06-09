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
        d="M21.5 12.2a6.2 6.2 0 1 0 0 7.6"
        stroke="white"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="22" cy="16" r="2.1" fill="white" />
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
