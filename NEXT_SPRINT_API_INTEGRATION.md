# Next Sprint: Identify API Integration

Do not start this sprint until:

- the mocked app flow passes `QA_CHECKLIST.md`;
- camera/import can produce a local query image;
- the backend has a testable `POST /identify` endpoint or a stable mock server contract.

## Sprint Goal

Replace mock identify responses with a real API call while preserving mock mode for testing.

The app should be able to:

```text
local image + crop + hints -> POST /identify -> ranked candidates -> item detail
```

## Scope

Build:

- API client layer;
- environment config for API base URL;
- `POST /identify` request;
- identify response parsing;
- loading/progress state;
- network error state;
- no confident match state;
- mock/real mode toggle for development;
- typed response validation where practical.

Do not build yet:

- production auth;
- subscriptions;
- expert review operations;
- full retry queue;
- offline upload sync;
- final image compression/EXIF pipeline.

## Required Endpoints

### `POST /identify`

Request should include:

- upload reference or image payload;
- crop coordinates;
- hints;
- app version;
- client/device context if available.

Response should include:

- query ID;
- status;
- confidence band;
- ranked candidates;
- retry guidance;
- timing.

### `GET /items/{item_id}`

Used when opening a candidate.

Response should include:

- item identity;
- reference images;
- date/date range;
- type;
- collection/design family;
- variants;
- related pieces;
- source citation.

## App Architecture Rule

Keep one API boundary:

```text
screens -> app state -> api service -> backend/mock
```

Screens should not know whether data came from mock mode or the real backend.

## Development Modes

Support:

- `mock`: current local mock responses;
- `real`: calls backend API;
- `failure`: forces network/error states for QA.

## Step Sequence

### Step 1: API Service

- [ ] Create API client module.
- [ ] Add `identify()` function.
- [ ] Add `getItem()` function.
- [ ] Keep mock implementations available.
- [ ] Add API mode config.

### Step 2: Request Mapping

- [ ] Convert local query image into identify request.
- [ ] Include crop.
- [ ] Include hints.
- [ ] Include app version.
- [ ] Leave upload reference blank or mocked until upload service exists.

### Step 3: Response Mapping

- [ ] Map backend candidates to `CandidateResult`.
- [ ] Map confidence bands.
- [ ] Map retry guidance.
- [ ] Handle missing optional fields gracefully.

### Step 4: UI States

- [ ] Loading.
- [ ] Success with candidates.
- [ ] No confident match.
- [ ] Needs review.
- [ ] Network error.
- [ ] Server error.
- [ ] Malformed response.

### Step 5: Item Detail Fetch

- [ ] Open candidate.
- [ ] Fetch `GET /items/{item_id}` in real mode.
- [ ] Use mock item detail in mock mode.
- [ ] Show missing-field fallback text.

## Acceptance Criteria

- [ ] Mock mode still works.
- [ ] Real mode can call `POST /identify`.
- [ ] Candidate results render from API response.
- [ ] No-match response renders retry guidance.
- [ ] Network/server errors do not dead-end the user.
- [ ] Item detail fetch works or falls back cleanly.
- [ ] Typecheck passes.

## Red Flags

Stop if:

- screens directly call fetch instead of using the API layer;
- mock mode is removed;
- backend fields leak directly into UI without mapping;
- missing optional metadata crashes item detail;
- the app starts making authenticity/value/condition claims;
- API integration starts before a stable contract exists.

