import { useSites } from "@/hooks/useSites";
import { CLAUSE_LABELS, formatRelativeTime } from "@/lib/utils";
import type { SiteListItem } from "@/types";

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="bg-(--surface) border border-(--border) rounded-lg p-4">
      <div className="text-xs text-(--fg-tertiary) uppercase tracking-wide mb-2">
        {label}
      </div>
      <div className="text-2xl font-display font-semibold text-(--fg)">
        {value}
      </div>
      {sub && <div className="text-xs text-(--fg-tertiary) mt-1">{sub}</div>}
    </div>
  );
}

function ScoreDistribution({
  distribution,
}: {
  distribution: { range: string; rating: string; count: number }[];
}) {
  const max = Math.max(...distribution.map((d) => d.count), 1);

  const barColor: Record<string, string> = {
    green: "bg-safe",
    orange: "bg-moderate",
    red: "bg-high",
  };

  return (
    <div className="bg-(--surface) border border-(--border) rounded-lg p-4">
      <h3 className="text-sm font-medium text-(--fg) mb-4">
        Score distribution
      </h3>
      <div className="flex items-end gap-3 h-28">
        {distribution.map((d) => (
          <div
            key={d.range}
            className="flex flex-col items-center gap-1 flex-1"
          >
            <span className="text-xs text-(--fg-secondary)">{d.count}</span>
            <div
              className={`w-full rounded-t-sm ${barColor[d.rating]}`}
              style={{ height: `${(d.count / max) * 80}px` }}
            />
            <span className="text-xs text-(--fg-tertiary)">{d.range}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-4">
        {[
          { label: "Safe", color: "bg-safe" },
          { label: "Moderate", color: "bg-moderate" },
          { label: "High risk", color: "bg-high" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-sm ${color}`} />
            <span className="text-xs text-(--fg-tertiary)">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopRiskySites({ sites }: { sites: SiteListItem[] }) {
  const ratingColor: Record<string, string> = {
    red: "text-high",
    orange: "text-moderate",
    green: "text-safe",
  };

  return (
    <div className="bg-(--surface) border border-(--border) rounded-lg p-4">
      <h3 className="text-sm font-medium text-(--fg) mb-4">Top risky sites</h3>
      <div className="space-y-3">
        {sites.map((site) => (
          <div key={site.id} className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-(--bg-secondary) flex items-center justify-center text-xs font-medium text-(--fg-secondary) shrink-0">
              {site.domain.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-(--fg) flex-1 truncate">
              {site.domain}
            </span>
            <div className="w-16 h-1.5 bg-(--bg-tertiary) rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${site.current_rating === "red" ? "bg-high" : site.current_rating === "orange" ? "bg-moderate" : "bg-safe"}`}
                style={{
                  width: `${Math.max(site.current_global_score ?? 0, 3)}%`,
                }}
              />
            </div>
            <span
              className={`text-xs font-medium w-6 text-right ${ratingColor[site.current_rating ?? "green"]}`}
            >
              {site.current_global_score ?? "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentAnalyses({ sites }: { sites: SiteListItem[] }) {
  const ratingBg: Record<string, string> = {
    red: "score-high",
    orange: "score-moderate",
    green: "score-safe",
  };

  return (
    <div className="bg-(--surface) border border-(--border) rounded-lg">
      <div className="flex items-center justify-between px-4 py-3 border-b border-(--border)">
        <h3 className="text-sm font-medium text-(--fg)">Recent analyses</h3>
        <a href="/sites" className="text-xs text-primary hover:underline">
          View all →
        </a>
      </div>
      <div className="divide-y divide-(--border)">
        {sites.map((site) => (
          <div
            key={site.id}
            className="flex items-center gap-4 px-4 py-3 hover:bg-(--bg-secondary) transition-colors"
          >
            <div className="w-7 h-7 rounded-md bg-(--bg-secondary) flex items-center justify-center text-xs font-medium text-(--fg-secondary) shrink-0">
              {site.domain.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-(--fg) flex-1 truncate">
              {site.name ?? site.domain}
            </span>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${ratingBg[site.current_rating ?? "green"]}`}
            >
              {site.current_global_score ?? "—"}
            </span>
            <span className="text-xs text-(--fg-tertiary) w-20 text-right hidden sm:block">
              {site.clause_count} clause{site.clause_count !== 1 ? "s" : ""}
            </span>
            {site.top_concern && (
              <span className="text-xs text-(--fg-tertiary) hidden md:block w-28 truncate">
                {CLAUSE_LABELS[site.top_concern]}
              </span>
            )}
            <span className="text-xs text-(--fg-tertiary) w-20 text-right">
              {formatRelativeTime(site.created_at)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: sites = [], isLoading, isError } = useSites();

  if (isLoading)
    return <div className="text-sm text-(--fg-tertiary)">Loading...</div>;
  if (isError)
    return (
      <div className="text-sm text-(--fg-tertiary)">
        Failed to load dashboard.
      </div>
    );

  const analyzedSites = sites.filter((s) => s.current_global_score !== null);
  const totalSites = sites.length;
  const averageScore = analyzedSites.length
    ? Math.round(
        analyzedSites.reduce(
          (sum, s) => sum + (s.current_global_score ?? 0),
          0,
        ) / analyzedSites.length,
      )
    : 0;
  const highRiskCount = sites.filter((s) => s.current_rating === "red").length;
  const topRisky = [...analyzedSites]
    .sort(
      (a, b) =>
        (a.current_global_score ?? 100) - (b.current_global_score ?? 100),
    )
    .slice(0, 5);
  const scoreDistribution = [
    {
      range: "0–30",
      rating: "red",
      count: sites.filter(
        (s) =>
          (s.current_global_score ?? 0) <= 30 &&
          s.current_global_score !== null,
      ).length,
    },
    {
      range: "31–65",
      rating: "orange",
      count: sites.filter(
        (s) =>
          (s.current_global_score ?? 0) > 30 &&
          (s.current_global_score ?? 0) <= 65,
      ).length,
    },
    {
      range: "66–100",
      rating: "green",
      count: sites.filter((s) => (s.current_global_score ?? 0) > 65).length,
    },
  ];
  const recentSites = [...sites]
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    )
    .slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total sites" value={totalSites} />
        <StatCard label="Average score" value={averageScore} />
        <StatCard label="High risk" value={highRiskCount} sub="Score 0–30" />
        <StatCard
          label="Analyzed"
          value={analyzedSites.length}
          sub={`${totalSites - analyzedSites.length} pending`}
        />
      </div>

      {/* Chart + risky sites */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ScoreDistribution distribution={scoreDistribution} />
        <TopRiskySites sites={topRisky} />
      </div>

      {/* Recent analyses */}
      <RecentAnalyses sites={recentSites} />
    </div>
  );
}
