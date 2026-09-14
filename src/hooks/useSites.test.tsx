import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuthStore } from "@/stores/authStore";
import { useSites, useTags } from "./useSites";
import * as api from "@/lib/api";

vi.mock("@/lib/api", () => ({
  fetchSites: vi.fn(),
  fetchTags: vi.fn(),
  fetchSiteHistory: vi.fn(),
  fetchSiteHistoryDetail: vi.fn(),
  createTag: vi.fn(),
  deleteTag: vi.fn(),
  assignTagToSite: vi.fn(),
  removeTagFromSite: vi.fn(),
  updateTag: vi.fn(),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("query hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      token: "token-123",
      user: null,
      isLoginModalOpen: false,
    });
  });

  it("loads the site list from the API", async () => {
    const sites = [
      {
        id: "site-1",
        domain: "example.com",
        name: "Example",
        current_global_score: 72,
        current_rating: "green",
        created_at: "2025-01-01T00:00:00.000Z",
        updated_at: "2025-01-01T00:00:00.000Z",
        tags: [],
        clause_count: 4,
        top_concern: null,
      },
    ];

    vi.mocked(api.fetchSites).mockResolvedValue(sites);

    const { result } = renderHook(() => useSites(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(api.fetchSites).toHaveBeenCalledTimes(1);
    expect(result.current.data).toEqual(sites);
  });

  it("loads tags only when the user is authenticated", async () => {
    const tags = [
      {
        id: "tag-1",
        name: "Privacy",
        color: "#4ade80",
        user_id: "user-1",
        created_at: "2025-01-01T00:00:00.000Z",
      },
    ];

    vi.mocked(api.fetchTags).mockResolvedValue(tags);

    const { result } = renderHook(() => useTags(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(api.fetchTags).toHaveBeenCalledTimes(1);
    expect(result.current.data).toEqual(tags);
  });
});
