import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import logo from "../../assets/icon/logo/ic_logo_amoreMall_s158x28_000.svg";

const Header = () => {
  const { t } = useTranslation();

  return (
    <header className="w-9/10 h-[100px] mx-auto bg-gray-200">
      <div className="flex w-full h-[50%] bg-gray-400">
          <div className="flex items-center">
              <span className="">
                  <a href="#">
                    <img src={`${logo}`} alt="" />
                  </a>
              </span>
              <span className="ml-auto">
                  <button>열기/닫기</button>
              </span>
          </div>
          <div className="flex-1 bg-red-500 text-right">
            
          </div>
      </div>
      <div className="flex w-full h-[50%] bg-gray-200">
        
      </div>
    </header>
  );
};

export default Header;