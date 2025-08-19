import { create } from "zustand";

interface User {
  id: string;
  email: string;
  name: string;
  [key: string]: unknown;
}

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string | null, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (isLoading: boolean) => void;
  hydrate: () => Promise<void>;
};

/**
 * Store Zustand pour gérer l'authentification.
 */
export const authStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isLoading: false,
  login: (accessToken: string, refreshToken: string | null, user: User) => {
    set({ accessToken, refreshToken, user, isLoading: false });
  },
  logout: () => {
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isLoading: false,
    });
  },
  setUser: (user: User) => {
    set({ user });
  },
  setLoading: (isLoading: boolean) => set({ isLoading }),
  /**
   * Hydrate l'état en récupérant les infos utilisateur depuis l'API.
   */
  hydrate: async () => {
    try {
      set({ isLoading: true });

      const { apiClient } = await import("../lib/api.ts");
      const response = await apiClient.request("auth/me");

      if (response.user) {
        set({
          user: response.user,
          accessToken: response.accessToken || "cookie-auth",
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },
}));
