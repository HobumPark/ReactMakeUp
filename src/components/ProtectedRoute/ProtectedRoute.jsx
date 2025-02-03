import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import useUserMgt from "../../hooks/useUserMgt";
;

const ProtectedRoutes = () => {
  const isLogin = localStorage.getItem("isLogin") || sessionStorage.getItem("isLogin");
  const user_id = localStorage.getItem("user_id");
  const { detailUserData} = useUserMgt({
    userID: user_id,
  });

  if (!isLogin) {
    return <Navigate to="/" />;
  }

  return (
    <div className="wrapper">
         <Sidebar userInfo={{ username: detailUserData?.account_id, job: detailUserData?.job_position }} />
      <div className="article-content-right">
        
          <Outlet />
      
      </div>
    </div>
  );
};

export default ProtectedRoutes;

