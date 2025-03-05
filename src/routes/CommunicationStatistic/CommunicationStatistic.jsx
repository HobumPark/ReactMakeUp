import React, { useState, useEffect, useCallback } from "react";
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
import { formatDateTime } from "../../utils/date";
import UseStatistic from "../../hooks/useStatistic";


const CommunicationStatistic = () => {
  const { t, i18n } = useTranslation();
  const [isResetClicked, setIsResetClicked] = useState(false)
  const today = new Date();
  const midnight = new Date(new Date().setHours(0, 0, 0, 0));
  const [activeButton, setActiveButton] = useState("5분");
  const [interval, setInterval] = useState(5);
  const [dateTime, setDateTime] = useState({
    start_date:formatDateTime(midnight),
    end_date:formatDateTime(today)
  });


  const handleButtonClick = (label, interval) => {
    setActiveButton(label);
    setInterval(interval);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;  
      setDateTime((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
  };

    useEffect(() => {
      let locale;
      if (i18n.language === "eng") {
        locale = localeEn;
      } else if (i18n.language === "ind") {
        locale = localeId;
      } else {
        locale = localeKo; 
      }

  
      const optionsDate = {
        autoClose: true,
        locale: locale,
        position: "bottom center",
        selectedDates: [midnight],
        timepicker: true,
        timeFormat: "HH:mm",
        dateFormat: "yyyy-MM-dd",
        onSelect: (date) => {
          setDateTime((prevValues) => ({
            ...prevValues,
            start_date: date.formattedDate,
          }));
          setActiveButton('');
        },
      };
  
      const optionsDateSecond = {
        autoClose: true,
        locale: locale,
        position: "bottom center",
        timepicker: true,
        timeFormat: "HH:mm",
        dateFormat: "yyyy-MM-dd",
        selectedDates: [today],
        onSelect: (date) => {
          setDateTime((prevValues) => ({
            ...prevValues,
            end_date: date.formattedDate,
          }));
          setActiveButton('');
        },
      };
  
      const datepicker1 = new AirDatepicker('[name="start_date"]', optionsDate);
      const datepicker2 = new AirDatepicker('[name="end_date"]', optionsDateSecond);
      setIsResetClicked(false);
      return () => {
        datepicker1.destroy();
        datepicker2.destroy();
      };
    }, [i18n.language,isResetClicked]);


    const [activeTab, setActiveTab] = useState(0);
    const [queryParams, setQueryParams] = useState(`start_date=${dateTime.start_date}&end_date=${dateTime.end_date}&interval=${interval}`);


    const { objectTrafficList, objectCntList, objectCntLaneList, objectTrafficChartList } = UseStatistic({
      queryParams: queryParams,
    });
    
    const objectTraffic = objectTrafficList?.data;
    const objectCnt = objectCntList?.data;
    const objectCntLane = objectCntLaneList?.data;
    const objectTrafficChart = objectTrafficChartList?.data;

  const handleReset= () => {
    
    setIsResetClicked(true);
    setDateTime({
      start_date:formatDateTime(midnight),
      end_date:formatDateTime(today)
    })
    setActiveButton('5분')
    setInterval(5);

  };

  const handleSearch = useCallback((inputVal = null) => {
    const resultInput = inputVal ? `input=${inputVal}` : "";
    const { start_date, end_date } = dateTime;
    const dateParams = [];
    if (start_date) {
      dateParams.push(`start_time=${start_date}`);
    }

    if (end_date) {
      dateParams.push(`end_time=${end_date}`);
    }
    const intervalParam = interval ? `interval=${interval}` : "";
    const result = [resultInput, ...dateParams, intervalParam].filter(Boolean).join("&");
    setQueryParams(result); 
  },[dateTime, interval]);
    
    

    const tabs = [
      { label: "전체 통계", content: <AllStatistic  data={objectTraffic} chartData = {objectTrafficChart} />},
      { label: "차종별 통계", content: <StatisticByType  data={objectCnt}/> },
      { label: "차로별 통계", content: <StatisticByLane data={objectCntLane}/> },
    ]



  return (
    <>
      <section className="wrap">

      <div className="header-title">
          <h3>소통정보 통계</h3>
        </div>

        <ContainerCard>
          <Filtering 
            placeholder="사이트 / 접근로"
            customWidthInput=" flex xl:flex-[0.8] lg:flex-1 md:flex-1 "
            showLabel= {false} 
            onSearch={handleSearch}
            onReset={handleReset}
            disableFiltering={true} 
            customWidthSelect= "w-full flex flex-1 basis-[700px] ">
          {/* <Filtering 
            placeholder="사이트 / 접근로"
            customWidthInput=" flex flex-1 w-full!"
            showLabel= {false} 
            disableFiltering={true} 
            customWidthSelect= "w-full flex flex-1 basis-[790px] "> */}

            <div className="flex w-fit gap-4 flex-row">
              <Button
                customButton={`button filtering ${
                  activeButton === "5분" ? "active" : ""
                }`}
                label="5분"
                onClick={() => handleButtonClick("5분",5)}
              />
              <Button
                customButton={`button filtering ${
                  activeButton === "15분" ? "active" : ""
                }`}
                label="15분"
                onClick={() => handleButtonClick("15분",15)}
              />
              <Button
                customButton={`button filtering ${
                  activeButton === "30분" ? "active" : ""
                }`}
                label="30분"
                onClick={() => handleButtonClick("30분",30)}
              />
              <Button
                customButton={`button filtering ${
                  activeButton === "60분" ? "active" : ""
                }`}
                label="60분"
                onClick={() => handleButtonClick("60분",60)}
              />
            </div>
            <div className="flex flex-row gap-2 items-center w-full">
            <GeneralInput 
              isDob={true} 
              inputType = "text"
              name={"start_date"}
              value={dateTime.start_date}
              onChange={handleInputChange}
            />
            <span>-</span>
            <GeneralInput 
              isDob={true} 
              inputType = "text"
              name={"end_date"}
              value={dateTime.end_date}
              onChange={handleInputChange}
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
