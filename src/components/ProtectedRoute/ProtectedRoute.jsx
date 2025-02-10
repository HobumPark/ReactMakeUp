import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import useUserMgt from "../../hooks/useUserMgt";
import useCommonCodes from "../../hooks/useCommonCodes";
import { initializeLanguage } from '../../utils/i18n';

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
  const [isLanguageReady, setIsLanguageReady] = useState(false);

  useEffect(() => {
    const initLang = async () => {
      await initializeLanguage(); 
      setIsLanguageReady(true);
    };

    initLang();
  }, []);


  return (
    <>
    
    <div className="wrapper">
    
         <Sidebar userInfo={detailUserData} commonData={commonListData}/>
      <div className="article-content-right">
        
      {isLanguageReady && <Outlet />}
      
      </div>
     

    </div>
 
    </>
  );
};

export default ProtectedRoutes;

