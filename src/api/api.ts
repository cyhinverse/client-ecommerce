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
    console.log("response interceptor:", response);

    if (
      response.status === 401 &&
      (!originalReq._retry || originalReq._retry < 3)
    ) {
      originalReq._retry = (originalReq._retry || 0) + 1;
      const res = await instance.post("/auth/refresh-token", {
        withCredentials: true,
      });
      if (!res) {
        return Promise.reject("Unable to refresh token");
      }
      originalReq.headers.Authorization = `Bearer ${res.data.accessToken}`;

      return instance(originalReq);
    }

    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
