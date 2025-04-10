import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Category.css";
import { useTranslation } from "react-i18next";
import RankingModal from "../../components/Modal/RankingModal";
import BrandModal from "../../components/Modal/BrandModal";
import useCosmetic from "../../hooks/useCosmetic";
import CosmeticList from "../Cosmetic/CosmeticList";
import Pagination from "../Cosmetic/Pagination";

const Category = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // 왼쪽 카테고리 메뉴 (영문명 추가)
  const leftItems = [
    { name: "페이스", englishName: "face", display_category_sn: 201 },
    { name: "아이", englishName: "eye", display_category_sn: 202 },
    { name: "립", englishName: "lip", display_category_sn: 203 },
    { name: "네일", englishName: "nail", display_category_sn: 204 },
  ];

  // 오른쪽 제품 타입 메뉴
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

  // 상태값
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeProductType, setActiveProductType] = useState("all");
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");  // 브랜드 상태 추가
  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [cosmeticSearchParams, setCosmeticSearchParams] = useState("");

  const [cosmetics, setCosmetics] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const cosmeticsPerPage = 12; // 한 페이지당 화장품 수

  // URL 쿼리 읽어서 상태 초기화
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const brand = searchParams.get("brand");
    const option = searchParams.get("option");
    const productType = searchParams.get("product_type");
  
    const params = {};
  
    if (brand) {
      setSelectedBrand(brand); // 브랜드를 상태에 설정
      params.brand = brand;
    }
    if (productType && productType !== "all") params.product_type = productType;
  
    // 옵션: 예를 들어 rating filter로 처리
    if (option === "highRating") {
      params.rating_greater_than = 4;
    } else if (option === "midRating") {
      params.rating_greater_than = 2;
      params.rating_less_than = 4;
    }
  
    const queryStr = new URLSearchParams(params).toString();
    setCosmeticSearchParams(queryStr);
  }, [location]);

  const { searchCosmeticList } = useCosmetic({ searchParams: cosmeticSearchParams });
  console.log('cosmeticSearchParams')
  console.log(cosmeticSearchParams)
  console.log('searchCosmeticList')
  console.log(searchCosmeticList)

  useEffect(() => {
    
    setCosmetics(searchCosmeticList)

  },[searchCosmeticList])

  // 페이지 수 계산
  useEffect(() => {
    if (cosmetics && cosmetics.length > 0) {
      const totalCosmetics = cosmetics.length;
      setTotalPages(Math.ceil(totalCosmetics / cosmeticsPerPage));
    }
  }, [cosmetics]);

  // 왼쪽 메뉴 클릭 시
  const handleLeftItemClick = (idx, item) => {
    setActiveIndex(idx);
    setActiveProductType("all");
    navigate(`?brand=${selectedBrand}&category=${item.englishName}&product_type=all`);
  };

  // 오른쪽 제품 클릭 시
  const handleRightItemClick = (item) => {
    const category = leftItems[activeIndex].englishName;
    setActiveProductType(item.englishName);
    navigate(`?brand=${selectedBrand}&category=${category}&product_type=${item.englishName}`);
  };

  // 랭킹/브랜드 선택 시
  const handleOptionSelect = (option) => {
    const category = leftItems[activeIndex].englishName;
    setSelectedOption(option);
    navigate(`?brand=${selectedBrand}&category=${category}&product_type=${activeProductType}&option=${option}`);
  };

  return (
    <div className="w-full h-[1300px] bg-gray-500">
      {/* 상위 카테고리 */}
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

      {/* 제품 종류 메뉴 */}
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

      {/* 원형 메뉴 (랭킹/브랜드) */}
      <div className="h-[80px] bg-gray-200 p-3 mt-2">
        <div className="w-full bg-white p-1 rounded shadow">
          <div className="flex space-x-6 justify-center">
            <button
              onClick={() => setIsRankingModalOpen(true)}
              className="h-12 px-6 rounded-xl bg-blue-500 text-white hover:bg-blue-700 transition-all cursor-pointer"
            >
              랭킹순
            </button>
            <button
              onClick={() => setIsBrandModalOpen(true)}
              className="h-12 px-6 rounded-xl bg-green-500 text-white hover:bg-green-700 transition-all cursor-pointer"
            >
              브랜드
            </button>
          </div>
        </div>
      </div>
      <div className="h-[900px] bg-gray-200 p-3 mt-2">
         <CosmeticList cosmetics={cosmetics || []}/>
      </div>
      <div className="h-[100px] bg-gray-200 p-3 mt-2">
         <Pagination currentPage={currentPage} totalPages={totalPages}/>   
      </div>
      {/* 모달 */}
      <RankingModal
        isOpen={isRankingModalOpen}
        onClose={() => setIsRankingModalOpen(false)}
        onSelectRanking={(rankingOption) => {
          handleOptionSelect(rankingOption);
          setIsRankingModalOpen(false);
        }}
      />
      <BrandModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        selectedBrand={selectedBrand}  // 초기 브랜드 값 전달
        onSelectBrand={(brand) => {
          setSelectedBrand(brand);
          handleOptionSelect(brand); // 브랜드 선택 후 업데이트
          setIsBrandModalOpen(false);
        }}
      />
    </div>
  );
};

export default Category;
