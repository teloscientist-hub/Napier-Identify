import React, { useMemo, useState } from "react";
import { AppChrome } from "../components/AppChrome";
import {
  defaultHints,
  defaultPrivacySettings,
  initialHistory,
  mockCandidates,
  mockIdentifyResponse,
  mockQuery,
} from "../mockData";
import { CaptureReviewScreen } from "../screens/CaptureReviewScreen";
import { CollectionScreen } from "../screens/CollectionScreen";
import { CropScreen } from "../screens/CropScreen";
import { HintsScreen } from "../screens/HintsScreen";
import { HistoryScreen } from "../screens/HistoryScreen";
import { IdentifyScreen } from "../screens/IdentifyScreen";
import { ItemDetailScreen } from "../screens/ItemDetailScreen";
import { QueueScreen } from "../screens/QueueScreen";
import { ResultsScreen } from "../screens/ResultsScreen";
import { SearchProgressScreen } from "../screens/SearchProgressScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { AppMode, getItem, identify } from "../services/appServices";
import { createMockCrop, importQueryPhoto, takeQueryPhoto } from "../services/mediaService";
import { createSearchQuery } from "../services/queryService";
import {
  AppTab,
  CandidateResult,
  FlowScreen,
  HistoryEntry,
  IdentifyResponse,
  ItemDetail,
  LocalQueryImage,
  PieceDraft,
  PrivacySettings,
  SavedItem,
  SearchHint,
  SearchQuery,
} from "../types";
import { createSavedItemFromSelection } from "./savedItems";

export function AppShell() {
  const [tab, setTab] = useState<AppTab>("identify");
  const [screen, setScreen] = useState<FlowScreen>("identify");
  const [hints, setHints] = useState<SearchHint>(defaultHints);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateResult>(mockCandidates[0]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [pieceDrafts, setPieceDrafts] = useState<PieceDraft[]>([]);
  const [activePieceDraftId, setActivePieceDraftId] = useState<string | null>(null);
  const [pendingPhotoDraftId, setPendingPhotoDraftId] = useState<string | null>(null);
  const [lastSavedTitle, setLastSavedTitle] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>(initialHistory);
  const [privacy, setPrivacy] = useState<PrivacySettings>(defaultPrivacySettings);
  const [apiMode, setApiMode] = useState<AppMode>("mock");
  const [identifyResponse, setIdentifyResponse] = useState<IdentifyResponse>(mockIdentifyResponse);
  const [selectedItemDetail, setSelectedItemDetail] = useState<ItemDetail | null>(null);
  const [itemDetailError, setItemDetailError] = useState<string | null>(null);
  const [itemDetailLoading, setItemDetailLoading] = useState(false);
  const [currentQuery, setCurrentQuery] = useState<SearchQuery>(mockQuery);
  const [queryImage, setQueryImage] = useState<LocalQueryImage | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);

  function selectTab(nextTab: AppTab) {
    setTab(nextTab);
    if (nextTab === "identify") {
      setScreen("identify");
    }
  }

  function resetPhotoSelection() {
    setTab("identify");
    setApiError(null);
    setMediaError(null);
    setQueryImage(null);
    setActivePieceDraftId(null);
    setPendingPhotoDraftId(null);
    setScreen("identify");
  }

  async function takePhoto() {
    setApiError(null);
    setMediaError(null);

    const result = await takeQueryPhoto();
    if (result.status === "denied" || result.status === "canceled") {
      setMediaError(result.message);
    }
    if (result.status === "selected") {
      setQueryImage(result.image);
      setActivePieceDraftId(null);
      setScreen("captureReview");
    }
  }

  async function importPhoto() {
    setApiError(null);
    setMediaError(null);

    const result = await importQueryPhoto();
    if (result.status === "denied" || result.status === "canceled") {
      setMediaError(result.message);
    }
    if (result.status === "selected") {
      setQueryImage(result.image);
      setActivePieceDraftId(null);
      setScreen("captureReview");
    }
  }

  function createQueuedCapture(image: LocalQueryImage, angleLabel = "unlabeled view") {
    return {
      captureId: `capture_${Date.now()}`,
      image,
      createdAt: new Date().toISOString(),
      angleLabel,
    };
  }

  function addCurrentPhotoAsNewPiece() {
    if (!queryImage) {
      setMediaError("Take or import a photo before adding it to the queue.");
      return;
    }

    const capture = createQueuedCapture(queryImage, "primary view");
    const draftNumber = pieceDrafts.length + 1;
    const now = new Date().toISOString();
    const draft: PieceDraft = {
      draftId: `draft_${Date.now()}`,
      title: `Piece Draft ${draftNumber}`,
      description: "",
      createdAt: now,
      updatedAt: now,
      status: "queued",
      captures: [capture],
      primaryCaptureId: capture.captureId,
      searchQueryId: null,
      savedItemId: null,
    };

    setPieceDrafts((drafts) => [draft, ...drafts]);
    setQueryImage(null);
    setActivePieceDraftId(null);
    setPendingPhotoDraftId(null);
    setTab("queue");
    setScreen("identify");
  }

  function addCurrentPhotoToPieceDraft(draftId: string) {
    if (!queryImage) {
      setMediaError("Take or import a photo before adding it to a piece draft.");
      return;
    }

    const capture = createQueuedCapture(queryImage, "additional view");
    setPieceDrafts((drafts) =>
      drafts.map((draft) =>
        draft.draftId === draftId
          ? {
              ...draft,
              captures: [...draft.captures, capture],
              updatedAt: new Date().toISOString(),
              status: draft.status === "saved" ? "saved" : "queued",
            }
          : draft,
      ),
    );
    setQueryImage(null);
    setActivePieceDraftId(null);
    setPendingPhotoDraftId(null);
    setTab("queue");
    setScreen("identify");
  }

  function startAddingPhotoToDraft(draft: PieceDraft) {
    setApiError(null);
    setMediaError(null);
    setQueryImage(null);
    setActivePieceDraftId(null);
    setPendingPhotoDraftId(draft.draftId);
    setTab("identify");
    setScreen("identify");
  }

  function cancelCompanionPhotoCapture() {
    setPendingPhotoDraftId(null);
    setQueryImage(null);
    setApiError(null);
    setMediaError(null);
    setTab("queue");
    setScreen("identify");
  }

  function updatePieceDraft(draftId: string, updates: Pick<PieceDraft, "title" | "description">) {
    setPieceDrafts((drafts) =>
      drafts.map((draft) =>
        draft.draftId === draftId
          ? {
              ...draft,
              title: updates.title,
              description: updates.description,
              updatedAt: new Date().toISOString(),
            }
          : draft,
      ),
    );
  }

  function processPieceDraft(draft: PieceDraft) {
    const primaryCapture = draft.captures.find((capture) => capture.captureId === draft.primaryCaptureId) ?? draft.captures[0];
    if (!primaryCapture) {
      setMediaError("This piece draft has no photos left to identify.");
      return;
    }

    setApiError(null);
    setMediaError(null);
    setQueryImage(primaryCapture.image);
    setActivePieceDraftId(draft.draftId);
    setTab("identify");
    setScreen("captureReview");
  }

  function deletePieceDraft(draftId: string) {
    setPieceDrafts((drafts) => drafts.filter((draft) => draft.draftId !== draftId));
    if (activePieceDraftId === draftId) {
      setActivePieceDraftId(null);
      setQueryImage(null);
      setApiError(null);
      setMediaError(null);
      setScreen("identify");
    }
  }

  function deletePieceDraftCapture(draftId: string, captureId: string) {
    setPieceDrafts((drafts) =>
      drafts.flatMap((draft) => {
        if (draft.draftId !== draftId) {
          return [draft];
        }

        const captures = draft.captures.filter((capture) => capture.captureId !== captureId);
        if (captures.length === 0) {
          return [];
        }

        return [
          {
            ...draft,
            captures,
            primaryCaptureId: draft.primaryCaptureId === captureId ? captures[0].captureId : draft.primaryCaptureId,
            updatedAt: new Date().toISOString(),
          },
        ];
      }),
    );
  }

  function confirmMockCrop() {
    setQueryImage((image) => (image ? { ...image, crop: createMockCrop(image) } : image));
    setScreen("hints");
  }

  async function openCandidate(candidate: CandidateResult) {
    setSelectedCandidate(candidate);
    setSelectedItemDetail(null);
    setItemDetailError(null);
    setItemDetailLoading(true);
    setScreen("itemDetail");

    try {
      const item = await getItem(candidate.itemId, apiMode);
      setSelectedItemDetail(item);
    } catch (error) {
      setItemDetailError(error instanceof Error ? error.message : "Reference detail failed to load");
    } finally {
      setItemDetailLoading(false);
    }
  }

  async function runSearch(noMatch = false) {
    setApiError(null);
    setScreen("searchProgress");
    const query = createSearchQuery(queryImage, hints);
    setCurrentQuery(query);
    try {
      const response = await identify(query, apiMode, { forceNoMatch: noMatch });
      setIdentifyResponse(response);
      if (activePieceDraftId) {
        setPieceDrafts((drafts) =>
          drafts.map((draft) =>
            draft.draftId === activePieceDraftId
              ? { ...draft, status: response.candidates[0] ? "searched" : "unresolved", searchQueryId: query.queryId }
              : draft,
          ),
        );
      }
      if (response.candidates[0]) {
        setHistory((entries) => [
          {
            queryId: query.queryId,
            createdAt: query.createdAt,
            queryImageUri: query.imageUri,
            bestCandidateTitle: response.candidates[0].title,
            confidenceBand: response.candidates[0].confidenceBand,
            savedItemId: null,
          },
          ...entries,
        ]);
      }
      setScreen("results");
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Search failed");
      setScreen("results");
    }
  }

  function saveCurrentItem() {
    const activeDraft = pieceDrafts.find((draft) => draft.draftId === activePieceDraftId) ?? null;
    const privatePhotoUris = activeDraft?.captures.map((capture) => capture.image.originalUri);
    const saved = createSavedItemFromSelection(currentQuery.queryId, selectedCandidate, selectedItemDetail, queryImage, privatePhotoUris);

    setSavedItems((items) => [saved, ...items]);
    setHistory((entries) =>
      entries.map((entry) =>
        entry.queryId === currentQuery.queryId ? { ...entry, savedItemId: saved.savedItemId } : entry,
      ),
    );
    if (activePieceDraftId) {
      setPieceDrafts((drafts) =>
        drafts.map((draft) =>
          draft.draftId === activePieceDraftId
            ? { ...draft, status: "saved", searchQueryId: currentQuery.queryId, savedItemId: saved.savedItemId }
            : draft,
        ),
      );
    }
    setLastSavedTitle(saved.title);
    setTab("collection");
  }

  const body = useMemo(() => {
    if (tab === "collection") {
      return (
        <CollectionScreen
          lastSavedTitle={lastSavedTitle}
          savedItems={savedItems}
          onOpenIdentify={() => {
            setLastSavedTitle(null);
            setTab("identify");
            setScreen("identify");
          }}
        />
      );
    }
    if (tab === "queue") {
      return (
        <QueueScreen
          drafts={pieceDrafts}
          onOpenIdentify={() => {
            setPendingPhotoDraftId(null);
            setTab("identify");
            setScreen("identify");
          }}
          onAddPhotoToDraft={startAddingPhotoToDraft}
          onUpdateDraft={updatePieceDraft}
          onProcessDraft={processPieceDraft}
          onDeleteDraft={deletePieceDraft}
          onDeleteCapture={deletePieceDraftCapture}
        />
      );
    }
    if (tab === "history") {
      return (
        <HistoryScreen
          history={history}
          onOpenResult={() => {
            setTab("identify");
            setScreen("results");
          }}
        />
      );
    }
    if (tab === "settings") {
      return <SettingsScreen privacy={privacy} apiMode={apiMode} onApiModeChange={setApiMode} onChange={setPrivacy} />;
    }

    if (screen === "captureReview") {
      return (
        <CaptureReviewScreen
          image={queryImage}
          targetPieceDraft={pieceDrafts.find((draft) => draft.draftId === pendingPhotoDraftId) ?? null}
          pieceDrafts={pieceDrafts}
          onUsePhoto={() => setScreen("hints")}
          onAddAsNewPiece={addCurrentPhotoAsNewPiece}
          onAddToPieceDraft={addCurrentPhotoToPieceDraft}
          onRetake={resetPhotoSelection}
          onCrop={() => setScreen("crop")}
        />
      );
    }
    if (screen === "crop") {
      return <CropScreen image={queryImage} onConfirm={confirmMockCrop} onReset={() => setScreen("captureReview")} />;
    }
    if (screen === "hints") {
      return <HintsScreen hints={hints} onChange={setHints} onSkip={() => runSearch()} onSearch={() => runSearch()} />;
    }
    if (screen === "searchProgress") {
      return <SearchProgressScreen />;
    }
    if (screen === "results") {
      return (
        <ResultsScreen
          response={identifyResponse}
          error={apiError}
          onOpen={openCandidate}
          onRefine={() => setScreen("hints")}
          onTryAgain={resetPhotoSelection}
          onShowNoMatch={() => runSearch(true)}
          onShowMockMatches={() => runSearch(false)}
        />
      );
    }
    if (screen === "itemDetail") {
      return (
        <ItemDetailScreen
          candidate={selectedCandidate}
          error={itemDetailError}
          item={selectedItemDetail}
          loading={itemDetailLoading}
          onBack={() => setScreen("results")}
          onSave={saveCurrentItem}
        />
      );
    }
    const pendingPhotoDraft = pieceDrafts.find((draft) => draft.draftId === pendingPhotoDraftId) ?? null;
    return (
      <IdentifyScreen
        companionPieceTitle={pendingPhotoDraft?.title ?? null}
        captureContext={
          pendingPhotoDraft
            ? `Take or import another photo for ${pendingPhotoDraft.title}. Use this for the back, clasp, signature, side, or detail view.`
            : null
        }
        mediaError={mediaError}
        onCancelCompanionPhoto={cancelCompanionPhotoCapture}
        onTakePhoto={takePhoto}
        onImportPhoto={importPhoto}
        onNoMatch={() => runSearch(true)}
      />
    );
  }, [
    apiError,
    apiMode,
    currentQuery,
    hints,
    history,
    identifyResponse,
    itemDetailError,
    itemDetailLoading,
    lastSavedTitle,
    mediaError,
    pieceDrafts,
    pendingPhotoDraftId,
    privacy,
    queryImage,
    savedItems,
    screen,
    selectedCandidate,
    selectedItemDetail,
    tab,
  ]);

  return (
    <AppChrome activeTab={tab} onSelectTab={selectTab}>
      {body}
    </AppChrome>
  );
}
