import axios from "axios";
import { API_URL } from "../config/constant";
import axiosClient from "./axiosClient";

// const API = "https://localhost:7132/api/OrderType/all";
// const API = `${API_URL}/OrderType/all`

export const getOrderTypes = async () => {
  const res = await axiosClient.get(`/OrderType/all`);
  return res.data;
};
