"use client";

export function LoadingSkeleton() {
  return (
    <div
      className="animate-pulse flex flex-col items-center gap-6 w-full max-w-md mx-auto"
      role="status"
      aria-live="polite"
      aria-label="Loading weather"
    >
      <div className="h-24 w-24 rounded-full bg-foreground/10" />
      <div className="h-10 w-32 rounded-lg bg-foreground/10" />
      <div className="h-6 w-48 rounded bg-foreground/10" />
      <div className="h-4 w-36 rounded bg-foreground/10" />
      <span className="sr-only">Loading weather data…</span>
    </div>
  );
}
