import axios from "axios";
import { API_URL } from "../config/constant";
import axiosClient from "./axiosClient";

// const API = "https://localhost:7132/api/User";
const API = `/User`

// GET ALL USERS
export const getUsers = async () => {
  const res = await axiosClient.get(`${API}/all`);
  return res.data;
};

// CREATE USER
export const createUser = async (user) => {
  return await axiosClient.post(`${API}/create`, {
    userFullName: user.userFullName,
    userName: user.userName,
    password: user.password,
    userRemark: user.userRemark,
    divisionId: user.divisionId,
    userTypeId: user.userTypeId,
    vendorId: user.vendorId ?? null
  });
};

// UPDATE USER
export const updateUser = async (user) => {
  return await axiosClient.put(`${API}/update/${user.userId}`, {
    userFullName: user.userFullName,
    userName: user.userName,
    password: user.password,
    userRemark: user.userRemark,
    divisionId: user.divisionId,
    userTypeId: user.userTypeId,
    vendorId: user.vendorId ?? null
  });
};

// DELETE USER
export const deleteUser = async (id) => {
  return await axiosClient.delete(`${API}/delete/${id}`);
};
