import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import logo from "../../assets/icon/logo/ic_logo_amoreMall_s158x28_000.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShoppingCart, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  
  const [activeMenu, setActiveMenu] = useState('홈');

  const menuItems = [
    { label: 'LIVE', href: '/live' },
    { label: '홈', href: '/' },
    { label: 'BEST', href: '/best' },
    { label: '아모레위크', href: '/amoreweek' },
    { label: '같이살래?', href: '/together' },
    { label: '선물하기', href: '/gift' },
    { label: '브랜드', href: '/brand' },
    { label: '세일', href: '/sale' },
    { label: '신상', href: '/new' },
    { label: '이벤트', href: '/event' },
  ];

  const toggleIcon = () => {
    setIsOpen(!isOpen);  // 상태를 토글
  };

  const goToSearch=()=>{
    navigate('/search'); // 원하는 경로로 수정
  }

  return (
    <header className="w-7/10 h-[100px] mx-auto bg-gray-200">
      <div className="flex w-full h-[50%] bg-gray-400">
          <div className="flex items-center text-white">
              <span className="text-white mr-5">
                  <a href="/">
                    <img src={`${logo}`} alt="" />
                  </a>
              </span>
              <span className="ml-auto">
                <button onClick={toggleIcon} className="flex items-center cursor-pointer">
                  <FontAwesomeIcon 
                    icon={isOpen ? faArrowUp : faArrowDown} 
                    className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
              </span>
          </div>
          <div className="flex-1 bg-red-500 text-right">
            {/* 돋보기 아이콘 */}
            <button className="text-white mx-4 mt-3 hover:opacity-70 cursor-pointer" onClick={goToSearch}>
              <FontAwesomeIcon icon={faSearch} className="text-2xl"/>
            </button>

            {/* 장바구니 아이콘 */}
            <button className="text-white mx-4 mt-3 hover:opacity-70 cursor-pointer">
              <FontAwesomeIcon icon={faShoppingCart} className="text-2xl"/>
            </button>

            {/* 로그인 아이콘 */}
            <button className="text-white mx-4 mt-3 mr-5 hover:opacity-70 cursor-pointer">
              로그인
            </button>
          </div>
      </div>
      <div className="flex w-full h-[50%] bg-gray-200">
              <ul className="flex flex-row justify-start w-full p-4 space-x-4">
          {menuItems.map(({ label, href }) => {
            const isActive = location.pathname === href;

            return (
              <li
                key={label}
                className={`cursor-pointer hover:text-blue-500 pb-7 border-b-3 ${
                  isActive ? 'text-white font-bold' : 'border-transparent'
                }`}
              >
                <a href={href}>{label}</a>
              </li>
            );
          })}
        </ul>

      </div>

    </header>
  );
};

export default Header;