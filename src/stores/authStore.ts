import { create } from "zustand";

interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthStore {
  token: string | null;
  user: User | null;
  isLoginModalOpen: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: localStorage.getItem("clausify_token"),
  user: null,
  isLoginModalOpen: false,
  login: (token, user) => {
    localStorage.setItem("clausify_token", token);
    set({ token, user, isLoginModalOpen: false }); // auto-close on login
  },
  logout: () => {
    localStorage.removeItem("clausify_token");
    set({ token: null, user: null });
  },
  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
}));
