import type { WeatherCondition } from "@/lib/types";

/**
 * Dynamic theme: background and accent styles per weather condition.
 * Applied to the dashboard wrapper for a cohesive look.
 */
export const conditionThemes: Record<
  WeatherCondition,
  { wrapper: string; accent?: string }
> = {
  clear: {
    wrapper:
      "bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-yellow-900/20",
  },
  "partly-cloudy": {
    wrapper:
      "bg-gradient-to-br from-sky-50 via-blue-50 to-slate-100 dark:from-sky-950/40 dark:via-blue-950/30 dark:to-slate-900/30",
  },
  cloudy: {
    wrapper:
      "bg-gradient-to-br from-slate-100 via-slate-200 to-gray-200 dark:from-slate-900/50 dark:via-slate-800/40 dark:to-gray-900/40",
  },
  fog: {
    wrapper:
      "bg-gradient-to-br from-slate-200 via-gray-200 to-stone-300 dark:from-slate-800/60 dark:via-gray-800/50 dark:to-stone-800/50",
  },
  drizzle: {
    wrapper:
      "bg-gradient-to-br from-slate-300 via-blue-gray-200 to-blue-200 dark:from-slate-800/70 dark:via-blue-900/50 dark:to-blue-950/50",
  },
  rain: {
    wrapper:
      "bg-gradient-to-br from-slate-400 via-blue-900/30 to-indigo-900/40 dark:from-slate-800 dark:via-blue-950 dark:to-indigo-950",
  },
  snow: {
    wrapper:
      "bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-50 dark:from-slate-800/60 dark:via-blue-950/40 dark:to-indigo-950/30",
  },
  thunderstorm: {
    wrapper:
      "bg-gradient-to-br from-slate-600 via-indigo-900/50 to-purple-900/50 dark:from-slate-900 dark:via-indigo-950 dark:to-purple-950",
  },
};
