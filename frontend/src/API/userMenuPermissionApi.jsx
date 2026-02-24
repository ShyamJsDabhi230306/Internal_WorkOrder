import axiosClient from "./axiosClient";

// GET permissions of a user
export const getUserMenuPermissions = (userId) =>
  axiosClient.get(`/UserMenuPermissions/${userId}`)
    .then(res => res.data);

// SAVE permissions of a user
export const saveUserMenuPermissions = (userId, payload) =>
  axiosClient.post(`/UserMenuPermissions/${userId}`, payload);