import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

// 랭킹 모달 컴포넌트
const RankingModal = ({ isOpen, onClose, onSelectRanking }) => {
  // 랭킹 옵션 리스트 (쿼리 스트링 형태로 변환)
  const rankingOptions = [
    { label: "평점 높은순", value: "rating-greater-than" },
    { label: "평점 낮은순", value: "rating-less-than" },
    { label: "높은 가격순", value: "price-greater-than" },
    { label: "낮은 가격순", value: "price-less-than" }
  ];

  if (!isOpen) return null; // 모달이 열리지 않으면 null을 리턴

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full relative">
        {/* 닫기 버튼 - 폰트어썸 아이콘 사용 */}
        <button
          onClick={onClose} // 모달 닫기
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer text-2xl"
        >
          <FontAwesomeIcon icon={faTimes} /> {/* 폰트어썸 X 아이콘 */}
        </button>

        <h3 className="text-xl mb-4">정렬 옵션 선택</h3>
        <div className="flex space-x-4 flex-wrap">
          {rankingOptions.map((option, idx) => (
            <button
              key={idx}
              onClick={() => onSelectRanking(option.value)} // 랭킹 옵션 선택
              className="bg-blue-500 text-white px-4 py-2 rounded-full w-full mx-auto mb-2 cursor-pointer hover:bg-blue-600 transition-all"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RankingModal;
