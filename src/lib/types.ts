/**
 * Core data model for Claimr.
 * These types are intentionally backend-agnostic: the mock layer in
 * `lib/mock/*` returns these shapes, and a real API / indexer can return the
 * exact same ones later with no UI changes.
 */

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Host {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  handle?: string;
}

export interface Speaker {
  id: string;
  name: string;
  title: string;
  avatarUrl?: string;
}

export interface ScheduleItem {
  id: string;
  startISO: string;
  endISO: string;
  title: string;
  description?: string;
  track?: string;
}

export interface Venue {
  name: string;
  addressLine: string;
  city: string;
  country: string;
  center: GeoPoint;
  /** Eligibility radius in meters for the geofence gate. */
  radiusMeters: number;
}

export interface CollectibleArt {
  /** Drives the 3D viewer look. */
  hue: number; // 0-360
  accentHue: number; // 0-360
  /** Short label etched onto the artifact. */
  edition: string;
  variant: "capsule" | "prism" | "core";
}

export interface ClaimrEvent {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  coverImageColor: string;
  /** Optional cover artwork; falls back to a brand gradient when absent. */
  coverImageUrl?: string;
  /** Short label for the kind of event (e.g. "Conference", "Hackathon"). */
  kind: string;
  startISO: string;
  endISO: string;
  timezone: string;
  venue: Venue;
  hosts: Host[];
  speakers: Speaker[];
  schedule: ScheduleItem[];
  rsvpCount: number;
  claimCount: number;
  verifiedCount: number;
  capacity: number;
  /** Collectible POAP metadata template for this event. */
  collectible: {
    name: string;
    symbol: string;
    description: string;
    art: CollectibleArt;
  };
  chainId: number;
}

export type EligibilityState = "idle" | "checking" | "pass" | "fail";

export interface AttendanceVerification {
  emailVerified: boolean;
  insideGeoZone: boolean;
  whitelisted: boolean;
  alreadyClaimed: boolean;
  distanceMeters?: number;
}

export type GeoStatus =
  | "idle"
  | "requesting"
  | "inside"
  | "outside"
  | "denied"
  | "unavailable";

export type MintStatus =
  | "idle"
  | "preparing"
  | "signing"
  | "submitting"
  | "confirming"
  | "success"
  | "error";

export interface NFTMetadata {
  tokenId: string;
  name: string;
  description: string;
  image: string;
  eventId: string;
  attributes: { trait_type: string; value: string }[];
  metadataURI: string;
}

export interface Claim {
  id: string;
  eventId: string;
  eventSlug: string;
  eventTitle: string;
  wallet: string;
  email?: string;
  txHash: string;
  blockExplorerUrl: string;
  claimedAtISO: string;
  metadata: NFTMetadata;
  art: CollectibleArt;
}

export interface UserProfile {
  email?: string;
  wallet?: string;
  embedded: boolean;
}
