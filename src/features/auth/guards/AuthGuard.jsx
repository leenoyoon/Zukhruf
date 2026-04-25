import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export const AuthGuard = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
