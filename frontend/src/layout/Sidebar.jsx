
// import { NavLink, useLocation } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { usePermission } from "../routes/PermissionContext";
// import "../Components/Sidebar.css"

// export default function Sidebar() {
//   const { canView } = usePermission();
//   const location = useLocation();

//   const [openWorkOrder, setOpenWorkOrder] = useState(false);
//   const [openManage, setOpenManage] = useState(false);

//   useEffect(() => {
//     if (location.pathname.startsWith("/workorder")) setOpenWorkOrder(true);
//     if (location.pathname.startsWith("/workordermanage")) setOpenManage(true);
//   }, [location.pathname]);

//   const linkClass = ({ isActive }) =>
//     `sidebar-link ${isActive ? "active" : ""}`;

//   const subLinkClass = ({ isActive }) =>
//     `sidebar-sublink ${isActive ? "active" : ""}`;

//   const section = (title) => (
//     <div className="sidebar-section">{title}</div>
//   );

//   const GuardedLink = ({ can, to, className, children }) =>
//     can ? <NavLink to={to} className={className}>{children}</NavLink> : null;

//   return (
//     <div className="sidebar">
//       <div className="sidebar-header">
//         <i className="bi bi-gear-fill me-2" />
//         Work Order System
//       </div>

//       {section("Masters")}

//       <GuardedLink can={canView("company")} to="/company" className={linkClass}>
//         <i className="bi bi-building" /> Company
//       </GuardedLink>

//       <GuardedLink can={canView("division")} to="/division" className={linkClass}>
//         <i className="bi bi-diagram-3" /> Division
//       </GuardedLink>

//       <GuardedLink can={canView("category")} to="/category" className={linkClass}>
//         <i className="bi bi-tags" /> Category
//       </GuardedLink>

//       <GuardedLink can={canView("product")} to="/product" className={linkClass}>
//         <i className="bi bi-box-seam" /> Product
//       </GuardedLink>

//       <GuardedLink can={canView("vendor")} to="/vendor" className={linkClass}>
//         <i className="bi bi-truck" /> Vendor
//       </GuardedLink>

//       <GuardedLink can={canView("user")} to="/user" className={linkClass}>
//         <i className="bi bi-people" /> User
//       </GuardedLink>

//       <GuardedLink
//         can={canView("user-menu-rights")}
//         to="/user-menu-rights"
//         className={linkClass}
//       >
//         <i className="bi bi-shield-lock" /> User Menu Rights
//       </GuardedLink>

//       {canView("workorder") && (
//         <>
//           {section("Work Orders")}

//           <div
//             className={`sidebar-parent ${openWorkOrder ? "open" : ""}`}
//             onClick={() => setOpenWorkOrder(!openWorkOrder)}
//           >
//             <i className="bi bi-clipboard-check" />
//             Work Orders
//             <i className={`bi ms-auto ${openWorkOrder ? "bi-chevron-up" : "bi-chevron-down"}`} />
//           </div>

//           {openWorkOrder && (
//             <div className="sidebar-submenu">
//               <GuardedLink
//                 can={canView("workorder-create")}
//                 to="/workorder/create"
//                 className={subLinkClass}
//               >
//                 <i className="bi bi-plus-circle" /> Create
//               </GuardedLink>

//               <GuardedLink
//                 can={canView("workorder-list")}
//                 to="/workorder/list"
//                 className={subLinkClass}
//               >
//                 <i className="bi bi-list-ul" /> List
//               </GuardedLink>
//             </div>
//           )}
//         </>
//       )}

//       {canView("WorkOrderManage") && (
//         <>
//           {section("Manage")}

//           <div
//             className={`sidebar-parent ${openManage ? "open" : ""}`}
//             onClick={() => setOpenManage(!openManage)}
//           >
//             <i className="bi bi-tools" />
//             Work Order Manage
//             <i className={`bi ms-auto ${openManage ? "bi-chevron-up" : "bi-chevron-down"}`} />
//           </div>

//           {openManage && (
//             <div className="sidebar-submenu">
//               <GuardedLink
//                 can={canView("WorkOrderManage")}
//                 to="/workordermanage/accept"
//                 className={subLinkClass}
//               >
//                 <i className="bi bi-check-circle" /> Accept
//               </GuardedLink>

//               <GuardedLink
//                 can={canView("WorkOrderManage")}
//                 to="/workordermanage/dispatch"
//                 className={subLinkClass}
//               >
//                 <i className="bi bi-send" /> Dispatch
//               </GuardedLink>
//             </div>
//           )}
//         </>
//       )}

//       {section("Reports")}
//       <GuardedLink can={canView("reports")} to="/reports" className={linkClass}>
//         <i className="bi bi-bar-chart" /> Reports
//       </GuardedLink>
//     </div>
//   );
// }


import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { usePermission } from "../routes/PermissionContext";
// import "../Components/Sidebar.css";
import '../assets/css/Sidebar.css';
export default function Sidebar() {
  const { canView } = usePermission();
  const location = useLocation();

  const [openWorkOrder, setOpenWorkOrder] = useState(false);
  const [openManage, setOpenManage] = useState(false);

  useEffect(() => {
    if (location.pathname.startsWith("/workorder")) setOpenWorkOrder(true);
    if (location.pathname.startsWith("/workordermanage")) setOpenManage(true);
  }, [location.pathname]);

  const linkClass = ({ isActive }) =>
    `sidebar-link ${isActive ? "active" : ""}`;

  const subLinkClass = ({ isActive }) =>
    `sidebar-sublink ${isActive ? "active" : ""}`;

  const section = (title) => (
    <div className="sidebar-section-title">{title}</div>
  );

  const GuardedLink = ({ can, to, className, children }) =>
    can ? (
      <NavLink to={to} className={className}>
        {children}
      </NavLink>
    ) : null;

  return (
    <aside className="ra-sidebar">
      {/* HEADER */}
      <div className="ra-sidebar-header">
        <i className="bi bi-gear-fill me-2"></i>
        <span>Work Order System</span>
      </div>

      {/* MASTERS */}
      {section("Masters")}

      <GuardedLink can={canView("company")} to="/company" className={linkClass}>
        <i className="bi bi-building"></i>
        <span>Company</span>
      </GuardedLink>

      <GuardedLink can={canView("division")} to="/division" className={linkClass}>
        <i className="bi bi-diagram-3"></i>
        <span>Division</span>
      </GuardedLink>

      <GuardedLink can={canView("category")} to="/category" className={linkClass}>
        <i className="bi bi-tags"></i>
        <span>Category</span>
      </GuardedLink>

      <GuardedLink can={canView("product")} to="/product" className={linkClass}>
        <i className="bi bi-box-seam"></i>
        <span>Product</span>
      </GuardedLink>

      <GuardedLink can={canView("vendor")} to="/vendor" className={linkClass}>
        <i className="bi bi-truck"></i>
        <span>Vendor</span>
      </GuardedLink>

      <GuardedLink can={canView("user")} to="/user" className={linkClass}>
        <i className="bi bi-people"></i>
        <span>User</span>
      </GuardedLink>

      <GuardedLink
        can={canView("user-menu-rights")}
        to="/user-menu-rights"
        className={linkClass}
      >
        <i className="bi bi-shield-lock"></i>
        <span>User Menu Rights</span>
      </GuardedLink>

      {/* WORK ORDERS */}
      {canView("workorder") && (
        <>
          {section("Work Orders")}

          <div
            className={`sidebar-parent ${openWorkOrder ? "open" : ""}`}
            onClick={() => setOpenWorkOrder(!openWorkOrder)}
          >
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-clipboard-check"></i>
              <span>Work Orders</span>
            </div>
            <i
              className={`bi ${openWorkOrder ? "bi-chevron-up" : "bi-chevron-down"
                }`}
            ></i>
          </div>

          <div className={`sidebar-submenu ${openWorkOrder ? "show" : ""}`}>
            <GuardedLink
              can={canView("workorder-create")}
              to="/workorder/create"
              className={subLinkClass}
            >
              <i className="bi bi-plus-circle"></i> Create
            </GuardedLink>

            <GuardedLink
              can={canView("workorder-list")}
              to="/workorder/list"
              className={subLinkClass}
            >
              <i className="bi bi-list-ul"></i> List
            </GuardedLink>
          </div>
        </>
      )}

      {/* MANAGE */}
      {canView("WorkOrderManage") && (
        <>
          {section("Manage")}

          <div
            className={`sidebar-parent ${openManage ? "open" : ""}`}
            onClick={() => setOpenManage(!openManage)}
          >
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-tools"></i>
              <span>Work Order Manage</span>
            </div>
            <i
              className={`bi ${openManage ? "bi-chevron-up" : "bi-chevron-down"
                }`}
            ></i>
          </div>

          <div className={`sidebar-submenu ${openManage ? "show" : ""}`}>
            <GuardedLink
              can={canView("WorkOrderManage")}
              to="/workordermanage/accept"
              className={subLinkClass}
            >
              <i className="bi bi-check-circle"></i> Pending Accept
            </GuardedLink>
            <GuardedLink
              can={canView("WorkOrderManage")}
              to="/workordermanage/accepted"   // ✅ REMOVE extra 'p'
              className={subLinkClass}
            >
              <i className="bi bi-check-circle"></i> Accepted
            </GuardedLink>

            <GuardedLink
              can={canView("WorkOrderManage")}
              to="/workordermanage/dispatch"
              className={subLinkClass}
            >
              <i className="bi bi-send"></i>Pending Dispatch
            </GuardedLink>

          </div>
        </>
      )}

      {/* REPORTS */}
      {section("Reports")}
      <GuardedLink can={canView("reports")} to="/reports" className={linkClass}>
        <i className="bi bi-bar-chart"></i>
        <span>Reports</span>
      </GuardedLink>
    </aside>
  );
}
