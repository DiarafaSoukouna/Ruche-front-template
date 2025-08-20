import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { authStore } from "../stores/auth";
import { handleApiError } from "./errors";

// Mock data for demonstration
const mockTransactions = [
  {
    id: "TXN-001",
    customer: "Marie Dubois",
    email: "marie.dubois@email.com",
    product: "iPhone 15 Pro",
    category: "Électronique",
    amount: 1299,
    status: "Payé",
    date: "2024-01-15T10:30:00Z",
  },
  {
    id: "TXN-002",
    customer: "Jean Martin",
    email: "jean.martin@email.com",
    product: "MacBook Air M2",
    category: "Électronique",
    amount: 1499,
    status: "En attente",
    date: "2024-01-14T14:20:00Z",
  },
  {
    id: "TXN-003",
    customer: "Sophie Bernard",
    email: "sophie.bernard@email.com",
    product: "Robe d'été",
    category: "Vêtements",
    amount: 89,
    status: "Payé",
    date: "2024-01-14T09:15:00Z",
  },
  {
    id: "TXN-004",
    customer: "Pierre Durand",
    email: "pierre.durand@email.com",
    product: "Canapé 3 places",
    category: "Maison",
    amount: 899,
    status: "Payé",
    date: "2024-01-13T16:45:00Z",
  },
  {
    id: "TXN-005",
    customer: "Emma Leroy",
    email: "emma.leroy@email.com",
    product: "AirPods Pro",
    category: "Électronique",
    amount: 279,
    status: "Annulé",
    date: "2024-01-13T11:30:00Z",
  },
  {
    id: "TXN-006",
    customer: "Lucas Moreau",
    email: "lucas.moreau@email.com",
    product: "Chaussures de sport",
    category: "Sports",
    amount: 129,
    status: "Payé",
    date: "2024-01-12T13:20:00Z",
  },
  {
    id: "TXN-007",
    customer: "Camille Petit",
    email: "camille.petit@email.com",
    product: "Lampe de bureau",
    category: "Maison",
    amount: 45,
    status: "Payé",
    date: "2024-01-12T08:10:00Z",
  },
  {
    id: "TXN-008",
    customer: "Thomas Roux",
    email: "thomas.roux@email.com",
    product: "Veste en cuir",
    category: "Vêtements",
    amount: 249,
    status: "En attente",
    date: "2024-01-11T17:30:00Z",
  },
  {
    id: "TXN-009",
    customer: "Julie Blanc",
    email: "julie.blanc@email.com",
    product: "iPad Air",
    category: "Électronique",
    amount: 699,
    status: "Payé",
    date: "2024-01-11T12:45:00Z",
  },
  {
    id: "TXN-010",
    customer: "Antoine Garnier",
    email: "antoine.garnier@email.com",
    product: "Tapis de yoga",
    category: "Sports",
    amount: 35,
    status: "Payé",
    date: "2024-01-10T15:20:00Z",
  },
];

export const api = axios.create({
  baseURL:
    (import.meta.env.VITE_API_BASE_URL as string) ||
    "https://adsms.simro-cmr.net/api",
  timeout: 10000,
  withCredentials: true,
});

// ----- Gestion du refresh -----
let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

function subscribeTokenRefresh(cb: () => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed() {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => {
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;
      try {
        await api.post("/auth/refresh", null, { withCredentials: true });
        isRefreshing = false;
        onRefreshed();
        return api(originalRequest);
      } catch (refreshError: unknown) {
        isRefreshing = false;
        authStore.getState().logout();
        window.location.href = "/login";
        return Promise.reject(refreshError as Error);
      }
    }

    const apiError = handleApiError(error);
    return Promise.reject(apiError);
  }
);

// ----- Client avec retry -----
export const apiClient = {
  async request<T>(
    endpoint: string,
    options: AxiosRequestConfig & { retries?: number } = {}
  ): Promise<T> {
    // Handle mock endpoints
    if (endpoint.startsWith("mock/")) {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (endpoint === "mock/transactions") {
            resolve(mockTransactions as T);
          }
          resolve([] as T);
        }, 500); // Simulate network delay
      });
    }

    const { retries = 3, ...axiosConfig } = options;

    // Add auth token if required
    const token = authStore.getState().accessToken;
    if (token) {
      axiosConfig.headers = {
        ...axiosConfig.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const res = await api.request<T>({ url: endpoint, ...axiosConfig });
        return res.data;
      } catch (err: unknown) {
        if (
          attempt < retries &&
          err instanceof AxiosError &&
          err.response?.status &&
          err.response?.status >= 500
        ) {
          await new Promise((res) =>
            setTimeout(res, Math.pow(2, attempt) * 1000)
          );
          continue;
        }
        throw err;
      }
    }
    throw new Error("Max retries exceeded");
  },
};
