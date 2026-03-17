# Local Weather Dashboard

A responsive weather app built with **Next.js**, **React**, **TypeScript**, and **Tailwind CSS**. It shows current weather for your location (with optional manual search by US zip code), persists your choice in `localStorage`, and adapts the UI to the current weather.

## Features

- **Zero-click start**: On first load, the app requests your browser location and shows local weather.
- **Manual search fallback**: If location is denied or unavailable, you can enter a **US zip code** to get weather for that area.
- **Current conditions**: Location name, temperature, weather description, and humidity (via [Open-Meteo](https://open-meteo.com/)).
- **Persistence**: The last resolved location is saved in `localStorage`; on reload or return visits, weather loads for that location without asking for permission or search again.
- **Dynamic theme**: Background and feel change with the weather (e.g. sunny vs rainy).
- **Accessibility**: Keyboard navigation, ARIA labels, and screen-reader friendly states.
- **Loading & errors**: Skeletons, clear error messages, and retry/fallback flows.

## Local installation

### Prerequisites

- **Node.js** 18+ and **npm** (or yarn/pnpm/bun).

### Steps

1. **Clone** the repo (or navigate to the `local-weather-dashboard` folder).

2. **Install dependencies**:

   ```bash
   cd local-weather-dashboard
   npm install
   ```

3. **Run the dev server**:

   ```bash
   npm run dev
   ```

4. Open **http://localhost:3000** in your browser.

### Build for production

```bash
npm run build
npm start
```

No API keys are required; the app uses free, no-key APIs (Open-Meteo, Zippopotam.us, Nominatim for reverse geocoding).

---

## Demonstrate the app (including manual search)

1. **Automatic location**  
   Allow location when prompted → you should see weather for your area and a “Change location” button.

2. **Manual search fallback**  
   - Deny location, or use a browser/incognito session where location isn’t set.  
   - You should see a message and a search box.  
   - Enter a **US zip code** (e.g. `10001`, `90210`) and submit.  
   - Weather for that location appears; that location is then stored for next time.

3. **Persistence**  
   After a successful result (from location or search), reload the page or close and reopen the tab. The app should skip geolocation/search and load weather for the saved location immediately.

4. **Change location**  
   Click “Change location” to clear the saved place and go back to the geolocation → search flow.

---

## Where localStorage caching is handled

Persistence is implemented in a small storage layer and used by the weather hook and dashboard.

### 1. Storage API — `lib/storage.ts`

- **Key**: `local-weather-dashboard-location`.
- **`getSavedLocation()`**: Reads and parses the stored JSON; returns `SavedLocation | null`. Used on load to decide whether to skip geolocation/search.
- **`setSavedLocation(location)`**: Saves `{ latitude, longitude, name, savedAt }` after a successful weather fetch (from geolocation or zip search).
- **`clearSavedLocation()`**: Removes the key when the user clicks “Change location”.

So: **saving** happens in one place (`setSavedLocation`), **reading** in one place (`getSavedLocation`), and **clearing** in one place (`clearSavedLocation`).

### 2. When we save — `hooks/useWeather.ts`

- **`loadFromCoords(lat, lon, name?)`**: After fetching weather and (if needed) reverse-geocoding the name, it builds a `SavedLocation` and calls **`setSavedLocation(toSave)`**.
- **`loadFromZip(zip)`**: After resolving zip → coords + name and fetching weather, it does the same: **`setSavedLocation(toSave)`**.

So every successful path (geolocation or zip search) ends in `setSavedLocation`.

### 3. When we read and bypass search — `components/WeatherDashboard/WeatherDashboard.tsx`

- On mount, an effect runs **once** (guarded by a ref):
  - It calls **`weather.loadSavedLocation()`**.
  - **`loadSavedLocation()`** (in `useWeather`) calls **`getSavedLocation()`**. If a value exists, it sets that as the saved location and then calls **`loadFromCoords(saved.latitude, saved.longitude, saved.name)`**, which fetches weather and, on success, calls **`setSavedLocation`** again (refreshing `savedAt` and re-persisting).
  - If **`getSavedLocation()`** returns `null`, the dashboard goes to the “geolocating” phase (then search if needed).

So: **localStorage is read only at initial load** in that single effect; if a saved location exists, we never show the geolocation prompt or search form until the user clicks “Change location”.

### 4. When we clear — “Change location”

- **`handleChangeLocation()`** in `WeatherDashboard` calls **`weather.clearAndReset()`**, which calls **`clearSavedLocation()`** and resets app state, then requests geolocation again. So the next load will have no saved location and will go through the normal flow.

**Summary**: All caching is done via `lib/storage.ts`. The dashboard uses it on first load to decide “saved location vs geolocation/search”; the weather hook writes to it after every successful weather load and clears it when the user changes location.

---

## Project structure (component-based)

```
local-weather-dashboard/
├── app/
│   ├── layout.tsx          # Root layout, fonts, metadata
│   ├── page.tsx            # Renders <WeatherDashboard />
│   └── globals.css         # Tailwind + CSS variables + fade-in
├── components/
│   ├── WeatherDashboard/   # Main container: flow (saved → geo → search → weather)
│   ├── WeatherDisplay/     # Current weather card (temp, description, humidity)
│   ├── WeatherIcon/        # Condition-based icon (Lucide)
│   ├── WeatherSearch/      # Zip code form (a11y, validation)
│   ├── LoadingSkeleton/    # Loading state
│   └── ErrorMessage/       # Error state + optional retry
├── hooks/
│   ├── useGeolocation.ts   # Browser geolocation (request, status, error)
│   └── useWeather.ts       # Fetch weather, save/load/clear location
├── lib/
│   ├── types.ts            # Shared types
│   ├── storage.ts          # localStorage get/set/clear
│   ├── weather-code.ts     # WMO code → condition + description
│   ├── normalize-weather.ts
│   └── api/
│       ├── open-meteo.ts   # Weather by lat/lon
│       ├── zippopotam.ts   # US zip → lat/lon + place name
│       └── reverse-geocode.ts  # Lat/lon → place name (Nominatim)
└── README.md
```

---

## APIs used

- **Weather**: [Open-Meteo](https://open-meteo.com/) (no key) — forecast by latitude/longitude.
- **Zip → coords**: [Zippopotam.us](https://api.zippopotam.us/) (no key) — US zip to coordinates and place name.
- **Coords → name**: [Nominatim](https://nominatim.openstreetmap.org/) (no key) — reverse geocoding when we have lat/lon from the browser.

---

## License

MIT.
