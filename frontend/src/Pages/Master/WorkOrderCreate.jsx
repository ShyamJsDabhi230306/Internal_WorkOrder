import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getWorkOrders,
  createWorkOrder,
  getWorkOrderById,
  updateWorkOrder,
  previewWorkOrderNo
} from "../../API/workOrderApi";

import { getVendors } from "../../API/vendorApi";
import { getCategories } from "../../API/categoryApi";
import { getProductsByCategory } from "../../API/productApi";
import { getPriorities } from "../../API/priorityApi";
import { getOrderTypes } from "../../API/orderTypeApi";
import POAttachment from "../../Components/POAttachment";
import { toast } from "react-toastify";

export default function WorkOrderCreate() {
  const [workOrders, setWorkOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [orderTypes, setOrderTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState({});
  const [poFile, setPoFile] = useState(null);

  const loginData = JSON.parse(localStorage.getItem("user") || "{}");
  const loginUser = loginData.fullName || "Unknown User";


  const emptyForm = {
    workOrderNo: "",                                      // will be filled by useEffect
    vendorId: "",
    orderTypeId: "",
    workOrderDate: new Date().toISOString().slice(0, 10), // today
    deliveryDate: "",
    preparedBy: loginUser,                                // from localStorage
    poNo: "",
    poDate: "",
    authorizedPerson: "",
    products: [],
    address: "Ahmedabad",                                 // default
    woPriorityId: 1,                                      // Normal priority
  };

  const validatePODate = (poDate) => {
    const wo = new Date(form.workOrderDate);
    const po = new Date(poDate);

    if (po > wo) {
      alert("PO Date cannot be greater than Work Order Date");
      return false;
    }
    return true;
  };


  // date deleverydate Validation 
  const validateDeliveryDate = (deliveryDate) => {
    const wo = new Date(form.workOrderDate);
    const dd = new Date(deliveryDate);

    if (dd < wo) {
      alert("Delivery Date cannot be earlier than Work Order Date");
      return false;
    }
    return true;
  };


  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [wo, v, c, ot] = await Promise.all([
      getWorkOrders(),
      getVendors(),
      getCategories(),
      getOrderTypes()
    ]);

    setWorkOrders(wo || []);
    setVendors(v || []);
    setCategories(c || []);
    setOrderTypes(ot || []);
  };

  // useEffect(() => {
  //   // Logged-in user (for division)
  //   const user = JSON.parse(localStorage.getItem("user") || "{}");
  //   const myDivisionId = Number(user.divisionId || 0);

  //   // Only work orders of THIS division
  //   let list = workOrders;
  //   if (myDivisionId) {
  //     list = workOrders.filter((w) => Number(w.divisionId) === myDivisionId);
  //   }

  //   // ===== prefix calculation (WO-KPM or WO-ABC etc.) =====
  //   let prefix = "WO"; // default

  //   if (list.length > 0 && list[0].workOrderNo) {
  //     // Example: "WO-KPM-0002" -> ["WO","KPM","0002"]
  //     const parts = String(list[0].workOrderNo).split("-");
  //     if (parts.length >= 2) {
  //       // all parts EXCEPT last are prefix => "WO-KPM"
  //       prefix = parts.slice(0, parts.length - 1).join("-");
  //     }
  //   } else {
  //     // If no work order yet for this division, and your login sends divisionName
  //     // you could do: prefix = `WO-${user.divisionName}`;
  //     // for now keep "WO" (numbers will still be division-wise).
  //   }

  //   if (list.length > 0) {
  //     // numeric part from LAST segment (works for "WO-0001" and "WO-KPM-0001")
  //     const nums = list.map((wo) => {
  //       const parts = String(wo.workOrderNo || "").split("-");
  //       const numPart = parts[parts.length - 1]; // last piece, e.g. "0002"
  //       const n = Number(numPart);
  //       return isNaN(n) ? 0 : n;
  //     });

  //     const maxNo = Math.max(...nums);
  //     const next = (maxNo + 1).toString().padStart(4, "0");

  //     setForm((prev) => ({
  //       ...prev,
  //       workOrderNo: `${prefix}-${next}`, // e.g. WO-KPM-0003
  //       workOrderDate: new Date().toISOString().slice(0, 10),
  //     }));
  //   } else {
  //     // First work order of this division
  //     const firstNum = "0001";
  //     setForm((prev) => ({
  //       ...prev,
  //       workOrderNo: `${prefix}-${firstNum}`, // e.g. WO-KPM-0001 or WO-0001
  //       workOrderDate: new Date().toISOString().slice(0, 10),
  //     }));
  //   }
  // }, [workOrders]);

  // const fetchPreviewNo = async () => {
  //   const user = JSON.parse(localStorage.getItem("user") || "{}");
  //   const divisionId = Number(user.divisionId || 0);
  //   if (!divisionId) return;

  //   const res = await previewWorkOrderNo(divisionId);
  //   setForm((prev) => ({
  //     ...prev,
  //     workOrderNo: res?.workOrderNo || "",
  //   }));
  //   await fetchPreviewNo();
  // };
const fetchPreviewNo = async () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const divisionId = Number(user.divisionId || 0);
  if (!divisionId) return;

  const res = await previewWorkOrderNo(divisionId);
  setForm((prev) => ({
    ...prev,
    workOrderNo: res?.workOrderNo || "",
  }));
};

  useEffect(() => {
    fetchPreviewNo().catch(console.error);
  }, []);


  const addProductRow = () => {
    setForm({
      ...form,
      products: [...form.products, { categoryId: "", productId: "", quantity: "" }],
    });
  };

  // ⭐ FIXED: Always ensure row exists before updating
  const updateProductField = async (i, key, value) => {
    const updated = [...form.products];

    // 🚀 FIX: If row doesn't exist, create it
    if (!updated[i]) {
      updated[i] = { categoryId: "", productId: "", quantity: "" };
    }

    updated[i][key] = value;

    setForm({ ...form, products: updated });

    if (key === "categoryId") {
      const list = await getProductsByCategory(value);
      setProducts((prev) => ({ ...prev, [i]: list || [] }));
    }
  };

  const removeProductRow = (index) => {
    const newRows = [...form.products];
    newRows.splice(index, 1);
    setForm({ ...form, products: newRows });

    const copy = { ...products };
    delete copy[index];
    setProducts(copy);
  };

  // -------------------------------------------------
  // SAVE WORK ORDER
  // -------------------------------------------------

  // const handleSave = async () => {
  //   const isAgainstOrder = Number(form.orderTypeId) === 1;

  //   // const dto = {
  //   //   ...form,
  //   //   vendorId: Number(form.vendorId),
  //   //   orderTypeId: Number(form.orderTypeId),
  //   //   address: "Ahmedabad",
  //   //   woPriorityId: 1,

  //   //   poNo: isAgainstOrder ? form.poNo : null,
  //   //   poDate: isAgainstOrder ? form.poDate : null,
  //   //   authorizedPerson: isAgainstOrder ? form.authorizedPerson : null,

  //   //   products: form.products.map((p) => ({
  //   //     categoryId: Number(p.categoryId),
  //   //     productId: Number(p.productId),
  //   //     quantity: Number(p.quantity),
  //   //     dispatchedQuantity: 0,
  //   //     pendingQuantity: Number(p.quantity),
  //   //   })),
  //   // };

  //   const user = JSON.parse(localStorage.getItem("user") || "{}");
  //   const divisionId = Number(user.divisionId || 0);

  //   const dto = {
  //     vendorId: Number(form.vendorId),
  //     orderTypeId: Number(form.orderTypeId),
  //     woPriorityId: 1,

  //     divisionId,   // ⭐ ADD THIS

  //     workOrderDate: form.workOrderDate,
  //     deliveryDate: form.deliveryDate,
  //     preparedBy: loginUser,
  //     address: "Ahmedabad",

  //     poNo: isAgainstOrder ? form.poNo : null,
  //     poDate: isAgainstOrder ? form.poDate : null,
  //     authorizedPerson: isAgainstOrder ? form.authorizedPerson : null,

  //     products: form.products.map((p) => ({
  //       categoryId: Number(p.categoryId),
  //       productId: Number(p.productId),
  //       quantity: Number(p.quantity)
  //     }))
  //   };




  //   // 1️⃣ Create Work Order
  //   const res = await createWorkOrder(dto);
  //   const backendWoNo = res?.workOrderNo || "";

  //   // 2️⃣ Show created number
  //   alert(`Work Order Created Successfully: ${backendWoNo}`);

  //   // 3️⃣ Reset form (keep UI same)
  //   setForm({
  //     ...emptyForm,
  //     workOrderNo: backendWoNo, // temporarily show saved one
  //   });

  //   // 4️⃣ Reload list (your existing logic)
  //   loadData();

  //   // 5️⃣ ⭐ FETCH NEXT WORK ORDER NUMBER (NO PAGE REFRESH)
  //   await fetchPreviewNo();
  // };

const handleSave = async () => {
  try {
    const isAgainstOrder = Number(form.orderTypeId) === 1;

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const divisionId = Number(user.divisionId || 0);

    if (!divisionId) {
      alert("Division missing");
      return;
    }

    if (!form.vendorId || !form.orderTypeId) {
      alert("Please select Vendor and Order Type");
      return;
    }

    if (!form.products.length) {
      alert("Please add at least one product");
      return;
    }

    const fd = new FormData();

    // ===== SIMPLE FIELDS =====
    fd.append("VendorId", form.vendorId);
    fd.append("OrderTypeId", form.orderTypeId);
    fd.append("WoPriorityId", 1);
    fd.append("DivisionId", divisionId);
    fd.append("WorkOrderDate", form.workOrderDate);
    fd.append("DeliveryDate", form.deliveryDate);
    fd.append("PreparedBy", loginUser);
    fd.append("Address", "Ahmedabad");

    // ===== PO FIELDS =====
    if (isAgainstOrder) {
      fd.append("PoNo", form.poNo || "");
      fd.append("PoDate", form.poDate || "");
      fd.append("AuthorizedPerson", form.authorizedPerson || "");
    }

    // ===== FILE =====
    if (poFile) {
      fd.append("PoAttachment", poFile);
    }

    // ===== PRODUCTS =====
    form.products.forEach((p, i) => {
      fd.append(`Products[${i}].CategoryId`, p.categoryId);
      fd.append(`Products[${i}].ProductId`, p.productId);
      fd.append(`Products[${i}].Quantity`, p.quantity);
    });

    // 🚀 CALL API
    const res = await createWorkOrder(fd);

    toast.success(`Work Order Created Successfully: ${res.workOrderNo}`);

    setForm({
      ...emptyForm,
      workOrderNo: res.workOrderNo,
    });

    loadData();
    await fetchPreviewNo();

  } catch (err) {
    console.error(err);
    alert(
      err.response?.data?.message ||
      "Failed to create work order"
    );
  }
};








  // -------------------------------------------------
  // RENDER UI
  // -------------------------------------------------

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-white py-3">
        <h4 className="fw-bold">Create Work Order</h4>
      </div>

      <div className="card-body">
        {/* TOP ROW */}
        <div className="row g-4">
          <div className="col-md-3">
            <label className="fw-semibold">Work Order No</label>
            <input className="form-control form-control-lg" value={form.workOrderNo || ""} readOnly />
          </div>

          <div className="col-md-3">
            <label className="fw-semibold">Work Order Date</label>
            <input type="date" className="form-control form-control-lg" value={form.workOrderDate} readOnly />
          </div>

          <div className="col-md-3">
            <label className="fw-semibold">Prepared By</label>
            <input
              className="form-control form-control-lg"
              value={form.preparedBy}
              onChange={(e) => setForm({ ...form, preparedBy: e.target.value })}
              readOnly
            />
          </div>

          <div className="col-md-3">
            <label className="fw-semibold">Order Type</label>
            <select
              className="form-select form-select-lg"
              value={form.orderTypeId}
              onChange={(e) => setForm({ ...form, orderTypeId: e.target.value })}
            >
              <option value="">Select Order Type</option>
              {orderTypes.map((o) => (
                <option key={o.orderTypeId} value={o.orderTypeId}>
                  {o.orderTypeName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* PO Fields */}
        {form.orderTypeId == 1 && (
          <div className="row g-4 mt-3">
            <div className="col-md-4">
              <label className="fw-semibold">PO No</label>
              <input
                className="form-control form-control-lg"
                value={form.poNo}
                onChange={(e) => setForm({ ...form, poNo: e.target.value })}
              />
            </div>
           <POAttachment  onChange={setPoFile} />

            <div className="col-md-4">
              <label className="fw-semibold">PO Date</label>
              {/* <input
                type="date"
                className="form-control form-control-lg"
                value={form.poDate}
                onChange={(e) => setForm({ ...form, poDate: e.target.value })}
                
              /> */}

              <input
                type="date"
                className="form-control form-control-lg"
                value={form.poDate}
                min="1900-01-01"
                max={form.workOrderDate}
                onChange={(e) => {
                  if (validatePODate(e.target.value)) {
                    setForm({ ...form, poDate: e.target.value });
                  }
                }}
              />
            </div>

            <div className="col-md-4">
              <label className="fw-semibold">Marketing Person</label>
              <input
                className="form-control form-control-lg"
                value={form.authorizedPerson}
                onChange={(e) => setForm({ ...form, authorizedPerson: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* DELIVERY + VENDOR */}
        <div className="row g-4 mt-3">

          <div className="col-md-3">
            <label className="fw-semibold">Delivery Date</label>
            {/* <input
              type="date"
              className="form-control form-control-lg"
              value={form.deliveryDate}
              onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })}
              
            /> */}

            <input
              type="date"
              className="form-control form-control-lg"
              value={form.deliveryDate}
              min={form.workOrderDate}
              onChange={(e) => {
                if (validateDeliveryDate(e.target.value)) {
                  setForm({ ...form, deliveryDate: e.target.value });
                }
              }}
            />

          </div>

          <div className="col-md-3">
            <label className="fw-semibold">Vendor</label>
            <select
              className="form-select form-select-lg"
              value={form.vendorId}
              onChange={(e) => setForm({ ...form, vendorId: e.target.value })}
            >
              <option value="">Select Vendor</option>
              {vendors.map((v) => (
                <option key={v.vendorId} value={v.vendorId}>
                  {v.vendorName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* PRODUCT TABLE */}
        <div className="mt-4">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="fw-bold">Products</h5>

          </div>

          <table className="table table-bordered table-striped mt-2">
            <thead>
              <tr>
                <th>Category</th>
                <th>Product</th>
                <th>Quantity</th>
                <th width="80">Remove</th>
              </tr>
            </thead>

            <tbody>
              {(form.products.length === 0 ? [{}] : form.products).map((p, i) => (
                <tr key={i}>
                  <td className="col-md-3">
                    <select
                      className="form-select"
                      value={p.categoryId || ""}
                      onChange={(e) => {
                        if (form.products.length === 0) addProductRow();
                        updateProductField(i, "categoryId", e.target.value);
                      }}
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c.categoryId} value={c.categoryId}>
                          {c.categoryName}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="col-md-6 ">
                    <select
                      className="form-select"
                      value={p.productId || ""}
                      onChange={(e) => {
                        if (form.products.length === 0) addProductRow();
                        updateProductField(i, "productId", e.target.value);
                      }}
                    >

                      <option value="">Select Product</option>
                      {Array.isArray(products[i]) &&
                        products[i].map((prod) => (
                          <option key={prod.productId} value={prod.productId}>
                            {prod.productName}
                          </option>
                        ))
                      }
                    </select>
                  </td>

                  <td className="col-md-1">
                    <input
                      type="number"
                      className="form-control"
                      value={p.quantity || ""}
                      onChange={(e) => {
                        if (form.products.length === 0) addProductRow();
                        updateProductField(i, "quantity", e.target.value);
                      }}
                    />
                  </td>

                  <td className="col-sm-1">
                    <button
                      className="btn btn-danger btn-sm"
                      disabled={form.products.length === 0}
                      onClick={() => removeProductRow(i)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-primary btn-sm" onClick={addProductRow}>
            + Add Product
          </button>
          <div className="text-end mt-3">
            <button className="btn btn-success btn-lg px-5" onClick={handleSave}>
              Save Work Order
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}


