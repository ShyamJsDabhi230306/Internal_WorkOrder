import { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { getWorkOrders, vendorDispatch } from "../../API/workOrderApi";
import "./WorkOrderCSS/WorkOrderList.css";
import { toast } from "react-toastify";

export default function WorkOrderManageDispatch() {
  const [dispatchList, setDispatchList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const [dispatchQty, setDispatchQty] = useState({});
  const [transportBy, setTransportBy] = useState({});
  const [challanNo, setChallanNo] = useState({});
  const [dispatchFile, setDispatchFile] = useState({});
  // ----- FILTER STATES -----
  const [woNo, setWoNo] = useState("");
  const [vendor, setVendor] = useState("");
  const [status, setStatus] = useState("All");
  const [product, setProduct] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");

  const [productOptions, setProductOptions] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await getWorkOrders();

      const sorted = (data || [])
        .sort((a, b) => b.workOrderId - a.workOrderId)
        .filter(
          (wo) =>
            wo.status === "Accepted" ||
            wo.status === "Dispatched" ||
            wo.status === "Partially Dispatched",
        )
        .map((wo) => ({
          ...wo,
          visibleProducts: wo.products.filter(
            (p) => p.dispatchedQuantity < p.quantity,
          ),
        }))
        .filter((wo) => wo.visibleProducts.length > 0);

      // collect all product names
      const allProducts = [
        ...new Set(
          sorted.flatMap((w) => w.visibleProducts.map((p) => p.product)),
        ),
      ];

      setProductOptions(allProducts);
      setDispatchList(sorted);
      setFilteredList(sorted);
    } catch (err) {
      console.error("Load Dispatch Data Error:", err);
      setLoadError("Failed to load dispatch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    const search = globalSearch.trim().toLowerCase();

    const filtered = dispatchList
      .map((wo) => {
        let products = [...wo.visibleProducts];

        if (search) {
          products = products.filter((p) =>
            p.product?.toLowerCase().includes(search),
          );
        }

        const woSearchMatch =
          !search ||
          wo.workOrderNo?.toLowerCase().includes(search) ||
          wo.vendorName?.toLowerCase().includes(search) ||
          wo.status?.toLowerCase().includes(search) ||
          String(wo.deliveryDate || "")
            .toLowerCase()
            .includes(search) ||
          String(wo.acceptDeliveryDate || "")
            .toLowerCase()
            .includes(search);

        if (search && !woSearchMatch && products.length === 0) return null;

        if (woNo && !wo.workOrderNo.toLowerCase().includes(woNo.toLowerCase()))
          return null;

        if (
          vendor &&
          !wo.vendorName.toLowerCase().includes(vendor.toLowerCase())
        )
          return null;

        if (status !== "All" && wo.status !== status) return null;

        if (fromDate && new Date(wo.acceptDeliveryDate) < new Date(fromDate))
          return null;

        if (toDate && new Date(wo.acceptDeliveryDate) > new Date(toDate))
          return null;

        if (product !== "All") {
          products = products.filter(
            (p) => p.product.toLowerCase() === product.toLowerCase(),
          );
        }

        if (products.length === 0) return null;

        return {
          ...wo,
          visibleProducts: products,
        };
      })
      .filter(Boolean);

    setFilteredList(filtered);
  };

  useEffect(() => {
    applyFilter();
  }, [globalSearch, woNo, vendor, status, product, fromDate, toDate]);

  const formatDate = (v) => {
    if (!v) return "";
    const d = new Date(v);
    if (isNaN(d)) return v?.slice?.(0, 10) || "";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const getKey = (woId, productId, index) => `${woId}_${productId}_${index}`;

  // const handleDispatch = async (
  //   woId,
  //   productId,
  //   total,
  //   dispatched,
  //   index,
  //   woProductId,
  // ) => {
  //   const key = getKey(woId, productId, index);
  //   const qty = Number(dispatchQty[key] || 0);
  //   const tBy = transportBy[key] || "";
  //   const pending = total - dispatched;

  //   if (!tBy) return alert("Please enter 'Transport By' information.");
  //   if (!qty || qty <= 0)
  //     return alert("Please enter a valid quantity greater than 0.");
  //   if (qty > pending)
  //     return alert(`Maximum allowed dispatch quantity is ${pending}.`);

  //   if (!window.confirm("Are you sure you want to dispatch this product?"))
  //     return;

  //   setLoading(true);
  //   try {
  //     await vendorDispatch(woId, productId, qty, tBy, woProductId);
  //     alert("Product dispatched successfully!");
  //     setDispatchQty((p) => ({ ...p, [key]: "" }));
  //     setTransportBy((p) => ({ ...p, [key]: "" }));
  //     await loadData();
  //   } catch (err) {
  //     console.error("Dispatch Error:", err);
  //     alert(err.response?.data?.message || "Failed to dispatch product.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleDispatch = async (
    woId,
    productId,
    total,
    dispatched,
    index,
    woProductId,
  ) => {
    const key = getKey(woId, productId, index);

    const qty = Number(dispatchQty[key] || 0);
    const tBy = transportBy[key] || "";
    const challan = challanNo[key] || "";
    const file = dispatchFile[key];

    const pending = total - dispatched;

    if (!challan) return alert("Please enter Challan No.");
    if (!tBy) return alert("Please enter Transport By.");
    if (!qty || qty <= 0) return alert("Please enter valid dispatch quantity.");
    if (qty > pending) return alert(`Maximum allowed quantity is ${pending}.`);

    if (!window.confirm("Confirm dispatch?")) return;

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("DispatchQty", qty);
      formData.append("ChallanNo", challan);
      formData.append("TransportBy", tBy);

      if (file) {
        formData.append("DispatchAttachment", file);
      }

      await vendorDispatch(woId, woProductId, formData);

      toast.info("Product dispatched successfully!");

      setDispatchQty((p) => ({ ...p, [key]: "" }));
      setTransportBy((p) => ({ ...p, [key]: "" }));
      setChallanNo((p) => ({ ...p, [key]: "" }));
      setDispatchFile((p) => ({ ...p, [key]: null }));

      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Dispatch failed.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Layout>
      <div className="container-fluid py-3">
        <div className="card shadow-sm mb-3">
          <div className="card-body py-2">
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Search WO No, Product, Status..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-header border-0 bg-transparent">
            <h4 className="fw-bold mb-0">Product Dispatch</h4>
          </div>

          {loadError && (
            <div className="alert alert-danger m-3">{loadError}</div>
          )}

          <div className="card-body p-0">
            {loading && !filteredList.length ? (
              <div className="p-5 text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">
                  Searching for dispatchable items...
                </p>
              </div>
            ) : (
              <div
                className="table-responsive"
                style={{
                  maxHeight: "500px",
                  overflowY: "auto",
                }}
              >
                <table className="table table-bordered align-middle mb-0">
                  <thead
                    className="bg-dark border-bottom border-secondary"
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 2,
                    }}
                  >
                    <tr>
                      <th className="text-center text-nowrap">WO No</th>
                      <th className="text-center text-nowrap">Product</th>
                      <th className="text-center text-nowrap">HO</th>
                      <th className="text-center text-nowrap">Division</th>
                      <th className="text-center text-nowrap">Total</th>
                      <th className="text-center text-nowrap">Delivery Date</th>
                      <th className="text-center text-nowrap">Dispatched</th>
                      <th className="text-center text-nowrap">Pending</th>
                      <th className="text-center text-nowrap" width="120">Dispatch Qty</th>
                      <th className="text-center text-nowrap" width="150">Transport By</th>
                      <th className="text-center text-nowrap" width="150">Challan No</th>
                      <th className="text-center text-nowrap" width="180">Attachment</th>
                      <th className="text-center text-nowrap" width="100">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!filteredList.length && !loading && (
                      <tr>
                        <td
                          colSpan="11"
                          className="text-center py-4 text-muted"
                        >
                          No items found matching your search.
                        </td>
                      </tr>
                    )}
                    {filteredList.flatMap((wo) =>
                      wo.visibleProducts.map((p, index) => {
                        const total = p.quantity;
                        const dispatched = p.dispatchedQuantity;
                        const pending = total - dispatched;
                        const key = getKey(wo.workOrderId, p.productId, index);

                        return (
                          <tr key={key}>
                            <td className="text-center text-nowrap">{wo.workOrderNo}</td>
                            <td className="text-center text-nowrap">{p.product}</td>
                            <td className="text-center text-nowrap">{wo.fromDivisionName}</td>
                            <td className="text-center text-nowrap">{wo.toDivisionName}</td>
                            <td className="text-center text-nowrap">{total}</td>
                            <td className="text-center text-nowrap">{formatDate(wo.acceptDeliveryDate)}</td>
                            <td className="text-center text-nowrap">{dispatched}</td>
                            <td className="text-center text-nowrap">{pending}</td>
                            <td>
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                value={dispatchQty[key] || ""}
                                onChange={(e) =>
                                  setDispatchQty((prev) => ({
                                    ...prev,
                                    [key]: e.target.value,
                                  }))
                                }
                                disabled={loading}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Transport By"
                                value={transportBy[key] || ""}
                                onChange={(e) =>
                                  setTransportBy((prev) => ({
                                    ...prev,
                                    [key]: e.target.value,
                                  }))
                                }
                                disabled={loading}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Challan No"
                                value={challanNo[key] || ""}
                                onChange={(e) =>
                                  setChallanNo((prev) => ({
                                    ...prev,
                                    [key]: e.target.value,
                                  }))
                                }
                                disabled={loading}
                              />
                            </td>

                            <td>
                              <input
                                type="file"
                                className="form-control form-control-sm"
                                onChange={(e) =>
                                  setDispatchFile((prev) => ({
                                    ...prev,
                                    [key]: e.target.files[0],
                                  }))
                                }
                                disabled={loading}
                              />
                            </td>
                            <td>
                              <button
                                className="btn btn-success btn-sm w-100"
                                onClick={() =>
                                  handleDispatch(
                                    wo.workOrderId,
                                    p.productId,
                                    total,
                                    dispatched,
                                    index,
                                    p.workOrderProductId,
                                  )
                                }
                                disabled={loading}
                              >
                                {loading ? "..." : "Dispatch"}
                              </button>
                            </td>
                          </tr>
                        );
                      }),
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
