import { CandidateResult, ItemDetail, LocalQueryImage, SavedItem } from "../types";

export function createSavedItemFromSelection(
  queryId: string,
  candidate: CandidateResult,
  item: ItemDetail | null,
  queryImage: LocalQueryImage | null,
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
    privatePhotos: queryImage?.localUri ? [queryImage.localUri] : [],
  };
}
