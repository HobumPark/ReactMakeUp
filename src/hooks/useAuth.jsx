import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";

import { URLS, APIS } from "../config/urls.js";
import { reqGet, reqPost, reqPut } from "../utils/request.js";

const useAuth = ({ onLoginFail = () => {} } = {}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogin = async (accountDT) => {
    const requestURL = `${URLS.BACK_DSH}${APIS.login}`;
    return reqPost(requestURL, accountDT)
      .then((data) => {
        if (accountDT?.remember_me === true) {
          localStorage.setItem("user_id", data.user_id);
          localStorage.setItem("isLogin", true);
        } else {
          sessionStorage.setItem("user_id", data.user_id);
          sessionStorage.setItem("isLogin", true);
        }
        queryClient.clear();
        navigate("/system-management/user");
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


  const getIsLogin = () => {
    if (sessionStorage.getItem("isLogin") || localStorage.getItem("isLogin")) {
      return true;
    } 
    return false;
  };

  return {
    getIsLogin,
    handleLogin,
    handleLogout,
  };
};

export default useAuth;
