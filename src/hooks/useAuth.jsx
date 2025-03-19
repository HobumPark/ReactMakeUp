import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";

import { URLS, APIS } from "../config/urls.js";
import { reqGet, reqPost, reqPut } from "../utils/request.js";
import NoticeMessage from "../plugin/noticemessage/noticemessage.js";

const useAuth = ({   userID = null, onLoginFail = () => {} ,onResetFail = () => {}, onSuccessUpdate = () => {} } = {}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogin = async (accountDT) => {
    const requestURL = `${URLS.BACK_DSH}${APIS.login}`;
    return reqPost(requestURL, accountDT)
      .then((data) => {
        if (accountDT?.remember_me === true) {
          localStorage.setItem("user_id", data.user_id);
          localStorage.setItem("group_id", data.group_id);
          localStorage.setItem("isLogin", true);
        } else {
          sessionStorage.setItem("user_id", data.user_id);
          localStorage.setItem("group_id", data.group_id);
          sessionStorage.setItem("isLogin", true);
        }
        queryClient.clear();
        if (data.group_id == 1) {
          navigate("/dashboard/main-dashboard");
        } else if (data.group_id == 2) {
          navigate("/dashboard/main-dashboard");
        } else {
          navigate("/management/unauthorized")
        }
        
      })
      .catch((err) => {
        onLoginFail(err);
      });
  };

  const handleLogout = async () => {
    const requestURL = `${URLS.BACK_DSH}${APIS.logout}`;
    return reqGet(requestURL).then(() => {
      sessionStorage.clear();
      localStorage.clear();
      queryClient.clear();
      navigate("/");
    });
  };

  const { data: handleAuthority } = useQuery({
    queryKey: ["navbarList"],
    queryFn: async () => {
      const requestURL = `${URLS.BACK_DSH}${APIS.accessMenu}`;
      const response = await reqGet(requestURL);
      return response;
    },
    enabled: !!userID,
    staleTime: 1000 * 60 * 1,
  });
  

  const getIsLogin = () => {
    if (sessionStorage.getItem("isLogin") || localStorage.getItem("isLogin")) {
      return true;
    } 
    return false;
  };
  
  const handleForgotPassword = async (accountDT) => {
    const requestURL = `${URLS.BACK_DSH}${APIS.forgotPassword}`;
    return reqPost(requestURL, accountDT)
    .then((data) => {
      new NoticeMessage(`성공적으로 업데이트하였습니다.`, {
        callback() {
          location.reload();
        }
      })
    })
    .catch((err) => {
      onResetFail(err);
    });
  }

  const checkStatus = async () => {
    fetch(`${URLS.BACK_DSH}${APIS.checkStatus}`,{
      method: "GET",
      mode: "cors",
      credentials: "include",
    })
    .then(response => {
      if(!response.ok){
        localStorage.clear();
        sessionStorage.clear();
        queryClient.clear();
        navigate("/");
      }
    })
  };

  return {
    checkStatus,
    getIsLogin,
    handleLogin,
    handleLogout,
    handleForgotPassword,
    handleAuthority 
  };
};

export default useAuth;
