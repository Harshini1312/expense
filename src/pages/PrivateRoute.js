import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  // If no token → block access & redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
