import axiosClient from "./axiosClient";

export const getDivisions = async () => {
  const res = await axiosClient.get("/division");
  return res.data;
};

export const createDivision = async (dto) => {
  const res = await axiosClient.post("/division", dto);
  return res.data;
};

export const updateDivision = async (id, dto) => {
  const res = await axiosClient.put(`/division/${id}`, dto);
  return res.data;
};

export const deleteDivision = async (id) => {
  return axiosClient.delete(`/division/${id}`);
};