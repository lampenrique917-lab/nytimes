"use client";

import {
  Cloud,
  CloudRain,
  CloudSnow,
  Sun,
  CloudSun,
  CloudLightning,
  CloudDrizzle,
} from "lucide-react";
import type { WeatherCondition } from "@/lib/types";

interface WeatherIconProps {
  condition: WeatherCondition;
  className?: string;
  size?: number;
  "aria-hidden"?: boolean;
}

const iconMap: Record<WeatherCondition, React.ComponentType<{ className?: string; size?: number }>> = {
  clear: Sun,
  "partly-cloudy": CloudSun,
  cloudy: Cloud,
  fog: Cloud,
  drizzle: CloudDrizzle,
  rain: CloudRain,
  snow: CloudSnow,
  thunderstorm: CloudLightning,
};

export function WeatherIcon({
  condition,
  className = "",
  size = 64,
  "aria-hidden": ariaHidden = true,
}: WeatherIconProps) {
  const Icon = iconMap[condition] ?? CloudSun;
  return (
    <Icon
      className={className}
      size={size}
      aria-hidden={ariaHidden}
    />
  );
}
