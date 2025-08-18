import axios, { AxiosError, AxiosHeaders } from "axios";
import { authStore } from "../stores/auth";

/**
 * @type {string}
 */
const baseURL =
  /** @type {{ env?: { VITE_API_BASE_URL?: string } }} */ (import.meta)?.env
    ?.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

/**
 * @returns {import("axios").AxiosInstance}
 */
function createAxiosClient() {
  const instance = axios.create({ baseURL, withCredentials: true });

  // Request interceptor: attach token (only if not cookie-auth)
  instance.interceptors.request.use((config) => {
    const token = authStore.getState().accessToken;
    let headers;
    if (config.headers instanceof AxiosHeaders) {
      headers = config.headers;
    } else if (typeof config.headers === "object" && config.headers) {
      headers = AxiosHeaders.from(config.headers);
    } else {
      headers = new AxiosHeaders();
    }

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
    (response) => response,
    (/** @type {AxiosError} */ error) => {
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

/**
 * @typedef {Object} RequestOptions
 * @property {"GET"|"POST"|"PUT"|"PATCH"|"DELETE"} [method]
 * @property {unknown} [body]
 * @property {Record<string, unknown>} [params]
 * @property {Record<string, string>} [headers]
 * @property {boolean} [requireAuth]
 */

// ---------------- MOCK DATA ----------------
const mockTransactions = [
  {
    id: "TXN-001",
    customer: "Mamadou Keita",
    email: "mamadou.keita@email.com",
    product: "Samsung Galaxy S23",
    category: "Électronique",
    amount: 550000, // FCFA
    status: "Payé",
    date: "2024-02-10T09:45:00Z",
  },
  {
    id: "TXN-002",
    customer: "Aïssata Traoré",
    email: "aissata.traore@email.com",
    product: "HP Pavilion 15",
    category: "Informatique",
    amount: 420000,
    status: "En attente",
    date: "2024-02-12T15:20:00Z",
  },
  {
    id: "TXN-003",
    customer: "Ibrahim Coulibaly",
    email: "ibrahim.coulibaly@email.com",
    product: 'Téléviseur LG 55"',
    category: "Électronique",
    amount: 350000,
    status: "Payé",
    date: "2024-02-08T11:10:00Z",
  },
  {
    id: "TXN-004",
    customer: "Fatoumata Diallo",
    email: "fatoumata.diallo@email.com",
    product: "Infinix Hot 40",
    category: "Téléphonie",
    amount: 120000,
    status: "Annulé",
    date: "2024-02-05T17:30:00Z",
  },
  {
    id: "TXN-005",
    customer: "Oumar Sangaré",
    email: "oumar.sangare@email.com",
    product: "PlayStation 5",
    category: "Gaming",
    amount: 450000,
    status: "Payé",
    date: "2024-01-29T13:00:00Z",
  },
  {
    id: "TXN-006",
    customer: "Mariam Konaté",
    email: "mariam.konate@email.com",
    product: "Apple Watch SE",
    category: "Accessoires",
    amount: 180000,
    status: "En attente",
    date: "2024-02-14T08:40:00Z",
  },
  {
    id: "TXN-007",
    customer: "Youssouf Maïga",
    email: "youssouf.maiga@email.com",
    product: "Dell XPS 13",
    category: "Informatique",
    amount: 750000,
    status: "Payé",
    date: "2024-01-31T10:25:00Z",
  },
  {
    id: "TXN-008",
    customer: "Bintou Camara",
    email: "bintou.camara@email.com",
    product: "Machine à laver Samsung",
    category: "Électroménager",
    amount: 300000,
    status: "Payé",
    date: "2024-02-03T19:15:00Z",
  },
  {
    id: "TXN-009",
    customer: "Adama Cissé",
    email: "adama.cisse@email.com",
    product: "Chaussures Nike Air Max",
    category: "Mode",
    amount: 75000,
    status: "En attente",
    date: "2024-02-07T12:50:00Z",
  },
  {
    id: "TXN-010",
    customer: "Kadidia Diarra",
    email: "kadidia.diarra@email.com",
    product: "Sac Louis Vuitton",
    category: "Mode",
    amount: 220000,
    status: "Payé",
    date: "2024-02-09T16:05:00Z",
  },
  {
    id: "TXN-011",
    customer: "Moussa Doumbia",
    email: "moussa.doumbia@email.com",
    product: "Moto Haojue 125",
    category: "Automobile",
    amount: 950000,
    status: "Payé",
    date: "2024-02-01T08:00:00Z",
  },
  {
    id: "TXN-012",
    customer: "Djénéba Samaké",
    email: "djeneba.samaké@email.com",
    product: "Tablette Lenovo",
    category: "Informatique",
    amount: 140000,
    status: "Annulé",
    date: "2024-01-28T14:35:00Z",
  },
  {
    id: "TXN-013",
    customer: "Souleymane Sidibé",
    email: "souleymane.sidibe@email.com",
    product: "Casque Bluetooth JBL",
    category: "Accessoires",
    amount: 65000,
    status: "Payé",
    date: "2024-02-11T20:10:00Z",
  },
  {
    id: "TXN-014",
    customer: "Hawa Dembélé",
    email: "hawa.dembele@email.com",
    product: "Climatiseur LG 1.5 CV",
    category: "Électroménager",
    amount: 280000,
    status: "En attente",
    date: "2024-02-13T18:00:00Z",
  },
  {
    id: "TXN-015",
    customer: "Sekou Touré",
    email: "sekou.toure@email.com",
    product: "Ordinateur Acer Aspire 5",
    category: "Informatique",
    amount: 320000,
    status: "Payé",
    date: "2024-02-06T09:15:00Z",
  },
];

// ---------------- API ----------------
export const api = {
  /**
   * @template T
   * @param {string} url
   * @param {RequestOptions} [options]
   * @returns {Promise<T>}
   */
  async request(url, options = {}) {
    // Handle mock endpoints
    if (url.startsWith("mock/")) {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (url === "mock/transactions") {
            resolve({
              transactions: mockTransactions,
              total: mockTransactions.length,
              isPaginated: false,
            });
          }
          resolve(/** @type {any} */ ([]));
        }, 500);
      });
    }

    const { method = "GET", body, params, headers } = options;
    /** @type {import("axios").AxiosRequestConfig} */
    const config = {
      url,
      method,
      params,
      headers,
      data: body,
    };
    const res = await client.request(config);
    return res.data;
  },

  /**
   * @template T
   * @param {string} url
   * @param {Record<string, unknown>} [params]
   * @returns {Promise<T>}
   */
  get(url, params) {
    return this.request(url, { method: "GET", params });
  },

  /**
   * @template T
   * @param {string} url
   * @param {unknown} [body]
   * @returns {Promise<T>}
   */
  post(url, body) {
    return this.request(url, { method: "POST", body });
  },

  /**
   * @template T
   * @param {string} url
   * @param {unknown} [body]
   * @returns {Promise<T>}
   */
  put(url, body) {
    return this.request(url, { method: "PUT", body });
  },

  /**
   * @template T
   * @param {string} url
   * @param {unknown} [body]
   * @returns {Promise<T>}
   */
  patch(url, body) {
    return this.request(url, { method: "PATCH", body });
  },

  /**
   * @template T
   * @param {string} url
   * @returns {Promise<T>}
   */
  delete(url) {
    return this.request(url, { method: "DELETE" });
  },
};
