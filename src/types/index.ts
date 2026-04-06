export type ClauseType =
  | "personal_data"
  | "third_party"
  | "abusive"
  | "retention"
  | "recourse";

export type Severity = "high" | "medium" | "low";
export type Rating = "green" | "orange" | "red";

// ─── Tag ───────────────────────────────────────────────────────────────────

export interface Tag {
  id: string;
  name: string;
  color: string;
  user_id: string;
  created_at: string;
}

// ─── Site list ─────────────────────────────────────────────────────────────

export interface SiteListItem {
  id: string;
  domain: string;
  name: string | null;
  current_global_score: number | null;
  current_rating: string | null;
  created_at: string;
  updated_at: string;
  tags: Tag[];
}

// ─── Analysis ──────────────────────────────────────────────────────────────
interface Analysis {
  id: string;
  global_score: number;
  rating: string;
  analyzed_at: string;
  clauses: Clause[];
}

// ─── CgvVersion ────────────────────────────────────────────────────────────

export interface CgvVersion {
  id: string;
  content_hash: string;
  raw_text: string | null;
  source_url?: string | null;
  extracted_at: string;
  analysis: Analysis | null;
}

// ─── Clause ────────────────────────────────────────────────────────────────

export interface Clause {
  id: string;
  analysis_id: string;
  clause_type: ClauseType;
  content: string;
  severity: Severity;
  score_impact: number;
}

// ─── Site detail ───────────────────────────────────────────────────────────

export interface SiteDetail {
  id: string;
  domain: string;
  name: string | null;
  current_global_score: number | null;
  current_rating: string | null;
  created_at: string;
  updated_at: string;
  tags: Tag[];
  cgv_versions: CgvVersion[];
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

// ─── Auth ──────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface UserPreferences {
  clause_order: ClauseType[];
  hidden_clauses: ClauseType[];
  min_severity: Severity;
  watchlist: string[];
}
