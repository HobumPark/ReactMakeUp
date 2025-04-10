// routes/ProductDetail/ProductDetail.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

const CosmeticView = () => {
  // location에서 state로 전달된 cosmetic 데이터를 받음
  const location = useLocation();
  const cosmetic = location.state;  // Link에서 전달한 cosmetic 데이터

  if (!cosmetic) {
    return <div>Loading...</div>; // 만약 데이터가 없으면 로딩 표시
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">{cosmetic.name}</h2>
      <img src={cosmetic.api_featured_image} alt={cosmetic.name} className="w-full h-[400px] object-cover mb-4" />
      <p>{cosmetic.brand}</p>
      <p>{cosmetic.price}$</p>
      <p>{cosmetic.description}</p>
      <div className="mt-4">
        <h3 className="font-semibold">색상</h3>
        <div className="flex space-x-2">
          {cosmetic.product_colors?.map((color, idx) => (
            <div
              key={idx}
              className="w-8 h-8 rounded-full"
              style={{
                backgroundColor: color.hex_value,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CosmeticView;
