import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Search.css";
import { useTranslation } from "react-i18next";
const Search = () => {
  const {t} = useTranslation();

  const [deviceList, setDeviceList] = useState([]);//테스트 차량목록

  return (
    <div>
        검색창
    </div>
  );
};

export default Search;
