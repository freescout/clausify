import { useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useSites, useCompareSites } from "@/hooks/useSites";
import { CLAUSE_LABELS, SEVERITY_LABELS } from "@/lib/utils";
import type { ClauseType, SiteDetail, Clause } from "@/types";

const MAX_SITES = 3;

const CLAUSE_TYPES: ClauseType[] = [
  "personal_data",
  "third_party",
  "abusive",
  "retention",
  "recourse",
];

const ratingBar: Record<string, string> = {
  red: "bg-high",
  orange: "bg-moderate",
  green: "bg-safe",
};
const ratingText: Record<string, string> = {
  red: "text-high-text",
  orange: "text-moderate-text",
  green: "text-safe-text",
};
const ratingBg: Record<string, string> = {
  red: "bg-high-bg",
  orange: "bg-moderate-bg",
  green: "bg-safe-bg",
};
const severityScore: Record<string, string> = {
  high: "score-high",
  medium: "score-moderate",
  low: "score-safe",
};
const severityBorder: Record<string, string> = {
  high: "border-l-[var(--color-high)]",
  medium: "border-l-[var(--color-moderate)]",
  low: "border-l-[var(--color-safe)]",
};

// ─── SiteSelector ─────────────────────────────────────────────────────────────

function SiteSelector({
  selectedDomains,
  onAdd,
  onRemove,
}: {
  selectedDomains: string[];
  onAdd: (domain: string) => void;
  onRemove: (domain: string) => void;
}) {
  const { data: sites = [] } = useSites();
  const [open, setOpen] = useState(false);

  const available = sites.filter((s) => !selectedDomains.includes(s.domain));
  const canAdd = selectedDomains.length < MAX_SITES;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {selectedDomains.map((domain) => {
        const site = sites.find((s) => s.domain === domain);
        const rating = site?.current_rating ?? "green";
        return (
          <span
            key={domain}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${ratingBg[rating]} ${ratingText[rating]}`}
          >
            {site?.name ?? domain}
            <button
              onClick={() => onRemove(domain)}
              className="opacity-60 hover:opacity-100 transition-opacity"
              aria-label={`Remove ${domain}`}
            >
              <X size={12} />
            </button>
          </span>
        );
      })}

      {canAdd && (
        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border border-dashed border-(--border-strong) text-(--fg-secondary) hover:border-primary hover:text-primary transition-colors"
          >
            <Plus size={12} />
            Add site
          </button>

          {open && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setOpen(false)}
              />
              <div className="absolute top-full left-0 mt-1.5 z-20 min-w-56 max-h-72 overflow-y-auto rounded-lg bg-(--surface) border border-(--border) shadow-lg">
                {available.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-(--fg-tertiary)">
                    No more sites available
                  </p>
                ) : (
                  available.map((site) => (
                    <button
                      key={site.domain}
                      onClick={() => {
                        onAdd(site.domain);
                        setOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-(--fg) hover:bg-(--bg-secondary) transition-colors flex items-center justify-between gap-4"
                    >
                      <span>{site.name ?? site.domain}</span>
                      {site.current_global_score !== null && (
                        <span
                          className={`text-xs font-semibold ${ratingText[site.current_rating ?? "green"]}`}
                        >
                          {site.current_global_score}
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Column header ────────────────────────────────────────────────────────────

function SiteColumnHeader({
  domain,
  site,
  isLoading,
}: {
  domain: string;
  site: SiteDetail | undefined;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="p-4 flex flex-col items-center gap-2 animate-pulse">
        <div className="h-9 w-9 rounded-md bg-(--bg-tertiary)" />
        <div className="h-4 w-24 rounded bg-(--bg-tertiary)" />
        <div className="h-8 w-16 rounded-lg bg-(--bg-tertiary)" />
        <div className="w-full h-1.5 rounded-full bg-(--bg-tertiary)" />
      </div>
    );
  }

  if (!site) {
    return (
      <div className="p-4 flex flex-col items-center gap-1">
        <span className="text-sm text-(--fg-secondary)">{domain}</span>
        <span className="text-xs text-high-text">Failed to load</span>
      </div>
    );
  }

  const rating = site.current_rating ?? "green";
  const score = site.current_global_score ?? 0;

  return (
    <div className="p-4 flex flex-col items-center gap-2">
      <div
        className={`w-9 h-9 rounded-md flex items-center justify-center text-sm font-semibold shrink-0 ${ratingBg[rating]} ${ratingText[rating]}`}
      >
        {domain.charAt(0).toUpperCase()}
      </div>
      <span className="text-sm font-medium text-(--fg) text-center leading-tight">
        {site.name ?? domain}
      </span>
      <div className={`rounded-lg px-3 py-1.5 ${ratingBg[rating]}`}>
        <span
          className={`text-2xl font-bold tabular-nums ${ratingText[rating]}`}
        >
          {score}
        </span>
        <span className={`text-xs ml-0.5 opacity-70 ${ratingText[rating]}`}>
          /100
        </span>
      </div>
      <div className="w-full h-1.5 bg-(--bg-tertiary) rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${ratingBar[rating]}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

// ─── Clause cell ──────────────────────────────────────────────────────────────

function ClauseCell({
  site,
  isLoading,
  clauseType,
}: {
  site: SiteDetail | undefined;
  isLoading: boolean;
  clauseType: ClauseType;
}) {
  if (isLoading) {
    return (
      <div className="p-4 space-y-2 animate-pulse">
        <div className="h-3 w-3/4 rounded bg-(--bg-tertiary)" />
        <div className="h-3 w-1/2 rounded bg-(--bg-tertiary)" />
      </div>
    );
  }

  if (!site) {
    return (
      <div className="p-4 flex items-center justify-center text-(--fg-tertiary) text-sm">
        —
      </div>
    );
  }

  const clauses: Clause[] = (
    site.cgv_versions[0]?.analysis?.clauses ?? []
  ).filter((c) => c.clause_type === clauseType);

  if (clauses.length === 0) {
    return (
      <div className="p-4 flex items-center gap-2">
        <span className="text-safe-text">✓</span>
        <span className="text-xs text-(--fg-tertiary) italic">
          No issues found
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      {clauses.map((clause) => (
        <div
          key={clause.id}
          className={`border border-(--border) border-l-4 ${severityBorder[clause.severity]} rounded-lg p-3 space-y-1.5`}
        >
          <div className="flex items-center justify-between gap-2">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${severityScore[clause.severity]}`}
            >
              {SEVERITY_LABELS[clause.severity]}
            </span>
            <span
              className={`text-xs font-medium tabular-nums ${clause.score_impact < 0 ? "text-high-text" : "text-safe-text"}`}
            >
              {clause.score_impact > 0 ? "+" : ""}
              {clause.score_impact}
            </span>
          </div>
          <p className="text-xs text-(--fg-secondary) leading-relaxed line-clamp-3">
            {clause.content}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ onAdd }: { onAdd: (domain: string) => void }) {
  const { data: sites = [] } = useSites();
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
      <div className="text-5xl opacity-20">⚖️</div>
      <div>
        <h2 className="text-base font-medium text-(--fg)">
          Select sites to compare
        </h2>
        <p className="text-sm text-(--fg-tertiary) mt-1">
          Choose 2 to 3 sites for a side-by-side clause breakdown
        </p>
      </div>
      {sites.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 max-w-sm">
          {sites.slice(0, 6).map((site) => (
            <button
              key={site.domain}
              onClick={() => onAdd(site.domain)}
              className="px-3 py-1.5 rounded-full border border-(--border) text-sm text-(--fg-secondary) hover:border-primary hover:text-primary transition-colors"
            >
              {site.name ?? site.domain}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ComparePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedDomains = useMemo(
    () => searchParams.getAll("d").slice(0, MAX_SITES),
    [searchParams],
  );

  const siteQueries = useCompareSites(selectedDomains);

  function addDomain(domain: string) {
    if (selectedDomains.length >= MAX_SITES) return;
    setSearchParams(
      [...selectedDomains, domain].map((d) => ["d", d] as [string, string]),
    );
  }

  function removeDomain(domain: string) {
    setSearchParams(
      selectedDomains
        .filter((d) => d !== domain)
        .map((d) => ["d", d] as [string, string]),
    );
  }

  const gridStyle = {
    gridTemplateColumns: `180px repeat(${selectedDomains.length}, minmax(0, 1fr))`,
  } as React.CSSProperties;

  return (
    <div className="space-y-4">
      <button
        onClick={() => navigate("/sites")}
        className="flex items-center gap-1.5 text-sm text-(--fg-tertiary) hover:text-(--fg) transition-colors"
      >
        <ArrowLeft size={14} />
        Back to sites
      </button>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-lg font-display font-semibold text-(--fg)">
          Compare
        </h1>
        <SiteSelector
          selectedDomains={selectedDomains}
          onAdd={addDomain}
          onRemove={removeDomain}
        />
      </div>

      {selectedDomains.length < 2 ? (
        <EmptyState onAdd={addDomain} />
      ) : (
        <div className="rounded-lg border border-(--border) overflow-x-auto bg-(--surface)">
          <div className="min-w-150">
            {/* Score header row */}
            <div
              className="grid border-b border-(--border) bg-(--bg-secondary)"
              style={gridStyle}
            >
              <div className="p-4 border-r border-(--border) flex items-end pb-3">
                <span className="text-xs font-medium text-(--fg-tertiary) uppercase tracking-wide">
                  Global score
                </span>
              </div>
              {siteQueries.map(({ domain, query }) => (
                <div
                  key={domain}
                  className="border-r border-(--border) last:border-r-0"
                >
                  <SiteColumnHeader
                    domain={domain}
                    site={query.data}
                    isLoading={query.isLoading}
                  />
                </div>
              ))}
            </div>

            {/* Clause rows */}
            {CLAUSE_TYPES.map((type, i) => (
              <div
                key={type}
                className={`grid ${i < CLAUSE_TYPES.length - 1 ? "border-b border-(--border)" : ""}`}
                style={gridStyle}
              >
                <div className="p-4 border-r border-(--border) bg-(--bg-secondary) flex flex-col justify-start gap-0.5">
                  <span className="text-sm font-medium text-(--fg)">
                    {CLAUSE_LABELS[type]}
                  </span>
                  <span className="text-xs text-(--fg-tertiary) font-mono">
                    {type}
                  </span>
                </div>
                {siteQueries.map(({ domain, query }) => (
                  <div
                    key={domain}
                    className="border-r border-(--border) last:border-r-0"
                  >
                    <ClauseCell
                      site={query.data}
                      isLoading={query.isLoading}
                      clauseType={type}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
