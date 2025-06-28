
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../AuthContext";

const AdminPrivateRoute = ({ children }) => {
  const { role } = useAuth();

  if (role !== "admin") {
    toast.error("Access denied: Admins only");
    console.log(role)
    return <Navigate to="/" />;
  }
  
  console.log(role)
  return children;
};

export default AdminPrivateRoute;