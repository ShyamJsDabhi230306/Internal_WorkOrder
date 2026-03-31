// ==========================
// UPDATED WORK ORDER REPORT
// ==========================

import { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { getWorkOrders } from "../../API/workOrderApi";
import axiosClient from "../../API/axiosClient";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import POFileActions from "../../Components/POFileActions";
import DispatchFileActions from "../../Components/DispatchFileActions";

export default function WorkOrderReport() {
  const [workOrders, setWorkOrders] = useState([]);
  const [productRows, setProductRows] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [globalSearch, setGlobalSearch] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);

  const user = JSON.parse(localStorage.getItem("auth") || "{}");
  const userTypeId = Number(user.userTypeId) || 0;
  const divisionId = Number(user.divisionId) || 0;
  const locationId = Number(user.locationId) || 0;
  const userId = Number(user.userId) || 0;

  // =========================
  // LOAD DATA (ROLE BASED)
  // =========================

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getWorkOrders();

    let roleBasedData = data;

    // ================= ROLE FILTER =================

    // 🟢 ADMIN → ALL DATA
    if (userTypeId === 1) {
      roleBasedData = data;
    }

    // 🟢 HOD → All divisions under same location
    else if (userTypeId === 2) {
      roleBasedData = data.filter((wo) => wo.fromLocationId === locationId);
    }

    // 🟢 DIVISION USER → Only their division
    else if (userTypeId === 3) {
      roleBasedData = data.filter(
        (wo) =>
          wo.fromDivisionId === divisionId || wo.toDivisionId === divisionId,
      );
    }

    // 🟢 VENDOR → Only their created orders
    else if (userTypeId === 4) {
      roleBasedData = data.filter((wo) => wo.senderUserId === userId);
    }

    setWorkOrders(roleBasedData);

    // ================= FLATTEN PRODUCT ROWS =================

    const rows = [];

    roleBasedData.forEach((wo) => {
      wo.products.forEach((p) => {
        rows.push({
          workOrderId: wo.workOrderId,
          workOrderNo: wo.workOrderNo,
          pono: wo.pono,
          transportBy: wo.transportBy ?? p.transportBy ?? "",
          challanNo: wo.challanNo ?? p.challanNo ?? "",
          fromLocationName: wo.fromLocationName,
          fromDivisionName: wo.fromDivisionName,
          toLocationName: wo.toLocationName,
          toDivisionName: wo.toDivisionName,

          acceptedDivisionName: wo.acceptedDivisionName ?? "",
          divisionName: wo.divisionName ?? "",

          status: wo.status,
          workOrderDate: wo.workOrderDate,
          deliveryDate: wo.deliveryDate,
          acceptDate: wo.acceptDate,
          acceptDeliveryDate: wo.acceptDeliveryDate,
          dispatchDate: wo.dispatchDate,
          receiveDate: wo.receiveDate,

          poFilePath: wo.poFilePath ?? null,
          // dispatchAttachment: wo.dispatchAttachment ?? null,
          priorityType: wo.priorityType,
          orderTypeName: wo.orderTypeName,

          category: p.category,
          product: p.product,
          quantity: Number(p.quantity || 0),
          dispatchedQuantity: Number(p.dispatchedQuantity || 0),
          receivedQuantity: Number(p.receivedQuantity || 0),
          pending: Number(p.quantity || 0) - Number(p.receivedQuantity || 0),
          // ⭐ ADD THIS LINE
          dispatchHistories: p.dispatchHistories || [],
        });
      });
    });

    setProductRows(rows);
    setFiltered(rows);
  };

  // =========================
  // GLOBAL SEARCH
  // =========================

  useEffect(() => {
    let rows = [...productRows];

    // 1. Filter by Status (Completed vs Active)
    if (showCompleted) {
      rows = rows.filter((r) => r.status === "Completed");
    } else {
      rows = rows.filter((r) => r.status !== "Completed");
    }

    if (globalSearch) {
      const q = globalSearch.toLowerCase();

      rows = rows.filter(
        (r) =>
          r.workOrderNo?.toLowerCase().includes(q) ||
          r.fromLocationName?.toLowerCase().includes(q) ||
          r.fromDivisionName?.toLowerCase().includes(q) ||
          r.toDivisionName?.toLowerCase().includes(q) ||
          r.status?.toLowerCase().includes(q) ||
          r.product?.toLowerCase().includes(q) ||
          r.pono?.toLowerCase().includes(q) ||
          formatDate(r.acceptDate).includes(q) ||
          formatDate(r.dispatchDate).includes(q) ||
          formatDate(r.acceptDeliveryDate).includes(q) ||
          formatDate(r.receiveDate).includes(q),
      );
    }

    setFiltered(rows);
  }, [globalSearch, productRows, showCompleted]);

  const formatDate = (v) => {
    if (!v) return "";
    const d = new Date(v);
    if (isNaN(d)) return v?.slice?.(0, 10) || "";
    return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
  };

  // =========================
  // EXPORT EXCEL
  // =========================

  // const exportExcel = () => {
  //   const excelData = filtered.map((row) => ({
  //     "WO No": row.workOrderNo,
  //     "From Location": row.fromLocationName,
  //     "From Division": row.fromDivisionName,
  //     "To Location": row.toLocationName,
  //     "To Division": row.toDivisionName,
  //     Status: row.status,
  //     "WO Date": formatDate(row.workOrderDate),
  //     Product: row.product,
  //     Total: row.quantity,
  //     Dispatched: row.dispatchedQuantity,
  //     Received: row.receivedQuantity,
  //     Pending: row.pending,
  //     pono: row.pono,
  //   }));

  //   const ws = XLSX.utils.json_to_sheet(excelData);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Product Report");
  //   XLSX.writeFile(wb, "WorkOrder_ProductReport.xlsx");
  // };
  const exportExcel = () => {
    const excelData = [];

    filtered.forEach((row, index) => {
      // If dispatch history exists
      if (row.dispatchHistories && row.dispatchHistories.length > 0) {
        row.dispatchHistories.forEach((d) => {
          excelData.push({
            "#": index + 1,
            "WO No": row.workOrderNo,
            PONO: row.pono,
            "From Location": row.fromLocationName,
            "From Division": row.fromDivisionName,
            "To Location": row.toLocationName,
            "To Division": row.toDivisionName,
            Status: row.status,
            "WO Date": formatDate(row.workOrderDate),
            "Accept Date": formatDate(row.acceptDate),
            // "Dispatch Date (WO)": formatDate(row.dispatchDate),
            "Accept Delivery Date": formatDate(row.acceptDeliveryDate),
            "Receive Date": formatDate(row.receiveDate),
            Product: row.product,
            "Total Qty": row.quantity,
            Dispatched: row.dispatchedQuantity,
            Received: row.receivedQuantity,
            Pending: row.pending,

            // "PO Attachment": row.poFilePath || "",

            "Dispatch Date": formatDate(d.dispatchDate),
            "Dispatch Qty": d.dispatchQty,
            "Challan No": d.challanNo,
            Transport: d.transportBy,
            // "Dispatch Attachment": d.dispatchAttachment || ""
          });
        });
      } else {
        // If no dispatch history
        excelData.push({
          "#": index + 1,
          "WO No": row.workOrderNo,
          PONO: row.pono,
          "From Location": row.fromLocationName,
          "From Division": row.fromDivisionName,
          "To Location": row.toLocationName,
          "To Division": row.toDivisionName,
          Status: row.status,
          "WO Date": formatDate(row.workOrderDate),
          "Accept Date": formatDate(row.acceptDate),
          // "Dispatch Date (WO)": formatDate(row.dispatchDate),
          "Accept Delivery Date": formatDate(row.acceptDeliveryDate),
          "Receive Date": formatDate(row.receiveDate),
          Product: row.product,
          "Total Qty": row.quantity,
          Dispatched: row.dispatchedQuantity,
          Received: row.receivedQuantity,
          Pending: row.pending,

          // "PO Attachment": row.poFilePath || "",

          "Dispatch Date": "",
          "Dispatch Qty": "",
          "Challan No": "",
          Transport: "",
          // "Dispatch Attachment": ""
        });
      }
    });

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Product Report");

    XLSX.writeFile(wb, "WorkOrder_ProductReport.xlsx");
  };
  // =========================
  // EXPORT PDF
  // =========================

  // const exportPDF = () => {
  //   const doc = new jsPDF("l", "pt", "a4");

  //   doc.setFontSize(16);
  //   doc.text("Work Order Product Report", 40, 40);

  //   const columns = [
  //     "WO No",
  //     "From Division",
  //     "Status",
  //     "WO Date",
  //     "Product",
  //     "Total",
  //     "Dispatched",
  //     "Received",
  //     "Pending",
  //     "pono",
  //   ];

  //   const rows = filtered.map((r) => [
  //     r.workOrderNo,
  //     r.fromDivisionName,
  //     r.status,
  //     formatDate(r.workOrderDate),
  //     r.product,
  //     r.quantity,
  //     r.dispatchedQuantity,
  //     r.receivedQuantity,
  //     r.pending,
  //     r.pono,
  //   ]);

  //   autoTable(doc, {
  //     head: [columns],
  //     body: rows,
  //     startY: 60,
  //     theme: "grid",
  //   });

  //   doc.save("WorkOrder_ProductReport.pdf");
  // };
  const exportPDF = () => {
    const doc = new jsPDF("l", "pt", "a4");

    doc.setFontSize(16);
    doc.text("Work Order Product Report", 40, 40);

    const columns = [
      "WO No",
      "PONO",
      "From Location",
      "From Division",
      "To Location",
      "To Division",
      "Status",
      "WO Date",
      "Product",
      "Total",
      "Dispatched",
      "Received",
      "Pending",
      "Dispatch Date",
      "Dispatch Qty",
      "Challan",
      "Transport",
    ];

    const rows = [];

    filtered.forEach((row) => {
      if (row.dispatchHistories?.length > 0) {
        row.dispatchHistories.forEach((d) => {
          rows.push([
            row.workOrderNo,
            row.pono,
            row.fromLocationName,
            row.fromDivisionName,
            row.toLocationName,
            row.toDivisionName,
            row.status,
            formatDate(row.workOrderDate),
            row.product,
            row.quantity,
            row.dispatchedQuantity,
            row.receivedQuantity,
            row.pending,

            formatDate(d.dispatchDate),
            d.dispatchQty,
            d.challanNo,
            d.transportBy,
          ]);
        });
      } else {
        rows.push([
          row.workOrderNo,
          row.pono,
          row.fromLocationName,
          row.fromDivisionName,
          row.toLocationName,
          row.toDivisionName,
          row.status,
          formatDate(row.workOrderDate),
          row.product,
          row.quantity,
          row.dispatchedQuantity,
          row.receivedQuantity,
          row.pending,
          "",
          "",
          "",
          "",
        ]);
      }
    });
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 60,
      theme: "grid",

      styles: {
        fontSize: 8,
        cellPadding: 4,
        overflow: "linebreak",
      },

      headStyles: {
        fillColor: [40, 167, 69],
        textColor: 255,
        halign: "center",
      },

      columnStyles: {
        0: { cellWidth: 70 }, // WO No
        1: { cellWidth: 70 }, // PONO
        2: { cellWidth: 80 }, // From Location
        3: { cellWidth: 80 }, // From Division
        4: { cellWidth: 80 }, // To Location
        5: { cellWidth: 80 }, // To Division
        6: { cellWidth: 60 }, // Status
        7: { cellWidth: 70 }, // WO Date
        8: { cellWidth: 180 }, // Product (large)
        9: { cellWidth: 50 }, // Total
        10: { cellWidth: 60 }, // Dispatched
        11: { cellWidth: 60 }, // Received
        12: { cellWidth: 60 }, // Pending
        13: { cellWidth: 80 }, // Dispatch Date
        14: { cellWidth: 60 }, // Dispatch Qty
        15: { cellWidth: 70 }, // Challan
        16: { cellWidth: 80 }, // Transport
      },
    });
    doc.save("WorkOrder_ProductReport.pdf");
  };
  // =========================
  // UI
  // =========================

  return (
    <Layout>
      <div className="container-fluid py-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-bold">
            {showCompleted
              ? "Completed Work Order Report"
              : "Active Work Order Report"}
          </h3>
          <div>
            <button
              className={`btn ${showCompleted ? "btn-primary" : "btn-info"} me-2`}
              onClick={() => setShowCompleted(!showCompleted)}
            >
              {showCompleted ? "View Active Orders" : "View Completed Orders"}
            </button>
            <button className="btn btn-success me-2" onClick={exportExcel}>
              Export Excel
            </button>
          </div>
        </div>

        {/* <button className="btn btn-danger" onClick={exportPDF}>
              Export PDF
            </button> */}
        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Global Search (WO No, Product, PONO, Dates...)"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
          />
        </div>

        <div className="card shadow-sm">
          <div className="card-body p-0">
            <div
              className="table-responsive"
              style={{
                maxHeight: "500px",
                overflowY: "auto",
              }}
            >
              <table className="table table-bordered table-striped m-0">
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
                    <th className="text-center text-nowrap">
                      Product Histories
                    </th>
                    <th className="text-center text-nowrap">WO No</th>
                    <th className="text-center text-nowrap">PONO</th>
                    <th className="text-center text-nowrap">From Location</th>
                    <th className="text-center text-nowrap">From Division</th>
                    <th className="text-center text-nowrap">to Location</th>
                    <th className="text-center text-nowrap">to Division</th>
                    <th className="text-center text-nowrap">Status</th>
                    <th className="text-center text-nowrap">WO Date</th>
                    <th className="text-center text-nowrap">Accept Date</th>
                    {/* <th className="text-center text-nowrap">Dispatch Date</th> */}
                    <th className="text-center text-nowrap">
                      Accept Delivery Date
                    </th>
                    {/* <th className="text-center text-nowrap">Receive Date</th> */}
                    {showCompleted && (
                      <th className="text-center text-nowrap">Receive Date</th>
                    )}
                    <th className="text-center text-nowrap">Product</th>
                    <th className="text-center text-nowrap">Total</th>
                    <th className="text-center text-nowrap">Dispatched</th>
                    <th className="text-center text-nowrap">Received</th>
                    <th className="text-center text-nowrap">Pending</th>
                    <th className="text-center text-nowrap">Attachment</th>

                    {/* <th className="text-center text-nowrap">ChallanNo</th>
                     */}
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((row, i) => (
                    <>
                      <tr key={`${row.workOrderId}_${row.product}_${i}`}>
                        <td className="text-center text-nowrap">{i + 1}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                              setExpandedRow(expandedRow === i ? null : i)
                            }
                          >
                            +
                          </button>
                        </td>
                        <td className="text-center text-nowrap">
                          {row.workOrderNo}
                        </td>
                        <td className="text-center text-nowrap">{row.pono}</td>
                        <td className="text-center text-nowrap">
                          {row.fromLocationName}
                        </td>
                        <td className="text-center text-nowrap">
                          {row.fromDivisionName}
                        </td>
                        <td className="text-center text-nowrap">
                          {row.toLocationName}
                        </td>
                        <td className="text-center text-nowrap">
                          {row.toDivisionName}
                        </td>
                        <td className="text-center text-nowrap">
                          {row.status}
                        </td>
                        <td className="text-center text-nowrap">
                          {formatDate(row.workOrderDate)}
                        </td>
                        <td className="text-center text-nowrap">
                          {formatDate(row.acceptDate)}
                        </td>
                        {/* <td className="text-center text-nowrap">
                          {formatDate(row.dispatchDate)}
                        </td> */}
                        <td className="text-center text-nowrap">
                          {formatDate(row.acceptDeliveryDate)}
                        </td>
                        {/* <td className="text-center text-nowrap">
                          {formatDate(row.receiveDate)}
                        </td> */}
                        {showCompleted && (
                          <
                            td className="text-center text-nowrap">
                            {formatDate(row.receiveDate)}
                          </td>
                        )}
                        <td className="text-center text-nowrap">
                          {row.product}
                        </td>
                        <td className="text-center text-nowrap">
                          {row.quantity}
                        </td>
                        <td className="text-center text-nowrap">
                          {row.dispatchedQuantity}
                        </td>
                        <td className="text-center text-nowrap">
                          {row.receivedQuantity}
                        </td>
                        <td className="text-center text-nowrap">
                          {row.pending}
                        </td>
                        <td>
                          <POFileActions filePath={row.poFilePath} />
                        </td>
                        {/* <td className="text-center text-nowrap">{row.challanNo}</td>
                      <td className="text-center text-nowrap">{row.transportBy}</td>
                    */}
                        {/* <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                              setExpandedRow(expandedRow === i ? null : i)
                            }
                          >
                            +
                          </button>
                        </td> */}
                      </tr>
                      {expandedRow === i && (
                        <tr>
                          <td colSpan="19">
                            <h6 className="fw-bold mb-2">Dispatch History</h6>

                            <table className="table table-sm table-bordered">
                              <thead>
                                <tr>
                                  <th className="text-center text-nowrap">
                                    Dispatch Date
                                  </th>
                                  <th className="text-center text-nowrap">
                                    Dispatch Qty
                                  </th>
                                  <th className="text-center text-nowrap">
                                    Challan
                                  </th>
                                  <th className="text-center text-nowrap">
                                    Transport
                                  </th>
                                  <th className="text-center text-nowrap">
                                    Attachment
                                  </th>
                                </tr>
                              </thead>

                              <tbody>
                                {row.dispatchHistories?.map((d, index) => (
                                  <tr key={index}>
                                    <td className="text-center text-nowrap">
                                      {formatDate(d.dispatchDate)}
                                    </td>

                                    <td className="text-center text-nowrap">
                                      {d.dispatchQty}
                                    </td>

                                    <td className="text-center text-nowrap">
                                      {d.challanNo}
                                    </td>

                                    <td className="text-center text-nowrap">
                                      {d.transportBy}
                                    </td>

                                    <td className="text-center text-nowrap">
                                      <DispatchFileActions
                                        filePath={d.dispatchAttachment}
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
