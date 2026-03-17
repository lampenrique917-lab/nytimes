"use client";

import { useState, useCallback } from "react";

export interface GeoPosition {
  latitude: number;
  longitude: number;
}

export type GeoStatus = "idle" | "loading" | "success" | "error" | "unsupported";

export function useGeolocation() {
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [status, setStatus] = useState<GeoStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const requestPosition = useCallback(() => {
    if (typeof window === "undefined" || !navigator?.geolocation) {
      setStatus("unsupported");
      setErrorMessage("Geolocation is not supported by your browser.");
      return;
    }
    setStatus("loading");
    setErrorMessage(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setStatus("success");
      },
      (err) => {
        setStatus("error");
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setErrorMessage("Location access was denied. Use the search below to enter a zip code.");
            break;
          case err.POSITION_UNAVAILABLE:
            setErrorMessage("Location is unavailable. Try searching by zip code.");
            break;
          case err.TIMEOUT:
            setErrorMessage("Location request timed out. Try searching by zip code.");
            break;
          default:
            setErrorMessage("Could not get your location. Try searching by zip code.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  const reset = useCallback(() => {
    setPosition(null);
    setStatus("idle");
    setErrorMessage(null);
  }, []);

  return { position, status, errorMessage, requestPosition, reset };
}
