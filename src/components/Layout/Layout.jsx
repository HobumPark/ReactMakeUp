import React from 'react';
import { Outlet } from 'react-router-dom';  // Outlet을 사용하여 자식 컴포넌트를 렌더링
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();  // 현재 경로 정보 가져오기
  const path = location.pathname;
  console.log('path')
  console.log(path)
  
  return (
    <div className="w-[80vw] bg-gray-300 mx-auto">
      <Header path={path}/>  {/* 헤더 추가 */}
      <div className="w-7/10 mx-auto bg-gray-400">
        <Outlet />  {/* 이 자리에 자식 컴포넌트가 렌더링 됩니다. */}
      </div>
      <Footer />  {/* 푸터 추가 */}
    </div>
  );
};

export default Layout;
