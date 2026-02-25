import api from "./axios";

export const createInvoice = (data) => api.post("/invoice/create", data);
export const getInvoices = (search) => api.get(`/invoice${search ? `?search=${search}` : ""}`);

export const updateInvoiceStatus = (id, status) => api.patch(`/invoice/${id}/payment-status`, { status });

export const deleteInvoice = (id) => api.delete(`/invoice/${id}`);

export const sendInvoiceEmail = (data) => api.post("/invoice/send-email", data);
export const sendSalesReport = (data) => api.post("/invoice/send-report", data);
export const resetSalesSession = () => api.post("/invoice/reset-session");
