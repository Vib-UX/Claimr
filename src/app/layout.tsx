import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Claimr — Capture the moment.",
    template: "%s · Claimr",
  },
  description:
    "Claimr turns real-world attendance into a verified onchain memory with geofenced claims, embedded wallets, and collectible NFT POAPs on Monad.",
  keywords: [
    "Monad",
    "POAP",
    "proof of attendance",
    "NFT",
    "onchain",
    "events",
    "embedded wallet",
  ],
  openGraph: {
    title: "Claimr — Capture the moment.",
    description:
      "Attend, verify, mint. A collectible memory for every event, onchain on Monad.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
