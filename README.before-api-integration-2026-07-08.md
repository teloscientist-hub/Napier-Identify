# Napier Visual Reference Phone App

This is the first mocked phone app prototype for the Napier Visual Reference project.

The prototype currently proves the mocked flow:

```text
Identify -> Capture Review -> Crop -> Hints -> Search Progress -> Results -> Item Detail -> Save -> Collection
```

It uses local mock data only. It does not yet connect to a backend, camera, image picker, or visual search service.

## Run

Install dependencies:

```bash
npm install
```

Typecheck:

```bash
npm run typecheck
```

Start Expo:

```bash
npm start -- --localhost
```

## Current Environment Note

On 2026-07-08, `npm install` completed and `npm run typecheck` passed.

Starting Expo failed on this machine with:

```text
EMFILE: too many open files, watch
```

Likely cause:

- Metro is trying to watch many files under a cloud-synced folder without Watchman available.

Recommended fixes:

1. Install Watchman, then rerun `npm start -- --localhost`.
2. If the issue persists, run the phone app from a non-cloud local checkout while keeping source documents in the Napier Visual Reference project folder.
3. Keep `node_modules/` and `.expo/` out of source control. They are ignored by `.gitignore`.

Do not move this project into another app folder. The canonical project location is:

```text
/Users/mark/Library/CloudStorage/Dropbox-BPTNB/mark lewis/_GPT Meta/App Development/Napier Visual Reference
```

## First Prototype Scope

Included:

- mock Identify flow;
- mock capture review;
- mock crop screen;
- optional hints;
- mock search progress;
- ranked mock results;
- confidence labels;
- item detail;
- save to local collection state;
- history;
- privacy settings.

Not included yet:

- real camera;
- real photo import;
- real crop coordinates;
- backend API;
- visual search;
- account login;
- subscriptions;
- app-store setup.
