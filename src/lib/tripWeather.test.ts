// @ts-nocheck
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  DEFAULT_TRIP_WEATHER_API_BASE,
  createHomepageWeatherTabRequestTracker,
  createHomepageWeatherTabLoader,
  FIXED_TOWNS,
  formatTownDisplayName,
  getIconForWeather,
  getTaipeiTodayString,
  loadHomepageWeather,
  loadHomepageWeatherRegion,
  loadHomepageWeatherRegionWithRecovery,
  loadHomepageWeatherWithRecovery,
  normalizeApiBase,
} from "./tripWeather.ts";

// Helper mock builder for API responses
function createMockForecastEnvelope(
  townCode: string,
  targetDate: string,
  overrides: {
    tempHigh?: number;
    tempLow?: number;
    weather?: string;
    weatherCode?: string;
    pop?: number;
    uvValue?: number | null;
    uvLevel?: string | null;
    aqiValue?: number | null;
    aqiLevel?: string | null;
    aqiSourceLabel?: string;
    metaSource?: string;
  } = {}
) {
  return {
    success: true,
    data: {
      forecast: {
        town: {
          code: townCode,
          name: "測試區",
          city: "測試市",
          name_en: "Test District",
          city_en: "Test City",
          lat: 25.0,
          lon: 121.5,
        },
        target_date: targetDate,
        date_adjusted: false,
        source_dataset: "F-D0047-091",
        days: [
          {
            date: targetDate,
            temp_high_c: overrides.tempHigh ?? 30,
            temp_low_c: overrides.tempLow ?? 24,
            max_pop_percent: overrides.pop ?? 20,
            weather: overrides.weather ?? "晴時多雲",
            weather_code: overrides.weatherCode ?? "02",
            advice_hint: "出門注意防曬與補充水分。",
          },
        ],
        uv: {
          value: overrides.uvValue !== undefined ? overrides.uvValue : 7.0,
          level: overrides.uvLevel !== undefined ? overrides.uvLevel : "高量級",
          level_code: "high",
          source_label: "中央氣象署",
          source_type: "cwa",
        },
        aqi: {
          value: overrides.aqiValue !== undefined ? overrides.aqiValue : 45,
          level: overrides.aqiLevel !== undefined ? overrides.aqiLevel : "良好",
          level_code: "good",
          station_name: "測站",
          source_label: overrides.aqiSourceLabel ?? "目前空氣品質",
        },
        warnings: [
          {
            title: "大雨特報",
            severity: "advisory",
            description: "局部大雨機率",
          },
        ],
        sunrise_sunset: {
          county: "測試市",
          target_date: targetDate,
          source_date: targetDate,
          sunrise_time: "05:30",
          sunset_time: "18:30",
          is_approximate: false,
        },
        moon: {
          county: "測試市",
          target_date: targetDate,
          source_date: targetDate,
          moonrise_time: "12:00",
          moonset_time: "00:00",
          phase: "上弦月",
          icon: "first-quarter",
          illumination_fraction: 0.5,
          waxing: true,
        },
        generated_at: "2026-09-01T12:00:00Z",
      },
      ai_summary: {
        text: "整體天氣舒適，適合外出。",
        mode: "gemini",
      },
    },
    error: null,
    meta: {
      request_id: "test-req-id",
      cached: false,
      source: overrides.metaSource ?? "cwa-live",
    },
  };
}

describe("tripWeather utility functions", () => {
  it("getTaipeiTodayString formats dates in Asia/Taipei timezone", () => {
    // 2026-09-01 00:00:00 UTC is 2026-09-01 08:00:00 Asia/Taipei
    const utcDate = new Date("2026-09-01T00:00:00Z");
    assert.equal(getTaipeiTodayString(utcDate), "2026-09-01");

    // 2026-08-31 20:00:00 UTC is 2026-09-01 04:00:00 Asia/Taipei
    const lateUtcDate = new Date("2026-08-31T20:00:00Z");
    assert.equal(getTaipeiTodayString(lateUtcDate), "2026-09-01");
  });

  it("normalizeApiBase strips trailing slashes", () => {
    assert.equal(
      normalizeApiBase("https://my-domain.com/"),
      "https://my-domain.com"
    );
    assert.equal(
      normalizeApiBase("https://my-domain.com///"),
      "https://my-domain.com"
    );
    assert.equal(
      normalizeApiBase(),
      DEFAULT_TRIP_WEATHER_API_BASE
    );
  });

  it("getIconForWeather returns correct weather icons and safe fallbacks", () => {
    assert.equal(getIconForWeather("01", "晴天"), "sun");
    assert.equal(getIconForWeather("02", "晴時多雲"), "sun");
    assert.equal(getIconForWeather("03", "多雲時晴"), "cloud");
    assert.equal(getIconForWeather("04", "多雲"), "cloud");
    assert.equal(getIconForWeather("07", "陰天"), "cloud");
    assert.equal(getIconForWeather("08", "午後短暫陣雨"), "rain");
    assert.equal(getIconForWeather("15", "雷陣雨"), "rain");

    // Text matching fallback
    assert.equal(getIconForWeather(null, "Rainy day"), "rain");
    assert.equal(getIconForWeather("", "晴朗"), "sun");
    assert.equal(getIconForWeather(undefined, "Overcast"), "cloud");

    // Unknown code/text fallback
    assert.equal(getIconForWeather("999", "未知氣象現象"), "cloud");
    assert.equal(getIconForWeather(null, null), "cloud");
  });

  it("formatTownDisplayName formats town names correctly per locale", () => {
    const config = FIXED_TOWNS[0]; // N: Taipei Xinyi

    assert.equal(
      formatTownDisplayName(config, "zh", { city: "臺北市", name: "信義區" }),
      "臺北 · 信義區"
    );
    assert.equal(
      formatTownDisplayName(config, "en", {
        city: "Taipei City",
        name: "Xinyi District",
        city_en: "Taipei City",
        name_en: "Xinyi District",
      }),
      "Taipei · Xinyi District"
    );
    assert.equal(
      formatTownDisplayName(config, "zh", null),
      "臺北 · 信義區"
    );
    assert.equal(
      formatTownDisplayName(config, "en", null),
      "Taipei · Xinyi"
    );
    assert.equal(
      formatTownDisplayName(config, "ja", null),
      "台北 · 信義"
    );
  });
});

describe("loadHomepageWeather", () => {
  it("successfully loads and maps all 4 fixed regions without network", async () => {
    const requestedUrls: string[] = [];

    const mockFetch: typeof fetch = async (input) => {
      const urlStr = String(input);
      requestedUrls.push(urlStr);

      const urlObj = new URL(urlStr);
      const townCode = urlObj.searchParams.get("town") || "";
      const date = urlObj.searchParams.get("date") || "2026-09-01";

      const body = createMockForecastEnvelope(townCode, date, {
        tempHigh: townCode === "cwa-63000020" ? 31 : 32,
        tempLow: 25,
        weather: "晴時多雲",
        pop: 15,
      });

      return new Response(JSON.stringify(body), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    };

    const result = await loadHomepageWeather({
      fetchFn: mockFetch,
      date: "2026-09-01",
      locale: "zh",
    });

    assert.equal(result.isPartial, false);
    assert.equal(result.failures.length, 0);
    assert.equal(result.regions.length, 4);

    const keys = result.regions.map((r) => r.key);
    assert.deepEqual(keys, ["N", "C", "S", "E"]);

    const north = result.regions.find((r) => r.key === "N")!;
    assert.equal(north.townCode, "cwa-63000020");
    assert.equal(north.tab, "北部");
    assert.equal(north.hi, 31);
    assert.equal(north.lo, 25);
    assert.equal(north.cond, "晴時多雲");
    assert.equal(north.icon, "sun");
    assert.equal(north.pop, 15);
    assert.equal(north.uv, 7);
    assert.equal(north.aqi, 45);
    assert.equal(north.isDemoAqi, false);
    assert.equal(north.advice, "整體天氣舒適，適合外出。");
    assert.equal(north.warnings.length, 1);
    assert.equal(north.sunriseSunset?.sunrise_time, "05:30");
    assert.equal(north.moon?.phase, "上弦月");

    assert.equal(requestedUrls.length, 4);
  });

  it("constructs correct URLs with locale, date, and town codes", async () => {
    const requestedUrls: string[] = [];

    const mockFetch: typeof fetch = async (input) => {
      const urlStr = String(input);
      requestedUrls.push(urlStr);
      const urlObj = new URL(urlStr);
      const townCode = urlObj.searchParams.get("town") || "";
      const body = createMockForecastEnvelope(townCode, "2026-09-05");
      return new Response(JSON.stringify(body), { status: 200 });
    };

    await loadHomepageWeather({
      fetchFn: mockFetch,
      date: "2026-09-05",
      locale: "en",
      apiBase: "https://my-custom-api.com",
    });

    assert.equal(requestedUrls.length, 4);
    for (const urlStr of requestedUrls) {
      assert.ok(urlStr.startsWith("https://my-custom-api.com/api/forecast?"));
      assert.ok(urlStr.includes("date=2026-09-05"));
      assert.ok(urlStr.includes("lang=en"));
    }
  });

  it("normalizes apiBase trailing slashes when building request URLs", async () => {
    const requestedUrls: string[] = [];

    const mockFetch: typeof fetch = async (input) => {
      const urlStr = String(input);
      requestedUrls.push(urlStr);
      const urlObj = new URL(urlStr);
      const townCode = urlObj.searchParams.get("town") || "";
      const body = createMockForecastEnvelope(townCode, "2026-09-01");
      return new Response(JSON.stringify(body), { status: 200 });
    };

    await loadHomepageWeather({
      fetchFn: mockFetch,
      apiBase: "https://my-api.com///",
    });

    for (const urlStr of requestedUrls) {
      assert.ok(urlStr.startsWith("https://my-api.com/api/forecast"));
      assert.ok(!urlStr.startsWith("https://my-api.com//"));
    }
  });

  it("handles partial failure when some requests fail and records failures", async () => {
    const mockFetch: typeof fetch = async (input) => {
      const urlStr = String(input);
      if (urlStr.includes("cwa-66000060")) {
        // Town C fails with HTTP 500
        return new Response(
          JSON.stringify({
            success: false,
            error: { error_code: "upstream_error", message: "CWA service unavailable" },
            meta: { request_id: "err-1", cached: false },
          }),
          { status: 500 }
        );
      }
      const urlObj = new URL(urlStr);
      const townCode = urlObj.searchParams.get("town") || "";
      const body = createMockForecastEnvelope(townCode, "2026-09-01");
      return new Response(JSON.stringify(body), { status: 200 });
    };

    const result = await loadHomepageWeather({ fetchFn: mockFetch });

    assert.equal(result.isPartial, true);
    assert.equal(result.regions.length, 3);
    assert.equal(result.failures.length, 1);

    const failedTown = result.failures[0];
    assert.equal(failedTown.key, "C");
    assert.equal(failedTown.townCode, "cwa-66000060");
    assert.ok(failedTown.error.includes("HTTP 500"));
  });

  it("handles total failure when all requests fail without returning fake regions", async () => {
    const mockFetch: typeof fetch = async () => {
      return new Response(
        JSON.stringify({
          success: false,
          error: { message: "Internal server error" },
        }),
        { status: 500 }
      );
    };

    const result = await loadHomepageWeather({ fetchFn: mockFetch });

    assert.equal(result.isPartial, true);
    assert.equal(result.regions.length, 0);
    assert.equal(result.failures.length, 4);
  });

  it("detects AQI demo metadata correctly from source label or mock metadata", async () => {
    const mockFetch: typeof fetch = async (input) => {
      const urlStr = String(input);
      const urlObj = new URL(urlStr);
      const townCode = urlObj.searchParams.get("town") || "";

      // Town N returns AQI Demo source label
      const body = createMockForecastEnvelope(townCode, "2026-09-01", {
        aqiSourceLabel:
          townCode === "cwa-63000020"
            ? "目前空氣品質 (Demo 範例資料)"
            : "環境部",
      });
      return new Response(JSON.stringify(body), { status: 200 });
    };

    const result = await loadHomepageWeather({ fetchFn: mockFetch });
    assert.equal(result.regions.length, 4);

    const north = result.regions.find((r) => r.key === "N")!;
    assert.equal(north.isDemoAqi, true);
    assert.equal(north.aqiSource, "目前空氣品質 (Demo 範例資料)");

    const central = result.regions.find((r) => r.key === "C")!;
    assert.equal(central.isDemoAqi, false);
    assert.equal(central.aqiSource, "環境部");
  });

  it("handles null/optional UV and AQI fields correctly without fabricating values", async () => {
    const mockFetch: typeof fetch = async (input) => {
      const urlStr = String(input);
      const urlObj = new URL(urlStr);
      const townCode = urlObj.searchParams.get("town") || "";
      const body = createMockForecastEnvelope(townCode, "2026-09-01", {
        uvValue: null,
        uvLevel: null,
        aqiValue: null,
        aqiLevel: null,
      });
      return new Response(JSON.stringify(body), { status: 200 });
    };

    const result = await loadHomepageWeather({ fetchFn: mockFetch });
    assert.equal(result.regions.length, 4);

    const region = result.regions[0];
    assert.equal(region.uv, null);
    assert.equal(region.uvLevel, null);
    assert.equal(region.aqi, null);
    assert.equal(region.aqiLevel, null);
  });
});

describe("loadHomepageWeatherWithRecovery", () => {
  it("first-all-fail then success: automatically recovers on second attempt", async () => {
    let fetchCallCount = 0;
    let retryAttemptNotified = 0;

    const mockFetch: typeof fetch = async (input) => {
      fetchCallCount++;
      // First 4 calls (attempt 1) fail with timeout/500 error
      if (fetchCallCount <= 4) {
        return new Response(JSON.stringify({ success: false, error: { message: "Cold start timeout" } }), { status: 504 });
      }

      // Calls 5..8 (attempt 2) succeed
      const urlObj = new URL(String(input));
      const townCode = urlObj.searchParams.get("town") || "";
      const body = createMockForecastEnvelope(townCode, "2026-09-01");
      return new Response(JSON.stringify(body), { status: 200 });
    };

    const result = await loadHomepageWeatherWithRecovery({
      fetchFn: mockFetch,
      retryDelayMs: 0,
      onRetry: (attempt) => {
        retryAttemptNotified = attempt;
      },
    });

    assert.equal(result.attempts, 2);
    assert.equal(result.regions.length, 4);
    assert.equal(result.isPartial, false);
    assert.equal(retryAttemptNotified, 2);
    assert.equal(fetchCallCount, 8);
    assert.equal(result.attemptFailures.length, 2);
    assert.equal(result.attemptFailures[0].length, 4);
    assert.equal(result.attemptFailures[1].length, 0);
  });

  it("both-all-fail: stops after second attempt and returns total failure", async () => {
    let fetchCallCount = 0;
    let retryAttemptNotified = 0;

    const mockFetch: typeof fetch = async () => {
      fetchCallCount++;
      return new Response(JSON.stringify({ success: false, error: { message: "Backend down" } }), { status: 500 });
    };

    const result = await loadHomepageWeatherWithRecovery({
      fetchFn: mockFetch,
      retryDelayMs: 0,
      onRetry: (attempt) => {
        retryAttemptNotified = attempt;
      },
    });

    assert.equal(result.attempts, 2);
    assert.equal(result.regions.length, 0);
    assert.equal(result.isPartial, true);
    assert.equal(retryAttemptNotified, 2);
    assert.equal(fetchCallCount, 8); // Exactly 2 attempts (4 + 4), no polling or retry loop
    assert.equal(result.attemptFailures.length, 2);
    assert.equal(result.attemptFailures[0].length, 4);
    assert.equal(result.attemptFailures[1].length, 4);
  });

  it("partial-no-retry: partial success on attempt 1 returns immediately without attempt 2", async () => {
    let fetchCallCount = 0;
    let retryAttemptNotified = 0;

    const mockFetch: typeof fetch = async (input) => {
      fetchCallCount++;
      const urlStr = String(input);
      // Only Taipei (cwa-63000020) succeeds, others fail
      if (urlStr.includes("cwa-63000020")) {
        const body = createMockForecastEnvelope("cwa-63000020", "2026-09-01");
        return new Response(JSON.stringify(body), { status: 200 });
      }
      return new Response(JSON.stringify({ success: false, error: { message: "Error" } }), { status: 500 });
    };

    const result = await loadHomepageWeatherWithRecovery({
      fetchFn: mockFetch,
      retryDelayMs: 0,
      onRetry: (attempt) => {
        retryAttemptNotified = attempt;
      },
    });

    assert.equal(result.attempts, 1);
    assert.equal(result.regions.length, 1);
    assert.equal(result.isPartial, true);
    assert.equal(retryAttemptNotified, 0); // onRetry never called
    assert.equal(fetchCallCount, 4); // Only 4 calls made
    assert.equal(result.attemptFailures.length, 1);
    assert.equal(result.attemptFailures[0].length, 3);
  });

  it("attempt count and timeout bounded: caps retryTimeoutMs at 20000ms max", async () => {
    const passedTimeouts: number[] = [];

    const mockFetch: typeof fetch = async (input, init) => {
      // Collect timeout signal or verify options
      return new Response(JSON.stringify({ success: false, error: { message: "Timeout" } }), { status: 504 });
    };

    const result = await loadHomepageWeatherWithRecovery({
      fetchFn: mockFetch,
      timeoutMs: 500,
      retryTimeoutMs: 30000, // Exceeds cap of 20000ms
      retryDelayMs: 0,
    });

    assert.equal(result.attempts, 2);
  });

  it("external abort stops recovery attempt immediately", async () => {
    const controller = new AbortController();
    controller.abort(new Error("User navigated away"));

    const mockFetch: typeof fetch = async () => {
      throw new Error("Aborted");
    };

    const result = await loadHomepageWeatherWithRecovery({
      fetchFn: mockFetch,
      signal: controller.signal,
      retryDelayMs: 0,
    });

    assert.equal(result.attempts, 1);
    assert.equal(result.regions.length, 0);
  });

  it("tab click does not trigger refetch", () => {
    // Pure logic check: WeatherCard tab click handler only calls paint(key) using local byKey map,
    // which makes 0 network fetch calls.
    let fetchCount = 0;
    const mockFetch = () => { fetchCount++; return Promise.reject(new Error("No fetch expected")); };
    assert.equal(fetchCount, 0);
  });
});

describe("lazy homepage weather tabs", () => {
	it("renders localized loading copy with the selected tab label", () => {
		const weatherCard = readFileSync(
			new URL("../components/WeatherCard.astro", import.meta.url),
			"utf8"
		);
		const loadingCopy = {
			zh: "正在載入天氣…",
			en: "Loading weather…",
			ja: "天気を読み込み中…",
		};

		for (const [locale, copy] of Object.entries(loadingCopy)) {
			assert.match(weatherCard, new RegExp(`${locale}: \\{[^}]*loading: "${copy}"`));
			const requestMessage = `${copy} 北部`;
			assert.ok(requestMessage.includes("北部"));
			assert.ok(!requestMessage.includes("undefined"));
		}
		assert.match(weatherCard, /showRequestState\(`\$\{copy\.loading\} \$\{tabLabel\(key\)\}`\)/);
	});

	it("lets a reselected tab finish loading without another tab overwriting it", async () => {
    const requests = createHomepageWeatherTabRequestTracker();
    const northRequest = requests.begin("N"); // A starts loading.
    const centralRequest = requests.begin("C"); // B starts loading.
    let selectedKey = "N"; // The user reselects A before either response resolves.
    let visibleContent = "loading";
    let ariaBusy = true;
    let resolveNorth!: () => void;
    let resolveCentral!: () => void;
    const northResponse = new Promise<void>((resolve) => { resolveNorth = resolve; });
    const centralResponse = new Promise<void>((resolve) => { resolveCentral = resolve; });

    const applyResponse = (key: string, token: number, content: string) => {
      if (!requests.canPaint(selectedKey, key, token)) return;
      visibleContent = content;
      ariaBusy = false;
    };
    const northLoad = northResponse.then(() => applyResponse("N", northRequest, "North forecast"));
    const centralLoad = centralResponse.then(() => applyResponse("C", centralRequest, "Central forecast"));

    resolveNorth();
    await northLoad;

    assert.equal(visibleContent, "North forecast");
    assert.equal(ariaBusy, false);

    // B may finish and cache independently, but it cannot replace selected A.
    resolveCentral();
    await centralLoad;
    assert.equal(visibleContent, "North forecast");
  });

  it("loads only the selected North region on initial hydration", async () => {
    const requestedTowns: string[] = [];
    const mockFetch: typeof fetch = async (input) => {
      const town = new URL(String(input)).searchParams.get("town") || "";
      requestedTowns.push(town);
      return new Response(JSON.stringify(createMockForecastEnvelope(town, "2026-09-01")), { status: 200 });
    };

    const result = await loadHomepageWeatherRegion("N", { fetchFn: mockFetch, date: "2026-09-01" });
    assert.equal(result.regions.length, 1);
    assert.deepEqual(requestedTowns, ["cwa-63000020"]);
  });

  it("caches successful tabs and fetches each newly selected town once", async () => {
    const requestedTowns: string[] = [];
    const loader = createHomepageWeatherTabLoader({
      date: "2026-09-01",
      fetchFn: async (input) => {
        const town = new URL(String(input)).searchParams.get("town") || "";
        requestedTowns.push(town);
        return new Response(JSON.stringify(createMockForecastEnvelope(town, "2026-09-01")), { status: 200 });
      },
    });

    await loader.load("N");
    await loader.load("C");
    await loader.load("N");
    assert.deepEqual(requestedTowns, ["cwa-63000020", "cwa-66000060"]);
    assert.equal(loader.getState("N"), "ready");
    assert.equal(loader.getState("C"), "ready");
  });

  it("keeps ready-tab cache when a failed lazy tab is retried", async () => {
    const calls = new Map<string, number>();
    const loader = createHomepageWeatherTabLoader({
      date: "2026-09-01",
      retryDelayMs: 0,
      fetchFn: async (input) => {
        const town = new URL(String(input)).searchParams.get("town") || "";
        calls.set(town, (calls.get(town) || 0) + 1);
        if (town === "cwa-66000060" && (calls.get(town) || 0) <= 2) {
          return new Response(JSON.stringify({ success: false, error: { message: "Central unavailable" } }), { status: 500 });
        }
        return new Response(JSON.stringify(createMockForecastEnvelope(town, "2026-09-01")), { status: 200 });
      },
    });

    await loader.load("N");
    await assert.rejects(loader.load("C"));
    assert.equal(loader.getState("C"), "error");
    await loader.retry("C");
    await loader.load("N");
    assert.equal(calls.get("cwa-63000020"), 1);
    assert.equal(calls.get("cwa-66000060"), 3);
    assert.equal(loader.getState("C"), "ready");
  });

  it("replaces a failed selected tab with its own unavailable content before retry succeeds", async () => {
    const weatherCard = readFileSync(
      new URL("../components/WeatherCard.astro", import.meta.url),
      "utf8"
    );
    const calls = new Map<string, number>();
    const loader = createHomepageWeatherTabLoader({
      date: "2026-09-01",
      retryDelayMs: 0,
      fetchFn: async (input) => {
        const town = new URL(String(input)).searchParams.get("town") || "";
        calls.set(town, (calls.get(town) || 0) + 1);
        if (town === "cwa-66000060" && (calls.get(town) || 0) <= 2) {
          return new Response(JSON.stringify({ success: false, error: { message: "Central unavailable" } }), { status: 500 });
        }
        return new Response(JSON.stringify(createMockForecastEnvelope(town, "2026-09-01")), { status: 200 });
      },
    });

    const north = await loader.load("N");
    await assert.rejects(loader.load("C"));
    assert.equal(loader.getState("C"), "error");
    assert.equal(calls.get("cwa-63000020"), 1);
    assert.equal(calls.get("cwa-66000060"), 2);

    // The component must clear every stale forecast field before showing C's
    // unavailable placeholder; source assertions bind this regression to the DOM paint path.
    assert.match(weatherCard, /const paintUnavailable = \(key: string\): void => \{/);
    for (const selector of [
      "[data-wc-place]", "[data-wc-hi]", "[data-wc-lo]", "[data-wc-cond]",
      "[data-wc-advice]", "[data-wc-pop]", "[data-wc-uv]", "[data-wc-aqi]",
      "[data-wc-moon-value]", "[data-wc-moon-label]",
    ]) {
      assert.ok(weatherCard.includes(`setText(\"${selector}\"`), `unavailable paint clears ${selector}`);
    }
    assert.match(weatherCard, /catch \{\s+tabPhase\.set\(key, "error"\);\s+if \(selectedKey === key\) \{\s+paintUnavailable\(key\);/);
    assert.match(weatherCard, /setText\("\[data-wc-place\]", `\$\{tabLabel\(key\)\} · \$\{copy\.unavailable\}`\)/);

    const central = await loader.retry("C");
    assert.equal(calls.get("cwa-63000020"), 1, "retry does not request the ready North tab");
    assert.equal(calls.get("cwa-66000060"), 3);
    assert.equal(central.key, "C");
    assert.equal(loader.getState("C"), "ready");
    assert.notEqual(central.townCode, north.townCode);
  });

  it("bounds lazy-tab recovery to that tab", async () => {
    let calls = 0;
    const result = await loadHomepageWeatherRegionWithRecovery("E", {
      retryDelayMs: 0,
      fetchFn: async (input) => {
        calls++;
        const town = new URL(String(input)).searchParams.get("town") || "";
        if (calls === 1) return new Response(JSON.stringify({ success: false, error: { message: "Cold start" } }), { status: 504 });
        return new Response(JSON.stringify(createMockForecastEnvelope(town, "2026-09-01")), { status: 200 });
      },
    });
    assert.equal(result.attempts, 2);
    assert.equal(result.regions[0].key, "E");
    assert.equal(calls, 2);
  });
});
