import { Navigate } from "react-router-dom";
import { useAuth } from "../API/AuthContext";

export default function ProtectedRoute({ children }) {
  const { auth } = useAuth();

  if (!auth) {
    return <Navigate to="/newlogin" replace />;
  }

  return children;
}
