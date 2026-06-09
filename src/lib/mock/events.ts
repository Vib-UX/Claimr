import type { ClaimrEvent } from "@/lib/types";

/**
 * Polished placeholder data for the flagship Monad Blitz event plus a couple of
 * supporting events for the gallery / landing surfaces. Swap with a real CMS or
 * onchain registry later — the shape matches `ClaimrEvent`.
 */
export const EVENTS: ClaimrEvent[] = [
  {
    id: "evt_monad_blitz_nyc",
    slug: "monad-blitz-nyc",
    title: "Monad Blitz NYC",
    tagline: "A high-velocity builder night for the Monad ecosystem.",
    description:
      "Monad Blitz is a one-night sprint where builders, founders, and agents ship onchain on the fastest EVM. Expect lightning talks, live deploys, and a room full of people turning ideas into transactions. Claim your proof-of-attendance and capture the moment as a collectible memory.",
    coverImageColor: "#6c4cf1",
    coverImageUrl: "/events/monad-blitz-nyc.png",
    kind: "Monad Blitz",
    startISO: "2026-06-18T18:00:00-04:00",
    endISO: "2026-06-18T23:30:00-04:00",
    timezone: "America/New_York",
    venue: {
      name: "50 W 23rd St — 4th Floor",
      addressLine: "50 W 23rd St, 4th floor",
      city: "New York",
      country: "USA",
      center: { lat: 40.7423, lng: -73.9906 },
      radiusMeters: 200,
    },
    hosts: [
      { id: "h1", name: "Monad Foundation", role: "Host", handle: "@monad" },
      { id: "h2", name: "Cortex Global", role: "Co-host", handle: "@cortexglobal" },
      { id: "h3", name: "Ava Lindqvist", role: "Curator", handle: "@avabuilds" },
    ],
    speakers: [
      { id: "s1", name: "Keone Hon", title: "On parallel execution at scale" },
      { id: "s2", name: "Priya Raman", title: "Embedded wallets for the next billion" },
      { id: "s3", name: "Marcus Cole", title: "Agents that transact" },
      { id: "s4", name: "Lena Ortiz", title: "Designing high-trust crypto UX" },
    ],
    schedule: [
      {
        id: "sc1",
        startISO: "2026-06-18T18:00:00-04:00",
        endISO: "2026-06-18T18:45:00-04:00",
        title: "Doors & onboarding",
        description: "Check in, claim your spot, and get an embedded wallet in seconds.",
        track: "Welcome",
      },
      {
        id: "sc2",
        startISO: "2026-06-18T18:45:00-04:00",
        endISO: "2026-06-18T19:30:00-04:00",
        title: "Lightning talks",
        description: "Five-minute sparks from builders shipping on Monad.",
        track: "Mainstage",
      },
      {
        id: "sc3",
        startISO: "2026-06-18T19:30:00-04:00",
        endISO: "2026-06-18T21:30:00-04:00",
        title: "The Blitz — live build sprint",
        description: "Two hours, one room, real deploys to Monad testnet.",
        track: "Sprint",
      },
      {
        id: "sc4",
        startISO: "2026-06-18T21:30:00-04:00",
        endISO: "2026-06-18T22:15:00-04:00",
        title: "Demos & onchain proof",
        description: "Teams show what they shipped — verified onchain.",
        track: "Mainstage",
      },
      {
        id: "sc5",
        startISO: "2026-06-18T22:15:00-04:00",
        endISO: "2026-06-18T23:30:00-04:00",
        title: "Claim the moment & social",
        description: "Mint your POAP, capture the memory, and meet the room.",
        track: "Social",
      },
    ],
    rsvpCount: 612,
    claimCount: 348,
    verifiedCount: 401,
    capacity: 700,
    collectible: {
      name: "Monad Blitz NYC — Proof of Presence",
      symbol: "BLITZ",
      description:
        "A verified onchain memory from Monad Blitz NYC. Proof you were there.",
      art: { hue: 258, accentHue: 200, edition: "NYC · 2026", variant: "capsule" },
    },
    chainId: 10143,
  },
  {
    id: "evt_ethconf_nyc",
    slug: "ethconf",
    title: "ETHConf",
    tagline: "Where Ethereum meets institutional finance.",
    description:
      "ETHConf 2026 brings builders, institutions, and researchers together to explore where Ethereum meets institutional finance. Three days of mainstage keynotes and deep technical sessions at the Javits Center — featured in New York Tech Week. Claim your verified proof of attendance onchain.",
    coverImageColor: "#5b4bd6",
    coverImageUrl: "/events/ethconf.png",
    kind: "Conference",
    startISO: "2026-06-08T08:30:00-04:00",
    endISO: "2026-06-10T18:30:00-04:00",
    timezone: "America/New_York",
    venue: {
      name: "Javits Center",
      addressLine: "429 11th Ave",
      city: "New York",
      country: "USA",
      center: { lat: 40.7577, lng: -74.0027 },
      radiusMeters: 300,
    },
    hosts: [
      { id: "h1", name: "ETHGlobal", role: "Host", handle: "@ethglobal" },
      { id: "h2", name: "Kartik Talwar", role: "Co-host", handle: "@kartiktalwar" },
    ],
    speakers: [
      { id: "s1", name: "Dr. Elena Cho", title: "Tokenized treasuries at scale" },
      { id: "s2", name: "Marcus Reyes", title: "Institutional custody onchain" },
      { id: "s3", name: "Priya Nair", title: "Compliance-native DeFi" },
      { id: "s4", name: "Tomás Vidal", title: "Settlement rails for TradFi" },
    ],
    schedule: [
      {
        id: "sc1",
        startISO: "2026-06-08T08:30:00-04:00",
        endISO: "2026-06-08T10:00:00-04:00",
        title: "Registration & opening keynote",
        description: "Doors open. Claim your spot and grab a coffee.",
        track: "Day 1 · Mainstage",
      },
      {
        id: "sc2",
        startISO: "2026-06-08T10:00:00-04:00",
        endISO: "2026-06-08T17:00:00-04:00",
        title: "Institutional finance track",
        description: "Tokenization, custody, and settlement deep-dives.",
        track: "Day 1 · Sessions",
      },
      {
        id: "sc3",
        startISO: "2026-06-09T09:00:00-04:00",
        endISO: "2026-06-09T18:00:00-04:00",
        title: "Protocol & research day",
        description: "Scaling, privacy, and the road ahead for Ethereum.",
        track: "Day 2 · Sessions",
      },
      {
        id: "sc4",
        startISO: "2026-06-10T09:00:00-04:00",
        endISO: "2026-06-10T18:30:00-04:00",
        title: "Builders day & closing",
        description: "Demos, fireside chats, and the closing keynote.",
        track: "Day 3 · Mainstage",
      },
    ],
    rsvpCount: 1840,
    claimCount: 962,
    verifiedCount: 1203,
    capacity: 2200,
    collectible: {
      name: "ETHConf 2026 — Proof of Presence",
      symbol: "ETHCONF",
      description:
        "A verified onchain memory from ETHConf 2026 at the Javits Center.",
      art: { hue: 252, accentHue: 286, edition: "NYC · 2026", variant: "prism" },
    },
    chainId: 10143,
  },
  {
    id: "evt_ethglobal_nyc",
    slug: "ethglobal-nyc",
    title: "ETHGlobal New York 2026",
    tagline: "The flagship Ethereum hackathon returns to NYC.",
    description:
      "ETHGlobal New York 2026 is a 36-hour hackathon bringing the world's best builders together to ship onchain. Expect workshops, mentorship, prizes, and a packed demo day across three days in New York City. Verify your attendance and capture the moment as a collectible memory.",
    coverImageColor: "#e8a219",
    coverImageUrl: "/events/ethglobal-nyc.png",
    kind: "Hackathon",
    startISO: "2026-06-12T09:00:00-04:00",
    endISO: "2026-06-14T18:00:00-04:00",
    timezone: "America/New_York",
    venue: {
      name: "Pier 36",
      addressLine: "299 South St",
      city: "New York",
      country: "USA",
      center: { lat: 40.7095, lng: -73.9869 },
      radiusMeters: 280,
    },
    hosts: [
      { id: "h1", name: "ETHGlobal", role: "Host", handle: "@ethglobal" },
    ],
    speakers: [
      { id: "s1", name: "Nadia Brooks", title: "Judge · Infrastructure" },
      { id: "s2", name: "Leo Tanaka", title: "Judge · Consumer apps" },
      { id: "s3", name: "Sam Okafor", title: "Workshop · Onchain agents" },
      { id: "s4", name: "Maya Fischer", title: "Workshop · Account abstraction" },
    ],
    schedule: [
      {
        id: "sc1",
        startISO: "2026-06-12T09:00:00-04:00",
        endISO: "2026-06-12T12:00:00-04:00",
        title: "Check-in & opening ceremony",
        description: "Form teams, claim your spot, and kick off the hackathon.",
        track: "Day 1",
      },
      {
        id: "sc2",
        startISO: "2026-06-12T12:00:00-04:00",
        endISO: "2026-06-14T09:00:00-04:00",
        title: "Hacking begins",
        description: "36 hours to build. Workshops and mentorship throughout.",
        track: "Build",
      },
      {
        id: "sc3",
        startISO: "2026-06-14T09:00:00-04:00",
        endISO: "2026-06-14T13:00:00-04:00",
        title: "Submissions & judging",
        description: "Project submissions close. Judging round begins.",
        track: "Day 3",
      },
      {
        id: "sc4",
        startISO: "2026-06-14T13:00:00-04:00",
        endISO: "2026-06-14T18:00:00-04:00",
        title: "Demos & closing ceremony",
        description: "Finalist demos, prizes, and the closing ceremony.",
        track: "Day 3",
      },
    ],
    rsvpCount: 1320,
    claimCount: 540,
    verifiedCount: 788,
    capacity: 1500,
    collectible: {
      name: "ETHGlobal New York 2026 — Proof of Presence",
      symbol: "ETHNYC",
      description:
        "A verified onchain memory from the ETHGlobal New York 2026 hackathon.",
      art: { hue: 38, accentHue: 268, edition: "NYC · 2026", variant: "core" },
    },
    chainId: 10143,
  },
  {
    id: "evt_monad_blitz_lisbon",
    slug: "monad-blitz-lisbon",
    title: "Monad Blitz Lisbon",
    tagline: "Atlantic-coast builder night for the Monad ecosystem.",
    description:
      "The Lisbon edition of Monad Blitz brings the European builder community together for a night of shipping onchain.",
    coverImageColor: "#36b6ff",
    kind: "Monad Blitz",
    startISO: "2026-07-09T18:30:00+01:00",
    endISO: "2026-07-09T23:00:00+01:00",
    timezone: "Europe/Lisbon",
    venue: {
      name: "LX Factory — Hangar",
      addressLine: "R. Rodrigues de Faria 103",
      city: "Lisbon",
      country: "Portugal",
      center: { lat: 38.7036, lng: -9.1781 },
      radiusMeters: 220,
    },
    hosts: [{ id: "h1", name: "Monad Foundation", role: "Host", handle: "@monad" }],
    speakers: [
      { id: "s1", name: "João Almeida", title: "EVM at 10,000 TPS" },
      { id: "s2", name: "Sofia Marques", title: "Onchain memories" },
    ],
    schedule: [
      {
        id: "sc1",
        startISO: "2026-07-09T18:30:00+01:00",
        endISO: "2026-07-09T19:15:00+01:00",
        title: "Doors & onboarding",
        track: "Welcome",
      },
      {
        id: "sc2",
        startISO: "2026-07-09T19:15:00+01:00",
        endISO: "2026-07-09T21:30:00+01:00",
        title: "The Blitz — live build sprint",
        track: "Sprint",
      },
      {
        id: "sc3",
        startISO: "2026-07-09T21:30:00+01:00",
        endISO: "2026-07-09T23:00:00+01:00",
        title: "Claim & social",
        track: "Social",
      },
    ],
    rsvpCount: 284,
    claimCount: 120,
    verifiedCount: 156,
    capacity: 400,
    collectible: {
      name: "Monad Blitz Lisbon — Proof of Presence",
      symbol: "BLITZ",
      description: "A verified onchain memory from Monad Blitz Lisbon.",
      art: { hue: 200, accentHue: 268, edition: "LIS · 2026", variant: "prism" },
    },
    chainId: 10143,
  },
];

export const FEATURED_EVENT = EVENTS[0];

export function getEventBySlug(slug: string): ClaimrEvent | undefined {
  return EVENTS.find((e) => e.slug === slug);
}

export function getEventById(id: string): ClaimrEvent | undefined {
  return EVENTS.find((e) => e.id === id);
}
