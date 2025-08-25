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

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const authService = {
  // Login function
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiClient.request<LoginResponse>("/token/", {
        method: "POST",
        data: credentials,
      });

      toast.success("Connexion réussie");
      return response;
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail || "Erreur de connexion";
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
        (error as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail || "Erreur de connexion Google";
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

  // Change password function
  async changePassword(id: number, data: ChangePasswordData): Promise<void> {
    try {
      await apiClient.request(`/personnel/password_change/${id}/`, {
        method: "PUT",
        data: {
          old_password: data.currentPassword,
          new_password: data.newPassword,
          confirm_new_password: data.confirmPassword,
        },
      });

      toast.success("Mot de passe modifié avec succès");
    } catch (error: unknown) {
      let errorMessage = "Erreur lors du changement de mot de passe";

      // Handle different error response structures
      const axiosError = error as {
        response?: {
          data?: {
            old_password?: string | string[];
            new_password?: string | string[];
            confirm_new_password?: string | string[];
            detail?: string;
            message?: string;
          };
        };
        message?: string;
        code?: string;
      };

      if (axiosError?.response?.data) {
        const errorData = axiosError.response.data;
        console.log(errorData);

        // Check for specific field errors
        if (errorData.old_password) {
          errorMessage = Array.isArray(errorData.old_password)
            ? errorData.old_password[0]
            : errorData.old_password;
        } else if (errorData.new_password) {
          errorMessage = Array.isArray(errorData.new_password)
            ? errorData.new_password[0]
            : errorData.new_password;
        } else if (errorData.confirm_new_password) {
          errorMessage = Array.isArray(errorData.confirm_new_password)
            ? errorData.confirm_new_password[0]
            : errorData.confirm_new_password;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } else if (axiosError?.message) {
        // Handle network or other errors
        if (axiosError.code === "ERR_BAD_REQUEST") {
          errorMessage = "Données invalides. Vérifiez vos informations.";
        } else if (axiosError.code === "ERR_NETWORK") {
          errorMessage =
            "Erreur de connexion. Vérifiez votre connexion internet.";
        } else {
          errorMessage = axiosError.message;
        }
      }

      toast.error(errorMessage);
      throw error;
    }
  },
};
