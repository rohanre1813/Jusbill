import api from "./axios";

export const addCustomer = (data) => api.post("/customers", data);
export const getCustomers = (search = "") => api.get(`/customers?search=${search}`);
export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data);
export const deleteCustomer = (id) => api.delete(`/customers/${id}`);
