import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import useUserMgt from "../../hooks/useUserMgt";
import useCommonCodes from "../../hooks/useCommonCodes";
import { fetchUserLanguage } from '../../utils/i18n';
import { useTranslation } from "react-i18next";
import useAuth from "../../hooks/useAuth";

const ProtectedRoutes = () => {
  const { i18n } = useTranslation();
  const isLogin = localStorage.getItem("isLogin") || sessionStorage.getItem("isLogin");
  const user_id = localStorage.getItem("user_id");
  const { detailUserData} = useUserMgt({
    userID: user_id,
  });

  const { checkStatus, handleAuthority } = useAuth({
    userID: user_id,
  });

  const [optionParams, setOptionParams] = useState("upper-code=021&upper-code=ORG");
  const { commonListData } = useCommonCodes({ optionParams });

  useEffect(() => {
    if (!isLogin) {
      window.location.href = "/"; 
    }
  }, [isLogin]);

  const [isLanguageReady, setIsLanguageReady] = useState(false);
  const titleMap = {
    eng: "Management Page",
    kor: "관리 페이지",
    ind: "Halaman Manajemen",
  };
  const titleDashboard = {
    eng: "Main Dashboard",
    kor: "대시보드",
    ind: "Dasbor Utama",
  };

  const initLang = async () => {
    await fetchUserLanguage();
    setIsLanguageReady(true);
  
    const title = isDashboard ? titleDashboard[i18n.language] : titleMap[i18n.language];
    document.title = title;
  };


  useEffect(() => {
    initLang();
    checkStatus();
  }, []);

  const isDashboard = location.pathname.startsWith("/dashboard");
  if (isDashboard) {
    return isLanguageReady ? <Outlet context={{ userInfo: detailUserData }} /> : null;

  }
  
  return (
    <>
    
    <div className="wrapper">
    {/* {!isDashboard && <Sidebar userInfo={detailUserData} commonData={commonListData} />} */}
         <Sidebar userInfo={detailUserData} commonData={commonListData} navbarList={handleAuthority}/>
      <div className="article-content-right">
        
      {isLanguageReady && <Outlet />}
      
      </div>
     

    </div>
 
    </>
  );
};

export default ProtectedRoutes;

