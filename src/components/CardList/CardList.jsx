import React, { useState } from "react";

const CardList = ({ customCard,customTitle,customID,customSubtitle,customDate, title, subtitle, date, id }) => {
  const [isClicked, setIsClicked] = useState(false);


  const handleCardClick = () => {
    setIsClicked(!isClicked);
  };

  return (
    <div
      className={`${
        customCard
      } w-full flex flex-col gap-[3px] p-[10px]  rounded-[2px] border-l-[4px] border-red-500 ${
        isClicked ?  "bg-[#434b56]"  : "bg-[#31363D]"
      }`}
      onClick={handleCardClick}
    >
      <div className="w-full grid grid-cols-2">
        <span className={`${customTitle} body2 text-text-white`}>{title}</span>
        <span className={`${customID} body2 text-text-white text-right`}>{id}</span>
      </div>
      <div className="w-full grid grid-cols-2">
        <span className={`${customSubtitle} title3bold text-text-white`}>{subtitle}</span>
        <span className={`${customDate} body2 text-text-white text-right`}>{date}</span>
      </div>
    </div>
  );
};

export default CardList;
