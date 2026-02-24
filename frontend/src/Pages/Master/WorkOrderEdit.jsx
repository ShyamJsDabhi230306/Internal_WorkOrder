import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getWorkOrderById, updateWorkOrder, deleteWorkOrder } from "../../API/workOrderApi";
import { getCategories } from "../../API/categoryApi";
import { getProductsByCategory } from "../../API/productApi";
import { getOrderTypes } from "../../API/orderTypeApi";
import { getLocations } from "../../API/locationApi";
import { getDivisions } from "../../API/divisionApi";
import { useAuth } from "../../API/AuthContext";
import { toast } from "react-toastify";

export default function WorkOrderEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [orderTypes, setOrderTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [productOptions, setProductOptions] = useState({});

  const loadData = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [woRes, catList, otList, locList, divList] = await Promise.all([
        getWorkOrderById(id),
        getCategories(),
        getOrderTypes(),
        getLocations(),
        getDivisions()
      ]);

      const data = woRes.data;
      setCategories(catList || []);
      setOrderTypes(otList || []);
      setLocations(locList || []);
      setDivisions(divList || []);

      const woProducts = data.workOrderProducts || [];
      const initialForm = {
        workOrderId: data.workOrderId,
        workOrderNo: data.workOrderNo,
        toLocationId: data.toLocationId,
        toDivisionId: data.toDivisionId,
        fromLocationId: data.fromLocationId,
        fromDivisionId: data.fromDivisionId,
        orderTypeId: data.orderTypeId,
        woPriorityId: data.woPriorityId,
        workOrderDate: data.workOrderDate?.slice(0, 10),
        deliveryDate: data.deliveryDate?.slice(0, 10),
        poNo: data.pono,
        poDate: data.podate?.slice(0, 10),
        authorizedPerson: data.authorizedPerson,
        preparedBy: data.preparedBy,
        address: data.address,
        products: woProducts.map((p) => ({
          categoryId: p.categoryId,
          productId: p.productId,
          quantity: p.quantity,
        })),
      };

      setForm(initialForm);

      const productMap = {};
      for (let i = 0; i < woProducts.length; i++) {
        const catId = woProducts[i].categoryId;
        if (catId) {
          const arr = await getProductsByCategory(catId);
          productMap[i] = Array.isArray(arr) ? arr : [];
        } else {
          productMap[i] = [];
        }
      }
      setProductOptions(productMap);
    } catch (e) {
      console.error("Load Data Error:", e);
      setLoadError("Failed to load work order details.");
      toast.error("Failed to load work order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const updateProductField = async (index, key, value) => {
    const updated = [...form.products];
    updated[index] = { ...updated[index], [key]: value };
    setForm({ ...form, products: updated });

    if (key === "categoryId") {
      if (!value) {
        setProductOptions((prev) => ({ ...prev, [index]: [] }));
        return;
      }
      try {
        const arr = await getProductsByCategory(value);
        setProductOptions((prev) => ({ ...prev, [index]: Array.isArray(arr) ? arr : [] }));
      } catch (err) {
        console.error("Fetch products error:", err);
      }
    }
  };

  const addRow = () => {
    const idx = form.products.length;
    setForm({ ...form, products: [...form.products, { categoryId: "", productId: "", quantity: "" }] });
    setProductOptions((prev) => ({ ...prev, [idx]: [] }));
  };

  const removeRow = (index) => {
    const list = [...form.products];
    list.splice(index, 1);
    setForm({ ...form, products: list });
    const rebuilt = {};
    list.forEach((_, i) => { rebuilt[i] = productOptions[i] || []; });
    setProductOptions(rebuilt);
  };

  const handleUpdate = async () => {
    if (!form.toLocationId || !form.toDivisionId || !form.orderTypeId || !form.deliveryDate) {
      return toast.warning("Target Location, Division, Order Type, and Delivery Date are required.");
    }

    const invalidProducts = form.products.some(p => !p.categoryId || !p.productId || !p.quantity || Number(p.quantity) <= 0);
    if (invalidProducts) {
      return toast.warning("Please ensure all items have a category, product, and a valid quantity greater than 0.");
    }

    if (!window.confirm("Are you sure you want to update this work order?")) return;

    setLoading(true);
    try {
      const isAO = Number(form.orderTypeId) === 1;
      const dto = {
        ...form,
        orderTypeId: Number(form.orderTypeId),
        toLocationId: Number(form.toLocationId),
        toDivisionId: Number(form.toDivisionId),
        pono: isAO ? form.poNo : null,
        podate: isAO ? form.poDate : null,
        products: form.products.map(p => ({
          categoryId: Number(p.categoryId),
          productId: Number(p.productId),
          quantity: Number(p.quantity)
        }))
      };

      await updateWorkOrder(id, dto);
      toast.success("Updated Successfully");
      navigate("/workorder/list");
    } catch (e) {
      console.error("Update failed", e);
      toast.error(e.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this work order? This action cannot be undone.")) return;
    setLoading(true);
    try {
      await deleteWorkOrder(id);
      toast.success("Work Order deleted successfully");
      navigate("/workorder/list");
    } catch (e) {
      console.error("Delete failed", e);
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  if (!form && loading) return <div className="p-4 text-white">Loading...</div>;
  if (loadError) return <div className="alert alert-danger m-4">{loadError}</div>;
  if (!form) return <div className="p-4 text-white">No data found.</div>;

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-white m-0">Edit Work Order: {form.workOrderNo}</h3>
        <button className="btn btn-outline-danger btn-sm" onClick={handleDelete} disabled={loading}>
          {loading ? "Processing..." : "Delete Work Order"}
        </button>
      </div>

      <div className="card bg-dark-glass text-white border-0 shadow-lg p-4">
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label small">Target Location</label>
            <select
              className="form-select bg-dark text-white border-secondary"
              value={form.toLocationId}
              onChange={e => setForm({ ...form, toLocationId: e.target.value })}
              disabled={loading}
            >
              <option value="">Select Location</option>
              {locations.map(l => <option key={l.locationId} value={l.locationId}>{l.locationName}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label small">Target Division</label>
            <select
              className="form-select bg-dark text-white border-secondary"
              value={form.toDivisionId}
              onChange={e => setForm({ ...form, toDivisionId: e.target.value })}
              disabled={loading}
            >
              <option value="">Select Division</option>
              {divisions.filter(d => Number(d.locationId) === Number(form.toLocationId)).map(d => (
                <option key={d.divisionId} value={d.divisionId}>{d.divisionName}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label small">Order Type</label>
            <select
              className="form-select bg-dark text-white border-secondary"
              value={form.orderTypeId}
              onChange={e => setForm({ ...form, orderTypeId: Number(e.target.value) })}
              disabled={loading}
            >
              {orderTypes.map(o => <option key={o.orderTypeId} value={o.orderTypeId}>{o.orderTypeName}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label small">Delivery Date</label>
            <input
              type="date"
              className="form-control bg-dark text-white border-secondary"
              value={form.deliveryDate}
              onChange={e => setForm({ ...form, deliveryDate: e.target.value })}
              disabled={loading}
            />
          </div>
        </div>

        {Number(form.orderTypeId) === 1 && (
          <div className="row g-3 mt-2">
            <div className="col-md-4">
              <label className="form-label small">PO No</label>
              <input className="form-control bg-dark text-white border-secondary" value={form.poNo || ""} onChange={e => setForm({ ...form, poNo: e.target.value })} disabled={loading} />
            </div>
            <div className="col-md-4">
              <label className="form-label small">PO Date</label>
              <input type="date" className="form-control bg-dark text-white border-secondary" value={form.poDate || ""} onChange={e => setForm({ ...form, poDate: e.target.value })} disabled={loading} />
            </div>
            <div className="col-md-4">
              <label className="form-label small">Marketing Person</label>
              <input className="form-control bg-dark text-white border-secondary" value={form.authorizedPerson || ""} onChange={e => setForm({ ...form, authorizedPerson: e.target.value })} disabled={loading} />
            </div>
          </div>
        )}

        <hr className="my-4 border-secondary" />
        <h5 className="mb-3">Products</h5>
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle">
            <thead>
              <tr>
                <th>Category</th>
                <th>Product</th>
                <th>Quantity</th>
                <th width="50"></th>
              </tr>
            </thead>
            <tbody>
              {form.products.map((p, i) => (
                <tr key={i}>
                  <td>
                    <select className="form-select bg-dark text-white border-secondary border-0" value={p.categoryId} onChange={e => updateProductField(i, "categoryId", e.target.value)} disabled={loading}>
                      <option value="">Category</option>
                      {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
                    </select>
                  </td>
                  <td>
                    <select className="form-select bg-dark text-white border-secondary border-0" value={p.productId} onChange={e => updateProductField(i, "productId", e.target.value)} disabled={loading}>
                      <option value="">Product</option>
                      {(productOptions[i] || []).map(pr => <option key={pr.productId} value={pr.productId}>{pr.productName}</option>)}
                    </select>
                  </td>
                  <td>
                    <input type="number" className="form-control bg-dark text-white border-secondary border-0 text-center" value={p.quantity} onChange={e => updateProductField(i, "quantity", e.target.value)} disabled={loading} />
                  </td>
                  <td>
                    <button className="btn btn-outline-danger btn-sm border-0" onClick={() => removeRow(i)} disabled={loading}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="btn btn-outline-info btn-sm mb-4" onClick={addRow} disabled={loading}>+ Add Row</button>

        <div className="text-end">
          <button className="btn btn-success px-5 py-2 shadow" onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating..." : "Update Work Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
