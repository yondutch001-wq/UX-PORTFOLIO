"use client";

export type EngagementEvent = "view" | "inquiry" | "click";

const SESSION_KEY = "ux_portfolio_session";

function getSessionId() {
  if (typeof window === "undefined") return null;
  const existing = window.localStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const generated =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  window.localStorage.setItem(SESSION_KEY, generated);
  return generated;
}

export function trackEngagement(payload: {
  projectSlug: string;
  projectId?: string | null;
  eventType: EngagementEvent;
}) {
  if (!payload.projectSlug || typeof window === "undefined") return;

  const body = JSON.stringify({
    projectSlug: payload.projectSlug,
    projectId: payload.projectId ?? null,
    eventType: payload.eventType,
    sessionId: getSessionId(),
    pathname: window.location.pathname,
    referrer: document.referrer,
    userAgent: navigator.userAgent
  });

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon("/api/engagement", blob);
    return;
  }

  fetch("/api/engagement", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true
  }).catch(() => undefined);
}
