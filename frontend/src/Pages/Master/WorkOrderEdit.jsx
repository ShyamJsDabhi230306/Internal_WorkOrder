import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  getWorkOrderById,
  updateWorkOrder,
  deleteWorkOrder,
} from "../../API/workOrderApi";

import { getVendors } from "../../API/vendorApi";
import { getCategories } from "../../API/categoryApi";
import { getProductsByCategory } from "../../API/productApi";
import { getOrderTypes } from "../../API/orderTypeApi";

export default function WorkOrderEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [orderTypes, setOrderTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productOptions, setProductOptions] = useState({}); // row → product list

  // ---------------------------------------------------
  // LOAD DATA
  // ---------------------------------------------------
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [woRes, vendorList, categoryList, orderTypeList] =
      await Promise.all([
        getWorkOrderById(id),
        getVendors(),
        getCategories(),
        getOrderTypes(),
      ]);

    const data = woRes.data;

    setVendors(vendorList || []);
    setCategories(categoryList || []);
    setOrderTypes(orderTypeList || []);

    const woProducts = data.workOrderProducts || [];

    // Build form state
    const initialForm = {
      workOrderId: data.workOrderId,
      workOrderNo: data.workOrderNo,
      vendorId: data.vendorId,
      orderTypeId: data.orderTypeId,
      woPriorityId: data.woPriorityId,

      workOrderDate: data.workOrderDate?.slice(0, 10),
      deliveryDate: data.deliveryDate?.slice(0, 10),

      poNo: data.pono,
      poDate: data.podate?.slice(0, 10),
      authorizedPerson: data.authorizedPerson,

      preparedBy: data.preparedBy,
      address: data.address,
      divisionId: data.divisionId,

      products: woProducts.map((p) => ({
        categoryId: p.categoryId,
        productId: p.productId,
        quantity: p.quantity,
      })),
    };

    setForm(initialForm);

    // Load product dropdown options per row
    const productMap = {};
    for (let i = 0; i < woProducts.length; i++) {
      const catId = woProducts[i].categoryId;
      if (!catId) {
        productMap[i] = [];
        continue;
      }
      try {
        const arr = await getProductsByCategory(catId);
        productMap[i] = Array.isArray(arr) ? arr : [];
      } catch {
        productMap[i] = [];
      }
    }

    setProductOptions(productMap);
  };

  // ---------------------------------------------------
  // GET PRODUCTS FOR ROW
  // ---------------------------------------------------
  const getProductsForRow = (idx) => {
    const row = productOptions[idx];
    return Array.isArray(row) ? row : [];
  };

  // ---------------------------------------------------
  // UPDATE PRODUCT ROW FIELD
  // ---------------------------------------------------
  const updateProductField = async (index, key, value) => {
    const updated = [...form.products];
    updated[index] = { ...updated[index], [key]: value };
    setForm({ ...form, products: updated });

    if (key === "categoryId") {
      if (!value) {
        setProductOptions((prev) => ({ ...prev, [index]: [] }));
        return;
      }

      const arr = await getProductsByCategory(value);
      setProductOptions((prev) => ({
        ...prev,
        [index]: Array.isArray(arr) ? arr : [],
      }));
    }
  };

  // ---------------------------------------------------
  // ADD PRODUCT ROW
  // ---------------------------------------------------
  const addRow = () => {
    const idx = form.products.length;

    setForm({
      ...form,
      products: [
        ...form.products,
        { categoryId: "", productId: "", quantity: "" },
      ],
    });

    setProductOptions((prev) => ({ ...prev, [idx]: [] }));
  };

  // ---------------------------------------------------
  // REMOVE PRODUCT ROW
  // ---------------------------------------------------
  const removeRow = (index) => {
    const list = [...form.products];
    list.splice(index, 1);

    setForm({ ...form, products: list });

    // rebuild options
    const rebuilt = {};
    list.forEach((_, i) => {
      rebuilt[i] = productOptions[i] || [];
    });

    setProductOptions(rebuilt);
  };

  // ---------------------------------------------------
  // UPDATE WORK ORDER
  // ---------------------------------------------------
  const handleUpdate = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const isAO = Number(form.orderTypeId) === 1;

    const dto = {
      workOrderId: form.workOrderId,
      vendorId: Number(form.vendorId),
      orderTypeId: Number(form.orderTypeId),
      woPriorityId: Number(form.woPriorityId),

      workOrderDate: form.workOrderDate,
      deliveryDate: form.deliveryDate,
      preparedBy: form.preparedBy,
      address: form.address,
      divisionId: Number(user.divisionId),

      pono: isAO ? form.poNo : null,
      podate: isAO ? form.poDate : null,
      authorizedPerson: isAO ? form.authorizedPerson : null,

      products: form.products.map((p) => ({
        categoryId: Number(p.categoryId),
        productId: Number(p.productId),
        quantity: Number(p.quantity),
      })),
    };

    await updateWorkOrder(id, dto);
    alert("Work Order Updated Successfully");
    navigate("/workorder/list");
  };

  // ---------------------------------------------------
  // DELETE WORK ORDER
  // ---------------------------------------------------
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this Work Order?"))
      return;

    await deleteWorkOrder(id);
    alert("Work Order Deleted");
    navigate("/workorder/list");
  };

  if (!form) return <div className="p-4">Loading...</div>;

  // ---------------------------------------------------
  // UI
  // ---------------------------------------------------
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-white d-flex justify-content-between">
        <h4 className="fw-bold">Edit Work Order</h4>
        <button className="btn btn-danger btn-sm" onClick={handleDelete}>
          Delete
        </button>
      </div>

      <div className="card-body">
        {/* BASIC INFO */}
        <div className="row g-4">
          <div className="col-md-3">
            <label className="fw-semibold">Work Order No</label>
            <input className="form-control" value={form.workOrderNo} readOnly />
          </div>

          <div className="col-md-3">
            <label className="fw-semibold">Work Order Date</label>
            <input
              type="date"
              className="form-control"
              value={form.workOrderDate}
              readOnly
            />
          </div>

          <div className="col-md-3">
            <label className="fw-semibold">Prepared By</label>
            <input className="form-control" value={form.preparedBy} readOnly />
          </div>

          <div className="col-md-3">
            <label className="fw-semibold">Order Type</label>
            <select
              className="form-select"
              value={form.orderTypeId}
              onChange={(e) =>
                setForm({ ...form, orderTypeId: Number(e.target.value) })
              }
            >
              <option value="">Select</option>
              {orderTypes.map((o) => (
                <option key={o.orderTypeId} value={o.orderTypeId}>
                  {o.orderTypeName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* AGAINST ORDER FIELDS */}
        {form.orderTypeId === 1 && (
          <div className="row g-4 mt-2">
            <div className="col-md-4">
              <label className="fw-semibold">PO No</label>
              <input
                className="form-control"
                value={form.poNo || ""}
                onChange={(e) =>
                  setForm({ ...form, poNo: e.target.value })
                }
              />
            </div>

            <div className="col-md-4">
              <label className="fw-semibold">PO Date</label>
              <input
                type="date"
                className="form-control"
                value={form.poDate || ""}
                onChange={(e) =>
                  setForm({ ...form, poDate: e.target.value })
                }
              />
            </div>

            <div className="col-md-4">
              <label className="fw-semibold">Marketing Person</label>
              <input
                className="form-control"
                value={form.authorizedPerson || ""}
                onChange={(e) =>
                  setForm({ ...form, authorizedPerson: e.target.value })
                }
              />
            </div>
          </div>
        )}

        {/* DELIVERY + VENDOR */}
        <div className="row g-4 mt-3">
          <div className="col-md-3">
            <label className="fw-semibold">Delivery Date</label>
            <input
              type="date"
              className="form-control"
              value={form.deliveryDate || ""}
              onChange={(e) =>
                setForm({ ...form, deliveryDate: e.target.value })
              }
            />
          </div>

          <div className="col-md-3">
            <label className="fw-semibold">Vendor</label>
            <select
              className="form-select"
              value={form.vendorId}
              onChange={(e) =>
                setForm({ ...form, vendorId: Number(e.target.value) })
              }
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

        {/* PRODUCTS */}
        <h5 className="fw-bold mt-4">Products</h5>
        <table className="table table-bordered mt-2">
          <thead>
            <tr>
              <th>Category</th>
              <th>Product</th>
              <th>Qty</th>
              <th width="80">Remove</th>
            </tr>
          </thead>
          <tbody>
            {form.products.map((p, i) => (
              <tr key={i}>
                <td>
                  <select
                    className="form-select"
                    value={p.categoryId || ""}
                    onChange={(e) =>
                      updateProductField(
                        i,
                        "categoryId",
                        Number(e.target.value)
                      )
                    }
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.categoryId} value={c.categoryId}>
                        {c.categoryName}
                      </option>
                    ))}
                  </select>
                </td>

                <td>
                  <select
                    className="form-select"
                    value={p.productId || ""}
                    onChange={(e) =>
                      updateProductField(
                        i,
                        "productId",
                        Number(e.target.value)
                      )
                    }
                  >
                    <option value="">Select Product</option>
                    {getProductsForRow(i).map((prod) => (
                      <option key={prod.productId} value={prod.productId}>
                        {prod.productName}
                      </option>
                    ))}
                  </select>
                </td>

                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={p.quantity}
                    onChange={(e) =>
                      updateProductField(
                        i,
                        "quantity",
                        Number(e.target.value)
                      )
                    }
                  />
                </td>

                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeRow(i)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="btn btn-primary btn-sm" onClick={addRow}>
          + Add Product
        </button>

        <div className="text-end mt-4">
          <button className="btn btn-success btn-lg px-5" onClick={handleUpdate}>
            Update Work Order
          </button>
        </div>
      </div>
    </div>
  );
}
