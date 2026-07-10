import { CandidateResult, ItemDetail, LocalQueryImage, PieceDraft, SavedItem } from "../types";

export function createSavedItemFromSelection(
  queryId: string,
  candidate: CandidateResult,
  item: ItemDetail | null,
  queryImage: LocalQueryImage | null,
  privatePhotoUris?: string[],
): SavedItem {
  return {
    savedItemId: `saved_${Date.now()}`,
    itemId: item?.itemId || candidate.itemId,
    queryId,
    savedAt: new Date().toISOString(),
    title: item?.canonicalTitle || candidate.title,
    thumbnailUri: item?.referenceImages[0]?.uri || candidate.referenceImageUri || "",
    notes: `Saved from ${candidate.dateLabel} identification result.`,
    tags: [candidate.confidenceBand.replaceAll("_", " ")],
    condition: "",
    provenance: "",
    privatePhotos: privatePhotoUris ?? (queryImage?.originalUri ? [queryImage.originalUri] : []),
  };
}

export function createSavedItemFromPieceDraft(draft: PieceDraft): SavedItem {
  return {
    savedItemId: `saved_${Date.now()}`,
    itemId: draft.draftId,
    queryId: draft.searchQueryId ?? `manual_${draft.draftId}`,
    savedAt: new Date().toISOString(),
    title: draft.title || "Untitled piece draft",
    thumbnailUri: draft.captures[0]?.image.originalUri ?? "",
    notes: draft.description || "Saved directly from piece draft.",
    tags: ["piece draft", `${draft.captures.length} photos`],
    condition: "",
    provenance: "",
    privatePhotos: draft.captures.map((capture) => capture.image.originalUri),
  };
}
