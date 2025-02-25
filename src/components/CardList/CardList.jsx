import React, { useState } from "react";

const CardList = ({
  type = "listSite", // Bisa "list" atau "event"
  customCard,
  customTitle,
  customID,
  customSubtitle,
  customDate,
  title,
  subtitle,
  date,
  id,
  showID = false
}) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleCardClick = () => {
    setIsClicked(!isClicked);
  };

  const typeStyles = {
    listSite: "border-l-[4px]  ",
    event: "border-l-[4px]  ",
  };

  return (
    <>
      {type === "event" ? (
        <div
          className={`${customCard} w-full flex flex-col gap-[3px] p-[10px] rounded-[2px] ${
            isClicked ? "bg-[#5B5C5C]" : "bg-[#31363D]"
          } ${typeStyles.event}`}
          onClick={handleCardClick}
        >
          <div className="w-full flex flex-row">
            <span
              className={`title3bold ${customTitle} text-text-white flex-1`}
            >
              [이벤트] {title}
            </span>

            {showID && (
            <span className={`${customID} flex-1 body2 text-text-white text-right`}>
              {id}
            </span>
            )}
          </div>
          <div className="w-full grid grid-cols-2">
            <span className={`body2medium ${customSubtitle} text-text-white`}>
              {subtitle}
            </span>
            <span
              className={`${customDate} caption text-text-white text-right`}
            >
              {date}
            </span>
          </div>
        </div>
      ) : (
        <div
          className={`${customCard} w-full flex flex-col gap-[3px] p-[10px] rounded-[2px] ${
            isClicked ? "bg-[#5B5C5C]" : "bg-[#31363D]"
          } ${typeStyles.listSite}`}
          onClick={handleCardClick}
        >
          <div className="w-full grid grid-cols-2">
            <span className={`body2 ${customTitle} text-text-white`}>
              {title}
            </span>
            <span className={`${customID} body2 text-text-white text-right`}>
              {id}
            </span>
          </div>
          <div className="w-full grid grid-cols-2">
            <span className={`body2medium ${customSubtitle} text-text-white`}>
              {subtitle}
            </span>
            <span className={`${customDate} body2 text-text-white text-right`}>
              {date}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default CardList;
