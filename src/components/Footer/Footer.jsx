import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="w-7/10 mx-auto bg-gray-200">
      {/* 푸터 내용 추가 */}
      <div>
        <ul className="flex flex-row w-full p-2 space-x-4">
          <li className="flex-1 text-center border-b-2 border-gray-300 pb-2">
            <a href="#">로그인</a>
          </li>
          <li className="flex-1 text-center border-b-2 border-gray-300 pb-2">
            <a href="#">고객센터</a>
          </li>
          <li className="flex-1 text-center border-b-2 border-gray-300 pb-2">
            <a href="#">임직원</a>
          </li>
        </ul>
      </div>
      <div className="w-full bg-gray-100 p-4">
        <div className="max-w-screen-md mx-auto text-sm text-gray-700">
          <p className="font-bold text-lg mb-2">(주)아모레퍼시픽</p>
          
          <p className="mb-1">서울특별시 용산구 한강대로 100 (한강로2가)</p>
          <p className="mb-1">080-030-5454 (쇼핑문의) / 080-023-5454 (제품문의)</p>
          <p className="mb-1">support_kr@amoremall.com (주문/배송/쇼핑 문의)</p>
          
          <div className="mt-2">
            <p className="mb-1">대표이사 : 김승환</p>
            <p className="mb-1">사업자등록번호 : 106-86-43373</p>
            <p className="mb-1">통신판매업신고번호 : 2017-서울용산-1308사업자 정보 확인</p>
            <p className="mb-1">건강기능식품판매업 영업신고증 제8호</p>
          </div>
          
          <p className="mt-2">호스팅제공자 : (주)아모레퍼시픽</p>
        </div>
      </div>
      <div className="w-full bg-gray-100 p-4">
        <div className="max-w-screen-md mx-auto text-sm text-gray-700">
          <p className="font-bold text-lg mb-2">개별 판매자의 의무와 책임</p>
          <p className="mb-2">
            개별 판매자가 입점하여 등록한 상품에 대한 광고, 상품주문, 배송, 환불의 의무와 책임은 각 입점판매자가 부담하고,
            이에 대하여 ㈜아모레퍼시픽은 통신판매중개자로서 통신판매의 당사자가 아니므로 일체 책임을 지지 않습니다.
          </p>

          <p className="font-bold text-lg mb-2">중개판매 분쟁해결 기준</p>
          <p className="mb-2">
            저희 쇼핑몰은 고객님의 안전거래를 위해 모든 무통장입금 주문에 대해 KG이니시스의 에스크로 구매안전서비스를 자동 적용하고 있습니다.
          </p>
          <p className="mb-2">서비스 가입 사실 확인</p>
        </div>
      </div>
      <div className="text-center text-sm text-gray-500 py-2">
          © AMOREPACIFIC CORPORATION. ALL RIGHTS RESERVED
      </div>
    </footer>
  );
};

export default Footer;
