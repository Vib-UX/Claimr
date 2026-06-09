import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Claimr — Capture the moment.",
    short_name: "Claimr",
    description:
      "Turn real-world attendance into a verified onchain memory. Attend, verify, mint a collectible POAP — onchain on Monad.",
    start_url: "/",
    display: "standalone",
    background_color: "#08070e",
    theme_color: "#08070e",
    orientation: "portrait",
    categories: ["events", "social", "lifestyle"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
