import api from "./axios";

export const createPurchase = (data) =>
  api.post("/purchases", data);

export const getPurchases = () =>
  api.get("/purchases");

export const deletePurchase = (id) =>
  api.delete(`/purchases/${id}`);

export const sendPurchaseReport = (data) =>
  api.post("/purchases/send-report", data);

export const clearPurchaseHistory = () =>
  api.delete("/purchases/clear-history");
