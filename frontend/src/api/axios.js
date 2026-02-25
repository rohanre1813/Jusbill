import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true
});

api.interceptors.request.use((config) => {
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    if (url.includes("/auth/me") || url.includes("/auth/logout")) {
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default api;
