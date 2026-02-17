import axios from "axios";
import { API_URL } from "../config/constant";
import axiosClient from "./axiosClient";

// const API = "https://localhost:7132/api/Vendor";
// const API = `${API_URL}/Vendor`
const API = `/Vendor`

// GET ALL
export const getVendors = async () => {
  const res = await axiosClient.get(API);
  return res.data;
};

// CREATE
export const createVendor = async (vendor) => {
  return await axiosClient.post(API, vendor);
};

// UPDATE
export const updateVendor = async (vendor) => {
  return await axiosClient.put(`${API}/${vendor.vendorId}`, vendor);
};

// DELETE
export const deleteVendor = async (id) => {
  return await axiosClient.delete(`${API}/${id}`);
};
