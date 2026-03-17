"use client";

import { useState, useCallback } from "react";
import { fetchWeather } from "@/lib/api/open-meteo";
import { fetchByZip } from "@/lib/api/zippopotam";
import { reverseGeocode } from "@/lib/api/reverse-geocode";
import { normalizeWeather } from "@/lib/normalize-weather";
import { getSavedLocation, setSavedLocation, clearSavedLocation } from "@/lib/storage";
import type { CurrentWeather } from "@/lib/types";
import type { SavedLocation } from "@/lib/types";

export type WeatherStatus = "idle" | "loading" | "success" | "error";

export interface UseWeatherState {
  weather: CurrentWeather | null;
  status: WeatherStatus;
  error: string | null;
  savedLocation: SavedLocation | null;
}

export function useWeather() {
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [status, setStatus] = useState<WeatherStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [savedLocation, setSavedLocationState] = useState<SavedLocation | null>(null);

  const loadFromCoords = useCallback(
    async (latitude: number, longitude: number, locationName?: string) => {
      setStatus("loading");
      setError(null);
      try {
        const [weatherData, name] = await Promise.all([
          fetchWeather(latitude, longitude),
          locationName ? Promise.resolve(locationName) : reverseGeocode(latitude, longitude),
        ]);
        const normalized = normalizeWeather(weatherData, name);
        setWeather(normalized);
        setStatus("success");
        const toSave: SavedLocation = {
          latitude,
          longitude,
          name,
          savedAt: new Date().toISOString(),
        };
        setSavedLocation(toSave);
        setSavedLocationState(toSave);
        return normalized;
      } catch (e) {
        const message = e instanceof Error ? e.message : "Failed to load weather.";
        setError(message);
        setStatus("error");
        throw e;
      }
    },
    []
  );

  const loadFromZip = useCallback(async (zip: string) => {
    setStatus("loading");
    setError(null);
    try {
      const { latitude, longitude, name } = await fetchByZip(zip);
      const weatherData = await fetchWeather(latitude, longitude);
      const normalized = normalizeWeather(weatherData, name);
      setWeather(normalized);
      setStatus("success");
      const toSave: SavedLocation = {
        latitude,
        longitude,
        name,
        savedAt: new Date().toISOString(),
      };
      setSavedLocation(toSave);
      setSavedLocationState(toSave);
      return normalized;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Search failed.";
      setError(message);
      setStatus("error");
      throw e;
    }
  }, []);

  const loadSavedLocation = useCallback(() => {
    const saved = getSavedLocation();
    if (!saved) return false;
    setSavedLocationState(saved);
    void loadFromCoords(saved.latitude, saved.longitude, saved.name);
    return true;
  }, [loadFromCoords]);

  const clearAndReset = useCallback(() => {
    clearSavedLocation();
    setWeather(null);
    setSavedLocationState(null);
    setStatus("idle");
    setError(null);
  }, []);

  return {
    weather,
    status,
    error,
    savedLocation,
    loadFromCoords,
    loadFromZip,
    loadSavedLocation,
    clearAndReset,
  };
}
