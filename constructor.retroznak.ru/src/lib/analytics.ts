export interface AnalyticsConfig {
  projectId?: string;
  debug?: boolean;
  defaultProperties?: Record<string, unknown>;
}

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
}

let analyticsConfig: AnalyticsConfig = {};
let isInitialized = false;

export function initAnalytics(config: AnalyticsConfig = {}) {
  analyticsConfig = config;
  isInitialized = true;

  if (analyticsConfig.debug) {
    console.info("[analytics] initialized", analyticsConfig);
  }
}

export function trackEvent(event: AnalyticsEvent) {
  if (!isInitialized) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[analytics] attempt to track event before initialization", event);
    }
    return;
  }

  const payload = {
    ...analyticsConfig.defaultProperties,
    ...event.properties,
  };

  if (analyticsConfig.debug || process.env.NODE_ENV !== "production") {
    console.info(`[analytics] ${event.name}`, payload);
  }

  // Placeholder for future analytics provider integration.
}

export function resetAnalytics() {
  analyticsConfig = {};
  isInitialized = false;
}
