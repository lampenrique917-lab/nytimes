"use client";

import { useState, useRef } from "react";
import { Search } from "lucide-react";

interface WeatherSearchProps {
  onSearch: (zip: string) => Promise<void>;
  isSearching: boolean;
  error: string | null;
}

export function WeatherSearch({ onSearch, isSearching, error }: WeatherSearchProps) {
  const [zip, setZip] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = zip.trim();
    if (!trimmed || isSearching) return;
    try {
      await onSearch(trimmed);
    } catch {
      inputRef.current?.focus();
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3"
        role="search"
        aria-label="Search weather by zip code"
      >
        <label htmlFor="weather-zip" className="sr-only">
          US Zip code
        </label>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            id="weather-zip"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="Enter US zip code"
            value={zip}
            onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
            disabled={isSearching}
            className="flex-1 rounded-xl border border-foreground/20 bg-background px-4 py-3 text-foreground placeholder:text-foreground/50 focus:border-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 disabled:opacity-60"
            aria-invalid={!!error}
            aria-describedby={error ? "zip-error" : undefined}
          />
          <button
            type="submit"
            disabled={isSearching || zip.trim().length < 5}
            className="flex shrink-0 items-center justify-center rounded-xl bg-foreground px-4 py-3 text-background transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 disabled:opacity-50"
            aria-label="Get weather"
          >
            <Search className="h-5 w-5" aria-hidden />
          </button>
        </div>
        {error && (
          <p id="zip-error" role="alert" className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
