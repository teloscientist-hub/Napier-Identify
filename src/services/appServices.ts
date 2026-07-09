import {
  createSavedItem,
  defaultPrivacySettings,
  mockIdentifyResponse,
  mockItemDetail,
  mockNoMatchResponse,
} from "../mockData";
import { IdentifyResponse, ItemDetail, PrivacySettings, SavedItem, SearchQuery } from "../types";
import { fetchItem, postIdentify } from "./apiClient";

export type AppMode = "mock" | "real" | "failure";

export type IdentifyOptions = {
  forceNoMatch?: boolean;
};

let privacySettings: PrivacySettings = defaultPrivacySettings;

export async function identify(
  query: SearchQuery,
  mode: AppMode,
  options: IdentifyOptions = {},
): Promise<IdentifyResponse> {
  await delay(350);

  if (mode === "failure") {
    throw new Error("Mock identify failure");
  }

  if (mode === "real") {
    return postIdentify(query, options);
  }

  return options.forceNoMatch ? mockNoMatchResponse : { ...mockIdentifyResponse, queryId: query.queryId };
}

export async function getItem(itemId: string, mode: AppMode): Promise<ItemDetail> {
  await delay(150);

  if (mode === "failure") {
    throw new Error("Mock item detail failure");
  }

  if (mode === "real") {
    return fetchItem(itemId);
  }

  return { ...mockItemDetail, itemId };
}

export async function saveItem(itemId: string, queryId: string, mode: AppMode): Promise<SavedItem> {
  await delay(100);

  if (mode === "failure") {
    throw new Error("Mock save failure");
  }

  if (mode === "real") {
    throw new Error("Real saved item API is not configured yet");
  }

  return { ...createSavedItem(queryId), itemId };
}

export async function getPrivacySettings(): Promise<PrivacySettings> {
  await delay(50);
  return privacySettings;
}

export async function updatePrivacySettings(settings: PrivacySettings): Promise<PrivacySettings> {
  await delay(50);
  privacySettings = settings;
  return privacySettings;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
