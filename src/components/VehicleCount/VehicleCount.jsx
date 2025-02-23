import React, {useState} from "react";
import IconLeft from "../../assets/icon/icon-db-turn-left.svg"
import IconDown from "../../assets/icon/icon-db-turn-down.svg"
import IconRight from "../../assets/icon/icon-db-turn-right.svg"

const VehicleCount = ({customeStyle, title, entryCount, exitCount, countTurnLeft, countStraight, countTrunRight}) => {
  return (
    <>
      <div className={ `${customeStyle}  min-w-[157px] gap-[7px] flex flex-col z-10 border-[0.5px] border-[#8B8888] bg-[rgba(45,50,56,0.24)] px-[10px] py-[5px] `}>
        <span className="text-text-white body2bold text-center flex justify-center">
          {title}
        </span>
        <div className="grid grid-cols-2 text-center justify-between w-full">
          <div className=" flex flex-1 items-center gap-[5px] flex justify-center">
            <span className="text-text-white captionmedium">진입</span>
            <span className="text-text-white captionbold">{entryCount}</span>
          </div>
          <div className=" flex flex-1 items-center gap-[5px] flex justify-center">
            <span className="text-text-white captionmedium">진출</span>
            <span className="text-text-white captionbold">{exitCount}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 text-center justify-between w-full gap-[20px]">
          <div className=" flex flex-1 items-center gap-[5px] flex justify-center">
            <img src={IconLeft} alt="" />
            <span className="text-text-white captionbold">{countTurnLeft}</span>
          </div>
          <div className=" flex flex-1 items-center gap-[5px] flex justify-center">
            <img src={IconDown} alt="" />
            <span className="text-text-white captionbold">{countStraight}</span>
          </div>
          <div className=" flex flex-1 items-center gap-[5px] flex justify-center">
            <img src={IconRight} alt="" />
            <span className="text-text-white captionbold">{countTrunRight}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default VehicleCount;
