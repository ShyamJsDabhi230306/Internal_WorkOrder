import axiosClient from "./axiosClient";

export const loginUser = async (username, password) => {
  const response = await axiosClient.post(`/Auth/login`, {
    UserName: username,
    Password: password,
  });

  const data = response.data;

  // Save token
  localStorage.setItem("token", data.token);

  // Extract user object from response
  const user = data.user;

  // Save needed fields
  localStorage.setItem("divisionId", user.divisionId);
  localStorage.setItem("fullName", user.userFullName);

  return user;
};
