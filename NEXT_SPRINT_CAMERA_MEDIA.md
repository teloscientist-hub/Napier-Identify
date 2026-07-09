# Next Sprint: Camera And Media Integration

Do not start this sprint until the mocked app flow passes `QA_CHECKLIST.md`.

## Sprint Goal

Replace the placeholder image flow with real media input while preserving mock search results.

The app should still use mock identify results after image capture/import. This sprint is about producing an image object the future backend can accept.

## Scope

Build:

- camera permission flow;
- photo-library permission flow;
- take photo;
- import photo;
- show captured/imported image in Capture Review;
- retake/reselect;
- basic crop placeholder using the selected image;
- image metadata object for future upload;
- graceful denied-permission states.

Do not build yet:

- real backend upload;
- real visual search;
- production crop/lasso tooling;
- image compression tuning;
- EXIF stripping implementation;
- account login.

## Recommended Expo Packages

Likely packages:

- `expo-camera`
- `expo-image-picker`
- `expo-image-manipulator`

Decision to verify:

- Use Expo packages first for prototype speed.
- Defer native/custom camera work unless Expo camera quality becomes a blocker.

## Required Data Object

After capture/import, the app should create a local media object:

```ts
type LocalQueryImage = {
  localUri: string;
  width: number;
  height: number;
  source: "camera" | "library";
  capturedAt: string;
  crop: null | {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};
```

This object should later map cleanly to `SearchQuery`.

## Step Sequence

### Step 1: Install Packages

- [ ] Add Expo camera/media packages.
- [ ] Confirm `npm run typecheck` still passes.
- [ ] Confirm Expo can start in the local environment.

### Step 2: Permission States

- [ ] Camera permission unknown.
- [ ] Camera permission granted.
- [ ] Camera permission denied.
- [ ] Photo library permission unknown.
- [ ] Photo library permission granted.
- [ ] Photo library permission denied.

Acceptance:

- Denied states explain recovery without blocking import/camera alternatives.

### Step 3: Capture / Import

- [ ] Take Photo launches real camera.
- [ ] Import Photo launches image library.
- [ ] Selected image appears in Capture Review.
- [ ] Retake/reselect works.

Acceptance:

- User can reach Capture Review with a real local image URI.

### Step 4: Crop Placeholder With Real Image

- [ ] Crop screen displays selected image.
- [ ] Confirm Crop attaches mock crop coordinates.
- [ ] Reset clears crop.

Acceptance:

- Crop output is stored in local query image state even if real crop editing is deferred.

### Step 5: Preserve Mock Search

- [ ] Use Photo still routes to Hints.
- [ ] Search still returns mock ranked results.
- [ ] History stores selected image URI where possible.

Acceptance:

- Media integration does not break the existing mocked search flow.

## QA Additions

Add to `QA_CHECKLIST.md` after this sprint:

- [ ] Camera permission denied state works.
- [ ] Library permission denied state works.
- [ ] Real photo capture works.
- [ ] Real photo import works.
- [ ] Captured/imported image displays in Capture Review.
- [ ] Crop screen displays selected image.
- [ ] Mock search still works after real media input.

## Red Flags

Stop and reassess if:

- camera setup blocks the mocked flow;
- Expo version conflicts require a major dependency change;
- the app starts requiring account/login;
- image handling introduces backend assumptions too early;
- crop work turns into a full custom image editor before basic capture works.

