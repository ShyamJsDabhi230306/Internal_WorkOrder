import { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { getWorkOrders, updateWorkOrderStatus } from "../../API/workOrderApi";
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

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applySearch();
  }, [search, pendingList]);

  const loadData = async () => {
    const data = await getWorkOrders();
    console.log("API DATA:", data);

    const sorted = (data || [])
      .filter(wo => wo.status?.trim().toLowerCase() === "pending")
      .sort((a, b) => b.workOrderId - a.workOrderId);

    setPendingList(sorted);
    setFilteredList(sorted);
  };


  // const formatDate = d => (d ? d.slice(0, 10) : "-");

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
    if (!search.trim()) return setFilteredList(pendingList);

    const s = search.toLowerCase();

    const filtered = pendingList.filter(wo =>
      wo.workOrderNo.toLowerCase().includes(s) ||
      wo.vendorName.toLowerCase().includes(s) ||
      formatDate(wo.workOrderDate).includes(s)
    );

    setFilteredList(filtered);
  };

  // const handleAccept = async (wo) => {
  //   if (!acceptDates[wo.workOrderId]) {
  //     return toast.warning("Select Accept Delivery Date");
  //   }

  //   const vId = auth?.vendorId || auth?.VendorId;

  //   if (!vId) {
  //     return toast.error("Vendor ID not found for current user. Please log in again.");
  //   }

  //   const dto = {
  //     acceptDeliveryDate: acceptDates[wo.workOrderId],
  //   };

  //   console.log("Accepting WorkOrder:", { id: wo.workOrderId, vendorId: vId, dto });

  //   try {
  //     await updateWorkOrderStatus(wo.workOrderId, vId, dto);
  //     toast.success("Accepted Successfully!");
  //     loadData();
  //   } catch (err) {
  //     console.error("Acceptance error:", err);
  //     const errorMsg = err.response?.data?.message || err.response?.data || "Acceptance failed";
  //     toast.error(errorMsg);
  //   }
  // };
const handleAccept = async (wo) => {
  const vendorId = auth?.vendorId ?? auth?.VendorId;

  if (!vendorId) {
    toast.error("Vendor ID missing. Please login again.");
    return;
  }

  const acceptDate = acceptDates[wo.workOrderId];

  if (!acceptDate) {
    toast.warning("Select Accept Delivery Date");
    return;
  }

  const dto = {
    vendorId: Number(vendorId),
    acceptDeliveryDate: acceptDate,
  };

  console.log("Sending DTO:", dto);

  try {
    await updateWorkOrderStatus(wo.workOrderId, dto);
    toast.success("Accepted Successfully!");
    loadData();
  } catch (err) {
    console.log("ERROR RESPONSE:", err.response?.data);
    toast.error(err.response?.data || "Acceptance failed");
  }
};

  return (
    <Layout>
      <div className="container-fluid py-3">

        <div className="card shadow-sm">
          <div className="card-header bg-white">
            <h4 className="fw-bold">Work Order Acceptance</h4>
          </div>

          <div className="p-3">
            <input
              className="form-control"
              placeholder="Search Work Order..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="card-body table-scroll p-0">
            <table className="table table-bordered  align-middle fixed-header">
              <thead className="table-light table-head-lg">
                <tr>
                  <th>WO No</th>
                  <th>WO Date</th>
                  {/* <th>Vendor</th> */}
                  <th>Division</th>
                  <th>Delivery date</th>
                  <th>Attachments</th>
                  <th>Products</th>
                  <th>Accept Delivery</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredList.map(wo => (
                  <>
                    <tr key={wo.workOrderId}>
                      <td>{wo.workOrderNo}</td>
                      <td>{formatDate(wo.workOrderDate)}</td>
                      {/* <td>{wo.vendorName}</td> */}
                      <td>{wo.divisionName}</td>
                      <td>{formatDate(wo.deliveryDate)}</td>
                      <td className="text-center">
                        <POFileActions filePath={wo.poFilePath} />
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() =>
                            setExpandedRow(
                              expandedRow === wo.workOrderId ? null : wo.workOrderId
                            )
                          }
                        >
                          {expandedRow === wo.workOrderId ? "Hide" : "View"}
                        </button>
                      </td>

                      <td>
                        <input
                          type="date"
                          className="form-control"
                          value={acceptDates[wo.workOrderId] || ""}
                          onChange={(e) =>
                            setAcceptDates(prev => ({
                              ...prev,
                              [wo.workOrderId]: e.target.value
                            }))
                          }
                        />
                      </td>

                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleAccept(wo)}
                        >
                          Accept
                        </button>
                      </td>
                    </tr>

                    {expandedRow === wo.workOrderId && (
                      <tr>
                        <td colSpan="7" className="bg-light">
                          <table className="table table-sm table-bordered mb-0">
                            <thead>
                              <tr>
                                <th>Category</th>
                                <th>Product</th>
                                <th>Qty</th>
                              </tr>
                            </thead>
                            <tbody>
                              {wo.products.map(p => (
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
                    <td colSpan="7" className="text-center text-muted py-3">
                      No pending work orders
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
