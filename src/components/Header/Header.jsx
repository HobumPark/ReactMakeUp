import React, { useEffect, useState } from "react";
import IconStatistic from "../../assets/icon/icon-db-statistic.svg";
import IconSystem from "../../assets/icon/icon-db-system.svg";
import IconSitus from "../../assets/icon/icon-db-situs.svg";
import IconAsset from "../../assets/icon/icon-db-asset.svg";
import IconUser from "../../assets/icon/icon-db-people.svg";
import IconLogout from "../../assets/icon/icon-db-logout.svg";
import useAuth from "../../hooks/useAuth";
import NoticeMessage from "../../plugin/noticemessage/noticemessage";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import Common from "../../utils/standard";
import i18n from "../../utils/i18n";

const Header = () => {
  const { t } = useTranslation();
  const { userInfo } = useOutletContext();
  const [language, setLanguage] = useState("");
  const [time, setTime] = useState(""); 
  const [date, setDate] = useState("");
  const [day, setDay] = useState("");

  const { handleLogout } = useAuth();
  const handleLogoutButton = () => {
    let checkLogout = new NoticeMessage(t('msg > logout confirm'), {
      mode: "confirm",
    });
  
    checkLogout.confirmClicked().then(() => {
      handleLogout();
    });
  };  
  useEffect(() => {
    const langSource = Common.getDTPLangSource(i18n.language);
    setLanguage(i18n.language.toLocaleUpperCase());
    const updateDateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");

      const dayName = langSource.days[now.getDay()];
      const monthName = langSource.months[now.getMonth()];
      const dayMins = langSource.dayMins; 
      const day = now.getDate();
      const year = now.getFullYear();

      setTime(`${hours}:${minutes}:${seconds}`);
      setDate(`${year}년 ${monthName} ${day}일`);
      setDay(dayName);
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);

    return () => clearInterval(intervalId);
  }, [i18n.language]);

  const handleNavigate = (url) => {
    window.open(url, "_blank");
  };
  return (
    <>
      <header className="w-full flex flex-row justify-between h-[62px] text-text-white bg-db-black ">
        <div className="flex w-fit">
          <div className="flex  items-center h-full min-w-[218px] bg-header-content ">
            <span className="m-auto h5bold">SMART TRAFFIC</span>
          </div>
          <div className="flex w-fit flex-row h-full items-center">
            <div className="flex flex-col items-center gap-[5px] w-[97px]" onClick={() => handleNavigate("/statistic/communication-history")}>
              <img src={IconStatistic} alt="IconStatistic" />
              <span className="body1medium text-text-white">통계</span>
            </div>
            <div className="flex flex-col items-center gap-[5px] w-[97px]"  onClick={() => handleNavigate("/system-management/user")}>
              <img src={IconSystem} alt="IconSystem" />
              <span className="body1medium text-text-white">시스템</span>
            </div>
            <div className="flex flex-col items-center gap-[5px] w-[97px]"  onClick={() => handleNavigate("/site-management/site")}>
              <img src={IconSitus} alt="IconSitus" />
              <span className="body1medium text-text-white">사이트</span>
            </div>
            <div className="flex flex-col items-center gap-[5px] w-[97px]"  onClick={() => handleNavigate("/asset-management/box")}>
              <img src={IconAsset} alt="IconAsset" />
              <span className="body1medium text-text-white">자산</span>
            </div>
          </div>
        </div>
        <div className="flex gap-[8px] w-fit">
          <div className="flex w-fit flex-row h-full items-center gap-[8px]">
            <div className="flex flex-col text-right ">
                <span className="text-text-white title2">{day}</span>
                <span className="text-text-white title2">{date}</span>
            </div>
            <span className="h5bold text-text-white">{time}</span>
          </div>
          <div className="flex  items-center h-full min-w-[218px] bg-header-content justify-between px-[20px] gap-[20px]">
            <div className="flex flex-row items-center gap-[4px]">
              <img src={IconUser} alt="user" />
              <span className="title2bold">{userInfo?.account_id}</span>
            </div>
            <img src={IconLogout} alt="" onClick={handleLogoutButton} />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
