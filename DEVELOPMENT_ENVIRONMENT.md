# Phone App Development Environment

Purpose: explain how to work on the Napier phone app prototype without confusing the canonical project folder with temporary local runtime needs.

## Canonical Project Location

All source files and project documents belong here:

```text
/Users/mark/Library/CloudStorage/Dropbox-BPTNB/mark lewis/_GPT Meta/App Development/Napier Visual Reference
```

The phone app source is:

```text
/Users/mark/Library/CloudStorage/Dropbox-BPTNB/mark lewis/_GPT Meta/App Development/Napier Visual Reference/phone-app
```

Do not use the MML chatbot project for this work.

## Current Status

Verified:

- `npm install` completed.
- `npm run typecheck` passes.

Known local blocker:

- `npm start -- --localhost` failed with `EMFILE: too many open files, watch`.

Likely cause:

- Metro is watching many files under a cloud-synced folder without Watchman.

## Recommended Fix

Install Watchman:

```bash
brew install watchman
```

Then from `phone-app/`:

```bash
npm start -- --localhost
```

## If Watchman Does Not Resolve It

Use a local runtime checkout while keeping the canonical source in the Napier folder.

Recommended approach:

1. Keep all planning docs and source-of-truth files in `Napier Visual Reference`.
2. Create a temporary non-cloud runtime copy only for running Metro.
3. Copy changes back to the canonical `phone-app` folder after edits.
4. Do not move the project into another product folder.

Example runtime location:

```text
/Users/mark/A/code/napier-visual-reference-phone-app-runtime
```

This should be treated as a runtime convenience, not the canonical project.

## Version Notes

Current scaffold:

- Expo SDK 51
- React Native 0.74
- TypeScript
- Node on this machine reported as v24.x

If Expo reports Node compatibility issues, use an LTS Node version for runtime work.

Recommended:

- Node 20 LTS

## Before Any Runtime Move

Confirm:

- [ ] Canonical source remains in `Napier Visual Reference/phone-app`.
- [ ] Runtime copy is clearly named as temporary/runtime.
- [ ] Generated folders are ignored: `node_modules/`, `.expo/`, `ios/`, `android/`.
- [ ] `npm run typecheck` passes in canonical source.

