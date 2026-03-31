import { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { getAcceptedWorkOrders } from "../../API/workOrderApi";
import POFileActions from "../../Components/POFileActions";
import { useAuth } from "../../API/AuthContext";

export default function WorkOrderManageAccepted() {
  const { auth } = useAuth();
  const [acceptedList, setAcceptedList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const [expandedRow, setExpandedRow] = useState(null);

  const loadData = async () => {
    if (!auth) return;
    setLoading(true);
    setLoadError(null);
    try {
      const data = await getAcceptedWorkOrders(auth.userTypeId, auth.divisionId, auth.locationId, auth.userId);
      const sorted = (data || []).sort((a, b) => b.workOrderId - a.workOrderId);
      setAcceptedList(sorted);
      setFilteredList(sorted);
    } catch (e) {
      console.error("Load accepted failed", e);
      setLoadError("Failed to load accepted work orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [auth]);

  useEffect(() => {
    applySearch();
  }, [search, acceptedList]);

  const formatDate = (v) => {
    if (!v) return "-";
    const d = new Date(v);
    if (isNaN(d)) return v;
    return d.toLocaleDateString("en-GB");
  };

  const applySearch = () => {
    if (!search.trim()) return setFilteredList(acceptedList);
    const s = search.toLowerCase();
    const filtered = acceptedList.filter(wo =>
      (wo.workOrderNo || "").toLowerCase().includes(s) ||
      (wo.fromDivisionName || "").toLowerCase().includes(s)
    );
    setFilteredList(filtered);
  };

  return (
    <Layout>
      <div className="container-fluid py-3">
        <h3 className="text-white mb-4">Accepted Work Orders</h3>

        <div className="card bg-dark-glass text-white border-0 shadow mb-4">
          <div className="card-body p-3">
            <input
              className="form-control bg-dark text-white border-secondary"
              placeholder="Search Accepted Work Orders..."
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
          {loading && (
            <div className="p-4 text-center">
              <div className="spinner-border text-info" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-white-50">Fetching your accepted work orders...</p>
            </div>
          )}
          <div className="card-body p-0">
         <div 
  className="table-responsive"
  style={{ 
    maxHeight: "500px", 
    overflowY: "auto" 
  }}
>
              <table className="table table-dark table-hover align-middle mb-0">
                <thead 
  className="bg-dark border-bottom border-secondary"
  style={{ 
    position: "sticky", 
    top: 0, 
    zIndex: 2 
  }}
>
                  <tr>
                    <th className="text-center text-nowrap">WO No</th>
                    <th className="text-center text-nowrap">WO Date</th>
                    <th className="text-center text-nowrap">Source Division</th>
                    <th className="text-center text-nowrap">Accepted Date</th>
                    <th className="text-center text-nowrap">Target Delivery</th>
                    <th className="text-center text-nowrap">Files</th>
                    <th className="text-center text-nowrap">Items</th>
                    <th className="text-center text-nowrap" width="120">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.map(wo => (
                    <tr key={wo.workOrderId}>
                      <td className="fw-bold text-white text-center text-nowrap">{wo.workOrderNo}</td>
                      <td className="text-white text-center text-nowrap">{formatDate(wo.workOrderDate)}</td>
                      <td className="text-white text-center text-nowrap">{wo.fromDivisionName}</td>
                      <td className="text-white text-center text-nowrap">{formatDate(wo.acceptDate)}</td>
                      <td className="text-white text-center text-nowrap">{formatDate(wo.acceptDeliveryDate)}</td>
                      <td><POFileActions filePath={wo.poFilePath} /></td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-info"
                          onClick={() => setExpandedRow(expandedRow === wo.workOrderId ? null : wo.workOrderId)}
                        >
                          {expandedRow === wo.workOrderId ? "Hide" : "View"}
                        </button>
                      </td>
                      <td><span className="badge bg-success">Accepted</span></td>
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
                      <td className="text-white">{p.category}</td>
                      <td className="text-white">{p.product}</td>
                      <td className="text-white">{p.quantity}</td>
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
