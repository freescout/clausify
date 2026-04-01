import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronUp, ChevronDown, LayoutGrid, List } from "lucide-react";
import { MOCK_RECENT_SITES } from "@/lib/mockData";
import { CLAUSE_LABELS, formatRelativeTime } from "@/lib/utils";
import type { SiteListItem, Rating, SortField, SortOrder } from "@/types";

const RATING_OPTIONS: { value: Rating | "all"; label: string }[] = [
  { value: "all", label: "All ratings" },
  { value: "red", label: "High risk" },
  { value: "orange", label: "Moderate" },
  { value: "green", label: "Safe" },
];

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: "date", label: "Most recent" },
  { value: "score", label: "Score" },
  { value: "name", label: "Name" },
];

function RatingBadge({ rating }: { rating: string | null }) {
  if (!rating) return <span className="text-xs text-(--fg-tertiary)">—</span>;
  const classes: Record<string, string> = {
    red: "score-high",
    orange: "score-moderate",
    green: "score-safe",
  };
  const labels: Record<string, string> = {
    red: "High risk",
    orange: "Moderate",
    green: "Safe",
  };
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${classes[rating]}`}
    >
      {labels[rating]}
    </span>
  );
}

function SiteCard({ site }: { site: SiteListItem }) {
  const navigate = useNavigate();
  const score = site.current_global_score ?? null;
  const rating = site.current_rating ?? "green";

  const barColor: Record<string, string> = {
    red: "bg-(--color-high)",
    orange: "bg-(--color-moderate)",
    green: "bg-(--color-safe)",
  };

  const initBg: Record<string, string> = {
    red: "bg-(--color-high-bg) text-(--color-high-text)",
    orange: "bg-(--color-moderate-bg) text-(--color-moderate-text)",
    green: "bg-(--color-safe-bg) text-(--color-safe-text)",
  };

  return (
    <div
      onClick={() => navigate(`/sites/${site.id}`)}
      className="bg-(--surface) border border-(--border) rounded-lg p-4 cursor-pointer hover:border-(--border-strong) hover:shadow-sm transition-all"
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-9 h-9 rounded-md flex items-center justify-center text-sm font-semibold shrink-0 ${initBg[rating]}`}
        >
          {site.domain.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-(--fg) truncate">
              {site.name ?? site.domain}
            </span>
            <RatingBadge rating={site.current_rating} />
          </div>
          <div className="text-xs text-(--fg-tertiary) mt-0.5">
            {site.domain}
          </div>
        </div>
      </div>

      {/* Score bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-(--fg-tertiary)">Trust score</span>
          <span className="text-xs font-medium text-(--fg)">
            {score ?? "—"} / 100
          </span>
        </div>
        <div className="h-1.5 bg-(--bg-tertiary) rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${barColor[rating]}`}
            style={{ width: `${score ?? 0}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-(--fg-tertiary)">
          {site.clause_count} clauses
          {site.top_concern && ` · ${CLAUSE_LABELS[site.top_concern]}`}
        </span>
        <span className="text-xs text-(--fg-tertiary)">
          {formatRelativeTime(site.created_at)}
        </span>
      </div>
    </div>
  );
}

export default function SitesListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [rating, setRating] = useState<Rating | "all">("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [view, setView] = useState<"grid" | "table">("grid");

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const filtered = MOCK_RECENT_SITES.filter((s) => {
    const matchSearch =
      s.domain.toLowerCase().includes(search.toLowerCase()) ||
      (s.name ?? "").toLowerCase().includes(search.toLowerCase());
    const matchRating = rating === "all" || s.current_rating === rating;
    return matchSearch && matchRating;
  }).sort((a, b) => {
    const dir = sortOrder === "asc" ? 1 : -1;
    if (sortField === "score")
      return (
        ((a.current_global_score ?? 0) - (b.current_global_score ?? 0)) * dir
      );
    if (sortField === "name") return a.domain.localeCompare(b.domain) * dir;
    return (
      (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) *
      dir
    );
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? (
      <ChevronUp size={12} />
    ) : (
      <ChevronDown size={12} />
    );
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-(--fg-tertiary)"
          />
          <input
            type="text"
            placeholder="Search sites..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-(--surface) border border-(--border) rounded-md text-(--fg) placeholder:text-(--fg-tertiary) focus:outline-none focus:border-(--border-strong)"
          />
        </div>

        {/* Rating filter */}
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value as Rating | "all")}
          className="px-3 py-2 text-sm bg-(--surface) border border-(--border) rounded-md text-(--fg) focus:outline-none focus:border-(--border-strong)"
        >
          {RATING_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {/* Sort */}
        <div className="flex gap-1">
          {SORT_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => toggleSort(o.value)}
              className={`flex items-center gap-1 px-3 py-2 text-sm rounded-md border transition-colors ${
                sortField === o.value
                  ? "bg-primary-subtle text-primary border-primary/20"
                  : "bg-(--surface) text-(--fg-secondary) border-(--border) hover:border-(--border-strong)"
              }`}
            >
              {o.label}
              <SortIcon field={o.value} />
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex gap-1 border border-(--border) rounded-md p-0.5 bg-(--surface)">
          <button
            onClick={() => setView("grid")}
            className={`p-1.5 rounded transition-colors ${view === "grid" ? "bg-primary-subtle text-primary" : "text-(--fg-tertiary) hover:text-(--fg)"}`}
          >
            <LayoutGrid size={14} />
          </button>
          <button
            onClick={() => setView("table")}
            className={`p-1.5 rounded transition-colors ${view === "table" ? "bg-primary-subtle text-primary" : "text-(--fg-tertiary) hover:text-(--fg)"}`}
          >
            <List size={14} />
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="text-xs text-(--fg-tertiary)">
        {filtered.length} site{filtered.length !== 1 ? "s" : ""} found
      </div>

      {/* Cards grid */}
      {/*       {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((site) => (
            <SiteCard key={site.id} site={site} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-(--fg-tertiary) text-sm">No sites found</div>
          <div className="text-(--fg-tertiary) text-xs mt-1">
            Try adjusting your search or filters
          </div>
        </div>
      )} */}

      {filtered.length > 0 ? (
        view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((site) => (
              <SiteCard key={site.id} site={site} />
            ))}
          </div>
        ) : (
          <div className="bg-(--surface) border border-(--border) rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-(--border) bg-(--bg-secondary)">
                  <th className="text-left text-xs font-medium text-(--fg-tertiary) px-4 py-3 uppercase tracking-wide">
                    Site
                  </th>
                  <th className="text-left text-xs font-medium text-(--fg-tertiary) px-4 py-3 uppercase tracking-wide">
                    Rating
                  </th>
                  <th className="text-left text-xs font-medium text-(--fg-tertiary) px-4 py-3 uppercase tracking-wide hidden sm:table-cell">
                    Score
                  </th>
                  <th className="text-left text-xs font-medium text-(--fg-tertiary) px-4 py-3 uppercase tracking-wide hidden md:table-cell">
                    Clauses
                  </th>
                  <th className="text-left text-xs font-medium text-(--fg-tertiary) px-4 py-3 uppercase tracking-wide hidden md:table-cell">
                    Top concern
                  </th>
                  <th className="text-left text-xs font-medium text-(--fg-tertiary) px-4 py-3 uppercase tracking-wide">
                    Analyzed
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--border)">
                {filtered.map((site) => (
                  <tr
                    key={site.id}
                    onClick={() => navigate(`/sites/${site.id}`)}
                    className="hover:bg-(--bg-secondary) cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-semibold shrink-0 ${
                            site.current_rating === "red"
                              ? "bg-high-bg text-high-text"
                              : site.current_rating === "orange"
                                ? "bg-moderate-bg text-moderate-text"
                                : "bg-safe-bg text-safe-text"
                          }`}
                        >
                          {site.domain.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-(--fg)">
                            {site.name ?? site.domain}
                          </div>
                          <div className="text-xs text-(--fg-tertiary)">
                            {site.domain}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <RatingBadge rating={site.current_rating} />
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-(--bg-tertiary) rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              site.current_rating === "red"
                                ? "bg-high"
                                : site.current_rating === "orange"
                                  ? "bg-moderate"
                                  : "bg-safe"
                            }`}
                            style={{
                              width: `${site.current_global_score ?? 0}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-(--fg)">
                          {site.current_global_score ?? "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-(--fg-secondary) hidden md:table-cell">
                      {site.clause_count}
                    </td>
                    <td className="px-4 py-3 text-sm text-(--fg-secondary) hidden md:table-cell">
                      {site.top_concern ? CLAUSE_LABELS[site.top_concern] : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-(--fg-tertiary)">
                      {formatRelativeTime(site.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-(--fg-tertiary) text-sm">No sites found</div>
          <div className="text-(--fg-tertiary) text-xs mt-1">
            Try adjusting your search or filters
          </div>
        </div>
      )}
    </div>
  );
}
