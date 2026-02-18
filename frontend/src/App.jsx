


import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./API/AuthContext";
import { PermissionProvider } from "./routes/PermissionContext";

import LoginPage from "./Pages/LoginPage";
import Forbidden403 from "./Pages/Error/Forbidden403";

// Masters
import CompanyMaster from "./Pages/Master/CompanyMaster";
import DivisionMaster from "./Pages/Master/DivisionMaster";
import CategoryMaster from "./Pages/Master/CategoryMaster";
import ProductMaster from "./Pages/Master/ProductMaster";
import UserMaster from "./Pages/Master/UserMaster";
import VendorMaster from "./Pages/Master/VendorMaster";

// Work Orders
import WorkOrderPage from "./Pages/Master/WorkOrderMaster";
import WorkOrderCreate from "./Pages/Master/WorkOrderCreate";
import WorkOrderList from "./Pages/Master/WorkOrderList";
import WorkOrderEdit from "./Pages/Master/WorkOrderEdit";

// Work Order Product / Manage
import WorkOrderManageAccept from "./Pages/Master/WorkOrderManageAccept";
import WorkOrderManageDispatch from "./Pages/Master/WorkOrderManageDispatch";

// Reports
import WorkOrderReport from "./Pages/Reports/WorkOrderReport";

// Rights
import UserMenuRights from "./Pages/UserMenuRights";

// Guards
import ProtectedRoute from "./routes/ProtectedRoute";
import PermissionRoute from "./routes/PermissionRoute";

import { ToastContainer } from "react-toastify";
import WorkOrderManagePage from "./Pages/Master/WorkOrderManage";
import WorkOrderManageAccepted from "./Pages/Master/WorkOrderManageAccepted";

export default function App() {
  return (
    <AuthProvider>
      <PermissionProvider>
        <Routes>

          {/* ================= AUTH ================= */}
          <Route path="/" element={<Navigate to="/newlogin" replace />} />
          <Route path="/newlogin" element={<LoginPage />} />
          <Route path="/403" element={<Forbidden403 />} />

          {/* ================= MASTERS ================= */}
          <Route
            path="/company"
            element={
              <PermissionRoute menuKey="Company">
                <ProtectedRoute>
                  <CompanyMaster />
                </ProtectedRoute>
              </PermissionRoute>
            }
          />

          <Route
            path="/division"
            element={
              <PermissionRoute menuKey="Division">
                <ProtectedRoute>
                  <DivisionMaster />
                </ProtectedRoute>
              </PermissionRoute>
            }
          />

          <Route
            path="/vendor"
            element={
              <PermissionRoute menuKey="Vendor">
                <ProtectedRoute>
                  <VendorMaster />
                </ProtectedRoute>
              </PermissionRoute>
            }
          />

          <Route
            path="/category"
            element={
              <PermissionRoute menuKey="Category">
                <ProtectedRoute>
                  <CategoryMaster />
                </ProtectedRoute>
              </PermissionRoute>
            }
          />

          <Route
            path="/product"
            element={
              <PermissionRoute menuKey="Product">
                <ProtectedRoute>
                  <ProductMaster />
                </ProtectedRoute>
              </PermissionRoute>
            }
          />

          <Route
            path="/user"
            element={
              <PermissionRoute menuKey="User">
                <ProtectedRoute>
                  <UserMaster />
                </ProtectedRoute>
              </PermissionRoute>
            }
          />

          {/* ================= WORK ORDER (PARENT CONTROLS ALL CHILDREN) ================= */}
          <Route
            path="/workorder"
            element={
              <PermissionRoute menuKey="WorkOrder">
                <ProtectedRoute>
                  <WorkOrderPage />
                </ProtectedRoute>
              </PermissionRoute>
            }
          >
            <Route index element={<Navigate to="create" replace />} />
            <Route path="create" element={<WorkOrderCreate />} />
            <Route path="list" element={<WorkOrderList />} />
            <Route path="edit/:id" element={<WorkOrderEdit />} />
          </Route>


          {/* ===== WORK ORDER MANAGE ===== */}
          <Route
            path="/workordermanage"
            element={
              <PermissionRoute menuKey="WorkOrderManage">
                <ProtectedRoute>
                  <WorkOrderManagePage />
                </ProtectedRoute>
              </PermissionRoute>
            }
          />

          <Route
            path="/workordermanage/accept"
            element={
              <PermissionRoute menuKey="WorkOrderManage">
                <ProtectedRoute>
                  <WorkOrderManageAccept />
                </ProtectedRoute>
              </PermissionRoute>
            }
          />
          <Route
            path="/workordermanage/accepted"
            element={
              <PermissionRoute menuKey="WorkOrderManage">
                <ProtectedRoute>
                  <WorkOrderManageAccepted />
                </ProtectedRoute>
              </PermissionRoute>
            }
          />

          <Route
            path="/workordermanage/dispatch"
            element={
              <PermissionRoute menuKey="WorkOrderManage">
                <ProtectedRoute>
                  <WorkOrderManageDispatch />
                </ProtectedRoute>
              </PermissionRoute>
            }
          />

          {/* ================= REPORTS (FRONTEND ONLY) ================= */}
          <Route
            path="/reports"
            element={
              <PermissionRoute menuKey="Reports">
                <ProtectedRoute>
                  <WorkOrderReport />
                </ProtectedRoute>
              </PermissionRoute>
            }
          />

          {/* ================= USER MENU RIGHTS ================= */}
          <Route
            path="/user-menu-rights"
            element={
              <PermissionRoute menuKey="UserType">
                <ProtectedRoute>
                  <UserMenuRights />
                </ProtectedRoute>
              </PermissionRoute>
            }
          />

        </Routes>

        <ToastContainer position="top-center" autoClose={1500} />
      </PermissionProvider>
    </AuthProvider>
  );
}
