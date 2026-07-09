import { mockQuery } from "../mockData";
import { LocalQueryImage, SearchHint, SearchQuery } from "../types";

export function createSearchQuery(image: LocalQueryImage | null, hints: SearchHint): SearchQuery {
  const createdAt = new Date().toISOString();

  return {
    ...mockQuery,
    queryId: `query_${Date.now()}`,
    createdAt,
    imageUri: image?.localUri ?? mockQuery.imageUri,
    originalImageUri: image?.originalUri ?? mockQuery.imageUri,
    imageWidth: image?.width ?? 0,
    imageHeight: image?.height ?? 0,
    crop: image?.crop ?? null,
    hints,
    status: "searching",
  };
}
