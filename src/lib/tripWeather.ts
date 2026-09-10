/**
 * Trip Weather Azure API Client & Data Layer
 *
 * Provides type-safe access to the Trip Weather Azure API, mapping town forecasts
 * to homepage WeatherCard data models, with support for timeouts, locales,
 * Asia/Taipei date default, partial failure handling, and AQI demo metadata detection.
 */

export type WeatherLocale = "zh" | "en" | "ja";
export type WeatherIcon = "sun" | "cloud" | "rain";

export interface WeatherWarning {
  title: string;
  severity: string;
  description?: string | null;
}

export interface SunriseSunset {
  county: string;
  target_date: string;
  source_date: string;
  sunrise_time?: string | null;
  sunset_time?: string | null;
  is_approximate?: boolean;
}

export interface MoonInfo {
  county: string;
  target_date: string;
  source_date: string;
  moonrise_time?: string | null;
  moonset_time?: string | null;
  phase: string;
  icon: string;
  illumination_fraction: number;
  waxing: boolean;
}

export interface WeatherRegion {
  key: "N" | "C" | "S" | "E";
  tab: string;
  name: string;
  hi: number;
  lo: number;
  cond: string;
  icon: WeatherIcon;
  pop: number;
  uv: number | null;
  aqi: number | null;
  advice: string;
}

export interface TripWeatherRegion extends WeatherRegion {
  townCode: string;
  weatherCode: string | null;
  uvLevel: string | null;
  uvSource: string | null;
  aqiLevel: string | null;
  aqiSource: string | null;
  isDemoAqi: boolean;
  warnings: WeatherWarning[];
  sunriseSunset: SunriseSunset | null;
  moon: MoonInfo | null;
  fetchedAt: string;
}

export interface TripWeatherFailure {
  key: "N" | "C" | "S" | "E";
  townCode: string;
  error: string;
}

export interface TripWeatherResult {
  regions: TripWeatherRegion[];
  failures: TripWeatherFailure[];
  isPartial: boolean;
  fetchedAt: string;
}

export interface LoadHomepageWeatherOptions {
  locale?: WeatherLocale;
  apiBase?: string;
  date?: string;
  now?: Date | string | number;
  timeoutMs?: number;
  fetchFn?: typeof fetch;
  signal?: AbortSignal;
}

export interface FixedTownConfig {
  key: "N" | "C" | "S" | "E";
  townCode: string;
  reference: string;
  i18n: Record<
    WeatherLocale,
    {
      tab: string;
      defaultName: string;
    }
  >;
}

export const DEFAULT_TRIP_WEATHER_API_BASE =
  "https://twp-backend.purplewave-91ee1594.southeastasia.azurecontainerapps.io";

export const FIXED_TOWNS: readonly FixedTownConfig[] = [
  {
    key: "N",
    townCode: "cwa-63000020",
    reference: "臺北市信義區",
    i18n: {
      zh: { tab: "北部", defaultName: "臺北 · 信義區" },
      en: { tab: "North", defaultName: "Taipei · Xinyi" },
      ja: { tab: "北部", defaultName: "台北 · 信義" },
    },
  },
  {
    key: "C",
    townCode: "cwa-66000060",
    reference: "臺中市西屯區",
    i18n: {
      zh: { tab: "中部", defaultName: "臺中 · 西屯區" },
      en: { tab: "Central", defaultName: "Taichung · Xitun" },
      ja: { tab: "中部", defaultName: "台中 · 西屯" },
    },
  },
  {
    key: "S",
    townCode: "cwa-67000370",
    reference: "臺南市中西區",
    i18n: {
      zh: { tab: "南部", defaultName: "臺南 · 中西區" },
      en: { tab: "South", defaultName: "Tainan · West Central" },
      ja: { tab: "南部", defaultName: "台南 · 中西" },
    },
  },
  {
    key: "E",
    townCode: "cwa-10015010",
    reference: "花蓮縣花蓮市",
    i18n: {
      zh: { tab: "東部", defaultName: "花蓮 · 花蓮市" },
      en: { tab: "East", defaultName: "Hualien · Hualien City" },
      ja: { tab: "東部", defaultName: "花蓮 · 花蓮市" },
    },
  },
] as const;

/**
 * Formats a Date/timestamp into YYYY-MM-DD in Asia/Taipei timezone.
 */
export function getTaipeiTodayString(now?: Date | string | number): string {
  const d = now instanceof Date ? now : now ? new Date(now) : new Date();
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(d);
}

/**
 * Strips trailing slashes from API base URL.
 */
export function normalizeApiBase(base?: string): string {
  const raw = base || DEFAULT_TRIP_WEATHER_API_BASE;
  return raw.replace(/\/+$/, "");
}

/**
 * Pure deterministic mapping from weather code and weather text to icon category.
 */
export function getIconForWeather(
  weatherCode?: string | null,
  weatherText?: string | null
): WeatherIcon {
  const code = (weatherCode || "").trim();
  const text = (weatherText || "").toLowerCase();

  const codeNum = parseInt(code, 10);
  if (!isNaN(codeNum) && codeNum >= 1 && codeNum <= 42) {
    if (codeNum === 1 || codeNum === 2) return "sun";
    if (codeNum >= 3 && codeNum <= 7) return "cloud";
    if (codeNum >= 8) return "rain";
  }

  if (
    text.includes("雨") ||
    text.includes("rain") ||
    text.includes("shower") ||
    text.includes("storm") ||
    text.includes("drizzle") ||
    text.includes("雷")
  ) {
    return "rain";
  }

  if (
    text.includes("陰") ||
    text.includes("雲") ||
    text.includes("cloud") ||
    text.includes("overcast")
  ) {
    return "cloud";
  }

  if (text.includes("晴") || text.includes("sun") || text.includes("clear")) {
    return "sun";
  }

  return "cloud";
}

/**
 * Formats localized town display name using town object or town config defaults.
 */

interface ApiTownPayload {
  code?: string;
  name?: string;
  city?: string;
  name_en?: string | null;
  city_en?: string | null;
}

export function formatTownDisplayName(
  config: FixedTownConfig,
  locale: WeatherLocale,
  apiTown?: ApiTownPayload | null
): string {
  if (!apiTown) {
    return config.i18n[locale]?.defaultName ?? config.i18n.zh.defaultName;
  }

  if (locale === "en") {
    const cityStr = apiTown.city_en || apiTown.city;
    const nameStr = apiTown.name_en || apiTown.name;
    if (cityStr && nameStr) {
      const cleanCity = cityStr.replace(/ City$/i, "").replace(/ County$/i, "");
      return `${cleanCity} · ${nameStr}`;
    }
  }

  if (apiTown.city && apiTown.name) {
    const cleanCity = apiTown.city.replace(/市$/, "").replace(/縣$/, "");
    return `${cleanCity} · ${apiTown.name}`;
  }

  return config.i18n[locale]?.defaultName ?? config.i18n.zh.defaultName;
}

/**
 * Loads homepage weather for the 4 fixed regions concurrently.
 */
export async function loadHomepageWeather(
  options: LoadHomepageWeatherOptions = {}
): Promise<TripWeatherResult> {
  const locale: WeatherLocale = options.locale || "zh";
  const apiBase = normalizeApiBase(options.apiBase);
  const targetDate = options.date || getTaipeiTodayString(options.now);
  const timeoutMs = options.timeoutMs ?? 8000;
  const fetchImpl = options.fetchFn || globalThis.fetch;

  if (typeof fetchImpl !== "function") {
    throw new Error("No fetch implementation available.");
  }

  const nowIso = new Date().toISOString();

  const fetchPromises = FIXED_TOWNS.map(
    async (townConfig): Promise<TripWeatherRegion> => {
      const url = `${apiBase}/api/forecast?town=${encodeURIComponent(
        townConfig.townCode
      )}&date=${encodeURIComponent(targetDate)}&lang=${encodeURIComponent(locale)}`;

      const controller = new AbortController();
      const timer = setTimeout(() => {
        controller.abort(
          new Error(`Request timed out after ${timeoutMs}ms for ${townConfig.townCode}`)
        );
      }, timeoutMs);

      let externalAbortHandler: (() => void) | undefined;
      if (options.signal) {
        if (options.signal.aborted) {
          controller.abort(options.signal.reason);
        } else {
          externalAbortHandler = () => {
            controller.abort(options.signal?.reason);
          };
          options.signal.addEventListener("abort", externalAbortHandler);
        }
      }

      try {
        const response = await fetchImpl(url, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        if (!json || typeof json !== "object" || json.success !== true || !json.data) {
          const msg = json?.error?.message || "Invalid response envelope";
          throw new Error(msg);
        }

        const forecastData = json.data.forecast;
        const aiSummary = json.data.ai_summary;

        if (!forecastData || !Array.isArray(forecastData.days)) {
          throw new Error("Missing forecast or days payload");
        }

        const day =
          forecastData.days.find((d: { date?: string }) => d.date === targetDate) ||
          forecastData.days[0];

        if (!day) {
          throw new Error(`No forecast day available for ${targetDate}`);
        }

        const hi = typeof day.temp_high_c === "number" ? day.temp_high_c : 0;
        const lo = typeof day.temp_low_c === "number" ? day.temp_low_c : 0;
        const cond = day.weather || "未知";
        const weatherCode = day.weather_code || null;
        const icon = getIconForWeather(weatherCode, cond);
        const pop = typeof day.max_pop_percent === "number" ? day.max_pop_percent : 0;

        const uvObj = forecastData.uv;
        const uvVal = uvObj && typeof uvObj.value === "number" ? uvObj.value : null;
        const uvLevel = uvObj?.level || null;
        const uvSource = uvObj?.source_label || null;

        const aqiObj = forecastData.aqi || day.aqi_forecast;
        const aqiVal = aqiObj && typeof aqiObj.value === "number" ? aqiObj.value : null;
        const aqiLevel = aqiObj?.level || null;
        const aqiSource = aqiObj?.source_label || null;

        const metaSource = json.meta?.source || "";
        const isDemoAqi = Boolean(
          (aqiSource && /demo|範例|mock/i.test(aqiSource)) ||
            (uvObj?.source_type && /mock/i.test(uvObj.source_type)) ||
            (metaSource && /mock/i.test(metaSource))
        );

        const advice = aiSummary?.text || day.advice_hint || "";
        const warnings = Array.isArray(forecastData.warnings) ? forecastData.warnings : [];
        const sunriseSunset = forecastData.sunrise_sunset || null;
        const moon = forecastData.moon || null;

        const name = formatTownDisplayName(townConfig, locale, forecastData.town);
        const tab = townConfig.i18n[locale]?.tab || townConfig.i18n.zh.tab;

        return {
          key: townConfig.key,
          townCode: townConfig.townCode,
          tab,
          name,
          hi,
          lo,
          cond,
          weatherCode,
          icon,
          pop,
          uv: uvVal,
          aqi: aqiVal,
          advice,
          uvLevel,
          uvSource,
          aqiLevel,
          aqiSource,
          isDemoAqi,
          warnings,
          sunriseSunset,
          moon,
          fetchedAt: nowIso,
        };
      } finally {
        clearTimeout(timer);
        if (options.signal && externalAbortHandler) {
          options.signal.removeEventListener("abort", externalAbortHandler);
        }
      }
    }
  );

  const results = await Promise.allSettled(fetchPromises);

  const regions: TripWeatherRegion[] = [];
  const failures: TripWeatherFailure[] = [];

  results.forEach((res, index) => {
    const townConfig = FIXED_TOWNS[index];
    if (res.status === "fulfilled") {
      regions.push(res.value);
    } else {
      failures.push({
        key: townConfig.key,
        townCode: townConfig.townCode,
        error: res.reason?.message || String(res.reason),
      });
    }
  });

  return {
    regions,
    failures,
    isPartial: failures.length > 0,
    fetchedAt: nowIso,
  };
}

export interface TripWeatherRecoveryResult extends TripWeatherResult {
  attempts: number;
  attemptFailures: TripWeatherFailure[][];
}

export interface LoadHomepageWeatherWithRecoveryOptions
  extends LoadHomepageWeatherOptions {
  retryTimeoutMs?: number;
  retryDelayMs?: number;
  onRetry?: (attempt: number) => void;
}

/**
 * Loads homepage weather for the 4 fixed regions with one bounded recovery attempt
 * when the initial attempt suffers a total failure (e.g. Azure scale-to-zero cold start timeout).
 */
export async function loadHomepageWeatherWithRecovery(
  options: LoadHomepageWeatherWithRecoveryOptions = {}
): Promise<TripWeatherRecoveryResult> {
  const attemptFailures: TripWeatherFailure[][] = [];
  const initialTimeoutMs = options.timeoutMs ?? 8000;
  const maxRetryTimeoutMs = 20000;
  const retryTimeoutMs = Math.min(
    maxRetryTimeoutMs,
    options.retryTimeoutMs ?? 15000
  );
  const retryDelayMs = options.retryDelayMs ?? 1000;

  // Attempt 1: Initial fetch
  const result1 = await loadHomepageWeather({
    ...options,
    timeoutMs: initialTimeoutMs,
  });

  attemptFailures.push(result1.failures);

  // If external signal was aborted or Attempt 1 returned at least 1 region, return immediately
  if (options.signal?.aborted || result1.regions.length > 0) {
    return {
      ...result1,
      attempts: 1,
      attemptFailures,
    };
  }

  // Attempt 1 had total failure (0 regions). Trigger waking callback for UI recovery.
  if (typeof options.onRetry === "function") {
    try {
      options.onRetry(2);
    } catch {
      // Ignore callback errors
    }
  }

  if (retryDelayMs > 0) {
    await new Promise<void>((resolve) => {
      if (options.signal?.aborted) {
        resolve();
        return;
      }
      const timer = setTimeout(resolve, retryDelayMs);
      if (options.signal) {
        const onAbort = () => {
          clearTimeout(timer);
          resolve();
        };
        options.signal.addEventListener("abort", onAbort, { once: true });
      }
    });
  }

  if (options.signal?.aborted) {
    return {
      ...result1,
      attempts: 1,
      attemptFailures,
    };
  }

  // Attempt 2: Bounded recovery attempt with longer timeout (up to 20s)
  const result2 = await loadHomepageWeather({
    ...options,
    timeoutMs: retryTimeoutMs,
  });

  attemptFailures.push(result2.failures);

  return {
    ...result2,
    attempts: 2,
    attemptFailures,
  };
}
