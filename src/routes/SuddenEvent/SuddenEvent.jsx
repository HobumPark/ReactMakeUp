import React, { useState, useEffect } from "react";
import IconPlay from "../../assets/icon/icon-play-tabulator.svg";
import ContainerCard from "../../components/ContainerCard/ContainerCard";
import Filtering from "../../components/Filtering/Filtering";
import { ReactTabulator } from "react-tabulator";
import DetailForm from "../../components/DetailForm/DetailForm";
import LogList from "../../components/LogList/LogList";
import ButtonGroup from "../../components/ButtonGroup/ButtonGroup";
import Select from "../../components/Select/Select";
import GeneralInput from "../../components/GeneralInput/GeneralInput";
import { useTranslation } from "react-i18next";
import localeEn from "air-datepicker/locale/en.js";
import localeKo from "air-datepicker/locale/ko.js";
import localeId from "air-datepicker/locale/id.js";
import AirDatepicker from "air-datepicker";
import Button from "../../components/Button/Button";

import VideoModal from "../../components/Modal/VideoModal/VideoModal";

import Chart from "react-apexcharts";

const suddenEventTabulator = [
  {
    title: "No",
    formatter: "rownum",
    width: 60,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "발생일시",
    field: "event_time",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: true,
    resizable: false,
  },
  {
    title: "사이트",
    field: "site",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "접근로",
    field: "access",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "이벤트 유형",
    field: "event_type",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "차종",
    field: "vehicle_type",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "차선방향",
    field: "lane_direction",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "차로",
    field: "lane",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "진행방향",
    field: "direction",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "이미지",
    field: "img_play",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
    formatter: (cell, formatterParams, onRendered) => {
      return `<img src="${IconPlay}" alt="Play Icon" style="margin: auto; cursor: pointer;" />`;
    },
    cellClick: (e, cell) => {
      window.open('/img-modal', '_blank', 'width=686,height=552');

    },
    
  },
];

const data = [
  {
    event_time: "2025-01-24 23:10:11",
    site: "시청사거리",
    access: "시청 방면",
    vehicle_type: "승용차",
    event_type: "역주행",
    lane_direction: "진입",
    lane: "3",
    direction: "좌회전",
    img_play: "",
  },
  {
    event_time: "2025-01-24 23:10:11",
    site: "시청사거리",
    access: "시청 방면",
    vehicle_type: "승용차",
    event_type: "역주행",
    lane_direction: "진입",
    lane: "3",
    direction: "좌회전",
    img_play: "",
  },
  {
    event_time: "2025-01-24 23:10:11",
    site: "시청사거리",
    access: "시청 방면",
    vehicle_type: "승용차",
    event_type: "역주행",
    lane_direction: "진입",
    lane: "3",
    direction: "좌회전",
    img_play: "",
  },
];

const optionsChart = {
  chart: {
    type: "line",
    zoom: {
      enabled: false,
    },
    fontFamily: "Noto Sans KR",
    toolbar: {
      show: false,
    },
  },
  colors: [
    "#171616", 
    "#07C403", 
    "#BBBE09", 
    "#C4032B", 
    "#9D03C4", 
    "#C47703", 
    "#29688C"], // ini buat bg warna legend
  markers: {
    size: 4,
    // colors: ["#EA494E", "#FDCA6A", "#439C50"],
    // strokeColors: ["#EA494E", "#FDCA6A", "#439C50"], // ini buat stroke bg warna legend
  },
  stroke: {
    show: true,
    curve: "straight",
    width: 1.5,
  },
  xaxis: {
    categories: [
      "01-20 12:30",
      "01-20 12:35",
      "01-20 12:40",
      "01-20 12:45",
      "01-20 12:50",
      "01-20 12:55",
      "01-20 13:00",
      "01-20 13:05",
      "01-20 13:10",
      "01-20 13:15",
      "01-20 13:20",
    ],
  },
};

const SuddenEvent = () => {
  const { t, i18n } = useTranslation();

  const [selectedOption, setSelectedOption] = useState("");
  const handleChange = (e) => {
    setSelectedOption(e.target.value);
  };
  const options = [
    { value: "전체", label: "전체" },
    { value: "역주행", label: "역주행" },
    { value: "정차", label: "정차" },
    { value: "정지선 위반", label: "정지선 위반" },
    { value: "불법 주정차", label: "불법 주정차" },
    { value: "속도 위반", label: "속도 위반" },
    { value: "보행자", label: "보행자" },
  ];

  const [activeButton, setActiveButton] = useState("1시간");

  const handleButtonClick = (label) => {
    setActiveButton(label);
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
    const datepicker2 = new AirDatepicker(
      '[name="second-date"]',
      optionsDateSecond
    );

    return () => {
      datepicker1.destroy();
      datepicker2.destroy();
    };
  }, [i18n.language]);


  const languageTabulator = () => {
    let datalanguage = {
      pagination: {
        first: t('cmn > first page'), //text for the first page button
        first_title:t('cmn > first page'), //tooltip text for the first page button
        last:t('cmn > last page'),
        last_title: t('cmn > last page'),
        prev: t('cmn > page before'),
        prev_title: t('cmn > page before'),
        next: t('cmn > next page'),
        next_title: t('cmn > next page'),
      },
    }
    return datalanguage
  }


  const optionsTabulator = {
    pagination: true,
    paginationSize: 10,
    rowHeight: 41,
    index: "id",
    locale: "ko",
    langs: {
      ko: languageTabulator(),
    },
    movableRows: false,
    resizableRows: false,
    footerElement: `<div style="padding: 0 20px 0 0; text-align: right;">총 ${data.length} 건</div>`,
  };

  const averageWaitTime = [
    {
      name: "전체",
      data: [30, 40, 25, 50, 49, 21, 35, 40, 23, 12, 54, 61],
    },
    {
      name: "역주행",
      data: [23, 12, 54, 61, 32, 56, 42, 33, 28, 18, 65, 47],
    },
    {
      name: "정차",
      data: [24, 20, 5, 75, 42, 79, 10, 24, 33, 45, 12, 34],
    },
    {
      name: "정지선 위반",
      data: [24, 20, 5, 5, 42, 79, 8, 19, 25, 35, 47, 53],
    },
    {
      name: "불법 주정차",
      data: [2, 20, 25, 55, 42, 79, 9, 23, 38, 48, 54, 63],
    },
    {
      name: "속도 위반",
      data: [2, 0, 25, 55, 102, 79, 30, 60, 45, 35, 25, 15],
    },
    {
      name: "보행자",
      data: [2, 0, 25, 55, 102, 79, 30, 60, 45, 35, 25, 15],
    },
  
  ];

  return (
    <>
      <section className="wrap">
        <div className="header-title">
          <h3>돌발이벤트</h3>
          {/* <h3>&gt;</h3>
          <h3>횡단보도</h3> */}
        </div>

        <ContainerCard>
          <Filtering
            placeholder="사이트 / 접근로"
            disableFiltering={true}
            customWidthSelect="w-[65%]"
            customWidthInput="w-[300px]"
            labelSelect="이벤트 유형  "
          >

            <div className="flex w-full gap-4 flex-row items-center">
            <Select
              options={options}
              customWidthSelect="w-[40%]!"
              label="Pilih Opsi"
              name="contoh aja coy"
              value={selectedOption}
              onChange={handleChange}
            />
           <div className="flex w-[60%] gap-[12px]">
           <Button
                customButton={`button filtering  w-full ${
                  activeButton === "1시간" ? "active" : ""
                }`}
                label="1시간"
                onClick={() => handleButtonClick("1시간")}
              />
              <Button
                customButton={`button filtering  w-full ${
                  activeButton === "1일" ? "active" : ""
                }`}
                label="1일"
                onClick={() => handleButtonClick("1일")}
              />
              <Button
                customButton={`button filtering  w-full ${
                  activeButton === "1개월" ? "active" : ""
                }`}
                label="1개월"
                onClick={() => handleButtonClick("1개월")}
              />
           </div>
            <div className="flex flex-row gap-2 items-center w-full">
              <GeneralInput isDob={true} inputType="text" name={"first-date"} />
              <span>-</span>
              <GeneralInput
                isDob={true}
                inputType="text"
                name={"second-date"}
              />
            </div>
            </div>

          </Filtering>
        </ContainerCard>

        <ContainerCard>
          <ReactTabulator
            data={data}
            columns={suddenEventTabulator}
            layout={"fitColumns"}
            className="tabulator-custom w-full "
            //   pagination="local"
            options={optionsTabulator}
          />

          <div className=" mt-[40px] flex flex-col border-[3px] border-[#E6E6E6] rounded-[3px] p-[10px]">
            <span className="title3bold text-[#545454]">돌발이벤트 발생횟수</span>
            <Chart
              options={optionsChart}
              series={averageWaitTime}
              height={350}
              className={"flex w-full !min-h-[0]"}
            />
          </div>
        </ContainerCard>
      </section>

      {/* <VideoModal/> */}
    </>
  );
};

export default SuddenEvent;
