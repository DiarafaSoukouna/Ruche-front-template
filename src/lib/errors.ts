// errors.ts
import type { AxiosError } from "axios";

export class ApiError extends Error {
  public code: string;
  public statusCode?: number;
  public details?: unknown;

  constructor(
    message: string,
    code: string,
    statusCode?: number,
    details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    // Corrige la chaîne de prototype pour les sous-classes d'Error
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const handleApiError = (error: AxiosError): ApiError => {
  // Si l'API retourne un objet avec message et code
  if (error.response?.data && typeof error.response.data === "object") {
    const data = error.response.data as { message?: string; code?: string };
    return new ApiError(
      data.message ?? "Une erreur s'est produite",
      data.code ?? "API_ERROR",
      error.response?.status,
      data
    );
  }

  // Timeout Axios
  if (error.code === "ECONNABORTED") {
    return new ApiError(
      "La requête a expiré. Veuillez réessayer.",
      "TIMEOUT_ERROR",
      408
    );
  }

  // Erreur réseau (ex : pas d'Internet)
  if (error.code === "ERR_NETWORK") {
    return new ApiError(
      "Erreur de connexion. Vérifiez votre connexion internet.",
      "NETWORK_ERROR",
      0
    );
  }

  // Erreur inconnue
  return new ApiError(
    "Une erreur inattendue s'est produite",
    "UNKNOWN_ERROR",
    error.response?.status
  );
};
