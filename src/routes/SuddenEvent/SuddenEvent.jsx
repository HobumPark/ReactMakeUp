import React, { useState, useEffect, useCallback, useRef } from "react";
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
import { formatDateToYYYYMMDD, formatFullDateTime, formatDateTime } from "../../utils/date";
import Button from "../../components/Button/Button";

import VideoModal from "../../components/Modal/VideoModal/VideoModal";

import Chart from "react-apexcharts";
import useSuddenMgt from "../../hooks/useSuddenMgt";

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
    field: "timestamp",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: true,
    resizable: false,
  },
  {
    title: "사이트",
    field: "site_name",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "접근로",
    field: "road_name",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "이벤트 유형",
    field: "type",
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
    field: "lane_moving_direction",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "차로",
    field: "road_id",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "진행방향",
    field: "lane_direction",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "이미지",
    field: "image",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
    formatter: (cell, formatterParams, onRendered) => {
      return `<img src="${IconPlay}" alt="Play Icon" style="margin: auto; cursor: pointer;" />`;
    },
    cellClick: (e, cell) => {
      const imgUrl = cell.getValue();
      console.log('이미지 클릭');
      console.log(imgUrl);

      // URL에 쿼리 파라미터로 비디오 URL 전달
      const url = `/img-modal?videoUrl=${encodeURIComponent(imgUrl)}`;
      window.open(url, '_blank', 'width=686,height=552');
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
      //
    ],
  },
};

const SuddenEvent = () => {


  const { t, i18n } = useTranslation();
  const searchRef = useRef(null);

  

  const [showModal, setShowModal] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [averageWaitTimeValues, setAverageWaitTimeValues] = useState([
    { name: "전체", data: new Array(12).fill(0) },
    { name: "역주행", data: new Array(12).fill(0) },
    { name: "정차", data: new Array(12).fill(0) },
    { name: "정지선 위반", data: new Array(12).fill(0) },
    { name: "불법 주정차", data: new Array(12).fill(0) },
    { name: "속도 위반", data: new Array(12).fill(0) },
    { name: "보행자", data: new Array(12).fill(0) }
  ]);
  //1시간 - 12개 인터벌
  //1일 - 12개 인터벌
  //1개월 - 12개 인터벌

  const [categories, setCategories] = useState([]);
  


  const [queryParams, setQueryParams] = useState(""); // queryParams 상태
  const [selectedOption, setSelectedOption] = useState("");

  const today = new Date();
  const firstDate = new Date();
  firstDate.setHours(today.getHours() - 1); // 1시간 뺀 값

  const secondDate = new Date(today);
  const [dateTime,setDateTime] = useState({
    start_date:formatFullDateTime(firstDate),
    end_date:formatFullDateTime(secondDate)
  });

  const {trafficEventTime,trafficEventCnt} = useSuddenMgt({
    queryParams: `start_time=${dateTime.start_date}&end_time=${dateTime.end_date}`,
   
  });

  console.log('trafficEventTime')
  console.log(trafficEventTime)

  console.log('trafficEventCnt')
  console.log(trafficEventCnt)

  const handleChange = (e) => {
    console.log('handleChange')
    console.log(e.target.value)
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
    //alert("ButtonClick!")
    setActiveButton(label);
  };

  useEffect(() => {
      if (searchRef.current) {
        searchRef.current.focus();
      }
    }, []);

  useEffect(() => {
    const today = new Date();

    // 첫 번째 날짜: 현재 시간에서 1시간을 뺀 값
    const firstDate = new Date(today);
    firstDate.setHours(today.getHours() - 1);

    // 두 번째 날짜: 현재 날짜의 년, 월, 일, 시, 분, 초, 밀리초 모두 설정
    const secondDate = new Date(today);

    setDateTime({
      start_date: formatFullDateTime(firstDate),
      end_date: formatFullDateTime(secondDate)
    });

    if(trafficEventTime != null){
      console.log('차트데이터 넣기!')
      console.log(trafficEventTime)
      //가져온 데이터 꺼내서검사
    }
    

  }, []);  // 의존성 배열이 비어있으므로 컴포넌트 마운트 시 한 번만 실행

  //initial date value
  useEffect(()=>{

  },[])

  //change date button
  useEffect(()=>{
    
    let locale;
    if (i18n.language === "eng") {
      locale = localeEn;
    } else if (i18n.language === "ind") {
      locale = localeId;
    } else {
      locale = localeKo;
    }

    // 첫 번째 날짜는 현재 시간에서 -1시간, -1일, -1개월
    const today = new Date();
    let firstDate = new Date(today); // today 값을 복사하여 사용

    if (activeButton === "1시간") {
      firstDate.setHours(today.getHours() - 1);  // 1시간을 빼기
    } else if (activeButton === "1일") {
      firstDate.setDate(today.getDate() - 1);  // 1일을 빼기
    } else if (activeButton === "1개월") {
      firstDate.setMonth(today.getMonth() - 1);  // 1개월을 빼기
    }


    // 두 번째 날짜는 현재 시간 그대로
    const secondDate = new Date(today);

    const optionsDate = {
      autoClose: true,
      locale: locale,
      position: "bottom center",
      selectedDates: [firstDate],  // 첫 번째 날짜는 -1시간 설정
      dateFormat: "yyyy-MM-dd hh:mm",  // 시, 분, 초까지 포함한 날짜 포맷
      onSelect: (date) => {
        console.log('select start date')
        console.log(date.formattedDate)
        setDateTime((prevValues) => ({
          ...prevValues,
          start_date: date.formattedDate,  // 날짜가 시분초 포함된 형식으로 반환됨
        }));

      },
    };

    const optionsDateSecond = {
      autoClose: true,  
      locale: locale,
      position: "bottom center",
      selectedDates: [secondDate],  // 두 번째 날짜는 현재 시간 그대로
      dateFormat: "yyyy-MM-dd hh:mm",  // 시, 분, 초까지 포함한 날짜 포맷 
      onSelect: (date) => {
        console.log('select end date')
        console.log(date.formattedDate)
        setDateTime((prevValues) => ({
          ...prevValues,
          end_date: date.formattedDate,  // 날짜가 시분초 포함된 형식으로 반환됨
        }));
      },
    };

    // 첫 번째 날짜 선택기
    const datepicker1 = new AirDatepicker('[name="first-date"]', optionsDate);

    // 두 번째 날짜 선택기
    const datepicker2 = new AirDatepicker('[name="second-date"]', optionsDateSecond);

    setDateTime({
      start_date: formatFullDateTime(firstDate),
      end_date: formatFullDateTime(secondDate)
    });

    return () => {
      datepicker1.destroy();
      datepicker2.destroy();
    };

  },[activeButton])

  useEffect(() => {
    if (dateTime.start_date && dateTime.end_date) {
      // trafficEventTime 값이 배열이라면, 하나씩 출력


    }
  }, [dateTime]); // dateTime 값이 변경될 때마다 실행


  useEffect(() => {
    // 두 날짜 간 차이를 계산
    const startDate = new Date(dateTime.start_date);
    const endDate = new Date(dateTime.end_date);
    const timeDifference = endDate - startDate; // 밀리초 단위 차이
    const timeInterval = timeDifference / 12; // 12개의 구간으로 나누기

    const newCategories = [];
    for (let i = 0; i < 12; i++) {
      const intervalStart = new Date(startDate.getTime() + timeInterval * i);
      const intervalEnd = new Date(intervalStart.getTime() + timeInterval);

      // 각 구간의 시작 시간을 'MM-DD hh:mm' 형식으로 저장
      const categoryLabel = `${intervalStart.getMonth() + 1}-${intervalStart.getDate()} ${String(intervalStart.getHours()).padStart(2, "0")}:${String(intervalStart.getMinutes()).padStart(2, "0")}`;
      newCategories.push(categoryLabel);

      // 예시로 각 구간에 무작위 값을 넣는 코드입니다. 실제 로직으로 대체 가능.
      console.log(`Interval ${i + 1}:`, intervalStart, "to", intervalEnd);
    }

    

    // categories 업데이트
    setCategories(newCategories);


  }, [dateTime]); // dateTime이 변경될 때마다 실행

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
    footerElement: `<div style="padding: 0 20px 0 0; text-align: right;">총 ${trafficEventTime?.data.events.length} 건</div>`,
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


    const handleSearch = useCallback(
        (inputVal = null) => { 
          //alert('검색!')
          const resultInput = inputVal ? `input=${inputVal}` : "";
          console.log('검색:'+resultInput)
          const result = resultInput;
          setQueryParams(result); 
        }, []
    );

  // 외부에서 xaxis categories를 설정하는 방식으로 차트 옵션을 변경
  const chartOptionsWithProps = (customCategories) => {
    return {
      ...optionsChart,
      xaxis: {
        categories: customCategories,  // xaxis.categories 값을 외부에서 변경된 값으로 설정
      },
    };
  };

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
            searchRef={searchRef}
            placeholder="사이트 / 접근로"
            disableFiltering={true}
            customWidthSelect= "w-full flex flex-1 basis-[450px] "
            customWidthInput=" flex flex-1 w-full!"
            labelSelect="이벤트 유형  "
            onSearch={handleSearch}
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
                customButton={`button filtering  cursor-pointer w-full ${
                  activeButton === "1시간" ? "active" : ""
                }`}
                label="1시간"
                onClick={() => handleButtonClick("1시간")}
              />
              <Button
                customButton={`button filtering cursor-pointer w-full ${
                  activeButton === "1일" ? "active" : ""
                }`}
                label="1일"
                onClick={() => handleButtonClick("1일")}
              />
              <Button
                customButton={`button filtering  cursor-pointer w-full ${
                  activeButton === "1개월" ? "active" : ""
                }`}
                label="1개월"
                onClick={() => handleButtonClick("1개월")}
              />
           </div>
            <div className="flex flex-row gap-2 items-center w-full">
              <GeneralInput 
                isDob={true}
                inputType="text"
                value={dateTime?.start_date}
                name={"first-date"} />
              <span>-</span>
              <GeneralInput
                isDob={true}
                inputType="text"
                value={dateTime?.end_date}
                name={"second-date"}
              />
            </div>
            </div>

          </Filtering>
        </ContainerCard>

        <ContainerCard>
          <ReactTabulator
            data={trafficEventTime?.data.events || []}
            columns={suddenEventTabulator}
            layout={"fitColumns"}
            className="tabulator-custom w-full "
            //   pagination="local"
            options={optionsTabulator}
          />

          <div className=" mt-[40px] flex flex-col border-[3px] border-[#E6E6E6] rounded-[3px] p-[10px]">
            <span className="title3bold text-[#545454]">돌발이벤트 발생횟수</span>
            <Chart
              options={chartOptionsWithProps(categories)}
              series={averageWaitTimeValues}
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
