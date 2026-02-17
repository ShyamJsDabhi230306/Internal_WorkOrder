// import axios from "axios";
// import { API_URL } from "../config/constant";
import axiosClient from "./axiosClient";

// const API = "https://localhost:7132/api/";
// const API = `${API_URL}/Division`

// GET ALL
export const getDivisions = async () => {
  const res = await axiosClient.get(`/Division`);
  return res.data;
};

// CREATE
export const createDivision = async (division) => {
  return await axiosClient.post(`/Division`, {
    divisionId: 0,
    companyId: division.companyId,
    divisionName: division.divisionName
  });
};

// UPDATE
// export const updateDivision = async (division) => {
//   return await axios.put(`${API}/${division.divisionId}`, division);
// };
export const updateDivision = async (id, data) => {
  return axiosClient.put(`/Division/${id}`, data);
};


// DELETE
export const deleteDivision = async (id) => {
  return await axiosClient.delete(`Division/${id}`);
};
