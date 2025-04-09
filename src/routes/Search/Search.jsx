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

  //Blush, Bronzer, Eyebrow, Eyeliner, Eyeshadow, Foundation, Lip liner, Lipstick, Mascara, Nail polish

   // 왼쪽 메뉴 (얼굴, 눈, 립 카테고리)
   const leftItems = [
    { name: "페이스", display_category_sn: 201 },
    { name: "아이", display_category_sn: 202 },
    { name: "립", display_category_sn: 203 },
    { name: "네일", display_category_sn: 204 },
  ];

  // 오른쪽 메뉴 (각각의 카테고리에 대한 하위 항목)
  const rightContents = {
    201: ["전체", "블러셔", "브론저", "파운데이션", "브러시"],   // 얼굴
    202: ["전체", "아이브로우", "아이라이너", "아이섀도우", "마스카라"],   // 눈
    203: ["전체", "립 라이너", "립스틱"],  // 립
    204: ["전체", "네일"],  // 립
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
