/**
 * Zippopotam.us — US zip code to coordinates and place name (no API key).
 * https://api.zippopotam.us/
 */

import type { ZippopotamResponse } from "../types";

const BASE = "https://api.zippopotam.us";

/**
 * Look up US zip code. Returns coords and place name.
 * Use for manual search fallback.
 */
export async function fetchByZip(zip: string): Promise<{
  latitude: number;
  longitude: number;
  name: string;
}> {
  const normalized = zip.trim().replace(/\s+/g, "");
  if (!normalized) {
    throw new Error("Please enter a zip code.");
  }
  const url = `${BASE}/us/${normalized}`;
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Zip code not found. Try a valid US zip code.");
    }
    throw new Error("Lookup failed. Please try again.");
  }
  const data = (await res.json()) as ZippopotamResponse;
  const place = data?.places?.[0];
  if (!place) {
    throw new Error("No place found for this zip code.");
  }
  const lat = parseFloat(place.latitude);
  const lon = parseFloat(place.longitude);
  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    throw new Error("Invalid coordinates for this zip code.");
  }
  const name = `${place["place name"]}, ${place["state abbreviation"]}`;
  return { latitude: lat, longitude: lon, name };
}
