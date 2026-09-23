import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import TagPopover from "./TagPopover";
import { useAuthStore } from "../../stores/authStore";
import * as hooks from "../../hooks/useSites";
import type { SiteListItem } from "../../types";

vi.mock("../../hooks/useSites", async () => {
  const actual = await vi.importActual<typeof import("../../hooks/useSites")>(
    "../../hooks/useSites",
  );

  return {
    ...actual,
    useTags: vi.fn(),
    useCreateTag: vi.fn(),
    useAssignTag: vi.fn(),
    useRemoveTag: vi.fn(),
  };
});

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("TagPopover", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      token: "token-123",
      user: null,
      isLoginModalOpen: false,
    });
  });

  it("opens and assigns a tag when the user clicks it", async () => {
    const user = userEvent.setup();
    const assignTag = { mutate: vi.fn(), isPending: false };
    const removeTag = { mutate: vi.fn(), isPending: false };
    const createTag = { mutateAsync: vi.fn(), isPending: false };

    vi.mocked(hooks.useTags).mockReturnValue({
      data: [
        {
          id: "tag-1",
          name: "Privacy",
          color: "#4ade80",
          user_id: "user-1",
          created_at: "2025-01-01T00:00:00.000Z",
        },
      ],
      isLoading: false,
      error: null,
      isError: false,
      isPending: false,
      isSuccess: true,
      status: "success",
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      fetchStatus: "idle",
      isFetched: true,
      isFetchedAfterMount: true,
      isFetching: false,
      isInitialLoading: false,
      isLoadingError: false,
      isPlaceholderData: false,
      isRefetchError: false,
      isRefetching: false,
      isStale: false,
      refetch: vi.fn(),
      submit: vi.fn(),
      remove: vi.fn(),
      promise: Promise.resolve([]),
    } as unknown as ReturnType<typeof hooks.useTags>);
    vi.mocked(hooks.useAssignTag).mockReturnValue(
      assignTag as unknown as ReturnType<typeof hooks.useAssignTag>,
    );
    vi.mocked(hooks.useRemoveTag).mockReturnValue(
      removeTag as unknown as ReturnType<typeof hooks.useRemoveTag>,
    );
    vi.mocked(hooks.useCreateTag).mockReturnValue(
      createTag as unknown as ReturnType<typeof hooks.useCreateTag>,
    );

    const site: SiteListItem = {
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
    };

    renderWithClient(<TagPopover site={site} />);

    await user.click(screen.getByRole("button", { name: /\+ add tag/i }));
    await user.click(screen.getByRole("button", { name: /privacy/i }));

    expect(assignTag.mutate).toHaveBeenCalledWith({
      tagId: "tag-1",
      siteId: "site-1",
    });
  });
});
