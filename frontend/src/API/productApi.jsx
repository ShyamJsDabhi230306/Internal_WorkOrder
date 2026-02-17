// src/API/productApi.js
import axiosClient from "./axiosClient";

const API = `/Product`;

// GET ALL PRODUCTS
export const getProducts = async () => {
  const res = await axiosClient.get(API);
  return res.data;
};

// CREATE PRODUCT
export const createProduct = async (product) => {
  return await axiosClient.post(API, {
    productId: 0,
    categoryId: product.categoryId,
    productName: product.productName,
    productRemark: product.productRemark,
  });
};

// UPDATE PRODUCT
export const updateProduct = async (product) => {
  return await axiosClient.put(`${API}/${product.productId}`, product);
};

// DELETE PRODUCT
export const deleteProduct = async (id) => {
  return await axiosClient.delete(`${API}/${id}`);
};

// ⭐ FINAL FIXED VERSION — MUST USE axiosClient
export const getProductsByCategory = async (categoryId) => {
  const res = await axiosClient.get(`${API}/byCategory/${categoryId}`);

  // Ensure clean array return
  return Array.isArray(res.data) ? res.data : [];
};
