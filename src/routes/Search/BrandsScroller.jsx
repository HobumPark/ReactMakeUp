import React, { useRef } from 'react';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const brands = [
  "almay", "alva", "anna sui", "annabelle", "benefit", "boosh", "burt's bees",
  "butter london", "c'est moi", "cargo cosmetics", "china glaze", "clinique",
  "coastal classic creation", "colourpop", "covergirl", "dalish", "deciem",
  "dior", "dr. hauschka", "e.l.f.", "essie", "fenty", "glossier", "green people",
  "iman", "l'oreal", "lotus cosmetics usa", "maia's mineral galaxy", "marcelle",
  "marienatie", "maybelline", "milani", "mineral fusion", "misa", "mistura",
  "moov", "nudus", "nyx", "orly", "pacifica", "penny lane organics",
  "physicians formula", "piggy paint", "pure anada", "rejuva minerals", "revlon",
  "sally b's skin yummies", "salon perfect", "sante", "sinful colours",
  "smashbox", "stila", "suncoat", "w3llpeople", "wet n wild", "zorah",
  "zorah biocosmetiques"
];
const {t} = useTranslation();

const BrandScroller = () => {
  const scrollRef = useRef(null);

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

      {/* 브랜드 리스트 (가로 스크롤) */}
      <div
        ref={scrollRef}
        className="w-[90%] flex overflow-x-hidden overflow-y-hidden space-x-4 scrollbar-hide"
      >
        {brands.map((brand, index) => (
          <div
            key={index}
            className="min-w-[80px] h-[80px] flex items-center justify-center rounded-full bg-white text-sm text-center shadow hover:bg-blue-200 cursor-pointer px-2"
          >
            {brand}
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

export default BrandScroller;
