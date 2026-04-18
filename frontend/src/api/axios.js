import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true
});

api.interceptors.request.use((config) => {
  // Automatically namespace API requests so they don't clash with React Router page URLs
  if (config.url && config.url.startsWith("/") && !config.url.startsWith("/api")) {
    config.url = `/api${config.url}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;
