export type ConfidenceBand =
  | "strong_match"
  | "possible_match"
  | "variant_match"
  | "similar_design"
  | "needs_review"
  | "no_confident_match";

export type AppTab = "identify" | "queue" | "collection" | "history" | "settings";

export type FlowScreen =
  | "identify"
  | "captureReview"
  | "crop"
  | "hints"
  | "searchProgress"
  | "results"
  | "itemDetail";

export type SearchHint = {
  jewelryType: string;
  signedNapier: "yes" | "no" | "unknown";
  finishOrColor: string[];
  approximateDecade: string;
  measurement: string;
  freeText: string;
};

export type SearchQuery = {
  queryId: string;
  createdAt: string;
  imageUri: string;
  originalImageUri: string;
  imageWidth: number;
  imageHeight: number;
  crop: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  hints: SearchHint;
  status: "draft" | "uploading" | "searching" | "completed" | "failed" | "canceled";
};

export type LocalQueryImage = {
  localUri: string;
  originalUri: string;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  compressionQuality: number;
  resizedForUpload: boolean;
  source: "camera" | "library";
  capturedAt: string;
  crop: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
};

export type PieceDraftStatus = "queued" | "searched" | "saved" | "unresolved";

export type QueuedCapture = {
  captureId: string;
  image: LocalQueryImage;
  createdAt: string;
  angleLabel: string;
};

export type PieceDraft = {
  draftId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: PieceDraftStatus;
  captures: QueuedCapture[];
  primaryCaptureId: string;
  searchQueryId: string | null;
  savedItemId: string | null;
};

export type CandidateResult = {
  candidateId: string;
  itemId: string;
  variantId: string | null;
  rank: number;
  confidenceBand: ConfidenceBand;
  visualScore: number;
  metadataScore: number;
  combinedScore: number;
  title: string;
  itemType: string;
  dateLabel: string;
  collectionName: string;
  designFamily: string;
  referenceImageUri: string;
  evidence: string[];
};

export type IdentifyResponse = {
  queryId: string;
  status: "completed" | "failed";
  confidenceBand: ConfidenceBand;
  candidates: CandidateResult[];
  retryGuidance: string[];
  timingMs: number;
};

export type ItemDetail = {
  itemId: string;
  canonicalTitle: string;
  itemType: string;
  dateLabel: string;
  dateStart: number | null;
  dateEnd: number | null;
  collectionName: string;
  designFamily: string;
  description: string;
  referenceImages: Array<{
    imageId: string;
    uri: string;
    caption: string;
  }>;
  materials: string[];
  measurements: string[];
  variants: Array<{
    variantId: string;
    title: string;
    note: string;
  }>;
  relatedPieces: Array<{
    itemId: string;
    title: string;
    itemType: string;
    relationship: string;
    dateLabel: string;
    imageUri: string;
  }>;
  sourceCitation: {
    sourceType: string;
    title: string;
    page: string;
    caption: string;
    confidence: string;
  };
  referenceNotes: string[];
};

export type SavedItem = {
  savedItemId: string;
  itemId: string;
  queryId: string;
  savedAt: string;
  title: string;
  thumbnailUri: string;
  notes: string;
  tags: string[];
  condition: string;
  provenance: string;
  privatePhotos: string[];
};

export type HistoryEntry = {
  queryId: string;
  createdAt: string;
  queryImageUri: string;
  bestCandidateTitle: string;
  confidenceBand: ConfidenceBand;
  savedItemId: string | null;
};

export type PrivacySettings = {
  retainUploadedImages: boolean;
  allowModelImprovement: boolean;
  allowHumanReview: boolean;
  stripExif: boolean;
};
