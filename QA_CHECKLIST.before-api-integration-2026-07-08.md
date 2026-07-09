# Phone App Mock Prototype QA Checklist

Use this checklist after the Expo app opens successfully.

## Environment

- [ ] `npm install` has completed.
- [ ] `npm run typecheck` passes.
- [ ] Expo starts without watcher errors.
- [ ] App opens on simulator, phone, or web target.

## Identify Flow

- [ ] App opens to the Identify tab.
- [ ] Take Photo routes to Capture Review.
- [ ] Import Photo routes to Capture Review.
- [ ] No account/login is required.
- [ ] Privacy note is visible before search.

## Capture And Crop

- [ ] Capture Review shows Use Photo, Crop, and Retake.
- [ ] Crop screen shows a visible crop target.
- [ ] Confirm Crop routes to Add Hints.
- [ ] Retake returns to the capture flow.

## Camera And Media

- [ ] Camera permission denied state works.
- [ ] Library permission denied state works.
- [ ] Real photo capture works.
- [ ] Real photo import works.
- [ ] Captured/imported image displays in Capture Review.
- [ ] Capture Review shows image dimensions and source.
- [ ] Crop screen displays selected image.
- [ ] Confirm Crop stores mock crop coordinates.
- [ ] Mock search still works after real media input.
- [ ] History stores selected image URI where possible.

## Hints

- [ ] Hints are optional.
- [ ] Skip Hints runs the mock search.
- [ ] Search runs the mock search.
- [ ] Type, signed status, color/finish, and decade controls are visible.

## Results

- [ ] Search Progress appears before Results.
- [ ] Results show multiple ranked candidates.
- [ ] Confidence labels are visible.
- [ ] Strong match, variant match, and similar design are represented.
- [ ] No-match state can be previewed.
- [ ] Retry guidance appears in no-match state.

## Item Detail

- [ ] Opening a candidate shows Item Detail.
- [ ] Reference facts are grouped under Napier Reference.
- [ ] User notes are visually separate from reference facts.
- [ ] Source citation is visible.
- [ ] Variants and related pieces are visible.
- [ ] Save To Collection works.

## Collection And History

- [ ] Saved item appears in Collection.
- [ ] Empty Collection state works before saving.
- [ ] History shows the mock query.
- [ ] History shows saved/not saved status.
- [ ] History can reopen the mock result.

## Settings / Privacy

- [ ] Privacy explanation is visible.
- [ ] Prototype API mode can switch between mock and failure.
- [ ] Failure mode shows a search error state without dead-ending the user.
- [ ] Retain uploaded images toggle works.
- [ ] Model improvement toggle works.
- [ ] Human expert review toggle works.
- [ ] Strip EXIF toggle works.
- [ ] Delete History placeholder is visible.

## Language Guardrails

- [ ] App does not say `verified` unless human/expert verification exists.
- [ ] App does not claim authenticity.
- [ ] App does not claim value or price.
- [ ] App does not claim condition or completeness.
- [ ] Low-confidence results do not look authoritative.

## First Prototype Pass

The mocked app passes QA when:

- [ ] full mock flow works end to end;
- [ ] every confidence state has a visible UI treatment;
- [ ] saved collection works locally;
- [ ] privacy controls are present;
- [ ] no screen blocks progress with production-only dependencies.
