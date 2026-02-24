import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getWorkOrders,
  receiveWorkOrder,
  receiveProduct,
} from "../../API/workOrderApi";
import POFileActions from "../../Components/POFileActions";


export default function WorkOrderList() {
  const [workOrders, setWorkOrders] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [search, setSearch] = useState("");
  const [filteredList, setFilteredList] = useState([]);
  const [receiveQty, setReceiveQty] = useState({});
  const navigate = useNavigate();
  const getStatusColor = (status) => {
    if (status === "On Time") return "seagreen";
    if (status.startsWith("Late Delivery")) return "red";   // ⭐ FIX
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

  const handleReceiveQtyChange = (workOrderId, productId, woProductId, value) => {
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
    woProductId
  ) => {
    const key = getProductKey(workOrderId, productId, woProductId);
    const qty = Number(receiveQty[key] || 0);

    const maxReceivable = dispatchedTotal - receivedTotal;

    if (!qty || qty <= 0) {
      return alert("Please enter a valid quantity greater than 0.");
    }

    if (qty > maxReceivable) {
      return alert(`Cannot receive more than available. Max allowed: ${maxReceivable}`);
    }

    try {
      setLoading(true);
      await receiveProduct(workOrderId, productId, { qty, workOrderProductId: woProductId });

      setReceiveQty((prev) => ({
        ...prev,
        [key]: "",
      }));

      await loadData();
      alert("Product received successfully!");
    } catch (err) {
      console.error("Receive Product Error:", err);
      alert(err.response?.data?.message || "Failed to receive product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (woId) => {
    if (!window.confirm("Are you sure you want to mark this work order as completed?")) return;

    try {
      setLoading(true);
      await receiveWorkOrder(woId);
      await loadData();
      alert("Work order marked as completed!");
    } catch (err) {
      console.error("Complete WO Error:", err);
      alert("Failed to complete work order.");
    } finally {
      setLoading(false);
    }
  };

  const isFullyReceived = (wo) =>
    wo.products.every(
      (p) => Number(p.receivedQuantity || 0) >= Number(p.quantity || 0)
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

      <div className="card-body">
        <div className="table-scroll mt-3">

          <table className="table table-bordered  align-middle fixed-header table-single-line">
            <thead>
              <tr>
                <th>#</th>
                <th>WO No</th>
                {/* <th>Person</th> */}
                <th>Location</th>
                <th>Division</th>
                <th>Status</th>
                <th>Delivery Status</th>

                <th>Work Order Date</th>
                <th>Delivery Date</th>

                <th>Order Type</th>
                <th>Prepared By</th>
                <th>Marketing Person</th>

                <th>Accept Date</th>
                <th>Accept Delivery Date</th>

                <th>Dispatch Date</th>
                <th>Receive Date</th>
                <th>Attachments</th>
                <th>Products</th>
                <th width="220">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredList.map((w, index) => {
                const fullyReceived = isFullyReceived(w);

                return (
                  <>
                    <tr key={w.workOrderId}>
                      <td>{index + 1}</td>
                      <td>{w.workOrderNo}</td>
                      {/* <td>{w.vendorName}</td> */}
                      <td>{w.toLocationName}</td>
                      <td>{w.toDivisionName}</td>
                      <td>
                        <span className="badge bg-info">{w.status}</span>
                      </td>
                      <td style={{ backgroundColor: getStatusColor(w.deliveryStatus), color: 'white' }}>
                        {w.deliveryStatus}
                      </td>

                      <td>{formatDate(w.workOrderDate)}</td>
                      <td>{formatDate(w.deliveryDate)}</td>

                      <td>{w.orderTypeName}</td>
                      <td>{w.preparedBy}</td>
                      <td>{w.authorizedPerson}</td>

                      <td>{formatDate(w.acceptDate)}</td>
                      <td>{formatDate(w.acceptDeliveryDate)}</td>

                      <td>{formatDate(w.dispatchDate)}</td>
                      <td>{formatDate(w.receiveDate)}</td>
                      <td className="text-center">
                        <POFileActions filePath={w.poFilePath} />
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() =>
                            setExpandedRow(
                              expandedRow === w.workOrderId
                                ? null
                                : w.workOrderId
                            )
                          }
                        >
                          {expandedRow === w.workOrderId ? "Hide" : "View"}
                        </button>
                      </td>


                      <td>
                        {/* ⭐ HIDE EDIT IF STATUS = Accepted / Dispatched / Completed */}
                        {!["Accepted", "Dispatched", "Completed"].includes(w.status) && (
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => navigate(`/workorder/edit/${w.workOrderId}`)}
                          >
                            Edit
                          </button>
                        )}

                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleMarkComplete(w.workOrderId)}
                          disabled={w.status === "Completed" || !fullyReceived || loading}
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
                        <td colSpan="16">
                          <h6 className="fw-bold mb-2">Product Breakdown</h6>

                          <table className="table table-sm table-bordered">
                            <thead>
                              <tr>
                                <th>Category</th>
                                <th>Product</th>
                                <th>Total Qty</th>
                                <th>Last Dispatch Qty</th>
                                <th> Total Dispatched Qty</th>
                                <th>Received Qty</th>
                                <th>Pending Qty</th>
                                <th>Receive</th>
                              </tr>
                            </thead>

                            <tbody>
                              {w.products.map((p, i) => {
                                const total = Number(p.quantity || 0);

                                const lastDispatchQty = Number(p.lastDispatchedQty ?? 0); // last cycle
                                const dispatchedTotal = Number(p.dispatchedQuantity || 0); // TOTAL dispatched

                                const received = Number(p.receivedQuantity || 0);
                                const pending = total - received;

                                // receive allowed (total dispatched - total received)
                                const maxReceivable = dispatchedTotal - received;

                                const key = getProductKey(w.workOrderId, p.productId, p.workOrderProductId);
                                const currentInput = receiveQty[key] || "";

                                const canReceive =
                                  maxReceivable > 0 && received < total;

                                return (
                                  <tr key={p.workOrderProductId}>
                                    <td>{p.category}</td>
                                    <td>{p.product}</td>
                                    <td>{total}</td>

                                    {/* LAST Dispatch Qty */}
                                    <td>{lastDispatchQty}</td>

                                    {/* NEW COLUMN: TOTAL Dispatched Qty */}
                                    <td>{dispatchedTotal}</td>

                                    <td>{received}</td>
                                    <td>{pending}</td>

                                    <td>
                                      {canReceive ? (
                                        <div className="d-flex gap-2 align-items-center">
                                          <input
                                            type="number"
                                            className="form-control form-control-sm no-spin"
                                            style={{ maxWidth: "90px" }}
                                            placeholder="Qty"
                                            value={currentInput}
                                            onChange={(e) =>
                                              handleReceiveQtyChange(
                                                w.workOrderId,
                                                p.productId,
                                                p.workOrderProductId,
                                                e.target.value
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
                                                p.workOrderProductId
                                              )
                                            }
                                          >
                                            Receive
                                          </button>
                                        </div>
                                      ) : (
                                        <span className="text-muted small">
                                          {received >= total ? "Received" : "Pending"}
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
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



