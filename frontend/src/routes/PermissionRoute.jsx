import { Navigate } from "react-router-dom";
import { usePermission } from "../routes/PermissionContext";
import { useAuth } from "../API/AuthContext";

export default function PermissionRoute({ menuKey, children }) {
  const { canView, ready } = usePermission();
  const { auth } = useAuth();

  // 🔐 Not logged in → let ProtectedRoute handle redirect to login
  if (!auth) {
    return children;
  }

  // ⏳ Wait until permissions are loaded from auth context
  if (!ready) {
    return <div className="p-5 text-center text-white">Loading...</div>;
  }

  // ✅ Check permission
  if (canView(menuKey)) {
    return children;
  }

  // 🚫 Logged in but no permission for this route
  return <Navigate to="/403" replace />;
}
