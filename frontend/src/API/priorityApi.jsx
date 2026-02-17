import axios from "axios";
import { API_URL } from "../config/constant";
import axiosClient from "./axiosClient";

// const API = "https://localhost:7132/api/Priority/all";
const API = `/Priority/all`

export const getPriorities = async () => {
  const res = await axiosClient.get(API);
  return res.data;
};


