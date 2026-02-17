
import { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { getWorkOrders } from "../../API/workOrderApi";
import axiosClient from "../../API/axiosClient";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import POFileActions from "../../Components/POFileActions";

export default function WorkOrderReport() {
  const [workOrders, setWorkOrders] = useState([]);
  const [productRows, setProductRows] = useState([]); // NEW
  const [filtered, setFiltered] = useState([]);
  const [productList, setProductList] = useState([]);
  // FILTER STATES
  const [search, setSearch] = useState("");
  const [division, setDivision] = useState("");
  const [status, setStatus] = useState("");
  const [vendor, setVendor] = useState("");
  const [product, setProduct] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userTypeId = Number(user.userTypeId);

  // LOAD DATA
  useEffect(() => {
    loadData();
    loadProducts();
  }, []);
  const loadData = async () => {
    const data = await getWorkOrders();
    setWorkOrders(data);

    const rows = [];

    data.forEach((wo) => {
      wo.products.forEach((p) => {
        rows.push({
          // ================= WORK ORDER =================
          workOrderId: wo.workOrderId,
          workOrderNo: wo.workOrderNo,
          vendorName: wo.vendorName,

          divisionName: wo.divisionName,   // ✅ ADD THIS
          status: wo.status,
          workOrderDate: wo.workOrderDate,
          deliveryDate: wo.deliveryDate,

          acceptDate: wo.acceptDate ?? null,
          acceptDeliveryDate: wo.acceptDeliveryDate ?? null,
          dispatchDate: wo.dispatchDate ?? null,
          receiveDate: wo.receiveDate ?? null,

          poFilePath: wo.poFilePath ?? null,   // ✅ ADD THIS LINE
          priorityType: wo.priorityType,
          orderTypeName: wo.orderTypeName,

          // ================= PRODUCT =================
          category: p.category,
          product: p.product,
          quantity: Number(p.quantity || 0),
          dispatchedQuantity: Number(p.dispatchedQuantity || 0),
          receivedQuantity: Number(p.receivedQuantity || 0),
          pending:
            Number(p.quantity || 0) -
            Number(p.receivedQuantity || 0),
        });
      });
    });

    console.log("Flattened rows:", rows[0]); // 🔥 MUST SEE DATES HERE

    setProductRows(rows);
    setFiltered(rows);
  };

  // const loadData = async () => {
  //   const data = await getWorkOrders();
  //   setWorkOrders(data);

  //   // FLATTEN WO → PRODUCT WISE ROWS
  //   const rows = [];

  //   data.forEach((wo) => {
  //     wo.products.forEach((p) => {
  //       rows.push({
  //         workOrderId: wo.workOrderId,
  //         workOrderNo: wo.workOrderNo,
  //         vendorName: wo.vendorName,
  //         status: wo.status,
  //         workOrderDate: wo.workOrderDate,
  //         deliveryDate: wo.deliveryDate,
  //         priorityType: wo.priorityType,
  //         orderTypeName: wo.orderTypeName,

  //          acceptDate: wo.acceptDate,
  //     acceptDeliveryDate: wo.acceptDeliveryDate,
  //     dispatchDate: wo.dispatchDate,
  //     receiveDate: wo.receiveDate,



  //         // PRODUCT-WISE
  //         category: p.category,
  //         product: p.product,
  //         quantity: Number(p.quantity || 0),
  //         dispatchedQuantity: Number(p.dispatchedQuantity || 0),
  //         receivedQuantity: Number(p.receivedQuantity || 0),
  //         pending: Number(p.quantity || 0) - Number(p.receivedQuantity || 0),
  //       });
  //     });
  //   });

  //   setProductRows(rows);
  //   setFiltered(rows);
  // };
  
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

  const loadProducts = async () => {
    try {
      const res = await axiosClient.get("/Product");
      setProductList(res.data || []);
    } catch (err) {
      console.error("Product load failed", err);
    }
  };
  // // APPLY FILTERS
  // const applyFilter = () => {
  //   let rows = [...productRows];

  //   if (search)
  //     rows = rows.filter((x) =>
  //       x.workOrderNo.toLowerCase().includes(search.toLowerCase())
  //     );

  //   if (vendor)
  //     rows = rows.filter(
  //       (x) => x.vendorName.toLowerCase() === vendor.toLowerCase()
  //     );

  //   if (status)
  //     rows = rows.filter(
  //       (x) => x.status.toLowerCase() === status.toLowerCase()
  //     );

  //   if (product)
  //     rows = rows.filter((x) =>
  //       x.product.toLowerCase().includes(product.toLowerCase())
  //     );

  //   if (fromDate)
  //     rows = rows.filter(
  //       (x) => formatDate(x.workOrderDate) >= fromDate
  //     );

  //   if (toDate)
  //     rows = rows.filter(
  //       (x) => formatDate(x.workOrderDate) <= toDate
  //     );

  //   setFiltered(rows);
  // };

  // const resetFilter = () => {
  //   setSearch("");
  //   setVendor("");
  //   setStatus("");
  //   setProduct("");
  //   setFromDate("");
  //   setToDate("");
  //   setFiltered(productRows);
  // };


  useEffect(() => {
    let rows = [...productRows];

    // WO NO
    if (search)
      rows = rows.filter(r =>
        r.workOrderNo?.toLowerCase().includes(search.toLowerCase())
      );

    // ADMIN → Vendor filter
    if ((userTypeId === 1 || userTypeId === 2) && vendor)
      rows = rows.filter(r =>
        r.vendorName?.toLowerCase().includes(vendor.toLowerCase())
      );

    // ADMIN → Division filter
    if ((userTypeId === 1 || userTypeId === 3) && division)
      rows = rows.filter(r =>
        r.divisionName?.toLowerCase().includes(division.toLowerCase())
      );

    // STATUS
    if (status)
      rows = rows.filter(r => r.status === status);

    // PRODUCT
    if (product)
      rows = rows.filter(r =>
        r.product?.toLowerCase().includes(product.toLowerCase())
      );

    // FROM DATE
    if (fromDate)
      rows = rows.filter(r =>
        r.workOrderDate?.slice(0, 10) >= fromDate
      );

    // TO DATE
    if (toDate)
      rows = rows.filter(r =>
        r.workOrderDate?.slice(0, 10) <= toDate
      );
    // 🔍 GLOBAL SEARCH (ALL FIELDS)
    if (globalSearch) {
      const q = globalSearch.toLowerCase();

      rows = rows.filter((r) =>
        r.workOrderNo?.toLowerCase().includes(q) ||
        r.vendorName?.toLowerCase().includes(q) ||
        r.divisionName?.toLowerCase().includes(q) ||
        r.status?.toLowerCase().includes(q) ||
        r.product?.toLowerCase().includes(q) ||
        r.category?.toLowerCase().includes(q) ||
        r.priorityType?.toLowerCase().includes(q) ||
        r.orderTypeName?.toLowerCase().includes(q) ||
        r.workOrderDate?.includes(q) ||
        r.acceptDate?.includes(q) ||
        r.dispatchDate?.includes(q) ||
        r.receiveDate?.includes(q)
      );
    }

    setFiltered(rows);
  }, [
    globalSearch,
    search,
    vendor,
    division,
    status,
    product,
    fromDate,
    toDate,
    productRows,
    userTypeId,
  ]);

  const clearFilters = () => {
    setSearch("");
    setVendor("");
    setDivision("");
    setStatus("");
    setProduct("");
    setFromDate("");
    setToDate("");
  };


  // SUMMARY COUNTERS
  const total = filtered.length;
  const pendingCount = filtered.filter((x) => x.status === "Pending").length;
  const accepted = filtered.filter((x) => x.status === "Accepted").length;
  const dispatched = filtered.filter((x) => x.status === "Dispatched").length;
  const completed = filtered.filter((x) => x.status === "Completed").length;

  // EXCEL EXPORT (PRODUCT-WISE)
  const exportExcel = () => {
    const excelData = filtered.map((row) => ({
      "WO No": row.workOrderNo,
      Vendor: row.vendorName,
      Status: row.status,
      "WO Date": formatDate(row.workOrderDate),
      "Delivery Date": formatDate(row.deliveryDate),
      Priority: row.priorityType,
      "Order Type": row.orderTypeName,
      Product: row.product,
      Total: row.quantity,
      Dispatched: row.dispatchedQuantity,
      Received: row.receivedQuantity,
      Pending: row.pending,
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Product Wise Report");

    XLSX.writeFile(wb, "WorkOrder_ProductReport.xlsx");
  };

  // PDF EXPORT (PRODUCT-WISE)
  const exportPDF = () => {
    const doc = new jsPDF("l", "pt", "a4");

    doc.setFontSize(16);
    doc.text("Work Order Product-wise Report", 40, 40);

    const tableColumn = [
      "WO No",
      "Vendor",
      "Status",
      "WO Date",
      "Product",
      "Total",
      "Dispatched",
      "Received",
      "Pending",
    ];
    const formatDate = (v) => (v ? v.slice(0, 10) : "");
    const tableRows = filtered.map((r) => [
      r.workOrderNo,
      r.vendorName,
      r.status,
      formatDate(r.workOrderDate),
      r.product,
      r.quantity,
      r.dispatchedQuantity,
      r.receivedQuantity,
      r.pending,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 60,
      theme: "grid",
      headStyles: { fillColor: [30, 30, 30] },
    });

    doc.save("WorkOrder_ProductReport.pdf");
  };

  return (
    <Layout>
      <div className="container-fluid py-3">

        {/* TITLE + EXPORT */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-bold">Work Order Product Report</h3>

          <div>
             <button className="btn btn-success me-2" onClick={exportExcel}>
              Export Excel
            </button>
            <button className="btn btn-danger" onClick={exportPDF}>
              Export PDF
            </button> 
          </div>
        </div>
        {/* SUMMARY BOXES */}
        <div className="row g-3 mb-3">
          <div className="col-md-2"><div className="card p-3 text-center shadow-sm"><h6>Total</h6><h4>{total}</h4></div></div>
          <div className="col-md-2"><div className="card p-3 text-center shadow-sm"><h6>Pending</h6><h4>{pendingCount}</h4></div></div>
          <div className="col-md-2"><div className="card p-3 text-center shadow-sm"><h6>Accepted</h6><h4>{accepted}</h4></div></div>
          <div className="col-md-2"><div className="card p-3 text-center shadow-sm"><h6>Dispatched</h6><h4>{dispatched}</h4></div></div>
          <div className="col-md-2"><div className="card p-3 text-center shadow-sm"><h6>Completed</h6><h4>{completed}</h4></div></div>
        </div>

        {/* FILTER PANEL */}
        {/* <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-2">
                <label>WO No</label>
                <input className="form-control"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="col-md-2">
                <label>Vendor</label>
                <input className="form-control"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                />
              </div>

              <div className="col-md-2">
                <label>Status</label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">All</option>
                  <option>Pending</option>
                  <option>Accepted</option>
                  <option>Dispatched</option>
                  <option>Completed</option>
                </select>
              </div>

              

              <div className="col-md-2">
                <label>Product</label>
                <select
                  className="form-select"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                >
                  <option value="">All Products</option>

                  {productList.map((p) => (
                    <option key={p.productId} value={p.productName}>
                      {p.productName}
                    </option>
                  ))}
                </select>
              </div>


              <div className="col-md-2">
                <label>From Date</label>
                <input type="date"
                  className="form-control"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              <div className="col-md-2">
                <label>To Date</label>
                <input type="date"
                  className="form-control"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>

            <div className="text-end mt-3">
              <button className="btn btn-primary me-2" onClick={applyFilter}>Apply Filter</button>
              <button className="btn btn-secondary" onClick={resetFilter}>Reset</button>
            </div>
          </div>
        </div> */}

        {/* <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3"> */}

        {/* WO NO */}
        {/* <div className="col-md-2">
                <label>WO No</label>
                <input
                  className="form-control"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="WO No"
                />
              </div> */}

        {/* ADMIN + DIVISION → VENDOR */}
        {/* {(userTypeId === 1 || userTypeId === 2) && (
                <div className="col-md-2">
                  <label>Vendor</label>
                  <input
                    className="form-control"
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    placeholder="Vendor"
                  />
                </div>
              )} */}

        {/* ADMIN + VENDOR → DIVISION */}
        {/* {(userTypeId === 1 || userTypeId === 3) && (
                <div className="col-md-2">
                  <label>Division</label>
                  <input
                    className="form-control"
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    placeholder="Division"
                  />
                </div>
              )} */}

        {/* STATUS */}
        {/* <div className="col-md-2">
                <label>Status</label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">All</option>
                  <option>Pending</option>
                  <option>Accepted</option>
                  <option>Dispatched</option>
                  <option>Completed</option>
                </select>
              </div> */}

        {/* PRODUCT */}
        {/* <div className="col-md-2">
                <label>Product</label>
                <input
                  className="form-control"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  placeholder="Product"
                />
              </div> */}

        {/* FROM DATE */}
        {/* <div className="col-md-1">
                <label>From</label>
                <input
                  type="date"
                  className="form-control"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div> */}

        {/* TO DATE */}
        {/* <div className="col-md-1">
                <label>To</label>
                <input
                  type="date"
                  className="form-control"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div> */}
        {/* CLEAR BUTTON */}
        {/* <div className="col-sm-2 text-end">
                <button
                  className="btn btn-outline-danger "
                  onClick={clearFilters}
                >
                 Clear Filters
                </button>
              </div> */}
        {/* </div>
          </div>
        </div> */}


        {/* PRODUCT WISE REPORT TABLE */}
        <div className="card shadow-sm">
          {/* GLOBAL SEARCH (ALL FIELDS) */}
          <div className="col-md-4 w-100 mb-3 p-3">
            <label>Global Search</label>
            <input
              className="form-control"
              placeholder="Search WO, Vendor, Division, Product, Status..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
            />
          </div>

          <div className="card-body p-0">
            <div className="table-scroll">

              {/* <table className="table table-bordered table-striped m-0 fixed-header ">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>WO No</th>
                  <th>Vendor</th>
                  <th>Status</th>
                  <th>WO Date</th>
                  <th>Product</th>
                  <th>Total</th>
                  <th>Dispatched</th>
                  <th>Received</th>
                  <th>Pending</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((row, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{row.workOrderNo}</td>
                    <td>{row.vendorName}</td>
                    <td><span className="badge bg-secondary">{row.status}</span></td>
                    <td>{formatDate(row.workOrderDate)}</td>
                    <td>{row.product}</td>
                    <td>{row.quantity}</td>
                    <td>{row.dispatchedQuantity}</td>
                    <td>{row.receivedQuantity}</td>
                    <td>{row.pending}</td>
                  </tr>
                ))}
              </tbody>
            </table> */}
              <table className="table table-bordered table-striped m-0 fixed-header table-single-line">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>WO No</th>

                    {/* 🔁 Conditional column */}
                    {userTypeId === 2 && <th>Vendor</th>}
                    {userTypeId === 3 && <th>Division</th>}
                    {userTypeId === 1 && (
                      <>
                        <th>Vendor</th>
                        <th>Division</th>
                      </>
                    )}

                    <th>Status</th>
                    <th>WO Date</th>
                    <th>Product</th>
                    <th>Total</th>
                    <th>Dispatched</th>
                    <th>Received</th>
                    <th>Accept Date</th>
                    <th>Accept Delivery Date</th>
                    <th>Dispatch Date</th>
                    <th>Receive Date</th>
                    <th>Pending</th>
                    <th>Attachments</th>
                  </tr>
                </thead>


                <tbody>
                  {[...filtered]
                    .sort((a, b) => b.workOrderNo.localeCompare(a.workOrderNo))
                    .map((row, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{row.workOrderNo}</td>

                        {/* 🔁 Conditional column */}
                        {userTypeId === 2 && <td>{row.vendorName}</td>}
                        {userTypeId === 3 && <td>{row.divisionName}</td>}
                        {userTypeId === 1 && (
                          <>
                            <td>{row.vendorName}</td>
                            <td>{row.divisionName}</td>
                          </>
                        )}

                        <td>
                          <span className={`badge ${row.status === " Pending" ? "bg-secondary" :
                            row.status === "Accepted" ? "bg-info" :
                              row.status === "Dispatched" ? "bg-warning" :
                                "bg-success"
                            }`}>
                            {row.status}
                          </span>
                        </td>

                        <td>{formatDate(row.workOrderDate)}</td>
                        <td>{row.product}</td>
                        <td>{row.quantity}</td>
                        <td>{row.dispatchedQuantity}</td>
                        <td>{row.receivedQuantity}</td>
                        <td>{formatDate(row.acceptDate)}</td>
                        <td>{formatDate(row.acceptDeliveryDate)}</td>
                        <td>{formatDate(row.dispatchDate)}</td>
                        <td>{formatDate(row.receiveDate)}</td>
                        <td>{row.pending}</td>

                        <td className="text-center">
                          <POFileActions filePath={row.poFilePath} />
                        </td>
                      </tr>
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
