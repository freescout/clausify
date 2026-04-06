import type { SiteListItem, SiteDetail, CgvVersion } from "@/types";

const BASE =
  (import.meta.env.VITE_API_BASE as string) || "http://localhost:3000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("clausify_token");

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`API error ${res.status}: ${message}`);
  }

  return res.json();
}

export async function fetchSites(): Promise<SiteListItem[]> {
  return request<SiteListItem[]>("/api/sites");
}

export async function fetchSiteHistory(domain: string): Promise<SiteDetail> {
  return request<SiteDetail>(`/api/sites/${domain}/history`);
}

export async function fetchSiteHistoryDetail(
  domain: string,
  historyId: string,
): Promise<CgvVersion> {
  return request<CgvVersion>(`/api/sites/${domain}/history/${historyId}`);
}

export async function analyzeUrl(url: string): Promise<void> {
  return request<void>("/api/analyze", {
    method: "POST",
    body: JSON.stringify({ url }),
  });
}
