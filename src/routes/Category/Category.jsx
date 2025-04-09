import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Category.css";
import { useTranslation } from "react-i18next";
import RankingModal from "../../components/Modal/RankingModal"; // 랭킹 모달
import BrandModal from "../../components/Modal/BrandModal"; // 브랜드 모달
import useCosmetic from "../../hooks/useCosmetic";

const Category = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // 왼쪽 메뉴 (영문명 추가)
  const leftItems = [
    { name: "페이스", englishName: "face", display_category_sn: 201 },
    { name: "아이", englishName: "eye", display_category_sn: 202 },
    { name: "립", englishName: "lip", display_category_sn: 203 },
    { name: "네일", englishName: "nail", display_category_sn: 204 },
  ];

  // 오른쪽 메뉴 (영문명으로 매핑)
  const rightContents = {
    201: [
      { name: "전체", englishName: "all" },
      { name: "블러셔", englishName: "blusher" },
      { name: "브론저", englishName: "bronzer" },
      { name: "파운데이션", englishName: "foundation" },
      { name: "브러시", englishName: "brush" },
    ], // 페이스
    202: [
      { name: "전체", englishName: "all" },
      { name: "아이브로우", englishName: "eyebrow" },
      { name: "아이라이너", englishName: "eyeliner" },
      { name: "아이섀도우", englishName: "eyeshadow" },
      { name: "마스카라", englishName: "mascara" },
    ], // 아이
    203: [
      { name: "전체", englishName: "all" },
      { name: "립 라이너", englishName: "lipliner" },
      { name: "립스틱", englishName: "lipstick" },
    ], // 립
    204: [
      { name: "전체", englishName: "all" },
      { name: "네일", englishName: "nail" },
    ], // 네일
  };

  // 상태 변수
  const [activeIndex, setActiveIndex] = useState(0); // 기본 선택된 상위 메뉴
  const [activeProductType, setActiveProductType] = useState("all"); // 기본 선택된 제품 종류 (영문명)
  const [selectedOption, setSelectedOption] = useState(''); // 랭킹순 또는 브랜드 선택
  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false); // 랭킹 모달 열기/닫기
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false); // 브랜드 모달 열기/닫기
  const [cosmeticFilterParams, setCosmeticFilterParams] = useState('');

  useEffect(() => {
    // URL에서 상위 카테고리와 제품 종류를 가져오는 코드
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category');
    const productType = searchParams.get('product_type');
    const option = searchParams.get('option');

    if (category) {
      const categoryIndex = leftItems.findIndex(item => item.englishName === category);
      setActiveIndex(categoryIndex >= 0 ? categoryIndex : 0); // 상위 카테고리
    }

    if (productType) {
      setActiveProductType(productType); // 제품 종류
    }

    if (option) {
      setSelectedOption(option); // 선택된 옵션
    }
  }, [location]);

  const { cosmeticList } = useCosmetic({
    cosmeticFilterParams: cosmeticFilterParams,
  });

  // 상위 메뉴 클릭 시
  const handleLeftItemClick = (idx, category) => {
    setActiveIndex(idx);
    setActiveProductType("all"); // 제품 종류 초기화
    navigate(`?category=${category.englishName}&product_type=all`); // URL 업데이트
  };

  // 하위 메뉴 클릭 시 (제품 종류)
  const handleRightItemClick = (item) => {
    setActiveProductType(item.englishName); // 영문명으로 상태 업데이트
    const category = leftItems[activeIndex].englishName;
    navigate(`?category=${category}&product_type=${item.englishName}`); // URL 업데이트
  };

  // 원형 메뉴 항목 클릭 시 (랭킹순, 브랜드 등)
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    const category = leftItems[activeIndex].englishName;
    navigate(`?category=${category}&product_type=${activeProductType}&option=${option}`); // URL 업데이트
  };

  return (
    <div className="w-full h-[1200px] bg-gray-500">
      {/* 상위 메뉴 */}
      <div className="w-full h-[50px] bg-gray-400 flex items-center justify-start px-4 space-x-4">
        {leftItems.map((item, idx) => (
          <div
            key={idx}
            onClick={() => handleLeftItemClick(idx, item)}
            className={`cursor-pointer py-2 px-4 text-center 
              ${activeIndex === idx ? "text-black border-b-2 border-black" : "text-gray-600"} 
              hover:text-black hover:border-b-2 hover:border-black transition-all`}
          >
            {item.name}
          </div>
        ))}
      </div>

      {/* 하위 메뉴 감싸는 영역 */}
      <div className="h-[130px] bg-gray-200 p-6">
        <div className="w-full bg-white p-4 rounded shadow">
          <div className="flex space-x-4 overflow-x-auto">
            {rightContents[leftItems[activeIndex].display_category_sn]?.map((item, i) => (
              <div
                key={i}
                onClick={() => handleRightItemClick(item)}
                className={`bg-white p-4 rounded shadow text-left cursor-pointer hover:bg-blue-100 min-w-[120px] 
                  ${activeProductType === item.englishName ? 'text-black border-b-2 border-black' : 'text-gray-600'}`}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 원형 메뉴 - 랭킹순, 브랜드 */}
      <div className="h-[120px] bg-gray-200 p-6 mt-4">
        <div className="w-full bg-white p-4 rounded shadow">
          <div className="flex space-x-6 justify-center">
            <button
              onClick={() => setIsRankingModalOpen(true)} // 랭킹순 버튼 클릭 시 모달 열기
              className="h-12 px-6 rounded-xl bg-blue-500 text-white flex items-center justify-center hover:bg-blue-700 transition-all cursor-pointer"
            >
              랭킹순
            </button>

            <button
              onClick={() => setIsBrandModalOpen(true)} // 브랜드 버튼 클릭 시 모달 열기
              className="h-12 px-6 rounded-xl bg-green-500 text-white flex items-center justify-center hover:bg-green-700 transition-all cursor-pointer"
            >
              브랜드
            </button>
          </div>
        </div>
      </div>

      {/* 모달 */}
      <RankingModal
        isOpen={isRankingModalOpen}
        onClose={() => setIsRankingModalOpen(false)}
        onSelectRanking={(rankingOption) => {
          handleOptionSelect(rankingOption);
          setIsRankingModalOpen(false); // 모달 닫기
        }}
      />
      <BrandModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        onSelectBrand={(brand) => {
          handleOptionSelect(brand);
          setIsBrandModalOpen(false); // 모달 닫기
        }}
      />
    </div>
  );
};

export default Category;
