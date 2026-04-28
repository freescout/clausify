import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ChevronUp,
  ChevronDown,
  LayoutGrid,
  List,
  Layers,
} from "lucide-react";
import { useSites, useTags } from "@/hooks/useSites";
import { formatRelativeTime } from "@/lib/utils";
import type { SiteListItem, Rating, SortField, SortOrder } from "@/types";
import { PAGE_SIZE, RATING_OPTIONS, SORT_OPTIONS } from "@/lib/constants";
import TagPopover from "@/components/ui/TagPopover";
import { useAuthStore } from "@/stores/authStore";

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

function SiteCard({
  site,
  compareSelected,
  onToggleCompare,
}: {
  site: SiteListItem;
  compareSelected: boolean;
  onToggleCompare: (domain: string) => void;
}) {
  const navigate = useNavigate();
  const score = site.current_global_score ?? null;
  const rating = site.current_rating ?? "green";
  const token = useAuthStore((s) => s.token);

  const barColor: Record<string, string> = {
    red: "bg-high",
    orange: "bg-moderate",
    green: "bg-safe",
  };
  const initBg: Record<string, string> = {
    red: "bg-high-bg text-high-text",
    orange: "bg-moderate-bg text-moderate-text",
    green: "bg-safe-bg text-safe-text",
  };

  return (
    <div
      onClick={() => navigate(`/sites/${site.domain}`)}
      className={`bg-(--surface) border rounded-lg p-4 cursor-pointer hover:border-(--border-strong) hover:shadow-sm transition-all ${compareSelected ? "border-primary" : "border-(--border)"}`}
    >
      <div className="flex items-start gap-3">
        {/* Compare checkbox */}
        <input
          type="checkbox"
          checked={compareSelected}
          onChange={(e) => {
            e.stopPropagation();
            onToggleCompare(site.domain);
          }}
          onClick={(e) => e.stopPropagation()}
          className="mt-1 accent-primary shrink-0"
        />
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

      <div className="flex items-center justify-between mt-3">
        <div>{!!token && <TagPopover site={site} />}</div>
        <span className="text-xs text-(--fg-tertiary)">
          {formatRelativeTime(site.updated_at)}
        </span>
      </div>
    </div>
  );
}

// ─── Grouped view ─────────────────────────────────────────────────────────────

function GroupedView({
  sites,
  selectedTags,
  compareSelection,
  onToggleCompare,
}: {
  sites: SiteListItem[];
  selectedTags: string[];
  compareSelection: string[];
  onToggleCompare: (domain: string) => void;
}) {
  const { data: allTags = [] } = useTags();

  const tagsToShow =
    selectedTags.length > 0
      ? allTags.filter((t) => selectedTags.includes(t.id))
      : allTags;

  const groups = tagsToShow.map((tag) => {
    const tagSites = sites.filter((s) => s.tags.some((t) => t.id === tag.id));
    const avgScore =
      tagSites.length > 0
        ? Math.round(
            tagSites.reduce(
              (sum, s) => sum + (s.current_global_score ?? 0),
              0,
            ) / tagSites.length,
          )
        : null;
    return { tag, sites: tagSites, avgScore };
  });

  const untagged = sites.filter((s) =>
    tagsToShow.every((tag) => !s.tags.some((t) => t.id === tag.id)),
  );

  return (
    <div className="space-y-8">
      {groups.map(({ tag, sites: groupSites, avgScore }) => (
        <div key={tag.id}>
          <div className="flex items-center gap-3 mb-3">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ background: tag.color }}
            />
            <span className="text-sm font-semibold text-(--fg)">
              {tag.name}
            </span>
            <span className="text-xs text-(--fg-tertiary)">
              {groupSites.length} site{groupSites.length !== 1 ? "s" : ""}
            </span>
            {avgScore !== null && (
              <>
                <span className="text-xs text-(--fg-tertiary)">·</span>
                <span className="text-xs text-(--fg-tertiary)">
                  avg score{" "}
                  <span className="font-medium text-(--fg)">{avgScore}</span>
                </span>
              </>
            )}
          </div>

          {groupSites.length === 0 ? (
            <p className="text-xs text-(--fg-tertiary) pl-6 italic">
              No sites with this tag.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupSites.map((site) => (
                <SiteCard
                  key={site.id}
                  site={site}
                  compareSelected={compareSelection.includes(site.domain)}
                  onToggleCompare={onToggleCompare}
                />
              ))}
            </div>
          )}
        </div>
      ))}

      {untagged.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-3 h-3 rounded-full shrink-0 bg-(--border)" />
            <span className="text-sm font-semibold text-(--fg)">Untagged</span>
            <span className="text-xs text-(--fg-tertiary)">
              {untagged.length} site{untagged.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {untagged.map((site) => (
              <SiteCard
                key={site.id}
                site={site}
                compareSelected={compareSelection.includes(site.domain)}
                onToggleCompare={onToggleCompare}
              />
            ))}
          </div>
        </div>
      )}

      {groups.every((g) => g.sites.length === 0) && untagged.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-(--fg-tertiary) text-sm">No sites found</div>
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SitesListPage() {
  const navigate = useNavigate();
  const { data: sites = [], isLoading, isError } = useSites();
  const { data: allTags = [] } = useTags();
  const token = useAuthStore((s) => s.token);

  const [search, setSearch] = useState("");
  const [rating, setRating] = useState<Rating | "all">("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [view, setView] = useState<"grid" | "list" | "group">("grid");
  const [page, setPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagOperator, setTagOperator] = useState<"AND" | "OR">("OR");
  const [compareSelection, setCompareSelection] = useState<string[]>([]);
  const [compareMaxWarning, setCompareMaxWarning] = useState(false);

  function toggleCompare(domain: string) {
    setCompareSelection((prev) => {
      if (prev.includes(domain)) return prev.filter((d) => d !== domain);
      if (prev.length >= 3) {
        setCompareMaxWarning(true);
        setTimeout(() => setCompareMaxWarning(false), 2000);
        return prev;
      }
      return [...prev, domain];
    });
  }

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
    setPage(1);
  };

  const filtered = sites
    .filter((s) => {
      const matchSearch =
        s.domain.toLowerCase().includes(search.toLowerCase()) ||
        (s.name ?? "").toLowerCase().includes(search.toLowerCase());
      const matchRating = rating === "all" || s.current_rating === rating;
      const matchTags =
        selectedTags.length === 0
          ? true
          : tagOperator === "OR"
            ? selectedTags.some((id) => s.tags.some((t) => t.id === id))
            : selectedTags.every((id) => s.tags.some((t) => t.id === id));
      return matchSearch && matchRating && matchTags;
    })
    .sort((a, b) => {
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

  const resetPage = () => setPage(1);
  const handleSearch = (value: string) => {
    setSearch(value);
    resetPage();
  };
  const handleRating = (value: Rating | "all") => {
    setRating(value);
    resetPage();
  };
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
    resetPage();
  };

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? (
      <ChevronUp size={12} />
    ) : (
      <ChevronDown size={12} />
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm text-(--fg-tertiary)">
          Failed to load sites. Is the backend running?
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ── Filters row ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-(--fg-tertiary)"
          />
          <input
            type="text"
            placeholder="Search sites..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-(--surface) border border-(--border) rounded-md text-(--fg) placeholder:text-(--fg-tertiary) focus:outline-none focus:border-(--border-strong)"
          />
        </div>

        <select
          value={rating}
          onChange={(e) => handleRating(e.target.value as Rating | "all")}
          className="px-3 py-2 text-sm bg-(--surface) border border-(--border) rounded-md text-(--fg) focus:outline-none focus:border-(--border-strong)"
        >
          {RATING_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

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

        <div className="flex gap-1 border border-(--border) rounded-md p-0.5 bg-(--surface)">
          {(["grid", "list", "group"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`p-1.5 rounded transition-colors ${view === v ? "bg-primary-subtle text-primary" : "text-(--fg-tertiary) hover:text-(--fg)"}`}
              title={v.charAt(0).toUpperCase() + v.slice(1)}
            >
              {v === "grid" ? (
                <LayoutGrid size={14} />
              ) : v === "list" ? (
                <List size={14} />
              ) : (
                <Layers size={14} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tag chips ── */}
      {token && allTags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {allTags.map((tag) => {
            const active = selectedTags.includes(tag.id);
            return (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all"
                style={{
                  background: active ? tag.color + "22" : "transparent",
                  color: active ? tag.color : "var(--fg-secondary)",
                  borderColor: active ? tag.color + "66" : "var(--border)",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: tag.color }}
                />
                {tag.name}
              </button>
            );
          })}
          {selectedTags.length >= 2 && (
            <button
              onClick={() => setTagOperator((o) => (o === "OR" ? "AND" : "OR"))}
              className="px-2.5 py-1 rounded-full text-xs font-semibold border border-(--border) text-(--fg-secondary) hover:text-(--fg) hover:border-(--border-strong) transition-colors"
            >
              {tagOperator}
            </button>
          )}
          {selectedTags.length > 0 && (
            <button
              onClick={() => setSelectedTags([])}
              className="text-xs text-(--fg-tertiary) hover:text-(--fg) transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      )}

      <div className="text-xs text-(--fg-tertiary)">
        {filtered.length} site{filtered.length !== 1 ? "s" : ""} found
        {totalPages > 1 && ` — page ${page} of ${totalPages}`}
      </div>

      {/* ── Content ── */}
      {view === "group" ? (
        <GroupedView
          sites={filtered}
          selectedTags={selectedTags}
          compareSelection={compareSelection}
          onToggleCompare={toggleCompare}
        />
      ) : filtered.length > 0 ? (
        view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.map((site) => (
              <SiteCard
                key={site.id}
                site={site}
                compareSelected={compareSelection.includes(site.domain)}
                onToggleCompare={toggleCompare}
              />
            ))}
          </div>
        ) : (
          <div className="bg-(--surface) border border-(--border) rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-(--border) bg-(--bg-secondary)">
                  <th className="px-4 py-3 w-8" />
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
                    Tags
                  </th>
                  <th className="text-left text-xs font-medium text-(--fg-tertiary) px-4 py-3 uppercase tracking-wide">
                    Analyzed
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--border)">
                {paginated.map((site) => (
                  <tr
                    key={site.id}
                    onClick={() => navigate(`/sites/${site.domain}`)}
                    className="hover:bg-(--bg-secondary) cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={compareSelection.includes(site.domain)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleCompare(site.domain);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="accent-primary"
                      />
                    </td>
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
                    <td className="px-4 py-3 hidden md:table-cell">
                      {site.tags.length > 0 ? (
                        site.tags.map((t) => (
                          <span
                            key={t.id}
                            style={{
                              backgroundColor: t.color + "22",
                              color: t.color,
                            }}
                            className="text-xs font-medium px-2 py-0.5 rounded-full mr-1"
                          >
                            {t.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-(--fg-tertiary)">—</span>
                      )}
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

      {/* ── Pagination ── */}
      {view !== "group" && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm rounded-md border border-(--border) text-(--fg-secondary) hover:border-(--border-strong) disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
              )
              .reduce<(number | "...")[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span
                    key={`dots-${i}`}
                    className="px-2 py-1.5 text-sm text-(--fg-tertiary)"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`w-8 h-8 text-sm rounded-md border transition-colors ${
                      page === p
                        ? "bg-primary text-white border-primary"
                        : "border-(--border) text-(--fg-secondary) hover:border-(--border-strong)"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm rounded-md border border-(--border) text-(--fg-secondary) hover:border-(--border-strong) disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      )}

      {/* ── Compare sticky bar ── */}
      {compareSelection.length >= 2 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-(--surface) border border-(--border-strong) shadow-lg">
          <span className="text-sm text-(--fg-secondary)">
            {compareSelection.length} sites selected
          </span>
          {compareMaxWarning && (
            <span className="text-xs text-high-text">Max 3 sites</span>
          )}
          <button
            onClick={() => setCompareSelection([])}
            className="text-xs text-(--fg-tertiary) hover:text-(--fg) transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() =>
              navigate(
                `/compare?${compareSelection.map((d) => `d=${d}`).join("&")}`,
              )
            }
            className="px-4 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Compare →
          </button>
        </div>
      )}
    </div>
  );
}
