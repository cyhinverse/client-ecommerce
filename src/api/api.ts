import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { authSlice } from "@/features/auth/authSlice";

let store: any;

export const injectStore = (_store: any) => {
  store = _store;
};

// Create a queue to hold failed requests while refreshing token
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 and it's not a retry and not the refresh token call itself
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh-token")
    ) {
      if (isRefreshing) {
        // If already refreshing, add request to queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return instance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${instance.defaults.baseURL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data;

        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", accessToken);
        }

        // Sync with Redux if store is injected
        if (store) {
          store.dispatch(authSlice.actions.setToken(accessToken));
          store.dispatch(authSlice.actions.setIsAuthenticated(true));
        }

        // Update instance defaults and original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        processQueue(null, accessToken);
        return instance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // If refresh fails, clear everything
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.dispatchEvent(new Event("auth-logout"));
        }

        if (store) {
          store.dispatch(authSlice.actions.clearAuth());
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
