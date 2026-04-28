import type { ClauseType, Rating, Severity, SortField } from "@/types";

// ─── Score bands ───────────────────────────────────────────────────────────

export const SCORE_BANDS = [
  {
    min: 0,
    max: 30,
    rating: "red" as Rating,
    label: "High risk",
    color: "#E24B4A",
  },
  {
    min: 31,
    max: 65,
    rating: "orange" as Rating,
    label: "Moderate",
    color: "#EF9F27",
  },
  {
    min: 66,
    max: 100,
    rating: "green" as Rating,
    label: "Safe",
    color: "#1D9E75",
  },
];

// ─── Clause types ──────────────────────────────────────────────────────────

export const CLAUSE_TYPES: ClauseType[] = [
  "personal_data",
  "third_party",
  "abusive",
  "retention",
  "recourse",
];

// ─── Severity ──────────────────────────────────────────────────────────────

export const SEVERITIES: Severity[] = ["high", "medium", "low"];

// ─── Pagination ────────────────────────────────────────────────────────────

export const DEFAULT_PAGE_SIZE = 12;

// ─── Query keys ────────────────────────────────────────────────────────────

export const QUERY_KEYS = {
  sites: ["sites"] as const,
  site: (id: string) => ["sites", id] as const,
  siteHistory: (id: string) => ["sites", id, "history"] as const,
  dashboard: ["dashboard"] as const,
} as const;

// ─── Routes ────────────────────────────────────────────────────────────────

export const ROUTES = {
  dashboard: "/",
  sites: "/sites",
  site: (id: string) => `/sites/${id}`,
  siteHistory: (id: string) => `/sites/${id}/history`,
  settings: "/settings",
  login: "/login",
  compare: "/compare",
} as const;

// ─── Pagination ────────────────────────────────────────────────────────────

export const PAGE_SIZE = 12;

// ─── Rating options ────────────────────────────────────────────────────────

export const RATING_OPTIONS: { value: Rating | "all"; label: string }[] = [
  { value: "all", label: "All ratings" },
  { value: "red", label: "High risk" },
  { value: "orange", label: "Moderate" },
  { value: "green", label: "Safe" },
];

// ─── Sort options ──────────────────────────────────────────────────────────

export const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: "date", label: "Most recent" },
  { value: "score", label: "Score" },
  { value: "name", label: "Name" },
];

// ─── Colors ──────────────────────────────────────────────────────────

export const PRESET_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
];
