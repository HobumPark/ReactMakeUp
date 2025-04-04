import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="w-9/10 h-[200px] mx-auto bg-gray-400">
      {/* 푸터 내용 추가 */}
    </footer>
  );
};

export default Footer;