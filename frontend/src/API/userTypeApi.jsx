import axios from "axios";
import { API_URL } from "../config/constant";
import axiosClient from "./axiosClient";

// const API = "https://localhost:7132/api/UserType";
const API = `/UserType`

export const getUserTypes = async () => {
  const res = await axiosClient.get(API);
  return res.data;
};
