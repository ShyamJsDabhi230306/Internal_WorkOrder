// import { useEffect, useState } from "react";
// import Layout from "../../layout/Layout";
// import { getWorkOrders, vendorDispatch } from "../../API/workOrderApi";
// import "./WorkOrderCSS/WorkOrderList.css";

// export default function WorkOrderManageDispatch() {
//   const [dispatchList, setDispatchList] = useState([]);
//   const [filteredList, setFilteredList] = useState([]);

//   const [dispatchQty, setDispatchQty] = useState({});
//   const [transportBy, setTransportBy] = useState({});

//   // ----- FILTER STATES -----
//   const [woNo, setWoNo] = useState("");
//   const [vendor, setVendor] = useState("");
//   const [status, setStatus] = useState("All");
//   const [product, setProduct] = useState("All");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");

//   const [productOptions, setProductOptions] = useState([]);

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     const data = await getWorkOrders();

//     const sorted = data
//       .sort((a, b) => b.workOrderId - a.workOrderId)
//       .filter((wo) => wo.status === "Accepted" || wo.status === "Dispatched")
//       .map((wo) => ({
//         ...wo,
//         visibleProducts: wo.products.filter(
//           (p) => p.dispatchedQuantity < p.quantity
//         ),
//       }))
//       .filter((wo) => wo.visibleProducts.length > 0);

//     // collect all product names
//     const allProducts = [
//       ...new Set(
//         sorted.flatMap((w) => w.visibleProducts.map((p) => p.product))
//       ),
//     ];

//     setProductOptions(allProducts);
//     setDispatchList(sorted);
//     setFilteredList(sorted);
//   };

//   // -------------------- APPLY FILTER --------------------
//   const applyFilter = () => {
//     let list = [...dispatchList];

//     list = list
//       .map((wo) => {
//         let prods = wo.visibleProducts;

//         if (woNo.trim())
//           prods = prods.filter((p) =>
//             wo.workOrderNo.toLowerCase().includes(woNo.toLowerCase())
//           );

//         if (vendor.trim())
//           prods = prods.filter((p) =>
//             wo.vendorName.toLowerCase().includes(vendor.toLowerCase())
//           );

//         if (status !== "All")
//           if (wo.status !== status) prods = [];

//         if (product !== "All")
//           prods = prods.filter(
//             (p) => p.product.toLowerCase() === product.toLowerCase()
//           );

//         if (fromDate)
//           if (new Date(wo.deliveryDate) < new Date(fromDate)) prods = [];

//         if (toDate)
//           if (new Date(wo.deliveryDate) > new Date(toDate)) prods = [];

//         return prods.length ? { ...wo, visibleProducts: prods } : null;
//       })
//       .filter(Boolean);

//     setFilteredList(list);
//   };

//   // -------------------- RESET FILTER --------------------
//   const resetFilter = () => {
//     setWoNo("");
//     setVendor("");
//     setStatus("All");
//     setProduct("All");
//     setFromDate("");
//     setToDate("");

//     setFilteredList(dispatchList);
//   };

//   const getKey = (woId, productId) => `${woId}_${productId}`;

//   const handleDispatch = async (woId, productId, total, dispatched) => {
//     const key = getKey(woId, productId);

//     const qty = Number(dispatchQty[key] || 0);
//     const tBy = transportBy[key] || "";
//     const pending = total - dispatched;

//     if (!tBy) return alert("Enter Transport By");
//     if (!qty || qty <= 0) return alert("Enter valid quantity");
//     if (qty > pending) return alert(`Max allowed: ${pending}`);

//     await vendorDispatch(woId, productId, qty, tBy);

//     setDispatchQty((p) => ({ ...p, [key]: "" }));
//     setTransportBy((p) => ({ ...p, [key]: "" }));

//     loadData();
//   };

//   return (
//     <Layout>
//       <div className="container-fluid py-3">

//         {/* ================= FILTER BAR ================= */}
//         <div className="card shadow-sm mb-3 p-3">
//           <div className="row g-3">

//             <div className="col-md-2">
//               <label>WO No</label>
//               <input
//                 className="form-control"
//                 value={woNo}
//                 onChange={(e) => setWoNo(e.target.value)}
//               />
//             </div>

//             <div className="col-md-2">
//               <label>Vendor</label>
//               <input
//                 className="form-control"
//                 value={vendor}
//                 onChange={(e) => setVendor(e.target.value)}
//               />
//             </div>

//             <div className="col-md-2">
//               <label>Status</label>
//               <select
//                 className="form-select"
//                 value={status}
//                 onChange={(e) => setStatus(e.target.value)}
//               >
//                 <option>All</option>
//                 <option>Accepted</option>
//                 <option>Dispatched</option>
//               </select>
//             </div>

//             <div className="col-md-2">
//               <label>Product</label>
//               <select
//                 className="form-select"
//                 value={product}
//                 onChange={(e) => setProduct(e.target.value)}
//               >
//                 <option>All</option>
//                 {productOptions.map((p) => (
//                   <option key={p}>{p}</option>
//                 ))}
//               </select>
//             </div>

//             <div className="col-md-2">
//               <label>From Date</label>
//               <input
//                 type="date"
//                 className="form-control"
//                 value={fromDate}
//                 onChange={(e) => setFromDate(e.target.value)}
//               />
//             </div>

//             <div className="col-md-2">
//               <label>To Date</label>
//               <input
//                 type="date"
//                 className="form-control"
//                 value={toDate}
//                 onChange={(e) => setToDate(e.target.value)}
//               />
//             </div>

//             <div className="col-12 text-end mt-2">
//               <button className="btn btn-primary me-2" onClick={applyFilter}>
//                 Apply Filter
//               </button>
//               <button className="btn btn-secondary" onClick={resetFilter}>
//                 Reset
//               </button>
//             </div>

//           </div>
//         </div>

//         {/* ================= TABLE ================= */}
//         <div className="card shadow-sm">
//           <div className="card-header bg-white">
//             <h4 className="fw-bold">Product Dispatch</h4>
//           </div>

//           <div className="card-body p-0">
//             <div className="table-scroll">
//               <table className="table table-bordered fixed-header">
//                 <thead className="table-light">
//                   <tr>
//                     <th>WO No</th>
//                     <th>Product</th>
//                     <th>Total</th>
//                     <th>Dispatched</th>
//                     <th>Pending</th>
//                     <th>Dispatch Qty</th>
//                     <th>Transport By</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {filteredList.flatMap((wo) =>
//                     wo.visibleProducts.map((p) => {
//                       const total = p.quantity;
//                       const dispatched = p.dispatchedQuantity;
//                       const pending = total - dispatched;

//                       const key = getKey(wo.workOrderId, p.productId);

//                       return (
//                         <tr key={key}>
//                           <td>{wo.workOrderNo}</td>
//                           <td>{p.product}</td>
//                           <td>{total}</td>
//                           <td>{dispatched}</td>
//                           <td>{pending}</td>

//                           <td>
//                             <input
//                               type="number"
//                               className="form-control"
//                               value={dispatchQty[key] || ""}
//                               onChange={(e) =>
//                                 setDispatchQty((prev) => ({
//                                   ...prev,
//                                   [key]: e.target.value,
//                                 }))
//                               }
//                             />
//                           </td>

//                           <td>
//                             <input
//                               type="text"
//                               className="form-control"
//                               placeholder="Transport By"
//                               value={transportBy[key] || ""}
//                               onChange={(e) =>
//                                 setTransportBy((prev) => ({
//                                   ...prev,
//                                   [key]: e.target.value,
//                                 }))
//                               }
//                             />
//                           </td>

//                           <td>
//                             {pending > 0 ? (
//                               <button
//                                 className="btn btn-success btn-sm"
//                                 onClick={() =>
//                                   handleDispatch(
//                                     wo.workOrderId,
//                                     p.productId,
//                                     total,
//                                     dispatched
//                                   )
//                                 }
//                               >
//                                 Dispatch
//                               </button>
//                             ) : (
//                               <span className="text-muted small">Done</span>
//                             )}
//                           </td>
//                         </tr>
//                       );
//                     })
//                   )}
//                 </tbody>

//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// }


import { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { getWorkOrders, vendorDispatch } from "../../API/workOrderApi";
import "./WorkOrderCSS/WorkOrderList.css";

export default function WorkOrderManageDispatch() {
  const [dispatchList, setDispatchList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  const [dispatchQty, setDispatchQty] = useState({});
  const [transportBy, setTransportBy] = useState({});

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
    const data = await getWorkOrders();

    const sorted = data
      .sort((a, b) => b.workOrderId - a.workOrderId)
      .filter((wo) => wo.status === "Accepted" || wo.status === "Dispatched")
      .map((wo) => ({
        ...wo,
        visibleProducts: wo.products.filter(
          (p) => p.dispatchedQuantity < p.quantity
        ),
      }))
      .filter((wo) => wo.visibleProducts.length > 0);

    // collect all product names
    const allProducts = [
      ...new Set(
        sorted.flatMap((w) => w.visibleProducts.map((p) => p.product))
      ),
    ];

    setProductOptions(allProducts);
    setDispatchList(sorted);
    setFilteredList(sorted);
  };

  // -------------------- APPLY FILTER --------------------
  // const applyFilter = () => {
  //   let list = [...dispatchList];

  //   list = list
  //     .map((wo) => {
  //       let prods = wo.visibleProducts;

  //       if (woNo.trim())
  //         prods = prods.filter((p) =>
  //           wo.workOrderNo.toLowerCase().includes(woNo.toLowerCase())
  //         );

  //       if (vendor.trim())
  //         prods = prods.filter((p) =>
  //           wo.vendorName.toLowerCase().includes(vendor.toLowerCase())
  //         );

  //       if (status !== "All")
  //         if (wo.status !== status) prods = [];

  //       if (product !== "All")
  //         prods = prods.filter(
  //           (p) => p.product.toLowerCase() === product.toLowerCase()
  //         );

  //       if (fromDate)
  //         if (new Date(wo.deliveryDate) < new Date(fromDate)) prods = [];

  //       if (toDate)
  //         if (new Date(wo.deliveryDate) > new Date(toDate)) prods = [];

  //       return prods.length ? { ...wo, visibleProducts: prods } : null;
  //     })
  //     .filter(Boolean);

  //   setFilteredList(list);
  // };
  // -------------------- APPLY FILTER (GLOBAL + FIELD) --------------------
  const applyFilter = () => {
    const search = globalSearch.trim().toLowerCase();

    const filtered = dispatchList
      .map((wo) => {
        // ---------- PRODUCT SEARCH (FIRST) ----------
        let products = [...wo.visibleProducts];

        if (search) {
          products = products.filter((p) =>
            p.product?.toLowerCase().includes(search)
          );
        }

        // ---------- WORK ORDER GLOBAL SEARCH ----------
        const woSearchMatch =
          !search ||
          wo.workOrderNo?.toLowerCase().includes(search) ||
          wo.vendorName?.toLowerCase().includes(search) ||
          wo.status?.toLowerCase().includes(search) ||
          String(wo.deliveryDate || "").toLowerCase().includes(search) ||
          String(wo.acceptDeliveryDate || "").toLowerCase().includes(search);

        if (search && !woSearchMatch && products.length === 0) return null;

        // ---------- FIELD FILTERS ----------
        if (woNo && !wo.workOrderNo.toLowerCase().includes(woNo.toLowerCase()))
          return null;

        if (vendor && !wo.vendorName.toLowerCase().includes(vendor.toLowerCase()))
          return null;

        if (status !== "All" && wo.status !== status)
          return null;

        if (fromDate && new Date(wo.acceptDeliveryDate) < new Date(fromDate))
          return null;

        if (toDate && new Date(wo.acceptDeliveryDate) > new Date(toDate))
          return null;

        // ---------- PRODUCT FILTER ----------
        if (product !== "All") {
          products = products.filter(
            (p) => p.product.toLowerCase() === product.toLowerCase()
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

  // -------------------- RESET FILTER --------------------
  // const resetFilter = () => {
  //   setWoNo("");
  //   setVendor("");
  //   setStatus("All");
  //   setProduct("All");
  //   setFromDate("");
  //   setToDate("");

  //   setFilteredList(dispatchList);
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

  // 🔧 UPDATED: include index in key
  const getKey = (woId, productId, index) => `${woId}_${productId}_${index}`;

  // 🔧 UPDATED: added index parameter
  const handleDispatch = async (woId, productId, total, dispatched, index) => {
    const key = getKey(woId, productId, index);

    const qty = Number(dispatchQty[key] || 0);
    const tBy = transportBy[key] || "";
    const pending = total - dispatched;

    if (!tBy) return alert("Enter Transport By");
    if (!qty || qty <= 0) return alert("Enter valid quantity");
    if (qty > pending) return alert(`Max allowed: ${pending}`);

    await vendorDispatch(woId, productId, qty, tBy);

    setDispatchQty((p) => ({ ...p, [key]: "" }));
    setTransportBy((p) => ({ ...p, [key]: "" }));

    loadData();
  };

  return (
    <Layout>
      <div className="container-fluid py-3">

        {/* ================= FILTER BAR ================= */}
        {/* <div className="card shadow-sm mb-3 p-3">
          <div className="row g-3">

            <div className="col-md-2">
              <label>WO No</label>
              <input
                className="form-control"
                value={woNo}
                onChange={(e) => setWoNo(e.target.value)}
              />
            </div>

            <div className="col-md-2">
              <label>Vendor</label>
              <input
                className="form-control"
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
                <option>All</option>
                <option>Accepted</option>
                <option>Dispatched</option>
              </select>
            </div>

            <div className="col-md-2">
              <label>Product</label>
              <select
                className="form-select"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
              >
                <option>All</option>
                {productOptions.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <label>From Date</label>
              <input
                type="date"
                className="form-control"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div className="col-md-2">
              <label>To Date</label>
              <input
                type="date"
                className="form-control"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <div className="col-12 text-end mt-2">
              <button className="btn btn-primary me-2" onClick={applyFilter}>
                Apply Filter
              </button>
              <button className="btn btn-secondary" onClick={resetFilter}>
                Reset
              </button>
            </div>

          </div>
        </div> */}
        {/* ================= GLOBAL SEARCH ================= */}
        <div className="card shadow-sm mb-3">
          <div className="card-body py-2">
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Search WO No,  Product, Status..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="card shadow-sm">
          <div className="card-header bg-white">
            <h4 className="fw-bold">Product Dispatch</h4>
          </div>

          <div className="card-body p-0">
            <div className="table-scroll">
              <table className="table table-bordered fixed-header">
                <thead className="table-light">
                  <tr>
                    <th>WO No</th>
                    <th>Product</th>
                    <th>Total</th>
                    <th>AcceptDeleveryDate</th>
                    <th>Dispatched</th>
                    <th>Pending</th>
                    <th>Dispatch Qty</th>
                    <th>Transport By</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredList.flatMap((wo) =>
                    wo.visibleProducts.map((p, index) => {
                      const total = p.quantity;
                      const dispatched = p.dispatchedQuantity;
                      const pending = total - dispatched;

                      const key = getKey(wo.workOrderId, p.productId, index);

                      return (
                        <tr key={key}>
                          <td>{wo.workOrderNo}</td>
                          <td>{p.product}</td>
                          <td>{total}</td>
                          <td>{formatDate(wo.acceptDeliveryDate)}</td>
                          <td>{dispatched}</td>
                          <td>{pending}</td>

                          <td>
                            <input
                              type="number"
                              className="form-control"
                              value={dispatchQty[key] || ""}
                              onChange={(e) =>
                                setDispatchQty((prev) => ({
                                  ...prev,
                                  [key]: e.target.value,
                                }))
                              }
                            />
                          </td>

                          <td>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Transport By"
                              value={transportBy[key] || ""}
                              onChange={(e) =>
                                setTransportBy((prev) => ({
                                  ...prev,
                                  [key]: e.target.value,
                                }))
                              }
                            />
                          </td>

                          <td>
                            {pending > 0 ? (
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() =>
                                  handleDispatch(
                                    wo.workOrderId,
                                    p.productId,
                                    total,
                                    dispatched,
                                    index
                                  )
                                }
                              >
                                Dispatch
                              </button>
                            ) : (
                              <span className="text-muted small">Done</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>

              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
