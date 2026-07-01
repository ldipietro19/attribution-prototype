"use client";

// Simple localStorage-backed store for style state.
// Initialised from mockData defaults; persists edits across navigation.

export function getStyleAttributes(id: string, defaults: Record<string, string>): Record<string, string> {
  if (typeof window === "undefined") return defaults;
  const stored = localStorage.getItem(`attr_${id}`);
  return stored ? { ...defaults, ...JSON.parse(stored) } : { ...defaults };
}

export function saveStyleAttributes(id: string, values: Record<string, string>) {
  localStorage.setItem(`attr_${id}`, JSON.stringify(values));
}

export function getReviewStatus(id: string, defaultStatus: string): string {
  if (typeof window === "undefined") return defaultStatus;
  return localStorage.getItem(`review_${id}`) ?? defaultStatus;
}

export function saveReviewStatus(id: string, status: string) {
  localStorage.setItem(`review_${id}`, status);
}
