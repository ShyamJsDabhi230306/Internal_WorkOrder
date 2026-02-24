import { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { getWorkOrders, acceptWorkOrder } from "../../API/workOrderApi";
import POFileActions from "../../Components/POFileActions";
import { toast } from "react-toastify";
import { useAuth } from "../../API/AuthContext";

export default function WorkOrderManageAccept() {
  const { auth } = useAuth();
  const [pendingList, setPendingList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [search, setSearch] = useState("");
  const [acceptDates, setAcceptDates] = useState({});
  const [expandedRow, setExpandedRow] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await getWorkOrders(true);
      const sorted = (data || [])
        .filter(wo => (wo.status || "").toLowerCase() === "pending")
        .sort((a, b) => b.workOrderId - a.workOrderId);
      setPendingList(sorted);
      setFilteredList(sorted);
    } catch (e) {
      console.error("Load failed", e);
      setLoadError("Failed to load pending work orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applySearch();
  }, [search, pendingList]);

  const formatDate = (v) => {
    if (!v) return "-";
    const d = new Date(v);
    if (isNaN(d)) return v;
    return d.toLocaleDateString("en-GB");
  };

  const applySearch = () => {
    if (!search.trim()) return setFilteredList(pendingList);
    const s = search.toLowerCase();
    const filtered = pendingList.filter(wo =>
      (wo.workOrderNo || "").toLowerCase().includes(s) ||
      (wo.fromDivisionName || "").toLowerCase().includes(s)
    );
    setFilteredList(filtered);
  };

  const handleAccept = async (wo) => {
    const acceptDate = acceptDates[wo.workOrderId];
    if (!acceptDate) return toast.warning("Please select an Accept Delivery Date.");

    if (!window.confirm(`Are you sure you want to accept Work Order ${wo.workOrderNo}?`)) return;

    setLoading(true);
    try {
      await acceptWorkOrder(wo.workOrderId, {
        acceptDeliveryDate: acceptDate,
        acceptedByUserId: auth?.userId,
        acceptedByDivisionId: auth?.divisionId
      });
      toast.success("Work Order Accepted successfully!");
      await loadData();
    } catch (err) {
      console.error("Acceptance failed", err);
      toast.error(err.response?.data?.message || "Acceptance failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container-fluid py-3">
        <h3 className="text-white mb-4">Pending Acceptance</h3>

        <div className="card bg-dark-glass text-white border-0 shadow mb-4">
          <div className="card-body p-3">
            <input
              className="form-control bg-dark text-white border-secondary"
              placeholder="Search by Work Order or Source Division..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="card bg-dark-glass text-white border-0 shadow">
          {loadError && (
            <div className="alert alert-danger m-3 mb-0">
              <strong>Error:</strong> {loadError}
            </div>
          )}
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>WO No</th>
                    <th>WO Date</th>
                    <th>Source Division</th>
                    <th>Target Delivery</th>
                    <th>Files</th>
                    <th>Items</th>
                    <th width="180">Accept Delivery</th>
                    <th width="120">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.length === 0 && !loadError && (
                    <tr>
                      <td colSpan={8} className="text-center py-4 text-white-50">
                        No pending work orders found for your division.
                      </td>
                    </tr>
                  )}
                  {filteredList.map(wo => (
                    <tr key={wo.workOrderId}>
                      <td>{wo.workOrderNo}</td>
                      <td>{formatDate(wo.workOrderDate)}</td>
                      <td>{wo.fromDivisionName}</td>
                      <td>{formatDate(wo.deliveryDate)}</td>
                      <td><POFileActions filePath={wo.poFilePath} /></td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-info"
                          onClick={() => setExpandedRow(expandedRow === wo.workOrderId ? null : wo.workOrderId)}
                        >
                          {expandedRow === wo.workOrderId ? "Hide Items" : "View Items"}
                        </button>
                      </td>
                      <td>
                        <input
                          type="date"
                          className="form-control form-control-sm bg-dark text-white border-secondary"
                          value={acceptDates[wo.workOrderId] || ""}
                          onChange={(e) => setAcceptDates(prev => ({ ...prev, [wo.workOrderId]: e.target.value }))}
                          disabled={loading}
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </td>
                      <td>
                        <button
                          className="btn btn-success btn-sm w-100"
                          onClick={() => handleAccept(wo)}
                          disabled={loading}
                        >
                          {loading ? "Processing..." : "Accept"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {expandedRow && (
          <div className="mt-3 card bg-dark-glass text-white border-0 shadow">
            <div className="card-header border-bottom border-secondary">Items for {filteredList.find(x => x.workOrderId === expandedRow)?.workOrderNo}</div>
            <div className="card-body p-0">
              <table className="table table-dark table-sm mb-0">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Product</th>
                    <th>Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.find(x => x.workOrderId === expandedRow)?.products.map(p => (
                    <tr key={p.productId}>
                      <td>{p.category}</td>
                      <td>{p.product}</td>
                      <td>{p.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
