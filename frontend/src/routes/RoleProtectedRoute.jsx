import { Navigate } from "react-router-dom";
import { useAuth } from "../API/AuthContext";

export default function RoleProtectedRoute({ children, allow }) {
  const { auth } = useAuth();

  if (!auth) return <Navigate to="/newlogin" replace />;

  if (!allow.includes(auth.userTypeId)) {
    return <Navigate to="/403" replace />;
  }

  return children;
}
