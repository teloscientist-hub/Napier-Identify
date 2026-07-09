import {
  CandidateResult,
  ConfidenceBand,
  HistoryEntry,
  IdentifyResponse,
  ItemDetail,
  PrivacySettings,
  SavedItem,
  SearchHint,
  SearchQuery,
} from "./types";

export const confidenceLabels: Record<ConfidenceBand, string> = {
  strong_match: "Strong match",
  possible_match: "Possible match",
  variant_match: "Variant match",
  similar_design: "Similar design",
  needs_review: "Needs review",
  no_confident_match: "No confident match",
};

export const defaultHints: SearchHint = {
  jewelryType: "brooch",
  signedNapier: "unknown",
  finishOrColor: ["gold tone"],
  approximateDecade: "1960s",
  measurement: "",
  freeText: "",
};

export const mockQuery: SearchQuery = {
  queryId: "query_0001",
  createdAt: "2026-07-08T00:00:00Z",
  imageUri: "mock://query/brooch-front.jpg",
  crop: null,
  hints: defaultHints,
  status: "draft",
};

export const mockCandidates: CandidateResult[] = [
  {
    candidateId: "candidate_0001",
    itemId: "napier_brooch_0001",
    variantId: null,
    rank: 1,
    confidenceBand: "strong_match",
    visualScore: 0.91,
    metadataScore: 0.76,
    combinedScore: 0.87,
    title: "Gold-tone textured brooch",
    itemType: "brooch",
    dateLabel: "mid-1960s",
    collectionName: "",
    designFamily: "textured modernist",
    referenceImageUri: "mock://reference/napier_brooch_0001_ref_01.jpg",
    evidence: ["Strong shape match", "Matches brooch type", "Finish appears compatible"],
  },
  {
    candidateId: "candidate_0002",
    itemId: "napier_brooch_0002",
    variantId: "napier_brooch_0002_var_01",
    rank: 2,
    confidenceBand: "variant_match",
    visualScore: 0.84,
    metadataScore: 0.69,
    combinedScore: 0.79,
    title: "Textured brooch, alternate finish",
    itemType: "brooch",
    dateLabel: "1960s",
    collectionName: "",
    designFamily: "textured modernist",
    referenceImageUri: "mock://reference/napier_brooch_0002_ref_01.jpg",
    evidence: ["Similar silhouette", "Different finish may indicate variant", "Date range is compatible"],
  },
  {
    candidateId: "candidate_0003",
    itemId: "napier_brooch_0003",
    variantId: null,
    rank: 3,
    confidenceBand: "similar_design",
    visualScore: 0.72,
    metadataScore: 0.48,
    combinedScore: 0.64,
    title: "Similar modernist brooch",
    itemType: "brooch",
    dateLabel: "late-1960s",
    collectionName: "",
    designFamily: "modernist",
    referenceImageUri: "mock://reference/napier_brooch_0003_ref_01.jpg",
    evidence: ["Related motif", "Different construction details", "Should not be treated as exact"],
  },
];

export const mockIdentifyResponse: IdentifyResponse = {
  queryId: "query_0001",
  status: "completed",
  confidenceBand: "strong_match",
  candidates: mockCandidates,
  retryGuidance: [],
  timingMs: 2200,
};

export const mockNoMatchResponse: IdentifyResponse = {
  queryId: "query_0002",
  status: "completed",
  confidenceBand: "no_confident_match",
  candidates: [],
  retryGuidance: [
    "Crop closer to the jewelry",
    "Add a reverse-side or mark photo",
    "Choose the jewelry type if known",
  ],
  timingMs: 2100,
};

export const mockItemDetail: ItemDetail = {
  itemId: "napier_brooch_0001",
  canonicalTitle: "Gold-tone textured brooch",
  itemType: "brooch",
  dateLabel: "mid-1960s",
  dateStart: 1964,
  dateEnd: 1966,
  collectionName: "",
  designFamily: "textured modernist",
  description: "Mock reference description for testing the item detail layout.",
  referenceImages: [
    {
      imageId: "img_brooch_0001_ref_01",
      uri: "mock://reference/napier_brooch_0001_ref_01.jpg",
      caption: "Reference image placeholder",
    },
  ],
  materials: ["gold tone"],
  measurements: ["measurement not yet entered"],
  variants: [
    {
      variantId: "napier_brooch_0001_var_01",
      title: "Alternate finish",
      note: "Shown as a mock variant for UI testing.",
    },
  ],
  relatedPieces: [
    {
      itemId: "napier_earrings_0001",
      title: "Related earrings",
      itemType: "earrings",
      relationship: "related_set_piece",
      dateLabel: "mid-1960s",
      imageUri: "mock://reference/related_earrings_0001.jpg",
    },
  ],
  sourceCitation: {
    sourceType: "book",
    title: "The Napier Co.: Defining 20th Century American Costume Jewelry",
    page: "mock page",
    caption: "Mock caption for layout testing.",
    confidence: "contextual",
  },
  referenceNotes: ["Mock note: authoritative Napier facts should remain separate from user notes."],
};

export const initialHistory: HistoryEntry[] = [
  {
    queryId: "query_0001",
    createdAt: "2026-07-08T00:00:00Z",
    queryImageUri: "mock://query/brooch-front.jpg",
    bestCandidateTitle: "Gold-tone textured brooch",
    confidenceBand: "strong_match",
    savedItemId: null,
  },
];

export const defaultPrivacySettings: PrivacySettings = {
  retainUploadedImages: false,
  allowModelImprovement: false,
  allowHumanReview: false,
  stripExif: true,
};

export function createSavedItem(queryId: string): SavedItem {
  return {
    savedItemId: `saved_${Date.now()}`,
    itemId: mockItemDetail.itemId,
    queryId,
    savedAt: new Date().toISOString(),
    title: mockItemDetail.canonicalTitle,
    thumbnailUri: mockItemDetail.referenceImages[0]?.uri ?? "",
    notes: "Mock saved note. Replace with user notes later.",
    tags: ["review later"],
    condition: "",
    provenance: "",
    privatePhotos: [],
  };
}
