import React, { useEffect} from "react";
import Header from "../../components/Header/Header";
import "./Home.css";
import { useTranslation } from "react-i18next";
import useCosmetic from "../../hooks/useCosmetic";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FoundationSlider from "../../components/Slider/FoundationSlider/FoundationSlider"; // 경로에 맞게 조정
import LipstickSlider from "../../components/Slider/LipstickSlider/LipstickSlider"; // 경로에 맞게 조정
import EyelinerSlider from "../../components/Slider/EyelinerSlider/EyelinerSlider"; // 경로에 맞게 조정

const Home = () => {
  const {t} = useTranslation();

  const { popularFoundationList, popularLipstickList, popularEyelinerList } 
  = useCosmetic(
    { 
      popularFoundationParams: 'rating_greater_than=4&product_type=foundation', 
      popularLipstickParams: 'rating_greater_than=4&product_type=lipstick', 
      popularEyelinerParams: 'rating_greater_than=4&product_type=eyeliner'
    }
  )

  console.log('popularFoundationList')
  console.log(popularFoundationList)
  console.log('popularLipstickList')
  console.log(popularLipstickList)
  console.log('popularEyelinerList')
  console.log(popularEyelinerList)

  return (
    <div className="w-10/10 h-[1500px] bg-gray-500 pt-2">
      {/* 인기 파운데이션 영역 */}
      <div className="bg-white rounded-lg shadow-md p-3 mb-3 mt-3">
        <h2 className="text-2xl font-bold mb-3 text-gray-800">🔥 인기 파운데이션</h2>
        {/* 여기 나중에 슬라이더 들어갈 자리 */}
        {popularFoundationList && popularFoundationList.length > 0 && (
          <FoundationSlider items={popularFoundationList} />
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-3 mb-3 mt-3">
        <h2 className="text-2xl font-bold mb-3 text-gray-800">🔥 인기 립스틱</h2>
        {/* 여기 나중에 슬라이더 들어갈 자리 */}
        {popularLipstickList && popularLipstickList.length > 0 && (
          <LipstickSlider items={popularLipstickList} />
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-3 mb-3 mt-3">
        <h2 className="text-2xl font-bold mb-3 text-gray-800">🔥 인기 아이라이너</h2>
        {/* 여기 나중에 슬라이더 들어갈 자리 */}
        {popularEyelinerList && popularEyelinerList.length > 0 && (
          <EyelinerSlider items={popularEyelinerList} />
        )}
      </div>

    </div>
  );
};

export default Home;
