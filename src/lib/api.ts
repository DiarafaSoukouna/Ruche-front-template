import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  AxiosHeaders,
} from "axios";
import { authStore } from "../stores/auth";

const baseURL =
  (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env
    ?.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

function createAxiosClient(): AxiosInstance {
  const instance = axios.create({ baseURL, withCredentials: true });

  // Request interceptor: attach token (only if not cookie-auth)
  instance.interceptors.request.use((config) => {
    const token = authStore.getState().accessToken;
    let headers: AxiosHeaders;
    if (config.headers instanceof AxiosHeaders) {
      headers = config.headers;
    } else if (typeof config.headers === "object" && config.headers) {
      headers = AxiosHeaders.from(config.headers);
    } else {
      headers = new AxiosHeaders();
    }
    // Only add Authorization header if we have a real token (not cookie-auth flag)
    if (token && token !== "cookie-auth") {
      headers.set("Authorization", `Bearer ${token}`);
    }
    if (!headers.get("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    config.headers = headers;
    return config;
  });

  // Response interceptor: handle 401 and normalize errors
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      console.log(error);
      if (error.response?.status === 401) {
        authStore.getState().logout();
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

const client = createAxiosClient();

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  requireAuth?: boolean;
};

export const api = {
  async request<T = unknown>(
    url: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { method = "GET", body, params, headers } = options;
    const config: AxiosRequestConfig = {
      url,
      method,
      params,
      headers,
      data: body,
    };
    const res = await client.request<T>(config);
    return res.data;
  },

  get<T = unknown>(url: string, params?: Record<string, unknown>) {
    return this.request<T>(url, { method: "GET", params });
  },
  post<T = unknown>(url: string, body?: unknown) {
    return this.request<T>(url, { method: "POST", body });
  },
  put<T = unknown>(url: string, body?: unknown) {
    return this.request<T>(url, { method: "PUT", body });
  },
  patch<T = unknown>(url: string, body?: unknown) {
    return this.request<T>(url, { method: "PATCH", body });
  },
  delete<T = unknown>(url: string) {
    return this.request<T>(url, { method: "DELETE" });
  },
};
