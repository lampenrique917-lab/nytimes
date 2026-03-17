/**
 * Reverse geocoding: lat/long → place name.
 * Uses Nominatim (OpenStreetMap) with a polite User-Agent (required by usage policy).
 */

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org/reverse";
const USER_AGENT = "LocalWeatherDashboard/1.0 (educational project)";

export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<string> {
  const params = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
    format: "json",
  });
  const res = await fetch(`${NOMINATIM_BASE}?${params.toString()}`, {
    headers: { "User-Agent": USER_AGENT },
  });
  if (!res.ok) {
    return "Your location";
  }
  const data = (await res.json()) as {
    address?: { city?: string; town?: string; village?: string; state?: string; country?: string };
    display_name?: string;
  };
  const addr = data?.address;
  if (addr) {
    const city = addr.city ?? addr.town ?? addr.village ?? "";
    const state = addr.state ?? "";
    if (city && state) return `${city}, ${state}`;
    if (city) return city;
    if (data.display_name) return data.display_name.split(",").slice(0, 2).join(", ").trim();
  }
  return data?.display_name?.split(",").slice(0, 2).join(", ").trim() ?? "Your location";
}
