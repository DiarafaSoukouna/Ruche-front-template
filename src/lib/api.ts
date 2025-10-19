import axios, { AxiosError, type AxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL:
    (import.meta.env.VITE_API_BASE_URL as string) ||
    "https://adsms.simro-cmr.net/api",
  timeout: 10000,
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

// Token management utilities
const TOKEN_KEYS = {
  ACCESS: "access_token",
  REFRESH: "refresh_token",
};

export const tokenManager = {
  getAccessToken: () => localStorage.getItem(TOKEN_KEYS.ACCESS),
  getRefreshToken: () => localStorage.getItem(TOKEN_KEYS.REFRESH),
  setTokens: (access: string, refresh: string) => {
    localStorage.setItem(TOKEN_KEYS.ACCESS, access);
    localStorage.setItem(TOKEN_KEYS.REFRESH, refresh);
  },
  clearTokens: () => {
    localStorage.removeItem(TOKEN_KEYS.ACCESS);
    localStorage.removeItem(TOKEN_KEYS.REFRESH);
  },
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    console.log(error);
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
      const refreshToken = tokenManager.getRefreshToken();

      if (!refreshToken) {
        isRefreshing = false;
        tokenManager.clearTokens();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const response = await api.post("/token/refresh/", {
          refresh: refreshToken,
        });

        const { access } = response.data;
        tokenManager.setTokens(access, refreshToken);

        isRefreshing = false;
        onRefreshed();
        return api(originalRequest);
      } catch (refreshError: unknown) {
        isRefreshing = false;
        tokenManager.clearTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError as Error);
      }
    }

    return Promise.reject(error);
  }
);

// ----- Client avec retry -----
export const apiClient = {
  async request<T>(
    endpoint: string,
    options: AxiosRequestConfig & { retries?: number } = {}
  ): Promise<T> {
    const { retries = 3, ...axiosConfig } = options;

    // Add auth token if required
    const token = tokenManager.getAccessToken();
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
