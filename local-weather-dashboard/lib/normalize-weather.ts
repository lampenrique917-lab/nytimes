import type { OpenMeteoResponse } from "./types";
import type { CurrentWeather } from "./types";
import { getWeatherCondition, getWeatherDescription } from "./weather-code";

export function normalizeWeather(
  data: OpenMeteoResponse,
  locationName: string
): CurrentWeather {
  const current = data.current;
  const code = current.weather_code;
  const unit = data.current_units?.temperature_2m ?? "°C";
  return {
    locationName,
    temperature: current.temperature_2m,
    temperatureUnit: unit,
    description: getWeatherDescription(code),
    condition: getWeatherCondition(code),
    humidity: current.relative_humidity_2m,
    weatherCode: code,
  };
}
