
import api from "./axios";

export const getProfile = () => api.get("/users/profile");

// updateProfile expects FormData because of file uploads
export const updateProfile = (formData) => api.put("/users/profile", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});
