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
      const imgUrl = cell.getValue();  // Get the value of the clicked cell
      const row = cell.getRow();  // Get the row that contains the clicked cell
      const rowData = row.getData();  // Get the full data for that row
    
      const imgId = rowData._id;  // Assuming _id is part of the row data
      console.log('이미지 클릭');
      console.log('이미지 URL:', imgUrl);
      console.log('행의 _id:', imgId);
    
      // URL에 쿼리 파라미터로 비디오 URL 전달
      const url = `/img-modal?id=${imgId}`;
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
    size: 2,
    hover: {
      size: 2, // 호버 시 마커 크기
    },
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
  yaxis: {//데이터가 총 200개면? 구간이 12개니까 최대높이만큼만 해야...\
    min:0,
    max: 100,  // Set your desired maximum Y-axis value here
  },
};

const SuddenEvent = () => {
  const { t, i18n } = useTranslation();
  const searchRef = useRef(null);

  const [trafficEventTimeValues,setTrafficEventTimeValues]=useState([])
  const [type,setType]=useState('')
  const [input,setInput]=useState('')
  const [searchInput,setSearchInput]=useState('')
  
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

  //graph
  const [categories, setCategories] = useState([]);//MM-DD hh:mm - graph x display
  const [fullCategories, setFullCategories] = useState([]);//YYYY-MM-DD hh:mm - compare
  const [yaxisMax,setYaxisMax]=useState(100)

  const [queryParamsTime, setQueryParamsTime] = useState(""); // queryParams 상태
  const [queryParamsCnt, setQueryParamsCnt] = useState(""); // queryParams 상태
  const [selectedOption, setSelectedOption] = useState("");

  const today = new Date();
  const firstDate = new Date();
  firstDate.setHours(today.getHours() - 1); // 1시간 뺀 값

  const secondDate = new Date(today);
  //2개 시간 기준이 달라서
  //1-trafficEventTime - 시분초까지
  const [dateTime1,setDateTime1] = useState({
    start_date:formatFullDateTime(firstDate),
    end_date:formatFullDateTime(secondDate)
  });
  //2-trafficEventCnt - 시분까지

  const [dateTime2,setDateTime2] = useState({
    start_date:formatDateTime(firstDate),
    end_date:formatDateTime(secondDate),
    interval:''//기본 5분
  });



  const {trafficEventTime,trafficEventCnt} = useSuddenMgt({
    //queryParamsTime: `start_time=${dateTime1.start_date}&end_time=${dateTime1.end_date}`,
    queryParamsTime:queryParamsTime,
    //
    queryParamsCnt: `start_time=${dateTime2.start_date}&end_time=${dateTime2.end_date}&interval=${dateTime2.interval}`,
  });

  console.log('trafficEventTime')
  console.log(trafficEventTime)

  console.log('trafficEventCnt')
  console.log(trafficEventCnt)

  
  //이벤트 유형 선택
  const handleChange = (e) => {
    console.log('handleChange')
    console.log(e.target.value)
    setSelectedOption(e.target.value);
    const val=e.target.value
    filterTableData(val)

  };
  const handleChangeInput=(e)=>{
    console.log('handleChangeInput')
    console.log(e.target.value)
    setInput(e.target.value)
  }

  const options = [
    { value: "", label: "전체" },
    { value: "EVT_TP_WWD", label: "역주행" },
    { value: "EVT_TP_STP", label: "정차" },
    { value: "EVT_TP_SLV", label: "정지선 위반" },
    { value: "EVT_TP_ILP", label: "불법 주정차" },
    { value: "EVT_TP_SPD", label: "속도 위반" },
    { value: "EVT_TP_CNG", label: "정체" },
    { value: "EVT_TP_JW", label: "보행자" },
    { value: "EVT_TP_EXC", label: "대기열 초과" },
    { value: "EVT_TP_UT", label: "U턴" },
  ];

  const filterTableData=(val)=>{
    console.log('filterTableData')
    console.log(val)
    setType(val)
  }

  const [activeButton, setActiveButton] = useState("");

  const handleButtonClick = (label) => {
    //alert("ButtonClick!")
    setActiveButton(label);
  };

  useEffect(() => {
      if (searchRef.current) {
        searchRef.current.focus();
      }
    }, []);

  //initial date value
  useEffect(()=>{
    setDefaultTime()
  },[])

  //change date button
  useEffect(()=>{
    console.log('activeButton')
    calendarChange()

  },[activeButton])

  const setDefaultTime=()=>{
    console.log('setDefaultTime')
    const today = new Date();

    // 첫 번째 날짜: 현재 시간에서 1시간을 뺀 값
    const firstDate = new Date(today);
    firstDate.setHours(0, 0, 0, 0); // 자정으로 설정

    // 두 번째 날짜: 현재 날짜의 년, 월, 일, 시, 분, 초, 밀리초 모두 설정
    const secondDate = new Date(today);

    // 두 날짜의 차이를 밀리초 단위로 구함
    const timeDifference = secondDate - firstDate; // 밀리초 단위 차이

    // 각 구간의 시간 간격을 구함 (12개의 구간으로 나누기)
    const interval = timeDifference / 12;
    console.log('interval cal')
    console.log(interval)
    setDateTime1({
      start_date: formatFullDateTime(firstDate),
      end_date: formatFullDateTime(secondDate)
    });
    //
    setDateTime2({
      start_date: formatDateTime(firstDate),
      end_date: formatDateTime(secondDate),
      interval: interval
    });

  }

  const setOneHour=()=>{
    const today = new Date();

    // 첫 번째 날짜: 현재 시간에서 1시간을 뺀 값
    const firstDate = new Date(today);
    firstDate.setHours(today.getHours() - 1);

    // 두 번째 날짜: 현재 날짜의 년, 월, 일, 시, 분, 초, 밀리초 모두 설정
    const secondDate = new Date(today);

    setDateTime1({
      start_date: formatFullDateTime(firstDate),
      end_date: formatFullDateTime(secondDate)
    });
    //
    setDateTime2({
      start_date: formatDateTime(firstDate),
      end_date: formatDateTime(secondDate),
      interval: 5
    });

  }

  const setOneDay=()=>{
    const today = new Date();

    // 첫 번째 날짜: 현재 시간에서 1시간을 뺀 값
    const firstDate = new Date(today);
    firstDate.setDate(today.getDate() - 1);  // 1일을 빼기

    // 두 번째 날짜: 현재 날짜의 년, 월, 일, 시, 분, 초, 밀리초 모두 설정
    const secondDate = new Date(today);

    setDateTime1({
      start_date: formatFullDateTime(firstDate),
      end_date: formatFullDateTime(secondDate)
    });
    //
    setDateTime2({
      start_date: formatDateTime(firstDate),
      end_date: formatDateTime(secondDate),
      interval: 60
    });
  }
  
  const setOneMonth=()=>{
    const today = new Date();

    // 첫 번째 날짜: 현재 시간에서 1시간을 뺀 값
    const firstDate = new Date(today);
    firstDate.setMonth(today.getMonth() - 1);  // 1개월을 빼기

    // 두 번째 날짜: 현재 날짜의 년, 월, 일, 시, 분, 초, 밀리초 모두 설정
    const secondDate = new Date(today);

    setDateTime1({
      start_date: formatFullDateTime(firstDate),
      end_date: formatFullDateTime(secondDate)
    });
    setDateTime2({
      start_date: formatDateTime(firstDate),
      end_date: formatDateTime(secondDate),
      interval: 3600
    });
  }

  const setCustomTime=()=>{
    const today = new Date();

    // 첫 번째 날짜: 현재 시간에서 1시간을 뺀 값
    const firstDate = new Date(today);
    firstDate.setHours(0, 0, 0, 0); // 자정으로 설정

    // 두 번째 날짜: 현재 날짜의 년, 월, 일, 시, 분, 초, 밀리초 모두 설정
    const secondDate = new Date(today);

    setDateTime1({
      start_date: formatFullDateTime(firstDate),
      end_date: formatFullDateTime(secondDate)
    });
    //
    setDateTime2({
      start_date: formatDateTime(firstDate),
      end_date: formatDateTime(secondDate),
      interval: 5
    });
  }

  const calendarChange=()=>{
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
    let interval = 5

    if (activeButton === "1시간") {
      //alert('1시간')
      setOneHour()
    } else if (activeButton === "1일") {
      //alert('1일')
      setOneDay()
    } else if (activeButton === "1개월") {
      //alert('1개월')
      setOneMonth()
    } else if (activeButton === "") {
      //alert('setCustomTime')
      setCustomTime()
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
        setDateTime2((prevValues) => ({
          ...prevValues,
          start_date: date.formattedDate,  // 날짜가 시분초 포함된 형식으로 반환됨
        }));
        setActiveButton("")
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
        setDateTime2((prevValues) => ({
          ...prevValues,
          end_date: date.formattedDate,  // 날짜가 시분초 포함된 형식으로 반환됨
        }));
        setActiveButton("")
      },
    };

    // 첫 번째 날짜 선택기
    const datepicker1 = new AirDatepicker('[name="first-date"]', optionsDate);

    // 두 번째 날짜 선택기
    const datepicker2 = new AirDatepicker('[name="second-date"]', optionsDateSecond);

    initAverageWaitTimeValues()

    return () => {
      datepicker1.destroy();
      datepicker2.destroy();
    };
  }
  
 
  useEffect(() => {
    console.log('trafficEventCnt useEffect1');
    
    if (trafficEventCnt?.data) {
      console.log('trafficEventCnt useEffect2');
      console.log('trafficEventCnt 존재');
      console.log(trafficEventCnt);
  
      // 상태 복사 및 0으로 초기화
      const updatedValues = [
        { name: "전체", data: new Array(12).fill(0) },
        { name: "역주행", data: new Array(12).fill(0) },
        { name: "정차", data: new Array(12).fill(0) },
        { name: "정지선 위반", data: new Array(12).fill(0) },
        { name: "불법 주정차", data: new Array(12).fill(0) },
        { name: "속도 위반", data: new Array(12).fill(0) },
        { name: "보행자", data: new Array(12).fill(0) }
      ];
  
      //console.log('초기화된 updatedValues');
      //console.log(updatedValues);  // 여기서 0으로 초기화된 값들이 출력되는지 확인
  
      // 카테고리 시간 캐시 (최적화를 위한)
      const fullCategoryTimes = fullCategories.map((category) => formatFullDateTime(new Date(category)));
  
      // trafficEventCnt.data 배열을 순차적으로 처리
      trafficEventCnt.data.forEach((entry) => {
        const startTime = formatFullDateTime(new Date(entry.aggregate_start_time));
        const endTime = formatFullDateTime(new Date(entry.aggregate_end_time));
        //console.log(`startTime~endTime`);
        //console.log(`${startTime}~${endTime}`);
  
        // fullCategories 배열의 각 카테고리에 대해 처리
        fullCategoryTimes.forEach((categoryTime, index) => {
          // entry의 startTime과 endTime 사이에 categoryTime이 포함되는지 확인
          if (categoryTime >= startTime && categoryTime <= endTime) {
            //console.log('카테고리 시간');
            //console.log(categoryTime);
  
            const typeIndex = updatedValues.findIndex((item) => item.name === entry.type);
            
            if (typeIndex !== -1) {
              // 해당하는 구간의 값을 누적
              updatedValues[typeIndex].data[index] += entry.cnt;
              updatedValues[0].data[index] += entry.cnt; // 전체 항목에 값 누적
            }
          }
        });
      });
  
      // 상태 업데이트
      console.log('최종 updatedValues');
      console.log(updatedValues);  // 데이터가 누적된 후 값이 제대로 변경되었는지 확인
  
      setAverageWaitTimeValues((prevState) => {
        return updatedValues.map(item => ({
          ...item,  // 각 항목의 이름(name)과 데이터를 새로 복사
          data: [...item.data]  // data도 새 배열로 복사
        }));
      });
  
      // 전체 항목에서 최대값 찾기
      console.log('전체항목에서 최대값');
      const findMaxValue = Math.max(...updatedValues[0].data);
      console.log("전체 항목에서의 최대값:", findMaxValue);
      setYaxisMax(findMaxValue);
    }
  }, [trafficEventCnt,yaxisMax]); // trafficEventCnt 값이 변경될 때마다 실행
  
  



  useEffect(() => {
    console.log('newCategories')
    // 두 날짜 간 차이를 계산
    const startDate = new Date(dateTime2.start_date);
    const endDate = new Date(dateTime2.end_date);
    const timeDifference = endDate - startDate; // 밀리초 단위 차이
    const timeInterval = timeDifference / 12; // 12개의 구간으로 나누기

    // 12개 구간을 담을 빈 배열을 선언
    const newCategories = new Array(12);
    const fullCategories = new Array(12); // 새로운 fullCategories 배열 (년도까지 추가)

    // 12개의 구간을 뒤에서부터 계산
    for (let i = 11; i >= 0; i--) {
      // 각 구간의 끝 시간을 기준으로 5분씩 이전으로 설정
      const intervalEnd = new Date(endDate.getTime() - timeInterval * (11 - i));
      const intervalStart = new Date(intervalEnd.getTime() - timeInterval);

      // 각 구간의 시작 시간을 'MM-DD hh:mm' 형식으로 저장
      const categoryLabel = `${String(intervalEnd.getMonth() + 1).padStart(2, "0")}-${intervalEnd.getDate()} ${String(intervalEnd.getHours()).padStart(2, "0")}:${String(intervalEnd.getMinutes()).padStart(2, "0")}`;
      
      // fullCategories에 값 넣기 (YYYY-MM-DD hh:mm 형식)
      const fullCategoryLabel = `${intervalEnd.getFullYear()}-${String(intervalEnd.getMonth() + 1).padStart(2, "0")}-${String(intervalEnd.getDate()).padStart(2, "0")} ${String(intervalEnd.getHours()).padStart(2, "0")}:${String(intervalEnd.getMinutes()).padStart(2, "0")}`;

      // 끝에서부터 배열에 값 할당
      newCategories[i] = categoryLabel;
      fullCategories[i] = fullCategoryLabel;

      // 예시로 각 구간에 무작위 값을 넣는 코드입니다. 실제 로직으로 대체 가능.
      console.log(`Interval ${i + 1}:`, intervalStart, "to", intervalEnd);
    }

    // categories 업데이트
    setCategories(newCategories);
    setFullCategories(fullCategories);

  }, [dateTime1, dateTime2]); // dateTime이 변경될 때마다 실행



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
    debugInvalidOptions: true,
    pagination: true,
    movableRows: false,
    resizableRows: false,
    index: "id",
    locale: "ko",
    langs: {
      ko: languageTabulator(),
    },
    paginationSize: 10,
    selectableRows: 1,
    rowHeight: 41,
    footerElement: `<div style="padding: 0 20px 0 0; text-align: right;">총 ${trafficEventTime?.data.events.length} 건</div>`,
  };
   
  const handleSearch = (inputVal="") =>{
        let params = `start_time=${dateTime1.start_date}&end_time=${dateTime1.end_date}`;
  
        // 동적으로 추가할 파라미터
        if (type) {
          params += `&type=${type}`;
        }
        if(inputVal){
          params += `&input=${inputVal}`;
        }
        //alert(params)
        setInput(inputVal)
        setQueryParamsTime(params)

        params = `start_time=${dateTime1.start_date}&end_time=${dateTime1.end_date}`;
  
        // 동적으로 추가할 파라미터
        if (type) {
          params += `&type=${type}`;
        }
        if(inputVal){
          params += `&input=${inputVal}`;
        }
        //alert(params)
        setInput(inputVal)
        setQueryParamsTime(params)

  }

  // 외부에서 xaxis categories, yaxis(최대높이)를 설정하는 방식으로 차트 옵션을 변경
  const chartOptionsWithProps = (customCategories, customYAxisMax) => {
    return {
      ...optionsChart,
      xaxis: {
        categories: customCategories,  // 외부에서 전달된 categories로 설정
      },
      yaxis: {
        min:0,
        max: customYAxisMax,  // 외부에서 전달된 Y축 최대값으로 설정
      },
    };
  };

  const initAverageWaitTimeValues=()=>{
    setAverageWaitTimeValues([
      { name: "전체", data: new Array(12).fill(0) },
      { name: "역주행", data: new Array(12).fill(0) },
      { name: "정차", data: new Array(12).fill(0) },
      { name: "정지선 위반", data: new Array(12).fill(0) },
      { name: "불법 주정차", data: new Array(12).fill(0) },
      { name: "속도 위반", data: new Array(12).fill(0) },
      { name: "보행자", data: new Array(12).fill(0) },
    ]);
  }

  const startCalendarChange=()=>{
    //alert('startCalendarChange')
    console.log('startCalendarChange')
  }

  const endCalendarChange=()=>{
    console.log('endCalendarChange')
  }

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
            
            customWidthSelect= "w-full flex flex-1 basis-[750px] "
            customWidthInput=" flex flex-1 w-full!"
            labelSelect="이벤트 유형  "
            onSearch={handleSearch}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
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
                value={dateTime2?.start_date}
                onChange={()=>startCalendarChange()}
                name={"first-date"} />
              <span>-</span>
              <GeneralInput
                isDob={true}
                inputType="text"
                value={dateTime2?.end_date}
                onChange={()=>endCalendarChange()}
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
              options={chartOptionsWithProps(categories,yaxisMax)}
              series={averageWaitTimeValues}
              height={350}
              type={'line'}
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
