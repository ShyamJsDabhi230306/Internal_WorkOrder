import axios from "axios";
import { API_URL } from "../config/constant";

const API =  `${API_URL}/Customer`;

// GET ALL
export const getCustomers = async () => {
  const res = await axios.get(API);
  return res.data;
};

// CREATE
export const createCustomer = async (customer) => {
  return await axios.post(API, {
    customerId: 0,
    customerName: customer.customerName,
    customerRemark: customer.customerRemark
  });
};

// UPDATE
export const updateCustomer = async (customer) => {
  return await axios.put(`${API}/${customer.customerId}`, customer);
};

// DELETE
export const deleteCustomer = async (id) => {
  return await axios.delete(`${API}/${id}`);
};
