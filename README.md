# Claimr

**Capture the moment.** Claimr turns real-world attendance into a verified
onchain memory — geofenced claims, embedded wallets, and collectible NFT POAPs
on **Monad**.

A Luma-inspired event experience for **Monad Blitz**: humans and agents verify
presence at an event, onboard with email, receive an embedded wallet via Privy,
and mint the moment as an onchain NFT POAP. The mint experience reveals a
memorable **3D collectible memory artifact**.

> Attend, verify, mint. Proof you were there.

---

## ✨ Features

- **Premium, Luma-style event UX** — calm, elegant, high-trust, with restrained
  Monad-native energy.
- **Email onboarding via Privy** — embedded wallets created instantly, no seed
  phrases, no wallet jargon in the primary UX.
- **Geofenced eligibility** — location permission → "inside / outside event
  zone" → claim, with clear fallback states.
- **Eligibility module** — email verified · inside geo zone · on guest list ·
  not already claimed.
- **Mock onchain mint flow** — viem/wagmi-shaped states (preparing → signing →
  submitting → confirming → success) ready to swap for a real contract call.
- **3D collectible reveal** — a "memory capsule" artifact with lighting, glow,
  refraction, orbit controls, and a reveal animation. Looks great in light &
  dark mode.
- **Collectible gallery + receipt** — profile, attendance history, and a
  shareable collectible page.
- **Dark / light mode** with a smooth toggle.
- **Mobile-first**, responsive, production-quality.

## 🧱 Tech stack

| Area        | Choice |
| ----------- | ------ |
| Framework   | Next.js (App Router) + TypeScript |
| Styling     | Tailwind CSS v4 + shadcn-style UI primitives |
| Motion      | Framer Motion |
| Auth/Wallet | Privy embedded wallets (`@privy-io/react-auth`, `@privy-io/wagmi`) |
| Chain       | viem + wagmi, **Monad Testnet** (chain `10143`) |
| 3D          | Three.js via React Three Fiber + drei |
| State       | Zustand (persisted claims) |

## 🚀 Getting started

```bash
# 1. Install dependencies
npm install

# 2. (Optional) configure Privy — the app runs without it in demo mode
cp .env.example .env.local
# then set NEXT_PUBLIC_PRIVY_APP_ID=... from https://dashboard.privy.io

# 3. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo mode vs. real Privy

- **No `NEXT_PUBLIC_PRIVY_APP_ID`** → Claimr uses a faithful **demo auth**: an
  email modal provisions a mock embedded wallet so the full claim flow works
  immediately.
- **With a Privy app id** → real email login + embedded wallet creation on
  Monad Testnet, wired through `@privy-io/wagmi`.

### Geofence demo override

The flow is explorable anywhere thanks to a demo override. To exercise the real
browser geolocation + distance check, set `DEMO_FORCE_INSIDE_ZONE = false` in
`src/lib/mock/geofence.ts`.

## 🗺️ Pages

| Route               | Description |
| ------------------- | ----------- |
| `/`                 | Hero, featured events, how it works, why Claimr |
| `/event/[slug]`     | Event hero, schedule, speakers, venue map, claim rail, stats |
| `/claim`            | Eligibility checks, geofence, wallet status, mint CTA, 3D preview |
| `/collectible/[id]` | 3D asset hero, NFT metadata, tx hash, share card |
| `/profile`          | Claimed POAPs, attendance history, wallet & email |

## 📁 Project structure

```
src/
  app/
    layout.tsx                 # fonts, providers, header/footer
    page.tsx                   # landing
    event/[slug]/page.tsx      # event details
    claim/page.tsx             # claim flow
    collectible/[id]/page.tsx  # collectible receipt + 3D hero
    profile/page.tsx           # gallery + history
    globals.css                # design tokens (light/dark)
  components/
    three/collectible-scene.tsx  # R3F scene (memory capsule)
    collectible-3d-viewer.tsx    # lazy WebGL wrapper
    claim-panel.tsx              # orchestrates the claim flow
    eligibility-checklist.tsx
    geo-fence-status.tsx
    mint-progress.tsx
    claim-success-modal.tsx      # 3D reveal — the emotional peak
    embedded-wallet-card.tsx
    privy-auth-button.tsx
    event-hero.tsx / event-card.tsx / event-schedule.tsx / event-people.tsx
    venue-map.tsx / stats-strip.tsx / attendance-gallery.tsx
    hero.tsx / how-it-works.tsx / why-claimr.tsx / share-card.tsx
    ui/                          # button, card, badge, modal, progress, ...
  lib/
    chain.ts                   # Monad chain config + explorer helpers
    types.ts                   # Event, User, Claim, AttendanceVerification, NFTMetadata
    store.ts                   # Zustand (persisted claims)
    auth/                      # Privy bridge + demo auth behind one context
    mock/                      # events, geofence, whitelist, mint stub
  hooks/
    use-geofence.ts
```

## ⛓️ Smart contracts & onchain minting

The onchain POAP is a real OpenZeppelin-based contract in `contracts/`.

### `ClaimrPOAP` (`contracts/src/ClaimrPOAP.sol`)

- ERC-721 (`ERC721URIStorage` + `AccessControl`).
- **One claim per `(eventId, wallet)`** — enforced onchain.
- Stores each token's `eventId` and metadata `uri`.
- **Soulbound** — non-transferable, because a POAP is proof *you* were there.
- `mintClaim(to, eventId, uri)` is gated by `MINTER_ROLE`.

Run the tests:

```bash
cd contracts
forge test
```

### Trust model (why a backend minter?)

Geofencing and email/identity checks happen **off-chain** — a contract can't
verify GPS. So Claimr's backend is the verifier:

1. Browser sends `{ slug, address, coords, accessToken }` to **`POST /api/claim`**.
2. The API verifies the **Privy access token** (`PRIVY_APP_SECRET`), re-checks
   the **geofence** and **guest list** server-side.
3. On success, the **minter wallet** (`MINTER_ROLE`) calls `mintClaim` to mint
   the POAP **directly to the user's embedded wallet** — so claiming is
   **gasless** for users (no testnet MON, no popups).

If no contract/minter is configured, `/api/claim` falls back to a mock mint so
the flow still works locally.

Token metadata is served live:
- `GET /api/metadata/[slug]` → ERC-721 JSON
- `GET /api/collectible/[slug]` → on-the-fly SVG artwork (matches the 3D viewer)

### Deploying to Monad Testnet

A funded deployer/minter wallet was generated at
`~/.monskills/keystore` (encrypted; its key is loaded into `.env.local` as
`MINTER_PRIVATE_KEY`).

```bash
# 1. Fund the deployer address with testnet MON:  https://faucet.monad.xyz
#    (address is printed by the script below / stored in .deployer-address.txt)

# 2. Deploy + auto-wire NEXT_PUBLIC_POAP_CONTRACT_ADDRESS into .env.local
bash contracts/deploy.sh

# 3. Verify on all explorers (MonadVision / Socialscan / Monadscan)
#    via the monskills verification API, or:
cd contracts && forge verify-contract <ADDR> src/ClaimrPOAP.sol:ClaimrPOAP \
  --chain 10143 --constructor-args $(cast abi-encode "constructor(address,address)" <ADDR_DEPLOYER> <ADDR_DEPLOYER>)

# 4. Restart the dev server — claims now mint for real.
```

## 🔌 Remaining mock surfaces

- **Eligibility** — `lib/mock/whitelist.ts` and `lib/mock/geofence.ts` are
  stubs; swap for real RSVP / signed-location attestation endpoints.
- **Data** — back `lib/mock/events.ts` with a CMS or onchain registry; the
  `ClaimrEvent` shape stays the same.
- **Metadata** — currently served from the app; pin to IPFS for permanence and
  store the `ipfs://` URI as the token URI.

## 🎨 Copy

> Capture the moment. · Proof you were there. · Claim your moment onchain. ·
> Attend, verify, mint. · A collectible memory for every event, onchain on Monad.

---

Built for Monad Blitz. Not affiliated with Luma.
