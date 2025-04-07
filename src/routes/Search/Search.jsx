import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Search.css";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSearch, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import BrandScroller from "./BrandsScroller";

const Search = () => {
  const {t} = useTranslation();
  const [input,setInput]=useState("")

  return (
    <div className="w-7/10 h-[500px] bg-gray-500 mx-auto">
       <div className="h-[80px] bg-gray-400 flex flex-row items-center">
        {/* 좌측 (10%) */}
        <div className="w-[10%] flex justify-center">
          <button className="text-white hover:opacity-70 cursor-pointer">
            <FontAwesomeIcon icon={faArrowLeft} className="text-2xl" />
          </button>
        </div>

        {/* 가운데 (80%) */}
        <div className="w-[80%] relative">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            onChange={() => {}}
            className="w-full h-10 pl-4 pr-10 rounded-full border border-blue-500 text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {/* input 안 오른쪽에 아이콘 */}
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
          />
        </div>

        {/* 우측 (10%) */}
        <div className="w-[10%] flex justify-center">
          {/* 필요 시 우측 버튼이나 아이콘 추가 */}
          <FontAwesomeIcon
            icon={faShoppingCart}
            className="text-white hover:opacity-70 cursor-pointer"
          />
        </div>
      </div>
       <div className="h-[150px] bg-gray-300 flex flex-row items-center">
          <BrandScroller/>
       </div>
       <div className="h-[600px] bg-gray-200 flex flex-row items-center">

       </div>
    </div>
  );
};

export default Search;
