declare const process: {
  env?: Record<string, string | undefined>;
};

export const apiConfig = {
  baseUrl: process.env?.EXPO_PUBLIC_NAPIER_API_BASE_URL ?? "",
  appVersion: "0.1.0",
  identifyMode: process.env?.EXPO_PUBLIC_NAPIER_IDENTIFY_MODE ?? "",
  itemMode: process.env?.EXPO_PUBLIC_NAPIER_ITEM_MODE ?? "",
};

export function requireApiBaseUrl(): string {
  const baseUrl = apiConfig.baseUrl.trim();

  if (!baseUrl) {
    throw new Error("Real API mode needs EXPO_PUBLIC_NAPIER_API_BASE_URL.");
  }

  return baseUrl.replace(/\/+$/, "");
}
