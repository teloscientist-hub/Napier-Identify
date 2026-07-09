# Mock Backend Stub Report - 2026-07-08

## Completed

- Added dependency-free local mock backend at `scripts/mock-api-server.mjs`.
- Added `npm run mock-api`.
- Updated `.env.example` to use `http://127.0.0.1:8797`.
- Updated `README.md` with mock backend run instructions and physical-phone LAN IP note.

## Endpoints

- `GET /health`
- `POST /identify`
- `POST /identify?mode=no_match`
- `POST /identify?mode=server_error`
- `GET /items/{item_id}`
- `GET /items/{item_id}?mode=partial`
- `GET /items/{item_id}?mode=server_error`

## Purpose

This server is not the production backend. It exists so the phone app can test real HTTP behavior, response mapping, error handling, and item-detail fetching before the visual-search backend exists.

## Run

```bash
npm run mock-api
```

Then set:

```bash
EXPO_PUBLIC_NAPIER_API_BASE_URL=http://127.0.0.1:8797
```

For Expo Go on a physical phone, replace `127.0.0.1` with the Mac's LAN IP address.

## Recommended Next Step

Restart Expo with `EXPO_PUBLIC_NAPIER_API_BASE_URL` set, switch Settings to `real`, and run the API Integration section of `QA_CHECKLIST.md`.

## Real-Mode App QA - 2026-07-08

Verified with:

```bash
npm run mock-api
EXPO_PUBLIC_NAPIER_API_BASE_URL=http://127.0.0.1:8797 npm run web -- --localhost
```

Results:

- App loaded at `http://localhost:8081`.
- Settings switched to `real`.
- `POST /identify` returned ranked candidates.
- Results rendered the API candidates.
- Opening `Gold-tone textured brooch` fetched item detail through `GET /items/{item_id}`.
- Item detail rendered API-mapped variant and related-piece data.
- No missing backend URL error appeared when the environment variable was set.
- `Preview No-Match State` in real mode called the API no-match path and rendered retry guidance.

Additional QA modes:

```bash
EXPO_PUBLIC_NAPIER_IDENTIFY_MODE=server_error
EXPO_PUBLIC_NAPIER_ITEM_MODE=partial
```

`Preview No-Match State` passes `mode=no_match` automatically in real mode.

Remaining QA:

- Run the same flow from Expo Go on a physical phone using the Mac's LAN IP address instead of `127.0.0.1`.
- Run real camera/import, then real-mode identify, on a device.
