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
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedProductType, setSelectedProductType] = useState(null);
  const navigate = useNavigate();

  const leftItems = [
    { name: "페이스", englishName: "face", display_category_sn: 201 },
    { name: "아이", englishName: "eye", display_category_sn: 202 },
    { name: "립", englishName: "lip", display_category_sn: 203 },
    { name: "네일", englishName: "nail", display_category_sn: 204 },
  ];

  const rightContents = {
    201: [
      { name: "전체", englishName: "all" },
      { name: "블러셔", englishName: "blusher" },
      { name: "브론저", englishName: "bronzer" },
      { name: "파운데이션", englishName: "foundation" },
      { name: "브러시", englishName: "brush" },
    ],
    202: [
      { name: "전체", englishName: "all" },
      { name: "아이브로우", englishName: "eyebrow" },
      { name: "아이라이너", englishName: "eyeliner" },
      { name: "아이섀도우", englishName: "eyeshadow" },
      { name: "마스카라", englishName: "mascara" },
    ],
    203: [
      { name: "전체", englishName: "all" },
      { name: "립 라이너", englishName: "lipliner" },
      { name: "립스틱", englishName: "lipstick" },
    ],
    204: [
      { name: "전체", englishName: "all" },
      { name: "네일", englishName: "nail" },
    ],
  };

  const handleBrandClick = (brand) => {
    setSelectedBrand(brand);
    if (selectedProductType) {
      moveToCategory(brand, selectedProductType);
    }
  };

  const handleRightItemClick = (item) => {
    const productType = item.englishName;
    setSelectedProductType(productType);
    if (selectedBrand) {
      moveToCategory(selectedBrand, productType);
    }
  };

  const moveToCategory = (brand, productType) => {
    const category = leftItems[activeIndex].englishName;
    navigate(`/category?brand=${brand}&category=${category}&product_type=${productType}`);
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
        <BrandsScroller
          selectedBrand={selectedBrand}
          onBrandClick={handleBrandClick}
        />
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
                className={`p-4 rounded shadow text-left cursor-pointer 
                  ${selectedProductType === item.englishName ? 'bg-blue-400 text-white' : 'bg-white hover:bg-blue-100'}`}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
