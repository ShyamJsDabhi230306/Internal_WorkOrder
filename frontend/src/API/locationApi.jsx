import axiosClient from "./axiosClient";

// GET ALL
export const getLocations = async () => {
  const res = await axiosClient.get(`/location`);
  return res.data;
};

// CREATE
export const createLocation = async (dto) => {
  const res = await axiosClient.post(`/location`, dto);
  return res.data;
};

// UPDATE
export const updateLocation = async (id, dto) => {
  const res = await axiosClient.put(`/location/${id}`, dto);
  return res.data;
};



// DELETE (Soft Delete)
export const deleteLocation = async (id) => {
  return axiosClient.delete(`/location/${id}`);
};