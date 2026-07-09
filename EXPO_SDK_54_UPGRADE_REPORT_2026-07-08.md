# Expo SDK 54 Upgrade Report - 2026-07-08

## Why This Was Needed

Expo Go on Mark's phone reported that it supports SDK 54 and the Napier phone app was still on SDK 51.

## Completed

- Upgraded Expo from SDK 51 to SDK 54.
- Added the explicit native entry point `index.js`.
- Updated `package.json` main entry to `index.js`.
- Updated Expo-compatible dependencies:
  - `expo@54.0.35`
  - `react@19.1.0`
  - `react-dom@19.1.0`
  - `react-native@0.81.5`
  - `react-native-web@0.21.2`
  - `@types/react@19.1.17`
  - `typescript@5.9.3`

## Verified

- `npx expo install --check` passes.
- `npm run typecheck` passes.

## Next QA Step

Restart Expo and scan the fresh QR code in the current Expo Go app.
