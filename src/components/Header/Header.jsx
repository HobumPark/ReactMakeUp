import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import logo from "../../assets/icon/logo/ic_logo_amoreMall_s158x28_000.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShoppingCart, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);

  const toggleIcon = () => {
    setIsOpen(!isOpen);  // 상태를 토글
  };

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
                <button onClick={toggleIcon} className="flex items-center">
                  <FontAwesomeIcon 
                    icon={isOpen ? faArrowUp : faArrowDown} 
                    className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
              </span>
          </div>
          <div className="flex-1 bg-red-500 text-right">
            {/* 돋보기 아이콘 */}
            <button className="text-white mx-4 mt-3 hover:opacity-70 cursor-pointer">
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
          <li className="cursor-pointer hover:text-blue-500">
            <a href="#">LIVE</a>
          </li>
          <li className="cursor-pointer hover:text-blue-500">
            <a href="#">홈</a>
          </li>
          <li className="cursor-pointer hover:text-blue-500">
            <a href="#">BEST</a>
          </li>
          <li className="cursor-pointer hover:text-blue-500">
            <a href="#">아모레위크</a>
          </li>
          <li className="cursor-pointer hover:text-blue-500">
            <a href="#">같이살래?</a>
          </li>
          <li className="cursor-pointer hover:text-blue-500">
            <a href="#">선물하기</a>
          </li>
          <li className="cursor-pointer hover:text-blue-500">
            <a href="#">브랜드</a>
          </li>
          <li className="cursor-pointer hover:text-blue-500">
            <a href="#">세일</a>
          </li>
          <li className="cursor-pointer hover:text-blue-500">
            <a href="#">신상</a>
          </li>
          <li className="cursor-pointer hover:text-blue-500">
            <a href="#">이벤트</a>
          </li>
        </ul>
      </div>

    </header>
  );
};

export default Header;