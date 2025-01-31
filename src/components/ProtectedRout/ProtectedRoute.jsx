import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const isLogin = localStorage.getItem("isLogin") || sessionStorage.getItem("isLogin");

  if (!isLogin) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
