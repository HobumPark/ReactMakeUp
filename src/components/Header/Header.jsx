import React from "react";
import IconStatistic from "../../assets/icon/icon-db-statistic.svg";
import IconSystem from "../../assets/icon/icon-db-system.svg";
import IconSitus from "../../assets/icon/icon-db-situs.svg";
import IconAsset from "../../assets/icon/icon-db-asset.svg";
import IconUser from "../../assets/icon/icon-db-people.svg";
import IconLogout from "../../assets/icon/icon-db-logout.svg";

const Header = () => {
  return (
    <>
      <header className="w-full flex flex-row justify-between h-[62px] text-text-white bg-db-black ">
        <div className="flex w-fit">
          <div className="flex  items-center h-full min-w-[218px] bg-header-content ">
            <span className="m-auto h5bold">SMART TRAFFIC</span>
          </div>
          <div className="flex w-fit flex-row h-full items-center">
            <div className="flex flex-col items-center gap-[5px] w-[97px]">
              <img src={IconStatistic} alt="IconStatistic" />
              <span className="body1medium text-text-white">통계</span>
            </div>
            <div className="flex flex-col items-center gap-[5px] w-[97px]">
              <img src={IconSystem} alt="IconSystem" />
              <span className="body1medium text-text-white">시스템</span>
            </div>
            <div className="flex flex-col items-center gap-[5px] w-[97px]">
              <img src={IconSitus} alt="IconSitus" />
              <span className="body1medium text-text-white">사이트</span>
            </div>
            <div className="flex flex-col items-center gap-[5px] w-[97px]">
              <img src={IconAsset} alt="IconAsset" />
              <span className="body1medium text-text-white">자산</span>
            </div>
          </div>
        </div>
        <div className="flex gap-[8px] w-fit">
          <div className="flex w-fit flex-row h-full items-center gap-[8px]">
            <div className="flex flex-col text-right ">
                <span className="text-text-white title2">목요일</span>
                <span className="text-text-white title2">2001년 9월 11일</span>
            </div>
            <span className="h5bold text-text-white">17:15:21</span>
          </div>
          <div className="flex  items-center h-full min-w-[218px] bg-header-content justify-between px-[20px] gap-[20px]">
            <div className="flex flex-row items-center gap-[4px]">
              <img src={IconUser} alt="user" />
              <span className="title2bold">Budiboy</span>
            </div>
            <img src={IconLogout} alt="" />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
