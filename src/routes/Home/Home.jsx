import React, { useCallback, useEffect, useRef, useState } from "react";
import Header from "../../components/Header/Header";
import "./Home.css";
import { useTranslation } from "react-i18next";
import useCosmetic from "../../hooks/useCosmetic";
const Home = () => {
  const {t} = useTranslation();

  const [cosmeticList, setCosmeticList] = useState([]);//테스트 차량목록

  const { popularCostmeticList }=useCosmetic({

  })

  console.log('popularCostmeticList')
  console.log(popularCostmeticList)

  return (
    <div className="w-10/10 h-[500px] bg-gray-500">
      홈
    </div>
  );
};

export default Home;
