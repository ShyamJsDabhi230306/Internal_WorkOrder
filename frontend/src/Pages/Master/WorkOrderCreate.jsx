import { useEffect, useState } from "react";
import {
  getWorkOrders,
  createWorkOrder,
  previewWorkOrderNo
} from "../../API/workOrderApi";
import { getLocations } from "../../API/locationApi";
import { getDivisions } from "../../API/divisionApi";
import { getCategories } from "../../API/categoryApi";
import { getProductsByCategory } from "../../API/productApi";
import { getOrderTypes } from "../../API/orderTypeApi";
import POAttachment from "../../Components/POAttachment";
import { toast } from "react-toastify";
import { useAuth } from "../../API/AuthContext";

export default function WorkOrderCreate() {
  const { auth } = useAuth();
  const [locations, setLocations] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [orderTypes, setOrderTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productsData, setProductsData] = useState({});
  const [poFile, setPoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const loginUser = auth?.fullName || "Unknown";
  const sourceLocationId = auth?.locationId || 0;
  const sourceDivisionId = auth?.divisionId || 0;
  const senderUserId = auth?.userId || 0;

  const emptyForm = {
    workOrderNo: "AUTO",
    toLocationId: "",
    toDivisionId: "",
    orderTypeId: "",
    workOrderDate: new Date().toISOString().slice(0, 10),
    deliveryDate: "",
    preparedBy: loginUser,
    poNo: "",
    poDate: "",
    authorizedPerson: "",
    products: [{ categoryId: "", productId: "", quantity: "" }],
    address: "Ahmedabad",
    woPriorityId: 1,
  };

  const [form, setForm] = useState(emptyForm);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [l, d, c, ot] = await Promise.all([
        getLocations(),
        getDivisions(),
        getCategories(),
        getOrderTypes()
      ]);
      setLocations(l || []);
      setDivisions(d || []);
      setCategories(c || []);
      setOrderTypes(ot || []);
    } catch (error) {
      console.error("Error loading WorkOrderCreate data:", error);
      toast.error("Failed to load initial form data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPreviewNo = async () => {
    if (!sourceDivisionId) return;
    try {
      const res = await previewWorkOrderNo(sourceDivisionId);
      setForm((prev) => ({ ...prev, workOrderNo: res?.workOrderNo || "AUTO" }));
    } catch (e) {
      console.error("Preview No Fetch failed", e);
    }
  };

  useEffect(() => {
    loadInitialData();
    fetchPreviewNo();
  }, []);

  const addProductRow = () => {
    setForm({
      ...form,
      products: [...form.products, { categoryId: "", productId: "", quantity: "" }],
    });
  };

  const updateProductField = async (i, key, value) => {
    const updated = [...form.products];
    updated[i][key] = value;
    setForm({ ...form, products: updated });

    if (key === "categoryId") {
      try {
        const list = await getProductsByCategory(value);
        setProductsData((prev) => ({ ...prev, [i]: list || [] }));
      } catch (e) {
        console.error("Failed to load products", e);
        toast.error("Failed to load products for category.");
      }
    }
  };

  const removeProductRow = (index) => {
    if (form.products.length === 1) return;
    const newRows = [...form.products];
    newRows.splice(index, 1);
    setForm({ ...form, products: newRows });
  };

  const handleSave = async () => {
    if (!form.toLocationId || !form.toDivisionId || !form.orderTypeId || !form.deliveryDate) {
      return toast.warning("Please fill all mandatory fields (Target Location, Division, Order Type, and Delivery Date).");
    }

    const invalidProducts = form.products.some(p => !p.categoryId || !p.productId || !p.quantity || Number(p.quantity) <= 0);
    if (invalidProducts) {
      return toast.warning("Please ensure all items have a category, product, and a valid quantity greater than 0.");
    }

    if (!window.confirm("Are you sure you want to save this work order?")) return;

    setLoading(true);
    try {
      const isAgainstOrder = Number(form.orderTypeId) === 1;
      const fd = new FormData();

      fd.append("FromLocationId", Number(sourceLocationId));
      fd.append("FromDivisionId", Number(sourceDivisionId));
      fd.append("ToLocationId", Number(form.toLocationId));
      fd.append("ToDivisionId", Number(form.toDivisionId));
      fd.append("SenderUserId", Number(senderUserId));
      fd.append("OrderTypeId", Number(form.orderTypeId));
      fd.append("WoPriorityId", 1);
      fd.append("WorkOrderDate", form.workOrderDate);
      fd.append("DeliveryDate", form.deliveryDate);
      fd.append("PreparedBy", loginUser);
      fd.append("Address", form.address);

      if (isAgainstOrder) {
        fd.append("PoNo", form.poNo || "");
        fd.append("PoDate", form.poDate || "");
        fd.append("AuthorizedPerson", form.authorizedPerson || "");
        if (poFile) fd.append("POAttachment", poFile);
      }

      form.products.forEach((p, i) => {
        fd.append(`Products[${i}].CategoryId`, Number(p.categoryId));
        fd.append(`Products[${i}].ProductId`, Number(p.productId));
        fd.append(`Products[${i}].Quantity`, Number(p.quantity));
      });

      const res = await createWorkOrder(fd);
      toast.success(`Work Order ${res.workOrderNo} Created Successfully!`);
      setForm({ ...emptyForm });
      await fetchPreviewNo();
    } catch (err) {
      console.error("Save error:", err);
      toast.error(err.response?.data?.message || "Failed to create Work Order. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="card bg-dark-glass text-white border-0 shadow-lg mb-4">
        <div className="card-header bg-transparent border-bottom border-secondary p-3">
          <h4 className="mb-0 fw-bold text-info">Create Work Order ({auth?.divisionName})</h4>
        </div>
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label small fw-bold">Work Order No</label>
              <input className="form-control bg-dark text-info border-secondary fw-bold" value={form.workOrderNo} readOnly />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-bold">Order Type</label>
              <select
                className="form-select bg-dark text-white border-secondary"
                value={form.orderTypeId}
                onChange={(e) => setForm({ ...form, orderTypeId: e.target.value })}
                disabled={loading}
              >
                <option value="">Select Order Type</option>
                {orderTypes.map((o) => (
                  <option key={o.orderTypeId} value={o.orderTypeId}>{o.orderTypeName}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-bold">Delivery Date</label>
              <input
                type="date"
                className="form-control bg-dark text-white border-secondary"
                value={form.deliveryDate}
                onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })}
                disabled={loading}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-bold">Prepared By</label>
              <input className="form-control bg-dark text-secondary border-secondary" value={form.preparedBy} readOnly />
            </div>

            <div className="col-md-3">
              <label className="form-label small fw-bold">Target Location</label>
              <select
                className="form-select bg-dark text-white border-secondary"
                value={form.toLocationId}
                onChange={(e) => setForm({ ...form, toLocationId: e.target.value })}
                disabled={loading}
              >
                <option value="">Select Target Location</option>
                {locations.map((l) => (
                  <option key={l.locationId} value={l.locationId}>{l.locationName}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-bold">Target Division</label>
              <select
                className="form-select bg-dark text-white border-secondary"
                value={form.toDivisionId}
                onChange={(e) => setForm({ ...form, toDivisionId: e.target.value })}
                disabled={loading}
              >
                <option value="">Select Target Division</option>
                {divisions.filter(d => Number(d.locationId) === Number(form.toLocationId)).map((d) => (
                  <option key={d.divisionId} value={d.divisionId}>{d.divisionName}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-bold">Marketing Person (Authorized Name)</label>
              <input
                className="form-control bg-dark text-white border-secondary"
                placeholder="Enter Marketing Person Name"
                value={form.authorizedPerson}
                onChange={(e) => setForm({ ...form, authorizedPerson: e.target.value })}
                disabled={loading}
              />
            </div>

            {form.orderTypeId === "1" && (
              <>
                <div className="col-md-3">
                  <label className="form-label small fw-bold">PO No</label>
                  <input className="form-control bg-dark text-white border-secondary" placeholder="Enter PO Number" value={form.poNo} onChange={(e) => setForm({ ...form, poNo: e.target.value })} disabled={loading} />
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-bold">PO Date</label>
                  <input
                    type="date"
                    className="form-control bg-dark text-white border-secondary"
                    value={form.poDate}
                    onChange={(e) => setForm({ ...form, poDate: e.target.value })}
                    disabled={loading}
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="col-md-6">
                  <POAttachment onChange={setPoFile} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="card bg-dark-glass text-white border-0 shadow">
        <div className="card-header border-bottom border-secondary d-flex justify-content-between">
          <h5 className="mb-0">Products</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-dark table-hover mb-0">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Product</th>
                  <th width="120">Quantity</th>
                  <th width="80" className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {form.products.map((p, i) => (
                  <tr key={i}>
                    <td>
                      <select
                        className="form-select bg-dark text-white border-secondary"
                        value={p.categoryId}
                        onChange={(e) => updateProductField(i, "categoryId", e.target.value)}
                        disabled={loading}
                      >
                        <option value="">Category</option>
                        {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
                      </select>
                    </td>
                    <td>
                      <select
                        className="form-select bg-dark text-white border-secondary"
                        value={p.productId}
                        onChange={(e) => updateProductField(i, "productId", e.target.value)}
                        disabled={loading}
                      >
                        <option value="">Product</option>
                        {(productsData[i] || []).map(pr => <option key={pr.productId} value={pr.productId}>{pr.productName}</option>)}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control bg-dark text-white border-secondary text-end no-spin"
                        value={p.quantity}
                        onChange={(e) => updateProductField(i, "quantity", e.target.value)}
                        disabled={loading}
                      />
                    </td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-danger" onClick={() => removeProductRow(i)} disabled={form.products.length === 1 || loading}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer border-top border-secondary text-end p-3">
          <button className="btn btn-outline-primary me-2 px-4" onClick={addProductRow} disabled={loading}>+ Add Item</button>
          <button className="btn btn-success px-5" onClick={handleSave} disabled={loading}>
            {loading ? "Creating..." : "Save Work Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
