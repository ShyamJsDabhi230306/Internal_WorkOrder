import axios from "axios";
import axiosClient from "./axiosClient";

// const API = "https://localhost:7132/api/WorkOrder";
const API = `WorkOrder`
// =============================
// GET ALL WORK ORDERS (FILTERED)
// =============================
// export const getWorkOrders = async () => {
//   const user = JSON.parse(localStorage.getItem("user")) || {};

//   const userTypeId = user.userTypeId || 0;
//   const vendorId = user.vendorId || 0;

//   const res = await axios.get(
//     `${API}/all?userTypeId=${userTypeId}&vendorId=${vendorId}`
//   );

//   return res.data;
// };




// export const getWorkOrders = async () => {
//   const user = JSON.parse(localStorage.getItem("user")) || {};

//   const res = await axios.get(
//     `${API}/all?userTypeId=${user.userTypeId}&vendorId=${user.vendorId ?? ""}`
//   );

//   return res.data;
// };



// export const getWorkOrders = async () => {
//   const user = JSON.parse(localStorage.getItem("user")) || {};

//   const params = new URLSearchParams();

//   params.append("userTypeId", user.userTypeId);

//   if (user.userTypeId === 2) {
//     // ⭐ DIVISION USER → MUST SEND divisionId
//     params.append("divisionId", user.divisionId);
//   }

//   if (user.userTypeId === 3) {
//     // ⭐ VENDOR USER → MUST SEND vendorId
//     params.append("vendorId", user.vendorId);
//   }

//   const res = await axios.get(`${API}/all?${params.toString()}`);
//   return res.data;
// };

// this is very important method 
// export const getWorkOrders = async () => {
//   const user = JSON.parse(localStorage.getItem("user") || "{}");

//   const params = {
//     userTypeId: Number(user.userTypeId),
//   };

//   if (user.userTypeId === 2) params.divisionId = Number(user.divisionId);
//   if (user.userTypeId === 3) params.vendorId = null;
//   //Number(user.vendorId)

//   const res = await axiosClient.get(
//     `${API}/all`,
//     { params }
//   );

//   return res.data;
// };


export const getWorkOrders = async (isCommonPool = false) => {
  const auth = JSON.parse(localStorage.getItem("auth") || "{}");

  const userTypeId = Number(auth.userTypeId);
  const divisionId = Number(auth.divisionId);
  const locationId = Number(auth.locationId);

  const params = {
    userTypeId,
    divisionId,
    locationId,
    isCommonPool
  };

  const res = await axiosClient.get(`${API}/all`, { params });
  return res.data;
};

// ===============================
// GET WORK ORDER BY ID
// ===============================
export const getWorkOrderById = async (id) => {
  return await axiosClient.get(`${API}/get/${id}`);
};

export const updateWorkOrder = async (id, data) => {
  return await axiosClient.put(`${API}/update/${id}`, data);
};

// =============================
// CREATE WORK ORDER
// =============================
export const createWorkOrder = async (formData) => {
  const res = await axiosClient.post(API, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const previewWorkOrderNo = async (divisionId) => {
  const res = await axiosClient.get(`${API}/preview-no/${divisionId}`);
  return res.data;
};

// ===============================
// ACCEPT WORK ORDER
// ===============================
export const acceptWorkOrder = async (id, data) => {
  return await axiosClient.put(`${API}/accept/${id}`, data);
};

// =============================
// DELETE WORK ORDER
// =============================
export const deleteWorkOrder = async (id) => {
  return await axiosClient.delete(`${API}/delete/${id}`);
};

// =============================
// UPDATE WORK ORDER STATUS (ACCEPT)
// =============================
export const updateWorkOrderStatus = async (id, dto) => {
  return await axiosClient.put(`${API}/accept/${id}`, dto);
};

export const updateWorkOrderDispatch = async (id, dto) => {
  return await axiosClient.put(`${API}/dispatch/${id}`, dto);
};

// =============================
// FULL RECEIVE
// =============================
export const completeWorkOrder = async (id) => {
  return await axiosClient.put(`${API}/receive/${id}`);
};

export const receiveWorkOrder = async (id) => {
  return await axiosClient.put(`${API}/receive/${id}`);
};

// =============================
// PARTIAL RECEIVE
// =============================
export const receiveProduct = async (workOrderId, productId, body) => {
  return await axiosClient.put(
    `${API}/receive-product/${workOrderId}/${productId}`,
    body
  );
};

// =============================
// DISPATCH PRODUCT
// =============================
export const vendorDispatch = async (workOrderId, productId, qty, transportBy, workOrderProductId) => {
  return axiosClient.put(
    `${API}/dispatch-product/${workOrderId}/${productId}`,
    {
      transportBy: transportBy,
      products: [
        {
          workOrderProductId: workOrderProductId,
          productId: productId,
          dispatchQty: qty,
        },
      ],
    }
  );
};

export const getPoPdf = async (fileName) => {
  const res = await axiosClient.get(
    `WorkOrder/po/${encodeURIComponent(fileName)}`,
    {
      responseType: "blob",
    }
  );

  return res.data;
};

export const getAcceptedWorkOrders = async (
  userTypeId,
  divisionId,
  locationId,
  userId
) => {
  const res = await axiosClient.get("WorkOrder/accepted", {
    params: {
      userTypeId,
      divisionId,
      locationId,
      userId
    }
  });

  return res.data;
};