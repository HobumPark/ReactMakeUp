import React, { useState } from "react";
import "./Search.css";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSearch, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import BrandsScroller from "./BrandsScroller";

const Search = () => {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const leftItems = [
    { name: "스킨케어", display_category_sn: 101 },
    { name: "메이크업", display_category_sn: 102 },
    { name: "향수", display_category_sn: 137 },
    { name: "생활용품", display_category_sn: 104 },
  ];

  const rightContents = {
    101: ["전체", "클렌징", "모이스처라이징"],
    102: ["전체", "페이스", "립"],
    137: ["전체", "향수"],
    104: ["전체", "바디", "구강"],
  };

  const [activeIndex, setActiveIndex] = useState(0); // 기본 선택 인덱스

  const handleRightItemClick = (rightItem) => {
    const { display_category_sn } = leftItems[activeIndex];
    const search_category = encodeURIComponent(rightItem);
    navigate(`/category?display_category_sn=${display_category_sn}&search_category=${search_category}`);
  };

  return (
    <div className="w-7/10 min-h-screen bg-gray-500 mx-auto">
      {/* 상단 검색바 */}
      <div className="h-[80px] bg-gray-400 flex flex-row items-center">
        <div className="w-[10%] flex justify-center">
          <button className="text-white hover:opacity-70 cursor-pointer">
            <FontAwesomeIcon icon={faArrowLeft} className="text-2xl" />
          </button>
        </div>
        <div className="w-[80%] relative">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-10 pl-4 pr-10 rounded-full border border-blue-500 text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
          />
        </div>
        <div className="w-[10%] flex justify-center">
          <FontAwesomeIcon
            icon={faShoppingCart}
            className="text-white hover:opacity-70 cursor-pointer"
          />
        </div>
      </div>

      {/* 브랜드 스크롤 */}
      <div className="h-[150px] bg-gray-300 flex flex-row items-center">
        <BrandsScroller />
      </div>

      {/* 카테고리 선택 */}
      <div className="min-h-[600px] bg-gray-200 p-6 space-y-4">
        <div className="flex w-full">
          {/* 왼쪽 메뉴 */}
          <div className="w-[20%] space-y-1">
            {leftItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`p-2 rounded shadow text-center cursor-pointer 
                  ${activeIndex === idx ? 'bg-white text-black' : 'bg-gray-100 text-gray-700'}
                  hover:bg-blue-100`}
              >
                {item.name}
              </div>
            ))}
          </div>

          {/* 오른쪽 메뉴 */}
          <div className="w-[80%] ml-4 space-y-1">
            {rightContents[leftItems[activeIndex].display_category_sn]?.map((item, i) => (
              <div
                key={i}
                onClick={() => handleRightItemClick(item)}
                className="bg-white p-4 rounded shadow text-left cursor-pointer hover:bg-blue-100"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
