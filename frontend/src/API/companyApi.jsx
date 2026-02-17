// companyApi.js
import axiosClient from "./axiosClient";  // Import your Axios client

// GET ALL Companies
export const getCompanies = async () => {
  const res = await axiosClient.get(`/company`);
  return res.data;
};

// CREATE Company
export const createCompany = async (dto) => {
  const res = await axiosClient.post(`/company`, dto);
  return res.data;
};

// UPDATE Company
export const updateCompany = async (id, dto) => {
  const body = {
    companyId: id,
    companyName: dto.companyName,
    companyCode: dto.companyCode,
    companyCity: dto.companyCity,
  };
  const res = await axiosClient.put(`/company/${id}`, body);
  return res.data;
};

// DELETE Company
export const deleteCompany = async (id) => {
  return axiosClient.delete(`/company/${id}`);
};
