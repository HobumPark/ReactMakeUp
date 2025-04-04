import React from 'react';
import { Outlet } from 'react-router-dom';  // Outlet을 사용하여 자식 컴포넌트를 렌더링
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const Layout = () => {
  return (
    <div className="w-[80vw] bg-gray-300 mx-auto">
      <Header />  {/* 헤더 추가 */}
      <div className="w-9/10 mx-auto bg-gray-400">
        <Outlet />  {/* 이 자리에 자식 컴포넌트가 렌더링 됩니다. */}
      </div>
      <Footer />  {/* 푸터 추가 */}
    </div>
  );
};

export default Layout;
