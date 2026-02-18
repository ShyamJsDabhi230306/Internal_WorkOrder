import { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { getAcceptedWorkOrders } from "../../API/workOrderApi";
import POFileActions from "../../Components/POFileActions";

export default function WorkOrderManageAccepted() {
  const [acceptedList, setAcceptedList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [search, setSearch] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applySearch();
  }, [search, acceptedList]);

  const loadData = async () => {
    const user = JSON.parse(localStorage.getItem("auth") || "{}");
    const data = await getAcceptedWorkOrders(user.userTypeId, user.divisionId, user.vendorId);

    const sorted = data.sort(
      (a, b) => b.workOrderId - a.workOrderId
    );

    setAcceptedList(sorted);
    setFilteredList(sorted);
  };

  //   const formatDate = (d) => (d ? d.slice(0, 10) : "-");

  const formatDate = (v) => {
    if (!v) return "";

    // works for "2026-01-07", ISO string, Date object
    const d = new Date(v);
    if (isNaN(d)) return v?.slice?.(0, 10) || "";

    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();

    return `${dd}-${mm}-${yyyy}`;
  };


  const applySearch = () => {
    if (!search.trim()) {
      setFilteredList(acceptedList);
      return;
    }

    const s = search.toLowerCase();

    const filtered = acceptedList.filter(
      (wo) =>
        wo.workOrderNo.toLowerCase().includes(s) ||
        wo.vendorName?.toLowerCase().includes(s) ||
        wo.divisionName?.toLowerCase().includes(s) ||
        formatDate(wo.acceptDate).includes(s)
    );

    setFilteredList(filtered);
  };

  return (
    <Layout>
      <div className="container-fluid py-3">
        <div className="card shadow-sm">
          <div className="card-header bg-white">
            <h4 className="fw-bold text-success">
              Accepted Work Orders
            </h4>
          </div>

          <div className="p-3">
            <input
              className="form-control"
              placeholder="Search Accepted Work Orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="card-body table-scroll p-0">
            <table className="table table-bordered align-middle fixed-header">
              <thead className="table-light table-head-lg">
                <tr>
                  <th>WO No</th>
                  <th>WO Date</th>
                  <th>Division</th>
                  <th>Accepted On</th>
                  <th>Target Delivery</th>
                  <th>Attachments</th>
                  <th>Products</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredList.map((wo) => (
                  <>
                    <tr key={wo.workOrderId}>
                      <td>{wo.workOrderNo}</td>
                      <td>{formatDate(wo.workOrderDate)}</td>
                      <td>{wo.divisionName}</td>
                      <td>{formatDate(wo.acceptDate)}</td>
                      <td>{formatDate(wo.acceptDeliveryDate)}</td>

                      <td className="text-center">
                        <POFileActions filePath={wo.poFilePath} />
                      </td>

                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() =>
                            setExpandedRow(
                              expandedRow === wo.workOrderId
                                ? null
                                : wo.workOrderId
                            )
                          }
                        >
                          {expandedRow === wo.workOrderId
                            ? "Hide"
                            : "View"}
                        </button>
                      </td>

                      <td>
                        <span className="badge bg-success">
                          Accepted
                        </span>
                      </td>
                    </tr>

                    {expandedRow === wo.workOrderId && (
                      <tr>
                        <td colSpan="8" className="bg-light">
                          <table className="table table-sm table-bordered mb-0">
                            <thead>
                              <tr>
                                <th>Category</th>
                                <th>Product</th>
                                <th>Qty</th>
                              </tr>
                            </thead>
                            <tbody>
                              {wo.products.map((p) => (
                                <tr key={p.productId}>
                                  <td>{p.category}</td>
                                  <td>{p.product}</td>
                                  <td>{p.quantity}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </>
                ))}

                {filteredList.length === 0 && (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center text-muted py-3"
                    >
                      No accepted work orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
