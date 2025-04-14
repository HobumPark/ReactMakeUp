import React, { useCallback, useEffect, useRef, useState } from "react";
import Header from "../../components/Header/Header";
import "./Home.css";
import { useTranslation } from "react-i18next";
import useCosmetic from "../../hooks/useCosmetic";

const Home = () => {
  const {t} = useTranslation();

  const [cosmeticList, setCosmeticList] = useState([]);//테스트 차량목록
  const [cosmeticPopularParams, setCosmeticPopularParams] = useState("");

  const [cosmeticFaceParams, setCosmeticFaceParams] = useState("");
  const [cosmeticEyeParams, setCosmeticEyeParams] = useState("");
  const [cosmeticLipParams, setCosmeticLipParams] = useState("");

  const [popularCosmetics,setPopularCosmetics]=useState([])

  useEffect(() => {
    setCosmeticPopularParams('rating_greater_than=4')
  },[])

  const { popularFaceList,popularEyeList,popularLipList } 
  = useCosmetic(
    { 
      popularFaceParams: 'rating_greater_than=4&product_type=foundation', 
      popularEyeParams: 'rating_greater_than=4&product_type=eyeliner', 
      popularLipParams: 'rating_greater_than=4&product_type=lipstick', 
    }
  )

  console.log('popularFaceList')
  console.log(popularFaceList)
  console.log('popularEyeList')
  console.log(popularEyeList)
  console.log('popularLipList')
  console.log(popularLipList)

  return (
    <div className="w-10/10 h-[500px] bg-gray-500">
      홈
    </div>
  );
};

export default Home;
