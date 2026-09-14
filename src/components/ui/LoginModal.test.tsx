import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import LoginModal from "./LoginModal";
import { useAuthStore } from "@/stores/authStore";
import * as api from "@/lib/api";

vi.mock("@/lib/api", () => ({
  loginUser: vi.fn(),
  registerUser: vi.fn(),
}));

describe("LoginModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    useAuthStore.setState({
      token: null,
      user: null,
      isLoginModalOpen: true,
    });
  });

  it("logs in a user with their email and password", async () => {
    const user = userEvent.setup();
    vi.mocked(api.loginUser).mockResolvedValue({
      token: "token-123",
      user: { id: "user-123", email: "alice@example.com", name: "Alice" },
    });

    render(<LoginModal />);

    await user.type(
      screen.getByPlaceholderText("Email address"),
      "alice@example.com",
    );
    await user.type(screen.getByPlaceholderText("Password"), "super-secret");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(api.loginUser).toHaveBeenCalledWith(
        "alice@example.com",
        "super-secret",
      );
    });

    await waitFor(() => {
      expect(useAuthStore.getState().token).toBe("token-123");
      expect(useAuthStore.getState().user).toMatchObject({
        id: "user-123",
        email: "alice@example.com",
        name: "Alice",
      });
    });
  });
});
