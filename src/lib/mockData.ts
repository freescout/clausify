import type { SiteDetail, SiteListItem } from "@/types";

export const MOCK_RECENT_SITES: SiteListItem[] = [
  {
    id: "05663761-9084-4a8e-be21-dfcaee05dabc",
    domain: "fnac.com",
    name: "Fnac",
    created_at: "2026-03-26T10:35:37.378Z",
    updated_at: "2026-03-26T11:14:05.241Z",
    current_global_score: 4,
    current_rating: "red",
    clause_count: 8,
    top_concern: "personal_data",
  },
  {
    id: "4487e95f-0dcf-4210-85eb-f29fa9eda53f",
    domain: "service-public.fr",
    name: "Service-Public.fr",
    created_at: "2026-03-25T10:22:10.409Z",
    updated_at: "2026-03-25T10:22:10.409Z",
    current_global_score: 88,
    current_rating: "green",
    clause_count: 3,
    top_concern: "retention",
  },
  {
    id: "34a33539-f2f3-4137-a3e8-3f7e49193fa1",
    domain: "facebook.com",
    name: "Facebook",
    created_at: "2026-03-26T08:18:25.015Z",
    updated_at: "2026-03-26T08:18:25.543Z",
    current_global_score: 70,
    current_rating: "orange",
    clause_count: 6,
    top_concern: "third_party",
  },
  {
    id: "3e47f932-58ac-4583-b3a3-002cc0f9fd99",
    domain: "discord.com",
    name: "Discord",
    created_at: "2026-03-26T11:11:07.224Z",
    updated_at: "2026-03-26T11:11:07.612Z",
    current_global_score: 0,
    current_rating: "red",
    clause_count: 12,
    top_concern: "personal_data",
  },
  {
    id: "66580ce2-c194-42d0-8b30-52d19511ba4d",
    domain: "spotify.com",
    name: "Spotify",
    created_at: "2026-03-26T11:01:06.587Z",
    updated_at: "2026-03-26T11:51:35.774Z",
    current_global_score: 0,
    current_rating: "red",
    clause_count: 10,
    top_concern: "abusive",
  },
];

export const MOCK_DASHBOARD_STATS = {
  total_sites: 20,
  average_score: 35,
  high_risk_count: 8,
  analyzed_today: 5,
  score_distribution: [
    { range: "0–30", count: 8, rating: "green" },
    { range: "31–65", count: 6, rating: "orange" },
    { range: "66–100", count: 6, rating: "red" },
  ],
  top_risky: [] as SiteListItem[],
};

MOCK_DASHBOARD_STATS.top_risky = MOCK_RECENT_SITES.filter(
  (s) => s.current_rating === "red",
);

export const MOCK_SITE_DETAIL: SiteDetail = {
  id: "3e47f932-58ac-4583-b3a3-002cc0f9fd99",
  domain: "discord.com",
  name: "Discord",
  current_global_score: 0,
  current_rating: "red",
  created_at: "2026-03-26T11:11:07.224Z",
  updated_at: "2026-03-26T11:11:07.612Z",
  cgv_version: {
    id: "c145d7bb-06a8-42af-8f11-e8b200651fa3",
    site_id: "3e47f932-58ac-4583-b3a3-002cc0f9fd99",
    content_hash: "abc123",
    raw_text: null,
    source_url: "https://discord.com/terms",
    extracted_at: "2026-03-26T11:11:07.224Z",
  },
  latest_analysis: {
    id: "060fee96-71a3-4f05-83bf-27d3d5b568b5",
    cgv_version_id: "c145d7bb-06a8-42af-8f11-e8b200651fa3",
    global_score: 0,
    rating: "red",
    analyzed_at: "2026-03-26T12:32:29.021Z",
  },
  clauses: [
    {
      id: "1",
      analysis_id: "060fee96-71a3-4f05-83bf-27d3d5b568b5",
      clause_type: "personal_data",
      content:
        "We collect information you provide directly to us, such as when you create an account, including your username, email address, and password.",
      severity: "high",
      score_impact: -15,
    },
    {
      id: "2",
      analysis_id: "060fee96-71a3-4f05-83bf-27d3d5b568b5",
      clause_type: "third_party",
      content:
        "We may share your personal information with third-party vendors and service providers that perform services on our behalf.",
      severity: "high",
      score_impact: -20,
    },
    {
      id: "3",
      analysis_id: "060fee96-71a3-4f05-83bf-27d3d5b568b5",
      clause_type: "retention",
      content:
        "We retain personal data for as long as necessary to provide our services and fulfill the purposes outlined in this policy.",
      severity: "medium",
      score_impact: -10,
    },
    {
      id: "4",
      analysis_id: "060fee96-71a3-4f05-83bf-27d3d5b568b5",
      clause_type: "abusive",
      content:
        "Discord reserves the right to modify these terms at any time without prior notice to users.",
      severity: "high",
      score_impact: -25,
    },
    {
      id: "5",
      analysis_id: "060fee96-71a3-4f05-83bf-27d3d5b568b5",
      clause_type: "recourse",
      content:
        "You may request deletion of your personal data by contacting our support team.",
      severity: "low",
      score_impact: 5,
    },
  ],
};
