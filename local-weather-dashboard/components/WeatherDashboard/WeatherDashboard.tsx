"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useWeather } from "@/hooks/useWeather";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ErrorMessage } from "@/components/ErrorMessage";
import { WeatherSearch } from "@/components/WeatherSearch";
import { WeatherDisplay } from "@/components/WeatherDisplay";
import { conditionThemes } from "./theme";

type Phase = "init" | "geolocating" | "search" | "weather" | "error";

export function WeatherDashboard() {
  const [phase, setPhase] = useState<Phase>("init");
  const initialCheckDone = useRef(false);

  const geo = useGeolocation();
  const weather = useWeather();

  useEffect(() => {
    if (initialCheckDone.current) return;
    initialCheckDone.current = true;
    const loaded = weather.loadSavedLocation();
    if (loaded) setPhase("weather");
    else setPhase("geolocating");
  }, [weather.loadSavedLocation]);

  useEffect(() => {
    if (phase !== "geolocating") return;
    geo.requestPosition();
  }, [phase]);

  useEffect(() => {
    if (phase !== "geolocating") return;
    if (geo.status === "success" && geo.position) {
      setPhase("weather");
      void weather
        .loadFromCoords(geo.position.latitude, geo.position.longitude)
        .catch(() => setPhase("error"));
    } else if (geo.status === "error" || geo.status === "unsupported") {
      setPhase("search");
    }
  }, [phase, geo.status, geo.position, weather]);

  useEffect(() => {
    if (weather.status === "success" && weather.weather) {
      setPhase("weather");
    } else if (weather.status === "error" && phase !== "search") {
      setPhase("error");
    }
  }, [weather.status, weather.weather, phase]);

  const handleSearch = async (zip: string) => {
    setPhase("weather");
    try {
      await weather.loadFromZip(zip);
    } catch {
      setPhase("search");
    }
  };

  const handleChangeLocation = () => {
    weather.clearAndReset();
    geo.reset();
    initialCheckDone.current = false;
    setPhase("geolocating");
    geo.requestPosition();
  };

  const themeClass =
    phase === "weather" && weather.weather
      ? conditionThemes[weather.weather.condition].wrapper
      : "bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800";

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${themeClass}`}
      data-weather-phase={phase}
    >
      <div className="mx-auto max-w-lg px-4 py-10 sm:py-16">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Local Weather
          </h1>
          <p className="mt-1 text-sm text-foreground/70">
            Your location, your forecast
          </p>
        </header>

        {phase === "geolocating" &&
          geo.status !== "error" &&
          geo.status !== "unsupported" && (
            <div className="flex flex-col items-center gap-6">
              <LoadingSkeleton />
              <p className="text-sm text-foreground/70">
                Getting your location…
              </p>
            </div>
          )}

        {phase === "geolocating" && (geo.status === "error" || geo.status === "unsupported") && (
          <div className="space-y-4">
            <ErrorMessage
              title="Location unavailable"
              message={geo.errorMessage ?? "Use the search below to enter a zip code."}
            />
            <div className="flex justify-center">
              <WeatherSearch
                onSearch={handleSearch}
                isSearching={weather.status === "loading"}
                error={weather.error}
              />
            </div>
          </div>
        )}

        {phase === "search" && (
          <div className="space-y-6">
            <ErrorMessage
              title="Location not detected"
              message={geo.errorMessage ?? "Enter a US zip code to see the weather."}
              onRetry={() => {
                geo.reset();
                setPhase("geolocating");
                geo.requestPosition();
              }}
            />
            <WeatherSearch
              onSearch={handleSearch}
              isSearching={weather.status === "loading"}
              error={weather.error}
            />
          </div>
        )}

        {phase === "weather" && weather.status === "loading" && (
          <div className="flex flex-col items-center gap-6">
            <LoadingSkeleton />
          </div>
        )}

        {phase === "weather" && weather.status === "success" && weather.weather && (
          <div className="space-y-6 animate-fade-in">
            <WeatherDisplay data={weather.weather} />
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleChangeLocation}
                className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-background/80 px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-foreground/10 focus:outline-none focus:ring-2 focus:ring-foreground/20"
                aria-label="Change location"
              >
                <RotateCcw className="h-4 w-4" aria-hidden />
                Change location
              </button>
            </div>
          </div>
        )}

        {phase === "error" && (
          <div className="space-y-4">
            <ErrorMessage
              title="Couldn't load weather"
              message={weather.error ?? "Something went wrong."}
              onRetry={() => {
                if (weather.savedLocation) {
                  weather.loadSavedLocation();
                  setPhase("weather");
                } else {
                  setPhase("search");
                }
              }}
            />
            <div className="flex justify-center">
              <WeatherSearch
                onSearch={handleSearch}
                isSearching={weather.status === "loading"}
                error={weather.error}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
