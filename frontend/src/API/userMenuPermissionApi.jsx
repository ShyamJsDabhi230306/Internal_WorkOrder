import axiosClient from "./axiosClient";





// // 🔹 Get menu permissions of a user
// export const getUserMenuPermissions = async (userId) => {
//   const res = await axiosClient.get(`/user-permissions/${userId}`);
//   return res.data;
// };

// // 🔹 Save menu permissions of a user
// // SAVE permissions of a user
// export const saveUserMenuPermissions = (userId, payload) =>
//   axiosClient.post(`/UserMenuPermissions/${userId}`, payload);


// GET permissions of a user
export const getUserMenuPermissions = (userId) =>
  axiosClient.get(`/UserMenuPermissions/${userId}`)
    .then(res => res.data);

// SAVE permissions of a user
export const saveUserMenuPermissions = (userId, payload) =>
  axiosClient.post(`/UserMenuPermissions/${userId}`, payload);