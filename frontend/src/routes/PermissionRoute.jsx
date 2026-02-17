

import { Navigate } from "react-router-dom";
import { usePermission } from "../routes/PermissionContext";
import { useAuth } from "../API/AuthContext";

export default function PermissionRoute({ menuKey, children }) {
  const { canView, loading } = usePermission();
  const { auth } = useAuth();

  // 🔐 If NOT logged in → let ProtectedRoute handle it
  if (!auth) {
    return children;
  }

  // ⏳ Wait for permissions
  if (loading) {
    return <div className="p-5 text-center">Loading permissions...</div>;
  }

  // ✅ Allowed
  if (canView(menuKey)) {
    return children;
  }

  // 🚫 Logged in but no permission
  return <Navigate to="/403" replace />;
}

