
import api from "./axios";

export const register = (data) => api.post("/auth/register", data);
export const login = (data) => api.post("/auth/login", data);
export const logout = () => api.post("/auth/logout");
// Cache-bust with timestamp — prevents the browser from serving a stale 304
// which strips CORS headers and silently fails cross-origin, logging users out on reload
export const verify = () => api.get(`/auth/me?_=${Date.now()}`);
