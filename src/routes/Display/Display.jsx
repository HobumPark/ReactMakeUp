import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Display.css";
import { useTranslation } from "react-i18next";
const Display = () => {
  const {t} = useTranslation();

  const [deviceList, setDeviceList] = useState([]);//테스트 차량목록

  return (
    <div>
   
    </div>
  );
};

export default Display;
