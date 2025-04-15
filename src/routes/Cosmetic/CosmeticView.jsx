import React from 'react';
import { useLocation } from 'react-router-dom';

const CosmeticView = () => {
  // location에서 state로 전달된 cosmetic 데이터를 받음
  const location = useLocation();
  const cosmetic = location.state;  // Link에서 전달한 cosmetic 데이터

  if (!cosmetic) {
    return <div>Loading...</div>; // 만약 데이터가 없으면 로딩 표시
  }

  // 평점 계산
  const rating = cosmetic.rating || 0;
  const ratingCount = cosmetic.rating_count || 0;

  return (
    <div className="p-4">
      {/* 이름에 배경색 및 가운데 정렬 */}
      <h2 className="text-xl font-bold text-white bg-blue-500 text-center py-2 mb-4 rounded">
        {cosmetic.name}
      </h2>

      <img
        src={cosmetic.api_featured_image}
        alt={cosmetic.name}
        className="w-full h-[400px] object-contain mb-4"
      />
      
      {/* 가격, 평점, 평점 수 */}
      <div className="mb-4">
        <p className="text-lg font-semibold">가격: {cosmetic.price}$</p>
        <p className="text-sm text-gray-500">평점: {rating} ({ratingCount}명)</p>
      </div>

      {/* 설명 */}
      <p className="mb-4">{cosmetic.description}</p>

      {/* 색상 원형 표시 및 이름 추가 */}
      <div className="mt-4">
        <h3 className="font-semibold">색상</h3>
        <div className="flex space-x-4">
          {cosmetic.product_colors?.map((color, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              {/* 색상 원 */}
              <div
                className="w-8 h-8 rounded-full"
                style={{
                  backgroundColor: color.hex_value,
                }}
              />
              {/* 색상 이름 */}
              <span className="text-sm">{color.colour_name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CosmeticView;
