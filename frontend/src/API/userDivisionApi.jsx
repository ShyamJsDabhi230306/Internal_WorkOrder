import axiosClient from "./axiosClient";

// USERS
export const getAllUsers = async () => {
  const res = await axiosClient.get("/User/all");
  return res.data;
};

// DIVISIONS
export const getAllDivisions = async () => {
  const res = await axiosClient.get("/Division");
  return res.data;
};

// USER → DIVISION RIGHTS
export const getUserDivisionRights = async (userId) => {
  const res = await axiosClient.get(`/UserDivision/by-user/${userId}`);
  return res.data;
};

export const saveUserDivisionRights = async (userId, divisionIds) => {
  return await axiosClient.post(
    `/UserDivision/save/${userId}`,
    divisionIds
  );
};

