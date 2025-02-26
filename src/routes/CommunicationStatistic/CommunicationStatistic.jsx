import React, { useState, useEffect } from "react";
import ContainerCard from "../../components/ContainerCard/ContainerCard";
import Filtering from "../../components/Filtering/Filtering";
import { ReactTabulator } from "react-tabulator";
import DetailForm from "../../components/DetailForm/DetailForm";
import LogList from "../../components/LogList/LogList";
import ButtonGroup from "../../components/ButtonGroup/ButtonGroup";
import Select from "../../components/Select/Select";
import GeneralInput from "../../components/GeneralInput/GeneralInput";
import { useTranslation } from 'react-i18next';
import localeEn from 'air-datepicker/locale/en.js'; 
import localeKo from 'air-datepicker/locale/ko.js'; 
import localeId from 'air-datepicker/locale/id.js'; 
import AirDatepicker from 'air-datepicker';

import AllStatistic from "../../components/Statistic/AllStatistic/AllStatistic";
import StatisticByType from "../../components/Statistic/StatisticByType/StatisticByType";
import StatisticByLane from "../../components/Statistic/StatisticByLane/StatisticByLane";

import Button from "../../components/Button/Button";


const CommunicationStatistic = () => {
  const [activeButton, setActiveButton] = useState("5분");

  const handleButtonClick = (label) => {
    setActiveButton(label);
  };

  const { t, i18n } = useTranslation();
  
    useEffect(() => {
      let locale;
      if (i18n.language === "eng") {
        locale = localeEn;
      } else if (i18n.language === "ind") {
        locale = localeId;
      } else {
        locale = localeKo; 
      }

      const today = new Date();
  
      const optionsDate = {
        autoClose: true,
        locale: locale,
        position: "bottom center",
        selectedDates: [today],
        onSelect: (date) => {
          setFormValues((prevValues) => ({
            ...prevValues,
            birth: date.formattedDate,
          }));
        },
      };
  
      const optionsDateSecond = {
        autoClose: true,
        locale: locale,
        position: "bottom center",
        selectedDates: [today],
        onSelect: (date) => {
          setFormValues((prevValues) => ({
            ...prevValues,
            birth: date.formattedDate,
          }));
        },
      };
  
      const datepicker1 = new AirDatepicker('[name="first-date"]', optionsDate);
      const datepicker2 = new AirDatepicker('[name="second-date"]', optionsDateSecond);
  
      return () => {
        datepicker1.destroy();
        datepicker2.destroy();
      };
    }, [i18n.language]);


    const [activeTab, setActiveTab] = useState(0);

    const tabs = [
      { label: "전체 통계", content: <AllStatistic />},
      { label: "차종별 통계", content: <StatisticByType /> },
      { label: "차로별 통계", content: <StatisticByLane /> },
    ]

  return (
    <>
      <section className="wrap">

      <div className="header-title">
          <h3>소통정보 통계</h3>
        </div>

        <ContainerCard>
          <Filtering placeholder="사이트 / 접근로" disableFiltering={true} customWidthSelect= "w-[55%]">
            <div className="flex w-fit gap-4 flex-row">
              <Button
                customButton={`button filtering ${
                  activeButton === "5분" ? "active" : ""
                }`}
                label="5분"
                onClick={() => handleButtonClick("5분")}
              />
              <Button
                customButton={`button filtering ${
                  activeButton === "15분" ? "active" : ""
                }`}
                label="15분"
                onClick={() => handleButtonClick("15분")}
              />
              <Button
                customButton={`button filtering ${
                  activeButton === "30분" ? "active" : ""
                }`}
                label="30분"
                onClick={() => handleButtonClick("30분")}
              />
              <Button
                customButton={`button filtering ${
                  activeButton === "60분" ? "active" : ""
                }`}
                label="60분"
                onClick={() => handleButtonClick("60분")}
              />
            </div>
            <div className="flex flex-row gap-2 items-center w-[60%]">
            <GeneralInput 
              isDob={true} 
              inputType = "text"
              name={"first-date"}
            />
            <span>-</span>
            <GeneralInput 
              isDob={true} 
              inputType = "text"
              name={"second-date"}
            />
            </div>
          </Filtering>
        </ContainerCard>

      <div className="w-full">
      <div className="flex flex-row gap-4 bg-[#E6E6E6] rounded-tl-lg rounded-tr-lg">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`w-fit py-2 text-center  ${
              activeTab === index
                ? "bg-[#FEFEFE] text-[#135A78] font-bold px-4 rounded-tl-lg rounded-tr-lg border-t border-l border-r border-[#E6E6E6] text-[14px]"
                : "border-transparent text-[#6A6A6A] px-4 text-[14px]"
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="bg-[#fff] p-[20px] border-r border-l border-b border-[#E6E6E6] rounded-bl-[10px] rounded-br-[10px] ">
        {tabs[activeTab].content}
      </div>
    </div>

        
      </section>
    </>
  );
};

export default CommunicationStatistic;
