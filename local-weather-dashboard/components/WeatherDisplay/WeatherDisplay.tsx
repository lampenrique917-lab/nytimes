"use client";

import { useMemo } from "react";
import { MapPin, Droplets } from "lucide-react";
import { WeatherIcon } from "@/components/WeatherIcon";
import type { CurrentWeather } from "@/lib/types";

interface WeatherDisplayProps {
  data: CurrentWeather;
  themeClass?: string;
}

export function WeatherDisplay({ data, themeClass }: WeatherDisplayProps) {
  const tempDisplay = useMemo(() => {
    const n = Math.round(data.temperature);
    return `${n}${data.temperatureUnit}`;
  }, [data.temperature, data.temperatureUnit]);

  return (
    <article
      className={`
        rounded-3xl border border-foreground/10 bg-gradient-to-b from-foreground/5 to-transparent p-8 text-center shadow-lg
        transition-opacity duration-300 ease-out
        ${themeClass ?? ""}
      `}
      aria-labelledby="weather-location"
      aria-describedby="weather-temp weather-desc"
    >
      <div className="flex justify-center opacity-90">
        <WeatherIcon condition={data.condition} size={80} className="text-foreground" />
      </div>
      <p
        id="weather-location"
        className="mt-4 flex items-center justify-center gap-2 text-lg font-medium text-foreground/90"
      >
        <MapPin className="h-4 w-4" aria-hidden />
        {data.locationName}
      </p>
      <p
        id="weather-temp"
        className="mt-2 text-5xl font-light tabular-nums tracking-tight text-foreground"
      >
        {tempDisplay}
      </p>
      <p id="weather-desc" className="mt-1 text-foreground/80">
        {data.description}
      </p>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-foreground/70">
        <Droplets className="h-4 w-4" aria-hidden />
        <span>Humidity {data.humidity}%</span>
      </p>
    </article>
  );
}
