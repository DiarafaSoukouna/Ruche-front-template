import { toast } from "react-toastify";
import { apiClient, tokenManager } from "../lib/api";

interface LoginCredentials {
  id_personnel_perso: string;
  password: string;
}

interface User {
  id?: string;
  name?: string;
  id_personnel_perso?: string;
  personnel?: unknown;
}

interface LoginResponse {
  access: string;
  refresh: string;
  user?: User;
}

export const authService = {
  // Login function
  async login(
    credentials: LoginCredentials
  ): Promise<LoginResponse> {
    try {
      const response = await apiClient.request<LoginResponse>("/token/", {
        method: "POST",
        data: credentials,
      });

      toast.success("Connexion réussie");
      return response;
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail || "Erreur de connexion";
      toast.error(errorMessage);
      throw error;
    }
  },

  async loginWithGoogle(): Promise<LoginResponse> {
    try {
      const response = await apiClient.request<LoginResponse>("/auth/google/", {
        method: "POST",
      });

      toast.success("Connexion Google réussie");
      return response;
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail || "Erreur de connexion Google";
      toast.error(errorMessage);
      throw error;
    }
  },

  // Logout function
  async logout(): Promise<void> {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      if (refreshToken) {
        // Call logout endpoint to invalidate token on server
        await apiClient.request("/token/logout/", {
          method: "POST",
          data: { refresh: refreshToken },
        });
      }
      toast.success("Déconnexion réussie");
    } catch {
      // Continue with logout even if server call fails
      toast.info("Déconnexion locale effectuée");
    } finally {
      // Clear local storage
      tokenManager.clearTokens();
    }
  },

  // Get current user info
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.request<User>("/auth/me/");
      return response;
    } catch {
      toast.error(
        "Erreur lors de la récupération des informations utilisateur"
      );
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const accessToken = tokenManager.getAccessToken();
    if (!accessToken) return false;

    try {
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  },

  // Refresh token
  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      if (!refreshToken) return false;

      const response = await apiClient.request<{ access: string }>(
        "/token/refresh/",
        {
          method: "POST",
          data: { refresh: refreshToken },
        }
      );

      const { access } = response;
      tokenManager.setTokens(access, refreshToken);

      return true;
    } catch {
      // If refresh fails, logout user
      toast.error("Session expirée, veuillez vous reconnecter");
      tokenManager.clearTokens();
      return false;
    }
  },
};
