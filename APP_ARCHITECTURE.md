# Phone App Architecture Notes

Purpose: keep the first Napier phone app prototype simple enough to move quickly while preserving the structure needed for real camera and API integration later.

## Current Prototype Shape

The app is currently a single Expo / React Native prototype with:

- local screen state;
- local mock data;
- mock identify responses;
- local saved collection state;
- no backend dependency;
- no real camera dependency yet.

This is intentional. The first goal is to prove the user flow before production services exist.

## Architecture Rule

Keep this boundary:

```text
Screen components -> app state -> service layer -> mock or real backend
```

Screens should not know whether results came from mock data or the real API.

## Recommended Next Refactor

Before adding camera or API integration, split `App.tsx` into:

```text
src/
  components/
    Badge.tsx
    CandidateCard.tsx
    MockImage.tsx
    PrimaryButton.tsx
    SecondaryButton.tsx
  screens/
    IdentifyScreen.tsx
    CaptureReviewScreen.tsx
    CropScreen.tsx
    HintsScreen.tsx
    SearchProgressScreen.tsx
    ResultsScreen.tsx
    ItemDetailScreen.tsx
    CollectionScreen.tsx
    HistoryScreen.tsx
    SettingsScreen.tsx
  services/
    identifyService.ts
    itemService.ts
    savedItemService.ts
  state/
    appState.ts
  styles/
    theme.ts
  mockData.ts
  types.ts
```

Do not over-engineer this yet. The purpose is separation, not abstraction for its own sake.

## State Ownership

App-level state:

- current tab;
- current flow screen;
- current query image;
- crop;
- hints;
- current identify response;
- selected candidate;
- saved items;
- history;
- privacy settings;
- API mode.

Screen-local state:

- text input editing;
- temporary picker choices;
- transient loading/error messages.

Backend-owned later:

- authoritative item detail;
- reference images;
- visual search results;
- user account;
- synced saved collection;
- retained query images.

## Service Layer

Create services before real API integration:

```text
identifyService.identify(query)
itemService.getItem(itemId)
savedItemService.saveItem(itemId, queryId)
savedItemService.listSavedItems()
```

Each service should support:

- `mock` mode;
- `real` mode later;
- failure mode for QA.

Current scaffold:

- `src/services/appServices.ts`

This service currently supports mock and failure behavior. `real` mode intentionally throws until backend endpoints exist.

## Do Not Add Yet

Do not add these until the mock flow and camera/media sprint pass QA:

- production authentication;
- payment/subscription logic;
- push notifications;
- deep linking;
- complex state-management library;
- full offline sync;
- native custom camera module;
- real expert review workflow.

## Acceptance Criteria For Refactor

After splitting files:

- `npm run typecheck` passes;
- app behavior is unchanged;
- mock mode still works;
- no screen imports raw backend response shapes directly;
- no production-only dependencies are introduced.
