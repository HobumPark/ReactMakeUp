// CosmeticItem.js
import React from "react";
import { Link } from "react-router-dom";

const CosmeticItem = ({ cosmetic }) => {
  return (
    <div className="p-4 border rounded-md shadow-lg">
      {/* Link 컴포넌트로 상세 페이지로 이동, state로 cosmetic 데이터 전달 */}
      <Link to={`/product/${cosmetic.id}`} state={cosmetic} className="block">
        <img
          src={cosmetic.api_featured_image}
          alt={cosmetic.name}
          className="w-full h-[200px] object-cover rounded-md mb-2"
        />
        <h4 className="text-lg font-bold">{cosmetic.name}</h4>
        <p className="text-gray-600">{cosmetic.brand}</p>
        <p className="text-gray-500">{cosmetic.price}$</p>
      </Link>
      
      {/* 색상 원형 배치 */}
      {cosmetic.product_colors && cosmetic.product_colors.length > 0 && (
        <div className="flex space-x-2 mt-2">
          {cosmetic.product_colors.map((color, idx) => (
            <div
              key={idx}
              className="w-6 h-6 rounded-full"
              style={{
                backgroundColor: color.hex_value, // 색상 코드에 맞게 원형 배경 설정
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CosmeticItem;
