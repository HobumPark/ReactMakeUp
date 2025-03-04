import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();
  const group_id = JSON.parse(localStorage.getItem("group_id")); 


  useEffect(() => {
    if (group_id == 1) {
      navigate("/system-management/user");
    } else if (group_id == 2) {
      navigate("/asset-management/box")
    } 
  }, [group_id, navigate]);

  return (
      <>
        <div id="alert-additional-content-2" className="p-4 mb-4 text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
          <div className="flex items-center">
            <svg className="shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
            </svg>
            <span className="sr-only">Info</span>
            <h3 className="text-lg font-medium">접근 권한이 없습니다.</h3>
          </div>
          <div className="mt-2 mb-4 text-sm">
           권한이 없습니다. 자세한 내용은 관리자에게 문의해주세요. 
          </div>
        </div>
       
      </>
     
   
  );
};

export default Unauthorized;