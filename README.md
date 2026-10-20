# DoubleU — Official Native App

Expo / React Native app for DoubleU. No stories left behind.

## Screens

- **Home** — fan dashboard, Vault entry, drop-alerts toggle
- **Radio** — full catalog player with background playback + lock-screen controls
- **Case Files** — every song as a case file: lyrics, story, credits, streaming links
- **News** — drops and upcoming songs
- **Shows** — GPS-sorted upcoming shows
- **The Vault** — code-locked app exclusives (code in `src/data/vault.ts`)

## Setup

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go.

## Audio

Tracks stream from `https://www.doubleuofficial.online/audio/`. Cover art is bundled in `assets/cover/` (not in this repo — binary assets).

To use local audio instead, change `audio` in `src/data/tracks.ts` to `require()` calls pointing at `assets/audio/`.

## Builds

```bash
# Development build (background audio, push notifications)
EAS_SKIP_AUTO_FINGERPRINT=1 npx eas build --profile development --platform android

# Production build
EAS_SKIP_AUTO_FINGERPRINT=1 npx eas build --profile production --platform android

# OTA update (no rebuild needed)
npx eas update --branch production --message "what changed"
```

Run `npx eas init` first and set the project ID in `app.json`.
