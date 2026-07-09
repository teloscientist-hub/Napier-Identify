import { apiConfig, requireApiBaseUrl } from "./apiConfig";
import type { IdentifyOptions } from "./appServices";
import { CandidateResult, ConfidenceBand, IdentifyResponse, ItemDetail, SearchQuery } from "../types";

type UnknownRecord = Record<string, unknown>;

const confidenceBands: ConfidenceBand[] = [
  "strong_match",
  "possible_match",
  "variant_match",
  "similar_design",
  "needs_review",
  "no_confident_match",
];

export async function postIdentify(query: SearchQuery, options: IdentifyOptions = {}): Promise<IdentifyResponse> {
  const url = new URL(`${requireApiBaseUrl()}/identify`);
  if (options.forceNoMatch) {
    url.searchParams.set("mode", "no_match");
  } else if (apiConfig.identifyMode) {
    url.searchParams.set("mode", apiConfig.identifyMode);
  }

  const response = await fetch(url.toString(), {
    method: "POST",
    body: createIdentifyFormData(query),
  });

  const payload = await readJson(response);
  if (!response.ok) {
    throw new Error(readErrorMessage(payload, `Identify request failed with status ${response.status}.`));
  }

  return mapIdentifyResponse(payload, query.queryId);
}

export async function fetchItem(itemId: string): Promise<ItemDetail> {
  const url = new URL(`${requireApiBaseUrl()}/items/${encodeURIComponent(itemId)}`);
  if (apiConfig.itemMode) {
    url.searchParams.set("mode", apiConfig.itemMode);
  }

  const response = await fetch(url.toString());
  const payload = await readJson(response);

  if (!response.ok) {
    throw new Error(readErrorMessage(payload, `Item detail request failed with status ${response.status}.`));
  }

  return mapItemDetail(payload, itemId);
}

function createIdentifyFormData(query: SearchQuery): FormData {
  const formData = new FormData();
  formData.append("query_id", query.queryId);
  formData.append("created_at", query.createdAt);
  formData.append("image_uri", query.imageUri);
  formData.append("crop", JSON.stringify(query.crop));
  formData.append("hints", JSON.stringify(query.hints));
  formData.append("app_version", apiConfig.appVersion);
  formData.append("client_context", JSON.stringify({ platform: "expo" }));

  if (!query.imageUri.startsWith("mock://")) {
    formData.append("image", {
      uri: query.imageUri,
      name: "query-image.jpg",
      type: "image/jpeg",
    } as unknown as Blob);
  }

  return formData;
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Server returned a malformed JSON response.");
  }
}

function mapIdentifyResponse(payload: unknown, fallbackQueryId: string): IdentifyResponse {
  const data = asRecord(payload, "Identify response must be an object.");
  const candidates = asArray(readField(data, "candidates", "ranked_candidates")).map((item, index) =>
    mapCandidateResult(item, index + 1),
  );
  const confidenceBand = readConfidenceBand(readField(data, "confidenceBand", "confidence_band"), candidates.length);

  return {
    queryId: readString(readField(data, "queryId", "query_id"), fallbackQueryId),
    status: readStatus(readField(data, "status")),
    confidenceBand,
    candidates,
    retryGuidance: asStringArray(readField(data, "retryGuidance", "retry_guidance")),
    timingMs: readNumber(readField(data, "timingMs", "timing_ms"), 0),
  };
}

function mapCandidateResult(payload: unknown, fallbackRank: number): CandidateResult {
  const data = asRecord(payload, "Candidate result must be an object.");

  return {
    candidateId: readString(readField(data, "candidateId", "candidate_id", "id"), `candidate_${fallbackRank}`),
    itemId: readString(readField(data, "itemId", "item_id"), ""),
    variantId: readNullableString(readField(data, "variantId", "variant_id")),
    rank: readNumber(readField(data, "rank"), fallbackRank),
    confidenceBand: readConfidenceBand(readField(data, "confidenceBand", "confidence_band"), 1),
    visualScore: readNumber(readField(data, "visualScore", "visual_score"), 0),
    metadataScore: readNumber(readField(data, "metadataScore", "metadata_score"), 0),
    combinedScore: readNumber(readField(data, "combinedScore", "combined_score", "score"), 0),
    title: readString(readField(data, "title", "canonicalTitle", "canonical_title"), "Untitled Napier reference"),
    itemType: readString(readField(data, "itemType", "item_type"), "unknown"),
    dateLabel: readString(readField(data, "dateLabel", "date_label"), "date unknown"),
    collectionName: readString(readField(data, "collectionName", "collection_name"), ""),
    designFamily: readString(readField(data, "designFamily", "design_family"), ""),
    referenceImageUri: readString(readField(data, "referenceImageUri", "reference_image_uri"), ""),
    evidence: asStringArray(readField(data, "evidence", "match_reasons")),
  };
}

function mapItemDetail(payload: unknown, fallbackItemId: string): ItemDetail {
  const data = asRecord(payload, "Item detail response must be an object.");

  return {
    itemId: readString(readField(data, "itemId", "item_id"), fallbackItemId),
    canonicalTitle: readString(readField(data, "canonicalTitle", "canonical_title", "title"), "Untitled Napier reference"),
    itemType: readString(readField(data, "itemType", "item_type"), "unknown"),
    dateLabel: readString(readField(data, "dateLabel", "date_label"), "date unknown"),
    dateStart: readNullableNumber(readField(data, "dateStart", "date_start")),
    dateEnd: readNullableNumber(readField(data, "dateEnd", "date_end")),
    collectionName: readString(readField(data, "collectionName", "collection_name"), ""),
    designFamily: readString(readField(data, "designFamily", "design_family"), ""),
    description: readString(readField(data, "description"), ""),
    referenceImages: asArray(readField(data, "referenceImages", "reference_images")).map((item, index) => {
      const image = asRecord(item, "Reference image must be an object.");
      return {
        imageId: readString(readField(image, "imageId", "image_id"), `image_${index + 1}`),
        uri: readString(readField(image, "uri", "imageUri", "image_uri"), ""),
        caption: readString(readField(image, "caption"), ""),
      };
    }),
    materials: asStringArray(readField(data, "materials")),
    measurements: asStringArray(readField(data, "measurements")),
    variants: asArray(readField(data, "variants")).map((item, index) => {
      const variant = asRecord(item, "Variant must be an object.");
      return {
        variantId: readString(readField(variant, "variantId", "variant_id"), `variant_${index + 1}`),
        title: readString(readField(variant, "title"), "Variant"),
        note: readString(readField(variant, "note"), ""),
      };
    }),
    relatedPieces: asArray(readField(data, "relatedPieces", "related_pieces")).map((item, index) => {
      const related = asRecord(item, "Related piece must be an object.");
      return {
        itemId: readString(readField(related, "itemId", "item_id"), `related_${index + 1}`),
        title: readString(readField(related, "title"), "Related piece"),
        itemType: readString(readField(related, "itemType", "item_type"), "unknown"),
        relationship: readString(readField(related, "relationship"), ""),
        dateLabel: readString(readField(related, "dateLabel", "date_label"), "date unknown"),
        imageUri: readString(readField(related, "imageUri", "image_uri"), ""),
      };
    }),
    sourceCitation: mapSourceCitation(readField(data, "sourceCitation", "source_citation")),
    referenceNotes: asStringArray(readField(data, "referenceNotes", "reference_notes")),
  };
}

function mapSourceCitation(payload: unknown): ItemDetail["sourceCitation"] {
  const data = isRecord(payload) ? payload : {};

  return {
    sourceType: readString(readField(data, "sourceType", "source_type"), "book"),
    title: readString(readField(data, "title"), "The Napier Co.: Defining 20th Century American Costume Jewelry"),
    page: readString(readField(data, "page"), "page unknown"),
    caption: readString(readField(data, "caption"), ""),
    confidence: readString(readField(data, "confidence"), "contextual"),
  };
}

function readField(data: UnknownRecord, ...keys: string[]): unknown {
  for (const key of keys) {
    if (key in data) {
      return data[key];
    }
  }

  return undefined;
}

function asRecord(value: unknown, message: string): UnknownRecord {
  if (!isRecord(value)) {
    throw new Error(message);
  }

  return value;
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function asStringArray(value: unknown): string[] {
  return asArray(value)
    .filter((item): item is string => typeof item === "string")
    .filter((item) => item.trim().length > 0);
}

function readString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

function readNullableString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function readNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function readNullableNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function readStatus(value: unknown): IdentifyResponse["status"] {
  return value === "failed" ? "failed" : "completed";
}

function readConfidenceBand(value: unknown, candidateCount: number): ConfidenceBand {
  if (typeof value === "string" && confidenceBands.includes(value as ConfidenceBand)) {
    return value as ConfidenceBand;
  }

  return candidateCount > 0 ? "possible_match" : "no_confident_match";
}

function readErrorMessage(payload: unknown, fallback: string): string {
  if (!isRecord(payload)) {
    return fallback;
  }

  return readString(readField(payload, "message", "error", "detail"), fallback);
}
