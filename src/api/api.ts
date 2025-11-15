import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  async (response) => {
    const originalReq = response.config as any;

    if (response.status === 401 && !originalReq._retry) {
      originalReq._retry = true;
      try {
        const res = await instance.post("/auth/refresh-token");
        const { accessToken } = res.data;
        originalReq.headers.Authorization = `Bearer ${accessToken}`;

        return instance(originalReq);
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      return instance.post("/auth/refresh-token").then((res) => {
        const { accessToken } = res.data;
        error.config.headers.Authorization = `Bearer ${accessToken}`;
        return instance(error.config);
      });
    }
    return Promise.reject(error);
  }
);

export default instance;

