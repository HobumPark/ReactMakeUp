import React from "react";
import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import "./FoundationSlider.css"; // 필요 시 커스텀 스타일

const FoundationSlider = ({ items }) => {
  // 🔵 이전 버튼
  const PrevArrow = ({ onClick }) => (
    <div
      className="absolute top-1/2 left-[-20px] transform -translate-y-1/2 z-10"
      onClick={onClick}
    >
      <div className="w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow hover:bg-gray-100 cursor-pointer transition">
        <FontAwesomeIcon icon={faArrowLeft} className="text-gray-600" />
      </div>
    </div>
  );

  // 🔵 다음 버튼
  const NextArrow = ({ onClick }) => (
    <div
      className="absolute top-1/2 right-[-20px] transform -translate-y-1/2 z-10"
      onClick={onClick}
    >
      <div className="w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow hover:bg-gray-100 cursor-pointer transition">
        <FontAwesomeIcon icon={faArrowRight} className="text-gray-600" />
      </div>
    </div>
  );

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  return (
    <div className="p-4 bg-white rounded shadow relative">
      <Slider {...settings}>
        {items?.map((item, idx) => (
          <div key={idx} className="p-2">
            <div className="bg-gray-100 p-4 rounded-lg shadow-md text-center h-[300px] flex flex-col justify-between">
              <img
                src={item.image_link}
                alt={item.name}
                className="w-full h-40 object-contain mb-2"
              />
              <h3 className="text-sm font-semibold line-clamp-2">{item.name}</h3>
              <p className="text-xs text-gray-500">{item.brand}</p>
              <p className="text-yellow-500 text-sm mt-1">⭐ {item.rating}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default FoundationSlider;
