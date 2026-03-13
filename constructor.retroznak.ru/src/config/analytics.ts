import type { AnalyticsConfig } from "@/lib/analytics";

const environment = process.env.NEXT_PUBLIC_APP_ENV ?? process.env.NODE_ENV ?? "development";

export const analyticsConfig: AnalyticsConfig = {
  projectId: process.env.NEXT_PUBLIC_ANALYTICS_PROJECT_ID,
  debug:
    process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "true" ||
    (process.env.NODE_ENV !== "production" && environment !== "production"),
  defaultProperties: {
    app: "Retroznak Land 2.0",
    environment,
  },
};
