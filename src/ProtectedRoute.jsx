// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const isAdmin = localStorage.getItem("admin1");

  return isAdmin ? element : <Navigate to="/admin-login" />;
};

export default ProtectedRoute;
