import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getWorkOrders,
  receiveWorkOrder,
  receiveProduct,
} from "../../API/workOrderApi";
import POFileActions from "../../Components/POFileActions";
import { toast } from "react-toastify";

export default function WorkOrderList() {
  const [workOrders, setWorkOrders] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [search, setSearch] = useState("");
  const [filteredList, setFilteredList] = useState([]);
  const [receiveQty, setReceiveQty] = useState({});
  const navigate = useNavigate();
  const getStatusColor = (status) => {
    if (status === "On Time") return "seagreen";
    // if (status.startsWith("Late Delivery")) return "red";   // ⭐ FIX
    if (status === "Pending Dispatch") return "#FFC107";
    return "gray";
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applySearch();
  }, [search, workOrders]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWorkOrders();
      const sorted = (data || []).sort((a, b) => b.workOrderId - a.workOrderId);
      setWorkOrders(sorted);
      setFilteredList(sorted);
    } catch (err) {
      console.error("Load Data Error:", err);
      setError("Failed to load work orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getProductKey = (workOrderId, productId, woProductId) =>
    `${workOrderId}_${productId}_${woProductId}`;

  const handleReceiveQtyChange = (
    workOrderId,
    productId,
    woProductId,
    value,
  ) => {
    const key = getProductKey(workOrderId, productId, woProductId);
    setReceiveQty((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReceiveProduct = async (
    workOrderId,
    productId,
    dispatchedTotal,
    receivedTotal,
    woProductId,
  ) => {
    const key = getProductKey(workOrderId, productId, woProductId);
    const qty = Number(receiveQty[key] || 0);

    const maxReceivable = dispatchedTotal - receivedTotal;

    if (!qty || qty <= 0) {
      return toast.warning("Please enter a valid quantity greater than 0.");
    }

    if (qty > maxReceivable) {
      return toast.warning(
        `Cannot receive more than available. Max allowed: ${maxReceivable}`,
      );
    }

    try {
      setLoading(true);
      await receiveProduct(workOrderId, productId, {
        qty,
        workOrderProductId: woProductId,
      });

      setReceiveQty((prev) => ({
        ...prev,
        [key]: "",
      }));

      await loadData();
      toast.success("Product received successfully!");
    } catch (err) {
      console.error("Receive Product Error:", err);
      toast.error(
        err.response?.data?.message ||
          "Failed to receive product. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (woId) => {
    if (
      !window.confirm(
        "Are you sure you want to mark this work order as completed?",
      )
    )
      return;

    try {
      setLoading(true);
      await receiveWorkOrder(woId);
      await loadData();
      toast.info("Work order marked as completed!");
    } catch (err) {
      console.error("Complete WO Error:", err);
      toast.error("Failed to complete work order.");
    } finally {
      setLoading(false);
    }
  };

  const isFullyReceived = (wo) =>
    wo.products.every(
      (p) => Number(p.receivedQuantity || 0) >= Number(p.quantity || 0),
    );

  const formatDate = (v) => {
    if (!v) return "";
    const d = new Date(v);
    if (isNaN(d)) return v?.slice?.(0, 10) || "";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const applySearch = () => {
    if (!search.trim()) {
      setFilteredList(workOrders);
      return;
    }

    const s = search.toLowerCase();

    const filtered = workOrders.filter((w) => {
      /* =========================
         WORK ORDER LEVEL SEARCH
      ========================= */
      const rowMatch =
        w.workOrderNo?.toLowerCase().includes(s) ||
        w.vendorName?.toLowerCase().includes(s) ||
        w.priorityType?.toLowerCase().includes(s) ||
        w.status?.toLowerCase().includes(s) ||
        w.pono?.toLowerCase().includes(s) ||
        formatDate(w.workOrderDate)?.includes(s) ||
        formatDate(w.deliveryDate)?.includes(s) ||
        formatDate(w.acceptDate)?.includes(s) ||
        formatDate(w.acceptDeliveryDate)?.includes(s) ||
        formatDate(w.dispatchDate)?.includes(s) ||
        formatDate(w.receiveDate)?.includes(s) ||
        w.orderTypeName?.toLowerCase().includes(s) ||
        (w.preparedBy || "").toLowerCase().includes(s) ||
        (w.address || "").toLowerCase().includes(s) ||
        (w.authorizedPerson || "").toLowerCase().includes(s) ||
        (w.deliveryStatus || "").toLowerCase().includes(s);

      /* =========================
         PRODUCT LEVEL SEARCH
      ========================= */
      const productMatch = w.products?.some((p) => {
        const lastDispatchQty = Number(p.lastDispatchedQty ?? 0);

        return (
          p.product?.toLowerCase().includes(s) ||
          p.category?.toLowerCase().includes(s) ||
          String(p.quantity).includes(s) ||
          String(p.dispatchedQuantity).includes(s) ||
          String(lastDispatchQty).includes(s) ||
          String(p.receivedQuantity).includes(s)
        );
      });

      return rowMatch || productMatch;
    });

    setFilteredList(filtered);
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header py-3">
        {/* <div className="d-flex justify-content-between align-items-center">
          <h4 className="fw-bold">Work Order List</h4>

          <input
            className="form-control w-25"
            placeholder="Search Work Orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div> */}
        <h4 className="fw-bold mb-0">Work Order List</h4>
        <div className="col-md-4 col-12 ms-auto mb-1 p-1">
          <input
            type="text"
            className="form-control"
            placeholder="Search WO, Vendor, Product, Status, Dates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card-body p-0">
        <div
          className="table-responsive"
          style={{
            maxHeight: "500px",
            overflowY: "auto",
          }}
        >
          <table className="table table-bordered table-striped m-0">
            {/* <thead className="bg-dark border-bottom border-secondary"> */}
            <thead
              className="bg-dark border-bottom border-secondary"
              style={{
                position: "sticky",
                top: 0,
                zIndex: 2,
              }}
            >
              <tr>
                <th>#</th>
                <th className="text-center text-nowrap">WO No</th>
                {/* className="text-center text-nowrap" <th>Person</th> */}
                <th className="text-center text-nowrap">Location</th>
                <th className="text-center text-nowrap">Division</th>
                <th className="text-center text-nowrap">PoNo</th>
                <th className="text-center text-nowrap">Status</th>
                <th className="text-center text-nowrap">Delivery Status</th>

                <th className="text-center text-nowrap">Work Order Date</th>
                <th className="text-center text-nowrap">Delivery Date</th>

                <th className="text-center text-nowrap">Order Type</th>
                <th className="text-center text-nowrap">Prepared By</th>
                <th className="text-center text-nowrap">Marketing Person</th>

                <th className="text-center text-nowrap">Accept Date</th>
                <th className="text-center text-nowrap">
                  Accept Delivery Date
                </th>

                <th className="text-center text-nowrap">Dispatch Date</th>
                <th className="text-center text-nowrap">Receive Date</th>
                <th className="text-center text-nowrap">Attachments</th>
                <th className="text-center text-nowrap">Products</th>
                <th className="text-center text-nowrap" width="220">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredList.map((w, index) => {
                const fullyReceived = isFullyReceived(w);

                return (
                  <>
                    <tr key={w.workOrderId}>
                      <td className="text-center text-nowrap">{index + 1}</td>
                      <td className="text-center text-nowrap">
                        {w.workOrderNo}
                      </td>
                      {/* <td>{w.vendorName}</td> */}
                      <td className="text-center text-nowrap">
                        {w.toLocationName}
                      </td>
                      <td className="text-center text-nowrap">
                        {w.toDivisionName}
                      </td>
                      <td className="text-center text-nowrap">{w.pono}</td>
                      <td className="text-center text-nowrap">
                        <span className="badge bg-info">{w.status}</span>
                      </td>
                      <td
                        className="text-center text-nowrap"
                        style={{
                          backgroundColor: getStatusColor(w.deliveryStatus),
                          color: "white",
                        }}
                      >
                        {w.deliveryStatus}
                      </td>

                      <td className="text-center text-nowrap">
                        {formatDate(w.workOrderDate)}
                      </td>
                      <td className="text-center text-nowrap">
                        {formatDate(w.deliveryDate)}
                      </td>

                      <td className="text-center text-nowrap">
                        {w.orderTypeName}
                      </td>
                      <td className="text-center text-nowrap">
                        {w.preparedBy}
                      </td>
                      <td className="text-center text-nowrap">
                        {w.authorizedPerson}
                      </td>

                      <td className="text-center text-nowrap">
                        {formatDate(w.acceptDate)}
                      </td>
                      <td className="text-center text-nowrap">
                        {formatDate(w.acceptDeliveryDate)}
                      </td>

                      <td className="text-center text-nowrap">
                        {formatDate(w.dispatchDate)}
                      </td>
                      <td className="text-center text-nowrap">
                        {formatDate(w.receiveDate)}
                      </td>
                      <td className="text-center text-nowrap">
                        <POFileActions filePath={w.poFilePath} />
                      </td>
                      <td className="text-center text-nowrap">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() =>
                            setExpandedRow(
                              expandedRow === w.workOrderId
                                ? null
                                : w.workOrderId,
                            )
                          }
                        >
                          {expandedRow === w.workOrderId ? "Hide" : "View"}
                        </button>
                      </td>

                      <td className="text-center text-nowrap">
                        {/* ⭐ HIDE EDIT IF STATUS = Accepted / Dispatched / Completed */}
                        {!["Accepted", "Dispatched", "Completed"].includes(
                          w.status,
                        ) && (
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() =>
                              navigate(`/workorder/edit/${w.workOrderId}`)
                            }
                          >
                            Edit
                          </button>
                        )}

                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleMarkComplete(w.workOrderId)}
                          disabled={
                            w.status === "Completed" ||
                            !fullyReceived ||
                            loading
                          }
                        >
                          {w.status === "Completed"
                            ? "Completed"
                            : fullyReceived
                              ? "Mark Completed"
                              : "Dispatch Pending"}
                        </button>
                      </td>
                    </tr>

                    {expandedRow === w.workOrderId && (
                      <tr>
                        <td colSpan="18">
                          <h6 className="fw-bold mb-2">Product Breakdown</h6>

                          <table className="table table-sm table-bordered">
                            <thead>
                              <tr>
                                <th className="text-center text-nowrap">
                                  Category
                                </th>
                                <th className="text-center text-nowrap">
                                  Product
                                </th>
                                <th className="text-center text-nowrap">
                                  Total Qty
                                </th>
                                <th className="text-center text-nowrap">
                                  Last Dispatch Qty
                                </th>
                                <th className="text-center text-nowrap">
                                  Total Dispatched Qty
                                </th>
                                <th className="text-center text-nowrap">
                                  Received Qty
                                </th>
                                <th className="text-center text-nowrap">
                                  Pending Qty
                                </th>
                                <th className="text-center text-nowrap">
                                  Receive
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              {w.products && w.products.length > 0 ? (
                                w.products.map((p) => {
                                  const total = Number(p.quantity || 0);
                                  const lastDispatchQty =
                                    p.dispatchHistories?.length > 0
                                      ? p.dispatchHistories[
                                          p.dispatchHistories.length - 1
                                        ].dispatchQty
                                      : 0;
                                  const dispatchedTotal = Number(
                                    p.dispatchedQuantity || 0,
                                  );
                                  const received = Number(
                                    p.receivedQuantity || 0,
                                  );
                                  const pending = total - received;
                                  const maxReceivable =
                                    dispatchedTotal - received;

                                  const key = `${w.workOrderId}_${p.productId}_${p.workOrderProductId}`;
                                  const currentInput = receiveQty[key] || "";

                                  const canReceive =
                                    maxReceivable > 0 && received < total;

                                  return (
                                    <tr key={p.workOrderProductId}>
                                      <td className="text-center text-nowrap">
                                        {p.category}
                                      </td>
                                      <td className="text-center text-nowrap">
                                        {p.product}
                                      </td>
                                      <td className="text-center text-nowrap">
                                        {total}
                                      </td>
                                      <td className="text-center text-nowrap">
                                        {lastDispatchQty}
                                      </td>
                                      <td className="text-center text-nowrap">
                                        {dispatchedTotal}
                                      </td>
                                      <td className="text-center text-nowrap">
                                        {received}
                                      </td>
                                      <td className="text-center text-nowrap">
                                        {pending}
                                      </td>

                                      <td>
                                        {canReceive ? (
                                          <div className="d-flex gap-2 align-items-center">
                                            <input
                                              type="number"
                                              className="form-control form-control-sm"
                                              style={{ maxWidth: "90px" }}
                                              value={currentInput}
                                              onChange={(e) =>
                                                handleReceiveQtyChange(
                                                  w.workOrderId,
                                                  p.productId,
                                                  p.workOrderProductId,
                                                  e.target.value,
                                                )
                                              }
                                            />
                                            <button
                                              className="btn btn-sm btn-success"
                                              onClick={() =>
                                                handleReceiveProduct(
                                                  w.workOrderId,
                                                  p.productId,
                                                  dispatchedTotal,
                                                  received,
                                                  p.workOrderProductId,
                                                )
                                              }
                                            >
                                              Receive
                                            </button>
                                          </div>
                                        ) : (
                                          <span className="text-muted small">
                                            {received >= total
                                              ? "Received"
                                              : "Not Dispatched Total Yet"}
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })
                              ) : (
                                <tr>
                                  <td
                                    colSpan="8"
                                    className="text-center text-muted"
                                  >
                                    No products found
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
