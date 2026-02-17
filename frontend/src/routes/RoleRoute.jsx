import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function RoleRoute({ children, role }) {
  const { auth } = useAuth();

  if (!auth) return <Navigate to="/newlogin" />;
  if (auth.role !== role) return <h2>Access Denied</h2>;

  return children;
}
