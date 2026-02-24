import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { usePermission } from "../routes/PermissionContext";
import '../assets/css/Sidebar.css';

export default function Sidebar() {
  const { canView } = usePermission();
  const location = useLocation();

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
      <div className="ra-sidebar-header">
        <i className="bi bi-gear-fill me-2"></i>
        <span>Work Order System</span>
      </div>

      {canView("reports") && (
        <>
          {section("Dashboard")}
          <GuardedLink can={canView("reports")} to="/reports" className={linkClass}>
            <i className="bi bi-speedometer2"></i>
            <span>Dashboard</span>
          </GuardedLink>
        </>
      )}

      {(canView("company") || canView("location") || canView("division") || canView("user") || canView("user-menu-rights")) && (
        <>
          {section("Main Master")}
          <GuardedLink can={canView("company")} to="/company" className={linkClass}>
            <i className="bi bi-building"></i>
            <span>Company Master</span>
          </GuardedLink>
          <GuardedLink can={canView("location")} to="/location" className={linkClass}>
            <i className="bi bi-geo-alt"></i>
            <span>Location Master</span>
          </GuardedLink>
          <GuardedLink can={canView("division")} to="/division" className={linkClass}>
            <i className="bi bi-diagram-3"></i>
            <span>Division Master</span>
          </GuardedLink>
          <GuardedLink can={canView("user")} to="/user" className={linkClass}>
            <i className="bi bi-people"></i>
            <span>User Master</span>
          </GuardedLink>
          <GuardedLink can={canView("user-menu-rights")} to="/user-menu-rights" className={linkClass}>
            <i className="bi bi-shield-lock"></i>
            <span>User Menu Master</span>
          </GuardedLink>
        </>
      )}

      {(canView("category") || canView("product")) && (
        <>
          {section("Flow Master")}
          <GuardedLink can={canView("category")} to="/category" className={linkClass}>
            <i className="bi bi-tags"></i>
            <span>Category Master</span>
          </GuardedLink>
          <GuardedLink can={canView("product")} to="/product" className={linkClass}>
            <i className="bi bi-box-seam"></i>
            <span>Product Master</span>
          </GuardedLink>
        </>
      )}

      {(canView("workorder-create") || canView("workorder-list") || canView("WorkOrderManage")) && (
        <>
          {section("Transaction")}
          <GuardedLink can={canView("workorder-create")} to="/workorder/create" className={linkClass}>
            <i className="bi bi-plus-circle"></i>
            <span>Create</span>
          </GuardedLink>
          <GuardedLink can={canView("workorder-list")} to="/workorder/list" className={linkClass}>
            <i className="bi bi-list-ul"></i>
            <span>List</span>
          </GuardedLink>
          <GuardedLink can={canView("WorkOrderManage")} to="/workordermanage/accept" className={linkClass}>
            <i className="bi bi-check-circle"></i>
            <span>Pending Accept</span>
          </GuardedLink>
          <GuardedLink can={canView("WorkOrderManage")} to="/workordermanage/accepted" className={linkClass}>
            <i className="bi bi-clock-history"></i>
            <span>Accepted</span>
          </GuardedLink>
          <GuardedLink can={canView("WorkOrderManage")} to="/workordermanage/dispatch" className={linkClass}>
            <i className="bi bi-send"></i>
            <span>Pending Dispatch</span>
          </GuardedLink>
        </>
      )}
    </aside>
  );
}
