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
    setScreen("identify");
  }

  async function takePhoto() {
    setApiError(null);
    setMediaError(null);

    const result = await takeQueryPhoto();
    if (result.status === "denied") {
      setMediaError(result.message);
    }
    if (result.status === "selected") {
      setQueryImage(result.image);
      setScreen("captureReview");
    }
  }

  async function importPhoto() {
    setApiError(null);
    setMediaError(null);

    const result = await importQueryPhoto();
    if (result.status === "denied") {
      setMediaError(result.message);
    }
    if (result.status === "selected") {
      setQueryImage(result.image);
      setScreen("captureReview");
    }
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
    const saved = createSavedItemFromSelection(currentQuery.queryId, selectedCandidate, selectedItemDetail, queryImage);
    setSavedItems((items) => [saved, ...items]);
    setHistory((entries) =>
      entries.map((entry) =>
        entry.queryId === currentQuery.queryId ? { ...entry, savedItemId: saved.savedItemId } : entry,
      ),
    );
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
          onUsePhoto={() => setScreen("hints")}
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
    return <IdentifyScreen mediaError={mediaError} onTakePhoto={takePhoto} onImportPhoto={importPhoto} onNoMatch={() => runSearch(true)} />;
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
