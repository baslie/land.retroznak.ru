"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { onCLS, onFCP, onLCP, onTTFB, onINP, type Metric } from "web-vitals";

import { analyticsConfig } from "@/config/analytics";
import { initAnalytics, resetAnalytics, trackEvent } from "@/lib/analytics";

function isAnalyticsEnabled() {
  return Boolean(analyticsConfig.projectId || analyticsConfig.debug);
}

function sendToAnalytics(metric: Metric) {
  if (!isAnalyticsEnabled()) {
    return;
  }

  trackEvent({
    name: "web_vitals",
    properties: {
      metric_name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigation_type: metric.navigationType,
    },
  });

  // Also log to console in debug mode
  if (analyticsConfig.debug) {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
    });
  }
}

export function AnalyticsProvider() {
  const pathname = usePathname();
  const enabled = isAnalyticsEnabled();

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    initAnalytics(analyticsConfig);

    return () => {
      resetAnalytics();
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const path = pathname ?? (typeof window !== "undefined" ? window.location.pathname : "/");
    const search = typeof window !== "undefined" ? window.location.search : "";
    const url = search ? `${path}${search}` : path;

    trackEvent({
      name: "page_view",
      properties: {
        path: url,
        title: typeof document !== "undefined" ? document.title : undefined,
        referrer: typeof document !== "undefined" ? document.referrer : undefined,
      },
    });
  }, [enabled, pathname]);

  // Monitor Core Web Vitals
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    // Register all Core Web Vitals metrics
    // Note: FID was replaced with INP in web-vitals v4
    onCLS(sendToAnalytics);
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
    onINP(sendToAnalytics);
  }, []);

  return null;
}
