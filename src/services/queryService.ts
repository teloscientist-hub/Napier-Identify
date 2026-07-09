import { mockQuery } from "../mockData";
import { LocalQueryImage, SearchHint, SearchQuery } from "../types";

export function createSearchQuery(image: LocalQueryImage | null, hints: SearchHint): SearchQuery {
  const createdAt = new Date().toISOString();

  return {
    ...mockQuery,
    queryId: `query_${Date.now()}`,
    createdAt,
    imageUri: image?.localUri ?? mockQuery.imageUri,
    crop: image?.crop ?? null,
    hints,
    status: "searching",
  };
}
