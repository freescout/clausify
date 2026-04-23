import type { SiteListItem, SiteDetail, CgvVersion, Tag } from "@/types";

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

export async function loginUser(email: string, password: string) {
  return request<{
    token: string;
    user: { id: number; email: string; name: string };
  }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerUser(
  email: string,
  password: string,
  name: string,
) {
  return request<{
    token: string;
    user: { id: number; email: string; name: string };
  }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  });
}

export async function fetchTags(): Promise<Tag[]> {
  return request<Tag[]>("/api/tags");
}

export async function createTag(name: string, color: string): Promise<Tag> {
  return request<Tag>("/api/tags", {
    method: "POST",
    body: JSON.stringify({ name, color }),
  });
}

export async function deleteTag(tagId: string): Promise<void> {
  return request<void>(`/api/tags/${tagId}`, { method: "DELETE" });
}

export async function assignTagToSite(
  tagId: string,
  siteId: string,
): Promise<void> {
  return request<void>(`/api/tags/${tagId}/sites/${siteId}`, {
    method: "POST",
  });
}

export async function removeTagFromSite(
  tagId: string,
  siteId: string,
): Promise<void> {
  return request<void>(`/api/tags/${tagId}/sites/${siteId}`, {
    method: "DELETE",
  });
}

export async function updateTag(
  tagId: string,
  data: { name?: string; color?: string },
): Promise<Tag> {
  return request<Tag>(`/api/tags/${tagId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
