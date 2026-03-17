/**
 * Shared types for the Local Weather Dashboard.
 */

/** Saved location persisted in localStorage (see lib/storage.ts). */
export interface SavedLocation {
  latitude: number;
  longitude: number;
  /** Display name: from reverse geocode or zip lookup (e.g. "New York, NY"). */
  name: string;
  /** When this was saved (ISO string). */
  savedAt: string;
}

/** Open-Meteo current weather (subset we use). */
export interface OpenMeteoCurrent {
  temperature_2m: number;
  relative_humidity_2m: number;
  weather_code: number;
  time: string;
}

/** Open-Meteo forecast API response (minimal). */
export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  current: OpenMeteoCurrent;
  current_units?: {
    temperature_2m: string;
  };
}

/** Weather code to condition mapping (WMO codes). */
export type WeatherCondition =
  | "clear"
  | "partly-cloudy"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "thunderstorm";

/** Normalized current weather for the UI. */
export interface CurrentWeather {
  locationName: string;
  temperature: number;
  temperatureUnit: string;
  description: string;
  condition: WeatherCondition;
  humidity: number;
  weatherCode: number;
}

/** Zippopotam.us response (US zip → coords + place name). */
export interface ZippopotamPlace {
  "place name": string;
  "state abbreviation": string;
  latitude: string;
  longitude: string;
}

export interface ZippopotamResponse {
  "post code": string;
  country: string;
  places: ZippopotamPlace[];
}
