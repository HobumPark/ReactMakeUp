import React, { useEffect, useState } from 'react';
import classes from './Sidebar.module.css'; 
import mainLogo from '../../assets/icon/main-logo.svg'
import imgUser from '../../assets/icon/img-user.svg'
import logoutIcon from '../../assets/icon/logout-icon.svg'
import dropdownArrow from '../../assets/icon/dropdown-arrow-grey.svg'
import { Link, useLocation } from 'react-router-dom';
import NoticeMessage from '../../plugin/noticemessage/noticemessage';
import useAuth from '../../hooks/useAuth';
import ModalProfileManagement from '../Modal/ModalProfileManagement/ModalProfileManagement';

const Sidebar = ({ userInfo }) => {
  const { handleLogout } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [time, setTime] = useState(""); 
  const [date, setDate] = useState("");
  const location = useLocation();

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      const days = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
      ];
      const months = [
        "January", "February", "March", "April", "May", "June", "July", "August",
        "September", "October", "November", "December",
      ];
      const dayName = days[now.getDay()];
      const monthName = months[now.getMonth()];
      const day = now.getDate();
      const year = now.getFullYear();

      setTime(`${hours}:${minutes}:${seconds}`);
      setDate(`${dayName}, ${monthName} ${day} ${year}`);
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const links = [
    { id: "code", label: "Code Management", path: "/system-management/code" },
    { id: "group", label: "Group Management", path: "/system-management/group" },
    { id: "user", label: "User Management", path: "/system-management/user" },
    { id: "program", label: "Program Management", path: "/system-management/program" },
    { id: "authority", label: "Authority Management", path: "/system-management/authority" },
  ];

  const handleLinkClick = (id) => {
    setIsActive(prevState => !prevState);
  };

  const toggleActive = () => {
    setIsActive(prevState => !prevState);
  };
  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };
  const isLinkActive = (linkPath) => {
    return location.pathname.includes(linkPath);
  };
  const handleLogoutButton = () => {
    let checkLogout = new NoticeMessage(":: msg > logout confirm", {
      mode: "confirm",
    });
  
    checkLogout.confirmClicked().then(() => {
      handleLogout();
    });
  };  


  return (
    <>
     <ModalProfileManagement/>
      <section className={classes.navbar} id="nav">
        <div className={classes['box-title-header']}>
          <div className={classes['box-selection']}>
            <img src={mainLogo} alt="Main Logo" />
          </div>

          <div className={classes['box-logout']}>
            <div className={`${classes.spacesProfile} ${classes._modalProp}`}>
              <img src={imgUser} className={classes["img-user"]} alt="User" />
              <div className={classes["name-user"]}>
                <span id="user-name">{userInfo?.username}</span>
                <p id="user-position">{userInfo?.job}</p>
              </div>
            </div>
            <div className={classes["title-languange-logout"]}>
              <span className={classes["languange"]} id="user-language">ENG</span>
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
              <span
                className={`${classes["title-system-management"]} ${isVisible ? classes.active : ''}`}
                id="title-system-management"
                onClick={toggleVisibility}
              >
                System
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
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Sidebar;
