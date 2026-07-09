# Napier Visual Reference Phone App

Expo/React Native prototype for the Napier Visual Reference app.

Current runtime:

- Expo SDK 54
- React Native 0.81.5
- React 19.1.0

Current app flow:

```text
Identify -> Camera/Import -> Capture Review -> Crop -> Hints -> Search Progress -> Results -> Item Detail -> Save -> Collection
```

## Location

The app code lives outside Dropbox:

```text
/Users/mark/A/code/napier-phone-app
```

The Dropbox Napier Visual Reference folder remains the canonical place for human planning documents, benchmark worksheets, and project reports.

## Run

Install dependencies:

```bash
npm install
```

Typecheck:

```bash
npm run typecheck
```

Start native Expo:

```bash
npm start -- --localhost
```

Start web QA target:

```bash
npm run web -- --localhost
```

Start the local mock backend:

```bash
npm run mock-api
```

## API Mode

The app supports three development modes in Settings:

- `mock`: local mock responses;
- `real`: calls a backend API;
- `failure`: forces error states for QA.

To use real mode with the local mock backend, create a local `.env` from `.env.example` and set:

```bash
EXPO_PUBLIC_NAPIER_API_BASE_URL=http://127.0.0.1:8797
```

For Expo Go on a physical phone, replace `127.0.0.1` with the Mac's LAN IP address because the phone's own loopback address is not the development machine.

Expected endpoints:

- `POST /identify`
- `GET /items/{item_id}`

No production auth, subscriptions, or offline upload queue are implemented yet.

## Current Scope

Included:

- real camera launch through Expo image picker;
- real photo-library import through Expo image picker;
- local selected-image object;
- capture review with selected image, dimensions, and source;
- crop placeholder with mock crop coordinates;
- optional search hints;
- mock identify mode;
- real identify API client boundary;
- real item-detail API client boundary;
- failure mode for QA;
- ranked results;
- no-match state;
- item detail with missing-field fallbacks;
- save to local collection state;
- history;
- privacy settings.

Not included yet:

- production backend;
- production image upload/storage contract;
- final crop/lasso editor;
- compression and EXIF processing pass;
- auth/accounts;
- subscriptions;
- expert review workflow;
- app-store setup.
