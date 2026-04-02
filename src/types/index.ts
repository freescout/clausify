// ─── Clause ────────────────────────────────────────────────────────────────

export type ClauseType =
  | "personal_data"
  | "third_party"
  | "abusive"
  | "retention"
  | "recourse";

export type Severity = "high" | "medium" | "low";

export type Rating = "green" | "orange" | "red";

export interface Clause {
  id: string;
  analysis_id: string;
  clause_type: ClauseType;
  content: string;
  severity: Severity;
  score_impact: number;
}

// ─── Site ──────────────────────────────────────────────────────────────────

export interface Site {
  id: string;
  domain: string;
  analyzed_at: string;
  global_score: number;
  rating: Rating;
  clauses: Clause[];
  version: number;
}

export interface SiteListItem {
  id: string;
  domain: string;
  name: string;
  created_at: string;
  updated_at: string;
  current_global_score: number | null;
  current_rating: string | null;
  clause_count: number;
  top_concern: ClauseType | null;
}

// ─── Analysis ──────────────────────────────────────────────────────────────

export interface Analysis {
  id: string;
  cgv_version_id: string;
  global_score: number;
  rating: string;
  analyzed_at: string;
}

export interface AnalysisResult {
  site: string;
  analyzed_at: string;
  clauses: Clause[];
  global_score: number;
  rating: Rating;
}

// ─── Version history ───────────────────────────────────────────────────────

export interface SiteVersion {
  id: string;
  version: number;
  analyzed_at: string;
  global_score: number;
  rating: Rating;
  clause_count: number;
}

export interface VersionDiff {
  added: Clause[];
  removed: Clause[];
  changed: Array<{ before: Clause; after: Clause }>;
  unchanged: Clause[];
  score_delta: number;
}

// ─── User & Auth ───────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  created_at: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  clause_order: ClauseType[];
  hidden_clauses: ClauseType[];
  min_severity: Severity;
  watchlist: string[];
}

// ─── API responses ─────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
}

// ─── Filters ───────────────────────────────────────────────────────────────

export type SortField = "score" | "date" | "name";
export type SortOrder = "asc" | "desc";

export interface SiteFilters {
  search: string;
  rating: Rating | "all";
  sort_field: SortField;
  sort_order: SortOrder;
  page: number;
}

export interface CgvVersion {
  id: string;
  site_id: string;
  content_hash: string;
  raw_text: string | null;
  source_url: string | null;
  extracted_at: string;
}

export interface SiteDetail {
  id: string;
  domain: string;
  name: string | null;
  current_global_score: number | null;
  current_rating: string | null;
  created_at: string;
  updated_at: string;
  latest_analysis: Analysis | null;
  clauses: Clause[];
  cgv_version: CgvVersion | null;
}
