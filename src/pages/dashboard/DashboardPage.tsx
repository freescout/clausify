import { MOCK_DASHBOARD_STATS, MOCK_RECENT_SITES } from "@/lib/mockData";
import { CLAUSE_LABELS, formatRelativeTime, getRatingLabel } from "@/lib/utils";
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

function ScoreDistribution() {
  const { score_distribution } = MOCK_DASHBOARD_STATS;
  const max = Math.max(...score_distribution.map((d) => d.count));

  const barColor: Record<string, string> = {
    green: "bg-(--color-safe)",
    orange: "bg-(--color-moderate)",
    red: "bg-(--color-high)",
  };

  return (
    <div className="bg-(--surface) border border-(--border) rounded-lg p-4">
      <h3 className="text-sm font-medium text-(--fg) mb-4">
        Score distribution
      </h3>
      <div className="flex items-end gap-3 h-28">
        {score_distribution.map((d) => (
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
          { label: "Safe", color: "bg-(--color-safe)" },
          { label: "Moderate", color: "bg-(--color-moderate)" },
          { label: "High risk", color: "bg-(--color-high)" },
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
    red: "text-(--color-high)",
    orange: "text-(--color-moderate)",
    green: "text-(--color-safe)",
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
                className={`h-full rounded-full ${site.current_rating === "red" ? "bg-(--color-high)" : site.current_rating === "orange" ? "bg-(--color-moderate)" : "bg-(--color-safe)"}`}
                style={{ width: `${site.current_global_score ?? 0}%` }}
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
              {site.clause_count} clauses
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
  const stats = MOCK_DASHBOARD_STATS;

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Total sites"
          value={stats.total_sites}
          sub="+8 this week"
        />
        <StatCard
          label="Average score"
          value={stats.average_score}
          sub={getRatingLabel(
            stats.average_score <= 30
              ? "green"
              : stats.average_score <= 65
                ? "orange"
                : "red",
          )}
        />
        <StatCard
          label="High risk"
          value={stats.high_risk_count}
          sub="Score > 65"
        />
        <StatCard
          label="Analyzed today"
          value={stats.analyzed_today}
          sub="Last: 14 min ago"
        />
      </div>

      {/* Chart + risky sites */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ScoreDistribution />
        <TopRiskySites sites={stats.top_risky} />
      </div>

      {/* Recent analyses */}
      <RecentAnalyses sites={MOCK_RECENT_SITES} />
    </div>
  );
}
