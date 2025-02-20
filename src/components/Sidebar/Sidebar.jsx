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


const Sidebar = ({ userInfo, commonData }) => {
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


  const categories = [
    { name: "dashboard", label: "Dashboard" },
    { name: "system", label: t("SYSTEM") },
    { name: "asset", label: "Asset Management" },
    { name: "site", label: "Site Management" },
    { name: "statistic", label: "Statistic" },
  ]

  const links = [
    {id: "main-dashboard", label: "sudden-event", path: "/dashboard/main-dashboard", category: "dashboard"},



    { id: "code", label: t('SYSTEM-CODE'), path: "/system-management/code", category: "system", },
    { id: "group", label: t('SYSTEM-GROUP'), path: "/system-management/group", category: "system", },
    { id: "user", label: t('SYSTEM-USER'), path: "/system-management/user", category: "system", },
    { id: "program", label: t('SYSTEM-PROGRAM'), path: "/system-management/program", category: "system", },
    { id: "authority", label: t('SYSTEM-AUTHORITY'), path: "/system-management/authority", category: "system", },

    {id: "box", label: "Box", path: "/asset-management/box", category: "asset"},
    {id: "detector", label: "Detector", path: "/asset-management/detector", category: "asset"},
    {id: "facility", label: "Facility", path: "/asset-management/facility", category: "asset"},


    {id: "site", label: "Site", path: "/site-management/site", category: "site"},
    {id: "crosswalk", label: "Crosswalk", path: "/site-management/crosswalk", category: "site"},
    
    
    {id: "communication-history", label: "communication-history", path: "/statistic/communication-history", category: "statistic"},
    {id: "communication-statistic", label: "communication-statistic", path: "/statistic/communication-statistic", category: "statistic"},
    {id: "sudden-event", label: "sudden-event", path: "/statistic/sudden-event", category: "statistic"}
  ];
  
  const [openMenu, setOpenMenu] = useState("system");

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
          <div className={classes["box-system-management"]}>
              {categories.map((category) => (
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
