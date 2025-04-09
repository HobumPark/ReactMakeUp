import React, { useRef } from 'react';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from "react-i18next";

const brandMap = [
  { en: "almay", ko: "알메이" },
  { en: "alva", ko: "알바" },
  { en: "anna sui", ko: "안나수이" },
  { en: "annabelle", ko: "아나벨" },
  { en: "benefit", ko: "베네피트" },
  { en: "boosh", ko: "부쉬" },
  { en: "burt's bees", ko: "버츠비" },
  { en: "butter london", ko: "버터런던" },
  { en: "c'est moi", ko: "쎄모아" },
  { en: "cargo cosmetics", ko: "카고" },
  { en: "china glaze", ko: "차이나글레이즈" },
  { en: "clinique", ko: "크리니크" },
  { en: "coastal classic creation", ko: "코스탈 클래식" },
  { en: "colourpop", ko: "컬러팝" },
  { en: "covergirl", ko: "커버걸" },
  { en: "dalish", ko: "달리시" },
  { en: "deciem", ko: "디시엠" },
  { en: "dior", ko: "디올" },
  { en: "dr. hauschka", ko: "하우슈카" },
  { en: "e.l.f.", ko: "엘프" },
  { en: "essie", ko: "에씨" },
  { en: "fenty", ko: "펜티" },
  { en: "glossier", ko: "글로시에" },
  { en: "green people", ko: "그린피플" },
  { en: "iman", ko: "이만" },
  { en: "l'oreal", ko: "로레알" },
  { en: "lotus cosmetics usa", ko: "로터스" },
  { en: "maia's mineral galaxy", ko: "마이아 미네랄" },
  { en: "marcelle", ko: "마르셀" },
  { en: "marienatie", ko: "마리에나티" },
  { en: "maybelline", ko: "메이블린" },
  { en: "milani", ko: "밀라니" },
  { en: "mineral fusion", ko: "미네랄퓨전" },
  { en: "misa", ko: "미사" },
  { en: "mistura", ko: "미스투라" },
  { en: "moov", ko: "무브" },
  { en: "nudus", ko: "누두스" },
  { en: "nyx", ko: "닉스" },
  { en: "orly", ko: "오를리" },
  { en: "pacifica", ko: "퍼시피카" },
  { en: "penny lane organics", ko: "페니레인" },
  { en: "physicians formula", ko: "피지션스 포뮬러" },
  { en: "piggy paint", ko: "피기페인트" },
  { en: "pure anada", ko: "퓨어 아나다" },
  { en: "rejuva minerals", ko: "레쥬바" },
  { en: "revlon", ko: "레블론" },
  { en: "sally b's skin yummies", ko: "샐리비" },
  { en: "salon perfect", ko: "살롱퍼펙트" },
  { en: "sante", ko: "산테" },
  { en: "sinful colours", ko: "신풀컬러" },
  { en: "smashbox", ko: "스매시박스" },
  { en: "stila", ko: "스틸라" },
  { en: "suncoat", ko: "선코트" },
  { en: "w3llpeople", ko: "웰피플" },
  { en: "wet n wild", ko: "웻앤와일드" },
  { en: "zorah", ko: "조라" },
  { en: "zorah biocosmetiques", ko: "조라 바이오" },
];

const BrandsScroller = ({ selectedBrand, onBrandClick }) => {
  const scrollRef = useRef(null);
  const { t } = useTranslation();

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -200 : 200,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="w-full h-[150px] bg-gray-300 flex items-center">
      {/* 왼쪽 버튼 */}
      <div className="w-[40px] flex justify-center items-center">
        <button
          className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
          onClick={() => scroll('left')}
        >
          <FontAwesomeIcon icon={faChevronLeft} className="text-2xl" />
        </button>
      </div>

      {/* 브랜드 리스트 */}
      <div
        ref={scrollRef}
        className="w-[90%] flex overflow-x-hidden overflow-y-hidden space-x-4 scrollbar-hide"
      >
        {brandMap.map((brand, index) => (
          <div
            key={index}
            onClick={() => onBrandClick(brand.en)}
            className={`
              min-w-[80px] h-[80px] flex items-center justify-center rounded-full text-sm text-center shadow cursor-pointer px-2
              ${selectedBrand === brand.en
                ? 'bg-blue-400 text-white'
                : 'bg-white hover:bg-blue-200'}
            `}
          >
            {brand.ko}
          </div>
        ))}
      </div>

      {/* 오른쪽 버튼 */}
      <div className="w-[40px] flex justify-center items-center">
        <button
          className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
          onClick={() => scroll('right')}
        >
          <FontAwesomeIcon icon={faChevronRight} className="text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default BrandsScroller;
