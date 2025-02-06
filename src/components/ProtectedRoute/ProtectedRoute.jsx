import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import useUserMgt from "../../hooks/useUserMgt";
import useCommonCodes from "../../hooks/useCommonCodes";

const ProtectedRoutes = () => {
  const isLogin = localStorage.getItem("isLogin") || sessionStorage.getItem("isLogin");
  const user_id = localStorage.getItem("user_id");
  const { detailUserData} = useUserMgt({
    userID: user_id,
  });

  const [optionParams, setOptionParams] = useState("upper-code=021&upper-code=ORG");
  const { commonListData } = useCommonCodes({ optionParams });

  if (!isLogin) {
    return <Navigate to="/" />;
  }

  return (
    <>
    
    <div className="wrapper">
    
         <Sidebar userInfo={detailUserData} commonData={commonListData}/>
      <div className="article-content-right">
        
          <Outlet />
      
      </div>
     

    </div>
 
    </>
  );
};

export default ProtectedRoutes;

