# API Integration Sprint Report - 2026-07-08

Source plan: `NEXT_SPRINT_API_INTEGRATION.md`

## Completed

- Added real API config in `src/services/apiConfig.ts`.
- Added API client in `src/services/apiClient.ts`.
- Wired `real` mode in `src/services/appServices.ts`.
- Added multipart `POST /identify` request mapping.
- Added `GET /items/{item_id}` client.
- Added response mapping from backend payloads into app-owned types:
  - `IdentifyResponse`
  - `CandidateResult`
  - `ItemDetail`
- Added fallback handling for missing optional item detail fields.
- Added real mode to Settings.
- Added `.env.example` with `EXPO_PUBLIC_NAPIER_API_BASE_URL`.
- Updated `QA_CHECKLIST.md` with API integration checks.
- Updated `README.md` to reflect camera/media and API mode.

## Verified In This Environment

- `npm run typecheck` passes.
- Expo web app loads at `http://localhost:8081`.
- Mock mode still renders no-match and ranked candidate results.
- Mock item detail still opens.
- Real mode without `EXPO_PUBLIC_NAPIER_API_BASE_URL` shows a recoverable search error.

## Needs Backend QA

These require a test backend:

- Real `POST /identify` with a selected image.
- API candidate rendering from backend results.
- API no-match response with retry guidance.
- API server/network error handling against real failures.
- Real `GET /items/{item_id}` response mapping.
- Missing optional backend fields in live payloads.

## Assumptions

- The first backend contract will expose:
  - `POST /identify`
  - `GET /items/{item_id}`
- `POST /identify` can accept multipart form data with:
  - `query_id`
  - `created_at`
  - `image_uri`
  - `image`
  - `crop`
  - `hints`
  - `app_version`
  - `client_context`
- Backend responses may use either snake_case or camelCase for early testing.

## Mark Review Items

- Confirm whether the backend should prefer multipart upload, pre-uploaded image references, or both.
- Confirm the exact backend base URL once the test service exists.
- Confirm whether `GET /items/{item_id}` should return the full public reference record immediately or a lighter detail payload first.

## Recommended Next Step

Create or stub a local test backend that implements `POST /identify` and `GET /items/{item_id}` using the response shapes expected by the app.
