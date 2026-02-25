import api from "./axios";

export const getProducts = () => api.get("/products");

export const createProduct = (data) =>
  api.post("/products", data);

export const updateProduct = (id, data) =>
  api.put(`/products/${id}`, data);

export const deleteProduct = (id) =>
  api.delete(`/products/${id}`);


export const getTopSellingProducts = (params) =>
  api.get("/products/top-selling", { params });

export const getPublicProducts = (shopId) =>
  api.get(`/products/public/${shopId}`);
