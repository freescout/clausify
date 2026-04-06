import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, Clock } from "lucide-react";
import { useSiteDetail } from "@/hooks/useSites";
import {
  CLAUSE_LABELS,
  SEVERITY_LABELS,
  formatDate,
  formatRelativeTime,
} from "@/lib/utils";
import type { Clause, ClauseType } from "@/types";

function ScoreGauge({ score, rating }: { score: number; rating: string }) {
  const color: Record<string, string> = {
    red: "bg-high",
    orange: "bg-moderate",
    green: "bg-safe",
  };
  const textColor: Record<string, string> = {
    red: "text-high-text",
    orange: "text-moderate-text",
    green: "text-safe-text",
  };
  const bgColor: Record<string, string> = {
    red: "bg-high-bg",
    orange: "bg-moderate-bg",
    green: "bg-safe-bg",
  };
  const label: Record<string, string> = {
    red: "High risk",
    orange: "Moderate",
    green: "Safe",
  };

  return (
    <div className={`rounded-lg p-4 ${bgColor[rating]}`}>
      <div className="flex items-end gap-1 mb-2">
        <span
          className={`text-4xl font-display font-bold ${textColor[rating]}`}
        >
          {score}
        </span>
        <span className={`text-sm mb-1 ${textColor[rating]} opacity-70`}>
          /100
        </span>
      </div>
      <div className="h-2 bg-(--bg-tertiary) rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full ${color[rating]}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-sm font-medium ${textColor[rating]}`}>
        {label[rating]}
      </span>
    </div>
  );
}

function ClauseCard({ clause }: { clause: Clause }) {
  const severityBg: Record<string, string> = {
    high: "score-high",
    medium: "score-moderate",
    low: "score-safe",
  };
  const borderColor: Record<string, string> = {
    high: "border-l-[var(--color-high)]",
    medium: "border-l-[var(--color-moderate)]",
    low: "border-l-[var(--color-safe)]",
  };

  return (
    <div
      className={`bg-(--surface) border border-(--border) border-l-4 ${borderColor[clause.severity]} rounded-lg p-4`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="text-xs font-medium text-(--fg-secondary) uppercase tracking-wide">
          {CLAUSE_LABELS[clause.clause_type]}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${severityBg[clause.severity]}`}
          >
            {SEVERITY_LABELS[clause.severity]}
          </span>
          <span
            className={`text-xs font-medium ${clause.score_impact < 0 ? "text-high-text" : "text-safe-text"}`}
          >
            {clause.score_impact > 0 ? "+" : ""}
            {clause.score_impact}
          </span>
        </div>
      </div>
      <p className="text-sm text-(--fg-secondary) leading-relaxed">
        {clause.content}
      </p>
    </div>
  );
}

function ClausesByCategory({ clauses }: { clauses: Clause[] }) {
  const grouped = clauses.reduce<Record<ClauseType, Clause[]>>(
    (acc, clause) => {
      if (!acc[clause.clause_type]) acc[clause.clause_type] = [];
      acc[clause.clause_type].push(clause);
      return acc;
    },
    {} as Record<ClauseType, Clause[]>,
  );

  return (
    <div className="space-y-6">
      {(Object.entries(grouped) as [ClauseType, Clause[]][]).map(
        ([type, clauses]) => (
          <div key={type}>
            <h3 className="text-sm font-medium text-(--fg) mb-3 flex items-center gap-2">
              {CLAUSE_LABELS[type]}
              <span className="text-xs text-(--fg-tertiary) font-normal">
                {clauses.length} clause{clauses.length > 1 ? "s" : ""}
              </span>
            </h3>
            <div className="space-y-3">
              {clauses.map((clause) => (
                <ClauseCard key={clause.id} clause={clause} />
              ))}
            </div>
          </div>
        ),
      )}
    </div>
  );
}

function ScoreBreakdown({ clauses }: { clauses: Clause[] }) {
  const byType = clauses.reduce<Record<string, number>>((acc, clause) => {
    acc[clause.clause_type] =
      (acc[clause.clause_type] ?? 0) + clause.score_impact;
    return acc;
  }, {});

  return (
    <div className="bg-(--surface) border border-(--border) rounded-lg p-4">
      <h3 className="text-sm font-medium text-(--fg) mb-1">Score breakdown</h3>
      <p className="text-xs text-(--fg-tertiary) mb-4">
        Impact per clause category
      </p>
      <div className="space-y-3">
        {Object.entries(byType).map(([type, impact]) => (
          <div key={type} className="flex items-center justify-between">
            <span className="text-xs text-(--fg-secondary)">
              {CLAUSE_LABELS[type as ClauseType]}
            </span>
            <span
              className={`text-xs font-medium ${impact < 0 ? "text-high-text" : "text-safe-text"}`}
            >
              {impact > 0 ? "+" : ""}
              {impact}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SiteDetailPage() {
  const { domain } = useParams<{ domain: string }>();
  const navigate = useNavigate();
  const { data: site, isLoading, isError } = useSiteDetail(domain!);

  if (isLoading)
    return <div className="text-sm text-(--fg-tertiary)">Loading...</div>;
  if (isError || !site)
    return <div className="text-sm text-(--fg-tertiary)">Site not found.</div>;

  const rating = site.current_rating ?? "green";
  const score = site.current_global_score ?? 0;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-(--fg-tertiary) hover:text-(--fg) transition-colors"
      >
        <ArrowLeft size={14} />
        Back to sites
      </button>

      {/* Site header */}
      <div className="bg-(--surface) border border-(--border) rounded-lg p-5">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold shrink-0
            ${
              rating === "red"
                ? "bg-high-bg text-high-text"
                : rating === "orange"
                  ? "bg-moderate-bg text-moderate-text"
                  : "bg-safe-bg text-safe-text"
            }`}
          >
            {site.domain.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-display font-semibold text-(--fg)">
              {site.name ?? site.domain}
            </h2>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="text-sm text-(--fg-tertiary)">
                {site.domain}
              </span>
              {site.cgv_versions[0]?.source_url && (
                <a
                  href={site.cgv_versions[0].source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <ExternalLink size={11} />
                  View T&C
                </a>
              )}
              <span className="flex items-center gap-1 text-xs text-(--fg-tertiary)">
                <Clock size={11} />
                Analyzed{" "}
                {formatRelativeTime(
                  site.cgv_versions[0]?.analysis?.analyzed_at ??
                    site.created_at,
                )}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate(`/sites/${domain}/history`)}
            className="flex items-center gap-1.5 text-xs text-(--fg-secondary) hover:text-(--fg) border border-(--border) px-3 py-1.5 rounded-md hover:border-(--border-strong) transition-colors"
          >
            <Clock size={12} />
            View history
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clauses — left/main */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-(--fg)">
              {site.cgv_versions[0]?.analysis?.clauses?.length ?? 0} clause
              {(site.cgv_versions[0]?.analysis?.clauses?.length ?? 0) !== 1
                ? "s"
                : ""}
            </h3>
            <span className="text-xs text-(--fg-tertiary)">
              Analyzed on{" "}
              {formatDate(
                site.cgv_versions[0]?.analysis?.analyzed_at ?? site.created_at,
              )}
            </span>
          </div>
          <ClausesByCategory
            clauses={site.cgv_versions[0]?.analysis?.clauses ?? []}
          />
        </div>

        {/* Score — right sidebar */}
        <div className="space-y-4">
          <ScoreGauge score={score} rating={rating} />
          <ScoreBreakdown
            clauses={site.cgv_versions[0]?.analysis?.clauses ?? []}
          />
        </div>
      </div>
    </div>
  );
}
