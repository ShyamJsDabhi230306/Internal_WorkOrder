import axios from "axios";
import { API_URL } from "../config/constant";
import axiosClient from "./axiosClient";

// const API = `${API_URL}/Category`;

// // GET ALL
// export const getCategories = async () => {
//   const res = await axios.get(API,{headers:{"Authorization": `Bearer ${localStorage.getItem('token')}` }});
//   return res.data;
// };

export const getCategories = async () => {
  const res = await axiosClient.get(`/Category`)
  return res.data;
}
// CREATE
export const createCategory = async (category) => {
  return await axiosClient.post(`/Category`, {
    categoryId: 0,
    categoryName: category.categoryName,
    categoryRemark: category.categoryRemark
  },)
};

// UPDATE
export const updateCategory = async (category) => {
  return await axiosClient.put(`Category/${category.categoryId}`, category);
};

// DELETE
export const deleteCategory = async (id) => {
  return await axios.delete(`Category/${id}`);
};
export const getProductsByCategory = async (categoryId) => {
  const res = await axiosClient.get(`/Product/byCategory/${categoryId}`);
  return res.data; // MUST RETURN ARRAY
};