"use client";

import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-red-200 bg-red-50/80 dark:border-red-900/50 dark:bg-red-950/30 p-6 text-center"
      aria-labelledby="error-title"
      aria-describedby="error-desc"
    >
      <AlertCircle
        className="mx-auto mb-3 h-10 w-10 text-red-600 dark:text-red-400"
        aria-hidden
      />
      <h2 id="error-title" className="text-lg font-semibold text-red-800 dark:text-red-200">
        {title}
      </h2>
      <p id="error-desc" className="mt-1 text-sm text-red-700 dark:text-red-300">
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-full bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-background"
          aria-label="Try again"
        >
          Try again
        </button>
      )}
    </div>
  );
}
