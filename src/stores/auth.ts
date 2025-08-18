import { create } from "zustand";
import PropTypes from "prop-types";

/**
 * Store Zustand pour gérer l'authentification.
 */
export const authStore = create((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isLoading: false,

  /**
   * Connexion d'un utilisateur.
   * @param {string} accessToken - Jeton d'accès.
   * @param {string|null} [refreshToken=null] - Jeton de rafraîchissement.
   * @param {Object|null} [user=null] - Objet utilisateur.
   */
  login: (accessToken: string, refreshToken: string | null, user: any) => {
    set({ accessToken, refreshToken, user, isLoading: false });
  },

  /**
   * Déconnexion (nettoyage complet de l'état).
   */
  logout: () => {
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isLoading: false,
    });
  },

  /**
   * Mise à jour de l'utilisateur.
   * @param {Object} user - Objet utilisateur.
   */
  setUser: (user: any) => {
    set({ user });
  },

  /**
   * Change l'état de chargement.
   * @param {boolean} isLoading
   */
  setLoading: (isLoading: boolean) => set({ isLoading }),

  /**
   * Hydrate l'état en récupérant les infos utilisateur depuis l'API.
   */
  hydrate: async () => {
    try {
      set({ isLoading: true });

      const { apiClient } = await import("../lib/api");
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
    } catch (error) {
      set({ isLoading: false });
    }
  },
}));

/**
 * Définition du type de l'objet User (remplace ton type TS `User`).
 */
export const UserPropTypes = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  email: PropTypes.string,
  name: PropTypes.string,
  userRoles: PropTypes.arrayOf(PropTypes.string),
});

/**
 * Définition des PropTypes pour le state Auth.
 */
export const AuthStatePropTypes = {
  accessToken: PropTypes.string,
  refreshToken: PropTypes.string,
  user: UserPropTypes,
  isLoading: PropTypes.bool.isRequired,
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  hydrate: PropTypes.func.isRequired,
};
