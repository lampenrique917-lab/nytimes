/**
 * Open-Meteo weather API (no API key required).
 * https://open-meteo.com/en/docs
 */

import type { OpenMeteoResponse } from "../types";

const BASE = "https://api.open-meteo.com/v1/forecast";

export async function fetchWeather(
  latitude: number,
  longitude: number
): Promise<OpenMeteoResponse> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "temperature_2m,relative_humidity_2m,weather_code",
  });
  const url = `${BASE}?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Weather request failed: ${res.status}`);
  }
  const data = (await res.json()) as OpenMeteoResponse;
  if (!data?.current) {
    throw new Error("Invalid weather response");
  }
  return data;
}
