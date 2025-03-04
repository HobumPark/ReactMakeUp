import React, { useEffect, useState } from 'react';
import { NavLink } from "react-router-dom";
import classes from './Sidebar.module.css'; 
import mainLogo from '../../assets/icon/main-logo.svg'
import imgUser from '../../assets/icon/img-user.svg'
import logoutIcon from '../../assets/icon/logout-icon.svg'
import dropdownArrow from '../../assets/icon/dropdown-arrow-grey.svg'
import { Link, useLocation } from 'react-router-dom';
import NoticeMessage from '../../plugin/noticemessage/noticemessage';
import useAuth from '../../hooks/useAuth';
import ModalProfileManagement from '../Modal/ModalProfileManagement/ModalProfileManagement';
import { useTranslation } from 'react-i18next';
import Common from '../../utils/standard';
import i18n from '../../utils/i18n';


const Sidebar = ({ userInfo, commonData, navbarList }) => {
  const { t } = useTranslation();
  const { handleLogout } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [time, setTime] = useState(""); 
  const [date, setDate] = useState("");
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [language, setLanguage] = useState("");


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
      const day = now.getDate();
      const year = now.getFullYear();

      setTime(`${hours}:${minutes}:${seconds}`);
      setDate(`${dayName}, ${monthName} ${day} ${year}`);
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);

    return () => clearInterval(intervalId);
  }, [i18n.language]);



  // const categories = [
  //   { name: "dashboard", label: "Dashboard", path: "/dashboard/main-dashboard" },
  //   { name: "system", label: '시스템 관리' },
  //   { name: "asset", label: '자산 관리' },
  //   { name: "site", label: "사이트 관리" },
  //   { name: "statistic", label: "통계" },
  // ]

  console.log(navbarList);
  
  const programOrder = ["DASHBOARD", "SYSTEM", "ASSET", "SITE-MANAGEMENT", "STATISTICS"];

  const categories = navbarList
    ?.filter(item => programOrder.includes(item.program_id))  
    ?.sort((a, b) => programOrder.indexOf(a.program_id) - programOrder.indexOf(b.program_id)) 
    ?.map(item => ({
      name: item.program_id,
      label: item.lang,
      path: item.url || item.urls?.[0] 
    }));
  

  const links = navbarList?.flatMap(item =>
    item.child_program_ids?.map((childId, index) => ({
      id: childId , 
      label: item.langs[index], 
      path: item.urls[index] ,
      category: item.program_id,
    }))
  );
  

  // const links = [
  //   // {id: "main-dashboard", label: "Main dashboard", path: "/dashboard/main-dashboard", category: "dashboard"},
  //   // {id: "crossroad", label: "Cross Road", path: "/dashboard/crossroad", category: "dashboard"},
  //   // {id: "equipment-info", label: "Equipment-info", path: "/dashboard/equipment-info", category: "dashboard"},
  //   // {id: "accessroad", label: "Access Road", path: "/dashboard/accessroad", category: "dashboard"},
  //   // {id: "crosswalk", label: "Cross Walk", path: "/dashboard/crosswalk", category: "dashboard"},



  //   { id: "code", label: '코드 관리', path: "/system-management/code", category: "system", },
  //   { id: "group", label: '그룹 관리', path: "/system-management/group", category: "system", },
  //   { id: "user", label: '유저 관리', path: "/system-management/user", category: "system", },
  //   { id: "program", label: '프로그램 관리', path: "/system-management/program", category: "system", },
  //   { id: "authority", label: '권한 관리', path: "/system-management/authority", category: "system", },

  //   {id: "box", label: '함체', path: "/asset-management/box", category: "asset"},
  //   {id: "detector", label: '검지기', path: "/asset-management/detector", category: "asset"},
  //   {id: "facility", label: '시설물', path: "/asset-management/facility", category: "asset"},


  //   {id: "site", label: "사이트", path: "/site-management/site", category: "site"},
    
    
  //   {id: "communication-history", label: "소통정보 이력", path: "/statistic/communication-history", category: "statistic"},
  //   {id: "communication-statistic", label: "소통정보 통계", path: "/statistic/communication-statistic", category: "statistic"},
  //   {id: "sudden-event", label: "돌발이벤트", path: "/statistic/sudden-event", category: "statistic"}
  // ];
  
  const [openMenu, setOpenMenu] = useState("");

  const toggleVisibility = (menu) => {
    setOpenMenu((prevMenu) => (prevMenu === menu ? null : menu));
  };

  const handleLinkClick = (id) => {
    setIsActive(prevState => !prevState);
  };

  const toggleActive = () => {
    setIsActive(prevState => !prevState);
  };
  // const toggleVisibility = () => {
  //   setIsVisible((prev) => !prev);
  // };
  const isLinkActive = (linkPath) => {
    return location.pathname.includes(linkPath);
  };
  const handleLogoutButton = () => {
    let checkLogout = new NoticeMessage(t('msg > logout confirm'), {
      mode: "confirm",
    });
  
    checkLogout.confirmClicked().then(() => {
      handleLogout();
    });
  };  

  useEffect(() => {
    const currentPath = location.pathname;
    const matchedLink = links?.find((link) => link.path === currentPath);
    if (matchedLink) {
      setOpenMenu(matchedLink.category);
    }
  }, [location.pathname]);


  const dashboardCategory = categories?.find(category => category.name === "DASHBOARD");


  return (
    <>
    
      <section className={classes.navbar} id="nav">
        <div className={classes['box-title-header']}>
          <div className={classes['box-selection']}>
            <img src={mainLogo} alt="Main Logo" />
          </div>

          <div className={classes['box-logout']}>
            <div className={`${classes.spacesProfile} ${classes._modalProp}`} onClick={() => setIsModalOpen(true)}>
              <img src={imgUser} className={classes["img-user"]} alt="User" />
              <div className={classes["name-user"]}>
                <span id="user-name">{userInfo?.account_id}</span>
                <p id="user-position">{userInfo?.job_position}</p>
              </div>
            </div>
            <div className={classes["title-languange-logout"]}>
              <span className={classes["languange"]} id="user-language">{language}</span>
                <img src={logoutIcon} alt="Logout" className={classes.logout} onClick={handleLogoutButton} />

            </div>
          </div>

          <div className={classes["box-content-time"]}>
            <div className={classes["title-timer"]} id="real_time">{time}</div>
            <div className={classes["title-date"]} id="real_day">{date}</div>
          </div>
        </div>

        <div className={classes["box-selection-toggle"]}>
          <div className={classes["box-toggle-dropdown"]}>
          {(categories && categories.length > 0 && links && links.length > 0) && (
              <div className={classes["box-system-management"]}>
                  {dashboardCategory && (
                    <div className={classes["title-system-management"]}>
                      <span
                        onClick={() => {
                          window.open(dashboardCategory.path, "_blank");
                        }}
                      >
                        {dashboardCategory.label}
                      </span>
                    </div>
                  )}
                {categories.filter(category => category.name !== "DASHBOARD").map((category) => (
                  <div key={category.name}>
                    <span
                      className={`${classes["title-system-management"]} ${
                        openMenu === category.name ? classes.active : ""
                      }`}
                      onClick={() => toggleVisibility(category.name)}
                    >
                      {category.label}
                      <img
                        className={classes["menu-dropdown"]}
                        src={dropdownArrow}
                        alt="Dropdown"
                      />
                    </span>

                    {openMenu === category.name && (
                      <div className={classes["content-system-management"]}>
                        {/* Render links only if links is not null or undefined */}
                        {links
                          .filter((link) => link.category === category.name)
                          .map((link) => (
                            <NavLink
                              key={link.id}
                              to={link.path}
                              className={`${classes.link} ${
                                isLinkActive(link.path) ? classes.active : ""
                              }`}
                            >
                              <li className={classes["list-system-management"]}>
                                {link.label}
                              </li>
                            </NavLink>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* <div className={classes["box-system-management"]}>
              <span
                className={`${classes["title-system-management"]} ${isVisible ? classes.active : ''}`}
                id="title-system-management"
                onClick={toggleVisibility}
              >
               {t('SYSTEM')}
                <img
                  className={classes["menu-dropdown"]}
                  src={dropdownArrow}
                  alt="Dropdown"
                />
              </span>
              {isVisible && (
              <div className={classes["content-system-management"]} id="content-system-management">
                {links.map(link => (
                  <Link
                    key={link.id}
                    to={link.path}
                    onClick={() => handleLinkClick(link.id)}
                    className={`${classes.link} ${isLinkActive(link.path) ? classes.active : ""}`}
                  >
                    <li className={classes["list-system-management"]}>
                      {link.label}
                    </li>
                  </Link>
                ))}
              </div>
            )}
            </div> */}
          </div>
        </div>
      </section>
      <ModalProfileManagement isModalOpen={isModalOpen}  setIsModalOpen={setIsModalOpen} userInfo={userInfo} commonData={commonData}/>
    </>
  );
};

export default Sidebar;
