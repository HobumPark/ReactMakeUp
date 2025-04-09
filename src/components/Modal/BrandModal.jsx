import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom"; // useNavigate로 변경

// 브랜드 모달 컴포넌트
const BrandModal = ({ isOpen, onClose, onApply }) => {
  const [selectedBrand, setSelectedBrand] = useState(null);
  const navigate = useNavigate(); // useNavigate 사용

  // 한글명과 영문명 매핑
  const brandMapping = {
    "알메이": "almay",
    "알바": "alva",
    "안나수이": "anna sui",
    "애나벨": "annabelle",
    "베네핏": "benefit",
    "부시": "boosh",
    "버츠비": "burt's bees",
    "버터런던": "butter london",
    "쎄쎄모이": "c'est moi",
    "카고 코스메틱": "cargo cosmetics",
    "차이나 글레이즈": "china glaze",
    "클리니크": "clinique",
    "코스탈 클래식 크리에이션": "coastal classic creation",
    "컬러팝": "colourpop",
    "커버걸": "covergirl",
    "달리쉬": "dalish",
    "데시엠": "deciem",
    "디올": "dior",
    "닥터 하우슈카": "dr. hauschka",
    "e.l.f.": "e.l.f.",
    "에시": "essie",
    "펜티": "fenty",
    "글로시에": "glossier",
    "그린피플": "green people",
    "이만": "iman",
    "로레알": "l'oreal",
    "로터스 코스메틱스 USA": "lotus cosmetics usa",
    "마이아의 미네랄 갤럭시": "maia's mineral galaxy",
    "마르셀": "marcelle",
    "마리네이티": "marienatie",
    "메이블린": "maybelline",
    "밀라니": "milani",
    "미네랄 퓨전": "mineral fusion",
    "미사": "misa",
    "미스트라": "mistura",
    "무브": "moov",
    "누두스": "nudus",
    "닉스": "nyx",
    "오를리": "orly",
    "파시피카": "pacifica",
    "페니 레인 오르가닉스": "penny lane organics",
    "피지션스 포뮬라": "physicians formula",
    "피기 페인트": "piggy paint",
    "퓨어 아나다": "pure anada",
    "리쥬바 미네랄": "rejuva minerals",
    "레브론": "revlon",
    "샐리 B의 스킨 유미즈": "sally b's skin yummies",
    "살롱 퍼펙트": "salon perfect",
    "산테": "sante",
    "신풀 컬러스": "sinful colours",
    "스매쉬박스": "smashbox",
    "스틸라": "stila",
    "선코트": "suncoat",
    "W3LL PEOPLE": "w3llpeople",
    "웻앤와일드": "wet n wild",
    "조라": "zorah",
    "조라 바이오코스메틱": "zorah biocosmetiques"
  };

  // 브랜드 한글명 리스트
  const brandOptions = Object.keys(brandMapping);

  // 브랜드 선택 시 상태 업데이트 및 쿼리스트링 추가
  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand); // 선택된 브랜드 상태 업데이트
  };

  // 초기화 버튼 클릭 시 상태 초기화 및 URL에서 'brand' 파라미터 삭제
  const handleReset = () => {
    setSelectedBrand(null); // 선택된 브랜드 초기화

    // URL에서 'brand' 파라미터 삭제
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.delete('brand'); // 'brand' 파라미터 삭제

    // URL에 쿼리 스트링 적용
    navigate({
      search: queryParams.toString()
    });
  };

  // 적용 버튼 클릭 시 쿼리스트링 업데이트 및 모달 닫기
  const handleApply = () => {
    if (selectedBrand) {
      const queryParams = new URLSearchParams(window.location.search);
      const brandEnglishName = brandMapping[selectedBrand]; // 선택된 브랜드의 영문명
      queryParams.set('brand', brandEnglishName); // 선택된 브랜드를 'brand' 파라미터로 추가

      // URL에 쿼리 스트링 적용
      navigate({
        search: queryParams.toString()
      });
    }

    // 모달 닫기
    onClose();
  };

  if (!isOpen) return null; // 모달이 열리지 않으면 null을 리턴

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-end z-50">
      <div className="bg-white p-6 rounded-t-lg shadow-lg w-[80%] max-w-[700px] h-[80vh] overflow-hidden relative">
        {/* 닫기 버튼 - 폰트어썸 아이콘 사용 */}
        <button
          onClick={onClose} // 모달 닫기
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer text-3xl"
        >
          <FontAwesomeIcon icon={faTimes} /> {/* 폰트어썸 X 아이콘 */}
        </button>

        <h3 className="text-xl mb-4 text-black">브랜드 선택</h3>

        {/* 브랜드 목록을 감싸는 div에만 스크롤을 적용 */}
        <div className="max-h-[65vh] overflow-y-auto mb-4">
          <div className="grid grid-cols-2 gap-4">
            {brandOptions.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleBrandSelect(option)} // 브랜드 선택
                className={`border-1 text-black px-6 py-3 rounded-xl w-full cursor-pointer transition-all 
                  ${selectedBrand === option ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-black hover:bg-blue-600 hover:text-white hover:border-blue-600'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* 하단 버튼들: 초기화, 적용 */}
        <div className="flex justify-between mt-4">
          <button
            onClick={handleReset} // 초기화 버튼
            className="bg-[#000080] text-white px-6 py-4 rounded-none w-[48%] hover:bg-[#3333cc] transition-all cursor-pointer"
          >
            초기화
          </button>
          <button
            onClick={handleApply} // 적용 버튼
            className="bg-[#000080] text-white px-6 py-4 rounded-none w-[48%] hover:bg-[#3333cc] transition-all cursor-pointer"
          >
            적용
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandModal;
