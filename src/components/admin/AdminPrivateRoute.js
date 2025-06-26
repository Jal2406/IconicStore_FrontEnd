import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
const API = process.env.REACT_APP_API_URL;

const PrivateAdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API}/login/verify-admin`, {
          headers: { Authorization: token },
        });

        setIsAdmin(response.data.isAdmin);
      } catch (error) {
        console.error("Admin verification failed:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
  }, []);

  if (loading) {
    return <div className="text-center my-5">Verifying access...</div>;
  }

  return isAdmin ? children : <Navigate to="/login" />;
};

export default PrivateAdminRoute;
