import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Category.css";
import { useTranslation } from "react-i18next";

const Category = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // 왼쪽 메뉴 (페이스, 아이, 립, 네일 카테고리)
  const leftItems = [
    { name: "페이스", display_category_sn: 201 },
    { name: "아이", display_category_sn: 202 },
    { name: "립", display_category_sn: 203 },
    { name: "네일", display_category_sn: 204 },
  ];

  // 오른쪽 메뉴 (각각의 카테고리에 대한 하위 항목)
  const rightContents = {
    201: ["랭킹순", "브랜드 A", "브랜드 B", "브랜드 C"], // 페이스
    202: ["랭킹순", "브랜드 X", "브랜드 Y", "브랜드 Z"], // 아이
    203: ["랭킹순", "브랜드 M", "브랜드 N"], // 립
    204: ["랭킹순", "브랜드 O"], // 네일
  };

  // 상태 변수
  const [activeIndex, setActiveIndex] = useState(0); // 기본 선택된 상위 메뉴
  const [activeSubIndex, setActiveSubIndex] = useState("랭킹순"); // 기본 선택된 하위 메뉴
  const [activeOption, setActiveOption] = useState("랭킹순"); // 하위 메뉴의 옵션 상태

  useEffect(() => {
    // URL에서 상위 카테고리와 하위 카테고리를 가져오는 코드
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category');
    const subCategory = searchParams.get('subCategory');

    if (category) {
      const categoryIndex = leftItems.findIndex(item => item.name === category);
      setActiveIndex(categoryIndex >= 0 ? categoryIndex : 0); // 상위 카테고리
    }
    
    if (subCategory) {
      setActiveSubIndex(subCategory); // 하위 카테고리
    }
  }, [location]);

  // 상위 메뉴 클릭 시
  const handleLeftItemClick = (idx, category) => {
    setActiveIndex(idx);
    setActiveSubIndex("랭킹순"); // 하위 메뉴 초기화
    setActiveOption("랭킹순"); // 옵션 초기화
    navigate(`?category=${category}&subCategory=랭킹순`); // URL 업데이트
  };

  // 하위 메뉴 클릭 시
  const handleRightItemClick = (item) => {
    setActiveSubIndex(item);
    const category = leftItems[activeIndex].name;
    navigate(`?category=${category}&subCategory=${item}`); // URL 업데이트
  };

  // 하위 메뉴 옵션 클릭 시
  const handleOptionClick = (option) => {
    setActiveOption(option);
    const category = leftItems[activeIndex].name;
    const subCategory = activeSubIndex;
    navigate(`?category=${category}&subCategory=${subCategory}&option=${option}`); // URL 업데이트
  };

  return (
    <div className="w-full h-[1200px] bg-gray-500">
      {/* 상위 메뉴 */}
      <div className="w-full h-[50px] bg-gray-400 flex items-center justify-start px-4 space-x-4">
        {leftItems.map((item, idx) => (
          <div
            key={idx}
            onClick={() => handleLeftItemClick(idx, item.name)}
            className={`cursor-pointer py-2 px-4 text-center 
              ${activeIndex === idx ? "text-black border-b-2 border-black" : "text-gray-600"} 
              hover:text-black hover:border-b-2 hover:border-black transition-all`}
          >
            {item.name}
          </div>
        ))}
      </div>

      {/* 하위 메뉴 감싸는 영역 */}
      <div className="h-[150px] bg-gray-200 p-6">
        <div className="w-full bg-white p-4 rounded shadow">
          {/* 하위 메뉴 */}
          <div className="flex space-x-4 overflow-x-auto">
            {rightContents[leftItems[activeIndex].display_category_sn]?.map((item, i) => (
              <div
                key={i}
                onClick={() => handleRightItemClick(item)}
                className={`cursor-pointer text-center py-2 px-6 rounded-full border-2 
                  ${activeSubIndex === item ? 'bg-black text-white border-black' : 'bg-gray-200 text-gray-600 border-gray-400'} 
                  hover:bg-blue-300 hover:text-white transition-all`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 하위 옵션들 추가 */}
      <div className="h-[150px] bg-gray-200 p-6 mt-4">
        <div className="w-full bg-white p-4 rounded shadow">
          <div className="flex space-x-4 overflow-x-auto">
            {["랭킹순", "브랜드 선택"].map((option, i) => (
              <div
                key={i}
                onClick={() => handleOptionClick(option)}
                className={`cursor-pointer text-center py-2 px-6 rounded-full border-2 
                  ${activeOption === option ? 'bg-black text-white border-black' : 'bg-gray-200 text-gray-600 border-gray-400'} 
                  hover:bg-blue-300 hover:text-white transition-all`}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 여기에 다른 페이지 콘텐츠를 동적으로 추가할 수 있습니다 */}
      <div className="h-[950px] bg-gray-400 p-6">
        <p>
          선택된 카테고리: {leftItems[activeIndex]?.name} <br />
          선택된 하위 카테고리: {activeSubIndex} <br />
          선택된 옵션: {activeOption}
        </p>
      </div>
    </div>
  );
};

export default Category;
