/**
 * localStorage persistence for the user's chosen location.
 * When a location is successfully resolved (geolocation or manual search),
 * we save it here so on reload we bypass search/geolocation and load weather
 * for the saved location immediately.
 */

import type { SavedLocation } from "./types";

const STORAGE_KEY = "local-weather-dashboard-location";

export function getSavedLocation(): SavedLocation | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (
      !parsed ||
      typeof parsed !== "object" ||
      typeof (parsed as SavedLocation).latitude !== "number" ||
      typeof (parsed as SavedLocation).longitude !== "number" ||
      typeof (parsed as SavedLocation).name !== "string"
    ) {
      return null;
    }
    return parsed as SavedLocation;
  } catch {
    return null;
  }
}

export function setSavedLocation(location: SavedLocation): void {
  if (typeof window === "undefined") return;
  try {
    const toSave: SavedLocation = {
      ...location,
      savedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
  }
}

export function clearSavedLocation(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
  }
}
