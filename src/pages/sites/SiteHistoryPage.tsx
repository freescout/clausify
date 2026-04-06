import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  TrendingDown,
  TrendingUp,
  Minus,
} from "lucide-react";
import { useSiteDetail } from "@/hooks/useSites";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import type { Analysis, CgvVersion } from "@/types";

type VersionWithAnalysis = CgvVersion & { analysis: Analysis | null };

function RatingBadge({ rating }: { rating: string }) {
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

function ScoreTrend({ versions }: { versions: VersionWithAnalysis[] }) {
  const scores = versions
    .filter((v) => v.analysis)
    .map((v) => v.analysis!.global_score)
    .reverse();

  if (scores.length < 2) return null;

  const first = scores[0];
  const last = scores[scores.length - 1];
  const delta = last - first;

  const Icon = delta < 0 ? TrendingDown : delta > 0 ? TrendingUp : Minus;
  const color =
    delta < 0
      ? "text-high-text"
      : delta > 0
        ? "text-safe-text"
        : "text-(--fg-tertiary)";

  return (
    <div className="bg-(--surface) border border-(--border) rounded-lg p-4">
      <h3 className="text-sm font-medium text-(--fg) mb-3">Score trend</h3>
      <div className="flex items-center gap-3">
        <Icon size={20} className={color} />
        <div>
          <div className={`text-lg font-display font-semibold ${color}`}>
            {first} → {last}
          </div>
          <div className="text-xs text-(--fg-tertiary)">
            {delta < 0
              ? `Decreased by ${Math.abs(delta)} points`
              : delta > 0
                ? `Increased by ${delta} points`
                : "No change"}
          </div>
        </div>
      </div>

      {/* Mini chart */}
      <div className="flex items-end gap-1.5 mt-4 h-12">
        {scores.map((score, i) => (
          <div key={i} className="flex flex-col items-center gap-1 flex-1">
            <div
              className={`w-full rounded-t-sm ${
                score <= 30
                  ? "bg-high"
                  : score <= 65
                    ? "bg-moderate"
                    : "bg-safe"
              }`}
              style={{ height: `${Math.max((score / 100) * 40, 4)}px` }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-(--fg-tertiary)">Oldest</span>
        <span className="text-xs text-(--fg-tertiary)">Latest</span>
      </div>
    </div>
  );
}

function VersionCard({
  version,
  index,
  isLatest,
  prevScore,
  totalVersions,
}: {
  version: VersionWithAnalysis;
  index: number;
  isLatest: boolean;
  prevScore: number | null;
  totalVersions: number;
}) {
  const analysis = version.analysis;
  const score = analysis?.global_score ?? null;
  const rating = analysis?.rating ?? null;

  const scoreDelta =
    score !== null && prevScore !== null ? score - prevScore : null;

  const barColor: Record<string, string> = {
    red: "bg-high",
    orange: "bg-moderate",
    green: "bg-safe",
  };

  return (
    <div className="relative flex gap-4">
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        <div
          className={`w-3 h-3 rounded-full shrink-0 mt-1 border-2 ${
            isLatest
              ? "bg-primary border-primary"
              : "bg-(--bg-secondary) border-(--border-strong)"
          }`}
        />
        {index < totalVersions - 1 && (
          <div className="w-px flex-1 bg-(--border) mt-1" />
        )}
      </div>

      {/* Card */}
      <div className="flex-1 bg-(--surface) border border-(--border) rounded-lg p-4 mb-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-(--fg)">
                Version {totalVersions - index}
              </span>
              {isLatest && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary-subtle text-primary">
                  Latest
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="flex items-center gap-1 text-xs text-(--fg-tertiary)">
                <Clock size={11} />
                {formatDate(version.extracted_at)}
              </span>
              <span className="text-xs text-(--fg-tertiary)">
                {formatRelativeTime(version.extracted_at)}
              </span>
              {version.source_url && (
                <a
                  href={version.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <ExternalLink size={11} />
                  Source
                </a>
              )}
            </div>
          </div>

          {/* Score */}
          {score !== null && rating && (
            <div className="flex items-center gap-2">
              {scoreDelta !== null && (
                <span
                  className={`text-xs font-medium ${
                    scoreDelta < 0
                      ? "text-high-text"
                      : scoreDelta > 0
                        ? "text-safe-text"
                        : "text-(--fg-tertiary)"
                  }`}
                >
                  {scoreDelta > 0 ? "+" : ""}
                  {scoreDelta}
                </span>
              )}
              <RatingBadge rating={rating} />
              <span className="text-sm font-semibold text-(--fg)">{score}</span>
            </div>
          )}
        </div>

        {/* Score bar */}
        {score !== null && rating && (
          <div className="mt-3 h-1.5 bg-(--bg-tertiary) rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${barColor[rating]}`}
              style={{ width: `${score}%` }}
            />
          </div>
        )}

        {!analysis && (
          <div className="mt-2 text-xs text-(--fg-tertiary) italic">
            Not yet analyzed
          </div>
        )}
      </div>
    </div>
  );
}

export default function SiteHistoryPage() {
  const { domain } = useParams<{ domain: string }>();
  const navigate = useNavigate();
  const { data: site, isLoading, isError } = useSiteDetail(domain!);

  if (isLoading)
    return <div className="text-sm text-(--fg-tertiary)">Loading...</div>;
  if (isError || !site)
    return <div className="text-sm text-(--fg-tertiary)">Site not found.</div>;

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate(`/sites/${domain}`)}
        className="flex items-center gap-1.5 text-sm text-(--fg-tertiary) hover:text-(--fg) transition-colors"
      >
        <ArrowLeft size={14} />
        Back to {site.name ?? site.domain}
      </button>

      {/* Header */}
      <div className="bg-(--surface) border border-(--border) rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-high-bg flex items-center justify-center text-sm font-bold text-high-text shrink-0">
            {site.domain.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-base font-semibold text-(--fg)">
              {site.name ?? site.domain}
            </h2>
            <p className="text-xs text-(--fg-tertiary)">
              {site.cgv_versions.length} versions tracked
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="lg:col-span-2">
          <h3 className="text-sm font-medium text-(--fg) mb-4">
            Version timeline
          </h3>
          <div className="pl-2">
            {site.cgv_versions.map((version, index) => (
              <VersionCard
                key={version.id}
                version={version}
                index={index}
                isLatest={index === 0}
                prevScore={
                  site.cgv_versions[index + 1]?.analysis?.global_score ?? null
                }
                totalVersions={site.cgv_versions.length}
              />
            ))}
          </div>
        </div>

        {/* Trend */}
        <div>
          <ScoreTrend versions={site.cgv_versions} />
        </div>
      </div>
    </div>
  );
}
