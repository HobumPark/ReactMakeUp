import React, { useState, useRef, useEffect } from "react";
import Header from "../../components/Header/Header";
import "./AccessRoadDashboard.css";
import { ReactTabulator } from "react-tabulator";
import Map from "ol/Map";
import View from "ol/View";
// import { Tile as TileLayer } from "ol/layer";
import { Tile as TileLayer } from "ol/layer";
import { XYZ } from "ol/source"; // Untuk menggunakan tile sumber XYZ
import { OSM } from "ol/source";
import { fromLonLat } from "ol/proj";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import Select from 'ol/interaction/Select'; // Select interaction 추가
import { click } from 'ol/events/condition'; // 클릭 조건 추가

import ImgOneWay from "../../assets/icon/img-one-way.svg";

import IconIn from "../../assets/icon/icon-db-in.svg";
import IconOut from "../../assets/icon/icon-db-out.svg";

import IconCar from "../../assets/icon/icon-db-car.svg";
import IconMotor from "../../assets/icon/icon-db-motorcycles.svg";
import IconBus from "../../assets/icon/icon-db-bus.svg";
import IconTruck from "../../assets/icon/icon-db-truck.svg";
import IconVan from "../../assets/icon/icon-db-van.svg";
import IconBicycles from "../../assets/icon/icon-db-bicycles.svg";
import IconHeavyTruck from "../../assets/icon/icon-db-heavy-truck.svg";
import IconUnknown from "../../assets/icon/icon-db-unknown.svg";

import IconDetector from "../../assets/icon/icon-db-detector.svg";
import IconDetectorActive from "../../assets/icon/icon-db-detector-active.svg";

import imgMaps from "../../assets/icon/img-lane-maps.svg";

import VehicleCount from "../../components/VehicleCount/VehicleCount";

import TrafficeByDirection from "../../components/CrossRoadStatistic/TrafficeByDirection";
import TrafficeByVehicle from "../../components/CrossRoadStatistic/TrafficeByVehicle";
import EntryRate from "../../components/CrossRoadStatistic/EntryRate";
import ExitRate from "../../components/CrossRoadStatistic/ExitRate";

import PieChartOut from "../../components/AccessRoadStatistic/PieChartOut";
import PieChartIn from "../../components/AccessRoadStatistic/PieChartIn";
import InOutTrafficeOverTimeStatistic from "../../components/AccessRoadStatistic/InOutTrafficeOverTimeStatistic";
import TrafficeByVehicleTypeStatistic from "../../components/AccessRoadStatistic/TrafficeByVehicleTypeStatistic";
import TrafficeByMovementStatistic from "../../components/AccessRoadStatistic/TrafficeByMovementStatistic";
import { formatFullDateTime, formatDateTime } from "../../utils/date";
import useAccessRoadMgt from "../../hooks/useAccessRoadMgt";
import { useLocation, useNavigate } from "react-router-dom";
import { AccessRoadCanvas } from "../../components/CrossRoadSvgMap/AccessRoadCanvas";

//공통 칼럼
const commonColumns = [
  {
    title: "오늘",
    field: "today",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "어제",
    field: "yesterday",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "일주일전",
    field: "one_week",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
]
//진입칼럼
const entryColumns = [
  { title: "진입", field: "entry", hozAlign: "center", headerHozAlign: "center",headerSort: false, },
  ...commonColumns,
];
//진출칼럼
const exitColumns  = [
  { title: "진출", field: "entry", hozAlign: "center", headerHozAlign: "center",headerSort: false, },
  ...commonColumns,
];

//승용차,오토바이,버스,트럭,승합차,자전거,대형트럭,기타
//301001 301006 301005 301003 301002 301007 301004 301000



const AccessRoadDashboard = () => {
  const radioOptions = [
    { id: "radio-5min", label: "5분", value: "5" },
    { id: "radio-15min", label: "15분", value: "15" },
    { id: "radio-30min", label: "30분", value: "30" },
  ];

  const optionsTabulatorEntry = {
    pagination: false,
    height: "100%",
    paginationSize: 10,
    rowHeight: 33,
    movableRows: false,
    resizableRows: false,
    // footerElement: `<div style="padding: 0 20px 0 0; text-align: right;">총 ${data.length} 건</div>`,
  };

  const location = useLocation();  // Get the current location
  const queryParams = new URLSearchParams(location.search);  // Parse query string
  const site_id = queryParams.get('site_id');  // Get road_id from the query string
  const road_id = queryParams.get('road_id');  // Get road_id from the query string
  // /dashboard/accessroad?site_id=1&road_id=2
  console.log("Accessing site_id:", site_id); // Use road_id here
  console.log("Accessing road_id:", road_id); // Use road_id here
  const mapRef = useRef(null);

  const [roads,setRoads]=useState("")

  const [roadName,setRoadName]=useState("")
  const [roadStreamUrl,setRoadStreamUrl]=useState("")
  const [detectorLat,setDetectorLat]=useState("")
  const [detectorLon,setDetectorLng]=useState("")

  const [radioTimeValue, setRadioTimeValue] = useState("5"); // Initial time is 5 minutes
  
  const today = new Date();

  // date time for pie chart
  const [dateTime1, setDateTime1] = useState({
    start_date: formatFullDateTime(today),
    end_date: formatFullDateTime(today)
  });

  // date time for table (3type - today,yesterday,week ago)
  const [dateTime2, setDateTime2] = useState({
    start_date_today: formatFullDateTime(today),//오늘-5분(기본)
    start_date_yesterday: formatFullDateTime(today),//어제-5분(기본)
    start_date_one_week: formatFullDateTime(today),//일주일전-5분(기본)
    end_date: formatFullDateTime(today)
  });

  // State for the query parameters
   //접근로 정보 파라미터
  const [siteRoadParams, setSiteRoadParams] = useState("");

  //파이차트 1,2에 사용할 파라미터 parameters
  const [objectUnqCntPie1Params, setObjectUnqCntPie1Params] = useState("");
  const [objectUnqCntPie2Params, setObjectUnqCntPie2Params] = useState("");
  
  //테이블 1,2에 사용할 파라미터
  //테이블1 - 오늘,어제,일주일전 parameters
  const [objectUnqCntTable1TodayParams, setObjectUnqCntTable1TodayParams] = useState("");
  const [objectUnqCntTable1YesterdayParams, setObjectUnqCntTable1YesterdayParams] = useState("");
  const [objectUnqCntTable1OneWeekParams, setObjectUnqCntTable1OnedWeekParams] = useState("");

  //테이블2 - 오늘,어제,일주일전 parameters
  const [objectUnqCntTable2TodayParams, setObjectUnqCntTable2TodayParams] = useState("");
  const [objectUnqCntTable2YesterdayParams, setObjectUnqCntTable2YesterdayParams] = useState("");
  const [objectUnqCntTable2OneWeekParams, setObjectUnqCntTable2OneWeekParams] = useState("");

  //시간별 진입/진출 교통량 parameters
  const [objectUnqCntMovingDirectionParams, setObjectUnqCntMovingDirectionParams] = useState("");
  //이동류별 차종 교통량 parameters

  //이동류 교통량 그래프 parameters

  const [roadId, setRoadId] = useState(road_id); // Assuming `road_id` is passed as a prop or from context
  // Assumptions x [-10, 350], y [-50, 50]
  const [trafficPosData, setTrafficPosData] = useState([
    {
    "vehicle_type": "301003",
    "xrelpos": 300.31,
    "yrelpos": 0.769999999999982
    },
    {
    "vehicle_type": "301001",
    "xrelpos": 200.05,
    "yrelpos": 30.44
    },
    {
    "vehicle_type": "301005",
    "xrelpos": 50.01,
    "yrelpos": -42.44
    }
  ])

  useEffect(() => {
    //road정보 가져오기
    setSiteRoadParams(`${site_id}`)
  }, [radioTimeValue, roadId]);

  // 파이차트 1,2 파라미터 설정
  useEffect(() => {
    const firstDate = new Date(today);
    firstDate.setMinutes(firstDate.getMinutes() - radioTimeValue); // Subtract radioTimeValue minutes from today
  
    const secondDate = new Date(today);
  
    // Format the date once and store in variables
    const formattedFirstDate = formatFullDateTime(firstDate);
    const formattedSecondDate = formatFullDateTime(secondDate);
  
    // Update query params based on the new date range and moving_direction values
    setObjectUnqCntPie1Params(
      `start_time=${formattedFirstDate}&end_time=${formattedSecondDate}&road_id=${roadId}&moving_direction=${108001}`
    );
    setObjectUnqCntPie2Params(
      `start_time=${formattedFirstDate}&end_time=${formattedSecondDate}&road_id=${roadId}&moving_direction=${108002}`
    );
  
    setDateTime1({
      start_date: formattedFirstDate,
      end_date: formattedSecondDate
    });
  
  }, [radioTimeValue, roadId]);
  

  // 테이블 1,2 파라미터 설정
  useEffect(() => {
    // 현재 날짜와 시간을 기준으로 시작 시간 계산
    const startDateToday = new Date(today);
    startDateToday.setMinutes(startDateToday.getMinutes() - radioTimeValue);  // radioTimeValue 만큼 분을 빼기
  
    // 어제 날짜와 시간을 기준으로 시작 시간 계산
    const startDateYesterDay = new Date(today);
    startDateYesterDay.setDate(startDateYesterDay.getDate() - 1);  // 1일을 빼기
    startDateYesterDay.setMinutes(startDateYesterDay.getMinutes() - radioTimeValue);  // radioTimeValue 만큼 분을 빼기
  
    // 일주일 전 날짜와 시간을 기준으로 시작 시간 계산
    const startDateOneWeek = new Date(today);
    startDateOneWeek.setDate(startDateOneWeek.getDate() - 7);  // 7일을 빼기
    startDateOneWeek.setMinutes(startDateOneWeek.getMinutes() - radioTimeValue);  // radioTimeValue 만큼 분을 빼기
  
    // 현재 시간
    const secondDate = new Date(today);
  
    // formatFullDateTime을 한 번만 호출하여 중복을 줄임
    const formattedStartDateToday = formatFullDateTime(startDateToday);
    const formattedStartDateYesterDay = formatFullDateTime(startDateYesterDay);
    const formattedStartDateOneWeek = formatFullDateTime(startDateOneWeek);
    const formattedSecondDate = formatFullDateTime(secondDate);
  
    // 파라미터 업데이트
    setObjectUnqCntTable1TodayParams(`start_time=${formattedStartDateToday}&end_time=${formattedSecondDate}&road_id=${roadId}&moving_direction=${108001}`);
    setObjectUnqCntTable1YesterdayParams(`start_time=${formattedStartDateYesterDay}&end_time=${formattedSecondDate}&road_id=${roadId}&moving_direction=${108001}`);
    setObjectUnqCntTable1OnedWeekParams(`start_time=${formattedStartDateOneWeek}&end_time=${formattedSecondDate}&road_id=${roadId}&moving_direction=${108001}`);
  
    setObjectUnqCntTable2TodayParams(`start_time=${formattedStartDateToday}&end_time=${formattedSecondDate}&road_id=${roadId}&moving_direction=${108002}`);
    setObjectUnqCntTable2YesterdayParams(`start_time=${formattedStartDateYesterDay}&end_time=${formattedSecondDate}&road_id=${roadId}&moving_direction=${108002}`);
    setObjectUnqCntTable2OneWeekParams(`start_time=${formattedStartDateOneWeek}&end_time=${formattedSecondDate}&road_id=${roadId}&moving_direction=${108002}`);
  
    setDateTime2({
      start_date_today: formattedStartDateToday,
      start_date_yesterday: formattedStartDateYesterDay,
      start_date_one_week: formattedStartDateOneWeek,
      end_date: formattedSecondDate
    });
  }, [radioTimeValue, roadId]);
  

  useEffect(()=>{
    console.log("3333")
    //시작-현재-8시간
    //끝-현재
    const firstDate = new Date(today);
    firstDate.setHours(firstDate.getHours() - 8); 
    const secondDate = new Date(today);


    const formattedStartDate= formatFullDateTime(firstDate);
    const formattedEndDate = formatFullDateTime(secondDate);
    const interval=60
    // 파라미터 업데이트
    setObjectUnqCntMovingDirectionParams(`start_time=${formattedStartDate}&end_time=${formattedEndDate}&road_id=${roadId}&interval=${interval}`);

  },[radioTimeValue, roadId])

  //시간별 이동류 교통량
  useEffect(()=>{
    
  },[radioTimeValue, roadId])

  //기본 5분
  const {
        //접근로 관련 데이터
        roadData,
        //파이차트 데이터
        objectUnqCntPie1,objectUnqCntPie2,
        //테이블1 데이터
        objectUnqCntTable1Today,
        objectUnqCntTable1Yesterday,
        objectUnqCntTable1OneWeek,
        //테이블2 데이터
        objectUnqCntTable2Today,
        objectUnqCntTable2Yesterday,
        objectUnqCntTable2OneWeek,
        //시간별 진입/진출 교통량
        objectUnqCntMovingDirection
        //이동류별 차종 교통량

        //이동류 교통량 그래프
  }=useAccessRoadMgt({
    siteRoadParams,
    objectUnqCntPie1Params,objectUnqCntPie2Params,
    objectUnqCntTable1TodayParams,objectUnqCntTable1YesterdayParams,objectUnqCntTable1OneWeekParams,
    objectUnqCntTable2TodayParams,objectUnqCntTable2YesterdayParams,objectUnqCntTable2OneWeekParams,
    objectUnqCntMovingDirectionParams

  })
  console.log('roadData')
  console.log(roadData)//진입
  //console.log('objectUnqCnt1')
  //console.log(objectUnqCntPie1)//진입
  //console.log('objectUnqCnt2')
  //console.log(objectUnqCntPie2)//진출

  //console.log('objectUnqCntTable1Today')
  //console.log(objectUnqCntTable1Today)
  //console.log('objectUnqCntTable1Yesterday')
  //console.log(objectUnqCntTable1Yesterday)
  //console.log('objectUnqCntTable1OneWeek')
  //console.log(objectUnqCntTable1OneWeek)

  //console.log('objectUnqCntTable2Today')
  //console.log(objectUnqCntTable2Today)
  //console.log('objectUnqCntTable2Yesterday')
  //console.log(objectUnqCntTable2Yesterday)
  //console.log('objectUnqCntTable2OneWeek')
  //console.log(objectUnqCntTable2OneWeek)

  //console.log('objectUnqCntMovingDirection')
  //console.log(objectUnqCntMovingDirection)


  const handleRadioChange = (e) => {
    //alert(e.target.value)
    //console.log(e.target.value)
    setRadioTimeValue(e.target.value)
  };

    // 클릭 이벤트를 감지하고 alert을 띄우는 함수 + 호버효과
  const addSelectInteraction = (map) => {
    const select = new Select({
      condition: click, // 클릭 조건
      toggleCondition: click,  // 마커 클릭 시 선택 상태가 계속 유지되도록 설정
    });

    map.addInteraction(select);

    select.on('select', function (e) {
      const selectedFeature = e.selected[0];
      if (selectedFeature) {
        // 클릭한 마커의 road_id를 alert로 출력
        //alert(`Marker with road_id: ${selectedFeature.get('id')} clicked`);
        const roadId=selectedFeature.get('id')
        setRoadId(roadId)
        window.location.href=`/dashboard/accessroad?site_id=${site_id}&road_id=${roadId}`
        //roadId변경해서 useNavigate유발
      }
    });

     // 지도 상의 마커에 대한 pointermove 이벤트로 커서 변경
    map.on('pointermove', (event) => {
      const hit = map.hasFeatureAtPixel(event.pixel); // 마커 위에 마우스가 있는지 확인
      document.body.style.cursor = hit ? 'pointer' : ''; // 마커 위에 있으면 손가락 모양, 아니면 기본 커서
    });
  };

  //접근로 정보 useEffect
  useEffect(() => {
    if (!mapRef.current) return;

    if(roadData == null)//데이터가 없으면 종료
      return

    //접근로 데이터 뽑기
    //접근로 이름, 스트림url
    //사이트 관련 접근로 배열에서 특정 접근로 찾기
    const { data: { roads } = {} } = roadData || {}; // roadData에서 data->roads 추출

    const findRoadData = roads?.find(item => item.road_id == road_id) || null;

    console.log('찾은 road데이터')
    console.log(findRoadData)

    setRoadName(findRoadData.name)
    setRoadStreamUrl(findRoadData.detector?.stream_url) 
    
    const lat = findRoadData.detector?.lat || "";
    const lng = findRoadData.detector?.lng || "";

    setDetectorLat(lat);  // Lat 업데이트
    setDetectorLng(lng);  // Lng 업데이트

    // roads 배열에서 각 도로의 detector 정보에서 위도(lat), 경도(lng)를 추출하여 새로운 배열을 생성
    console.log('detectorList1')
    setRoads(roads)
    const markerList = roads.map((data) => {
      const { detector } = data; // 데이터에서 detector 객체 추출
      const maker_road_id = data.road_id
      const lat = detector?.lat; // 위도(lat)
      const lng = detector?.lng; // 경도(lon)
      
      if (lat && lng) {
        // 마커 표시하기
        const markerFeature = new Feature({
          id:data.road_id,
          geometry: new Point(fromLonLat([lng, lat])), // 마커의 위치 (경도, 위도)
        });
        
        
        markerFeature.setStyle(
          new Style({
            image: new Icon({
              src: maker_road_id==road_id? IconDetectorActive:IconDetector, // 사용할 마커 아이콘 URL
              scale: 1, // 아이콘 크기 조절
            }),
          })
        );

        

        return markerFeature; // 마커 객체 반환
      }
    
      return null; // lat 또는 lng가 없으면 null 반환
    }).filter(Boolean); // null을 필터링하여 실제 마커만 남김


    // ✅ Inisialisasi peta
    const olMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        // 여기에서 마커 레이어를 추가
        new VectorLayer({
          source: new VectorSource({
            features: markerList // 여기에 마커를 추가할 예정
          }),
        }),
      ],

      //126.9762, 37.5647
      view: new View({
        center: fromLonLat([lng, lat]),
        zoom: 17,
      }),
    });

    addSelectInteraction(olMap);

    return () => olMap.setTarget(null);
  }, [roadData]);
  

  useEffect(()=>{
    //useNavigate(`/dashboard/accessroad?site_id=${site_id}&road_id=${road_id}`)
  },[roadId])

  //파이차트 데이터 뽑기
  const { data: incoming } = objectUnqCntPie1 || {}; // Destructure data from objectUnqCnt1 - incoming data
  const { data: outgoing } = objectUnqCntPie2 || {}; // Destructure data from objectUnqCnt2 - outcoming data

  const { 
    "301000": incoming301000, 
    "301001": incoming301001,
    "301002": incoming301002,
    "301003": incoming301003,
    "301004": incoming301004,
    "301005": incoming301005,
    "301006": incoming301006,
    "301007": incoming301007,
    "301008": incoming301008
  } = incoming || {}; // incoming이 없으면 빈 객체를 기본값으로 사용

  const { 
    "301000": outgoing301000, 
    "301001": outgoing301001,
    "301002": outgoing301002,
    "301003": outgoing301003,
    "301004": outgoing301004,
    "301005": outgoing301005,
    "301006": outgoing301006,
    "301007": outgoing301007,
    "301008": outgoing301008
  } = outgoing || {}; // incoming이 없으면 빈 객체를 기본값으로 사용
  //[35, 30, 20, 30, 15, 10, 10, 5]
  //승용차,오토바이,버스,트럭,승합차,자전거,대형트럭,기타
  //301001 301006 301005 301003 301002 301007 301004 301000

  const seriesPieIncoming=[incoming301000,incoming301006,incoming301005,incoming301003,incoming301002,incoming301007,incoming301004,incoming301000]
  const seriesPieOutgoing=[incoming301000,incoming301006,incoming301005,incoming301003,incoming301002,incoming301007,incoming301004,incoming301000]

  //테이블1 데이터 뽑기
  const { data: incomingTable1Today } = objectUnqCntTable1Today || {}; // Destructure data from objectUnqCnt1 - incoming data
  const { 
    "301000": incomingTable1Today301000, 
    "301001": incomingTable1Today301001,
    "301002": incomingTable1Today301002,
    "301003": incomingTable1Today301003,
    "301004": incomingTable1Today301004,
    "301005": incomingTable1Today301005,
    "301006": incomingTable1Today301006,
    "301007": incomingTable1Today301007,
    "301008": incomingTable1Today301008
  } = incomingTable1Today || {}; // incoming이 없으면 빈 객체를 기본값으로 사용

  const { data: incomingTable1Yesterday } = objectUnqCntTable1Yesterday || {}; // Destructure data from objectUnqCnt1 - incoming data
  const { 
    "301000": incomingTable1Yesterday301000, 
    "301001": incomingTable1Yesterday301001,
    "301002": incomingTable1Yesterday301002,
    "301003": incomingTable1Yesterday301003,
    "301004": incomingTable1Yesterday301004,
    "301005": incomingTable1Yesterday301005,
    "301006": incomingTable1Yesterday301006,
    "301007": incomingTable1Yesterday301007,
    "301008": incomingTable1Yesterday301008
  } = incomingTable1Yesterday || {}; // incoming이 없으면 빈 객체를 기본값으로 사용

  const { data: incomingTable1OneWeek } = objectUnqCntTable1OneWeek || {}; // Destructure data from objectUnqCnt1 - incoming data
  const { 
    "301000": incomingTable1OneWeek301000, 
    "301001": incomingTable1OneWeek301001,
    "301002": incomingTable1OneWeek301002,
    "301003": incomingTable1OneWeek301003,
    "301004": incomingTable1OneWeek301004,
    "301005": incomingTable1OneWeek301005,
    "301006": incomingTable1OneWeek301006,
    "301007": incomingTable1OneWeek301007,
    "301008": incomingTable1OneWeek301008
  } = incomingTable1OneWeek || {}; // incoming이 없으면 빈 객체를 기본값으로 사용


  const dataEntry = [
    {
      key: "301001", // 승용차
      entry: "승용차",
      today: incomingTable1Today301001 || 0,  // today 값 업데이트
      yesterday: incomingTable1Yesterday301001 || 0,  // yesterday 값 업데이트
      one_week: incomingTable1OneWeek301001 || 0,  // one_week 값 업데이트
    },
    {
      key: "301006", // 오토바이
      entry: "오토바이",
      today: incomingTable1Today301006 || 0,  // today 값 업데이트
      yesterday: incomingTable1Yesterday301006 || 0,  // yesterday 값 업데이트
      one_week: incomingTable1OneWeek301006 || 0,  // one_week 값 업데이트
    },
    {
      key: "301005", // 버스
      entry: "버스",
      today: incomingTable1Today301005 || 0,  // today 값 업데이트
      yesterday: incomingTable1Yesterday301005 || 0,  // yesterday 값 업데이트
      one_week: incomingTable1OneWeek301005 || 0,  // one_week 값 업데이트
    },
    {
      key: "301003", // 트럭
      entry: "트럭",
      today: incomingTable1Today301003 || 0,  // today 값 업데이트
      yesterday: incomingTable1Yesterday301003 || 0,  // yesterday 값 업데이트
      one_week: incomingTable1OneWeek301003 || 0,  // one_week 값 업데이트
    },
    {
      key: "301002", // 승합차
      entry: "승합차",
      today: incomingTable1Today301002 || 0,  // today 값 업데이트
      yesterday: incomingTable1Yesterday301002 || 0,  // yesterday 값 업데이트
      one_week: incomingTable1OneWeek301002 || 0,  // one_week 값 업데이트
    },
    {
      key: "301007", // 자전거
      entry: "자전거",
      today: incomingTable1Today301007 || 0,  // today 값 업데이트
      yesterday: incomingTable1Yesterday301007 || 0,  // yesterday 값 업데이트
      one_week: incomingTable1OneWeek301007 || 0,  // one_week 값 업데이트
    },
    {
      key: "301004", // 대형트럭
      entry: "대형트럭",
      today: incomingTable1Today301004 || 0,  // today 값 업데이트
      yesterday: incomingTable1Yesterday301004 || 0,  // yesterday 값 업데이트
      one_week: incomingTable1OneWeek301004 || 0,  // one_week 값 업데이트
    },
    {
      key: "301000", // 기타
      entry: "기타",
      today: incomingTable1Today301000 || 0,  // today 값 업데이트
      yesterday: incomingTable1Yesterday301000 || 0,  // yesterday 값 업데이트
      one_week: incomingTable1OneWeek301000 || 0,  // one_week 값 업데이트
    },
  ];
  
  // 테이블2 데이터 뽑기 (outgoing)
const { data: outgoingTable2Today } = objectUnqCntTable2Today || {}; // Destructure data from objectUnqCntTable2 - outgoing data
const { 
  "301000": outgoingTable2Today301000, 
  "301001": outgoingTable2Today301001,
  "301002": outgoingTable2Today301002,
  "301003": outgoingTable2Today301003,
  "301004": outgoingTable2Today301004,
  "301005": outgoingTable2Today301005,
  "301006": outgoingTable2Today301006,
  "301007": outgoingTable2Today301007,
  "301008": outgoingTable2Today301008
} = outgoingTable2Today || {}; // outgoing이 없으면 빈 객체를 기본값으로 사용

const { data: outgoingTable2Yesterday } = objectUnqCntTable2Yesterday || {}; // Destructure data from objectUnqCntTable2 - outgoing data
const { 
  "301000": outgoingTable2Yesterday301000, 
  "301001": outgoingTable2Yesterday301001,
  "301002": outgoingTable2Yesterday301002,
  "301003": outgoingTable2Yesterday301003,
  "301004": outgoingTable2Yesterday301004,
  "301005": outgoingTable2Yesterday301005,
  "301006": outgoingTable2Yesterday301006,
  "301007": outgoingTable2Yesterday301007,
  "301008": outgoingTable2Yesterday301008
} = outgoingTable2Yesterday || {}; // outgoing이 없으면 빈 객체를 기본값으로 사용

const { data: outgoingTable2OneWeek } = objectUnqCntTable2OneWeek || {}; // Destructure data from objectUnqCntTable2 - outgoing data
const { 
  "301000": outgoingTable2OneWeek301000, 
  "301001": outgoingTable2OneWeek301001,
  "301002": outgoingTable2OneWeek301002,
  "301003": outgoingTable2OneWeek301003,
  "301004": outgoingTable2OneWeek301004,
  "301005": outgoingTable2OneWeek301005,
  "301006": outgoingTable2OneWeek301006,
  "301007": outgoingTable2OneWeek301007,
  "301008": outgoingTable2OneWeek301008
} = outgoingTable2OneWeek || {}; // outgoing이 없으면 빈 객체를 기본값으로 사용
  
const dataExit = [
  {
    key: "301001", // 승용차
    entry: "승용차",
    today: outgoingTable2Today301001 || 0,
    yesterday: outgoingTable2Yesterday301001 || 0,
    one_week: outgoingTable2OneWeek301001 || 0,
  },
  {
    key: "301006", // 오토바이
    entry: "오토바이",
    today: outgoingTable2Today301006 || 0,
    yesterday: outgoingTable2Yesterday301006 || 0,
    one_week: outgoingTable2OneWeek301006 || 0,
  },
  {
    key: "301005", // 버스
    entry: "버스",
    today: outgoingTable2Today301005 || 0,
    yesterday: outgoingTable2Yesterday301005 || 0,
    one_week: outgoingTable2OneWeek301005 || 0,
  },
  {
    key: "301003", // 트럭
    entry: "트럭",
    today: outgoingTable2Today301003 || 0,
    yesterday: outgoingTable2Yesterday301003 || 0,
    one_week: outgoingTable2OneWeek301003 || 0,
  },
  {
    key: "301002", // 승합차
    entry: "승합차",
    today: outgoingTable2Today301002 || 0,
    yesterday: outgoingTable2Yesterday301002 || 0,
    one_week: outgoingTable2OneWeek301002 || 0,
  },
  {
    key: "301007", // 자전거
    entry: "자전거",
    today: outgoingTable2Today301007 || 0,
    yesterday: outgoingTable2Yesterday301007 || 0,
    one_week: outgoingTable2OneWeek301007 || 0,
  },
  {
    key: "301004", // 대형트럭
    entry: "대형트럭",
    today: outgoingTable2Today301004 || 0,
    yesterday: outgoingTable2Yesterday301004 || 0,
    one_week: outgoingTable2OneWeek301004 || 0,
  },
  {
    key: "301000", // 기타
    entry: "기타",
    today: outgoingTable2Today301000 || 0,
    yesterday: outgoingTable2Yesterday301000 || 0,
    one_week: outgoingTable2OneWeek301000 || 0,
  },
];

//seriesMovingInOutTime
/*
const seriesMovingInOutTime = [
  {
    name: "East",
    data: [6, 7, 8, 6, 7, 8, 7, 20],
  },
  {
    name: "West",
    data: [10, 12, 14, 16, 18, 20, 12, 15],
  },
];
*/
const { data: movingInOutGraphTemp } = objectUnqCntMovingDirection || {}; 
//console.log('movingInOutGraphTemp')
//console.log(movingInOutGraphTemp)
// 108001과 108002를 해당 index별로 분리하여 처리
const movingInOutGraph = movingInOutGraphTemp?.map(item => ({
  "108001": item["108001"], // 108001을 301000으로 변환
  "108002": item["108002"], // 108002을 301001으로 변환
  "aggregate_start_time": item["aggregate_start_time"]
    ? item["aggregate_start_time"].slice(5, 13) // "년-월-일 시" 부분만 추출
    : "" // 시간도 포함
})) || [];  // 데이터를 정상적으로 뽑지 못하면 빈 배열로 초기화

// aggregate_start_time을 xAxisCategories로 그대로 사용
const xAxisCategories = movingInOutGraph
      ?.slice(0, 8) // 0번째부터 7번째까지 데이터만 추출
      .map(item => item.aggregate_start_time) // 진입 (108001) 값만 추출
      .reverse() || [] // 뒤집어서 넣기


// 예시로 console에 출력
//console.log('movingInOutGraph');
//console.log(movingInOutGraph);
  
//0번째가 최신
//0번째를 제일 오른쪽부터 - 7
//1번째를 그 다음 - 6
//역순 뒤집기 - 배열9일때, 8일때 다름
const seriesMovingInOutTime = [
  {
    name: "진입", // 108001
    data: movingInOutGraph
      ?.slice(0, 8) // 0번째부터 7번째까지 데이터만 추출
      .map(item => item["108001"]) // 진입 (108001) 값만 추출
      .reverse() || [], // 뒤집어서 넣기
  },
  {
    name: "진출", // 108002
    data: movingInOutGraph
      ?.slice(0, 8) // 0번째부터 7번째까지 데이터만 추출
      .map(item => item["108002"]) // 진출 (108002) 값만 추출
      .reverse() || [], // 뒤집어서 넣기
  },
];

//console.log(seriesMovingInOutTime);
//const [checkData,setCheckData]=useState(movingInOutGraphTemp)

  return (
    <>
      <section className="_AccessRoadContainer w-full h-screen overflow-hidden flex flex-col bg-bg-grey-400">
        <Header />

        <div className="_layoutAccessRoad w-full h-[calc(100%-60px)] flex flex-col gap-[10px] p-[10px] overflow-hidden">
          <div className="flex  flex-row gap-[10px] flex-2 overflow-hidden">
            <section className="leftToproad flex flex-1 h-full bg-[#000] overflow-hidden rounded-[5px]">
              <div className="bg-header-content w-full h-[36px] flex items-center px-[15px]">
                <span className="title3bold text-text-white">
                  {roadName || ""}
                </span>
              </div>

              <div className="w-full h-full  overflow-hidden p-[10px]">
                <div className="_containerVideoAccerssRoad w-full h-[calc(100%-35px)] bg-[#171A1C]">
                  {/* you can fill in container */}
                  <img src={roadStreamUrl || ""} alt="스트리밍" className="w-full h-full object-cover"/>
                </div>
              </div>
            </section>
            <section className="rightToproad flex flex-1 h-full bg-[#000] overflow-hidden rounded-[5px] ">
              <section className="leftToproad flex flex-1/6 h-full bg-[#000] overflow-hidden rounded-[5px]">
                <div className="bg-header-content w-full h-[36px] flex items-center px-[15px]">
                  <span className="title3bold text-text-white">
                    차량별 교통량
                  </span>
                </div>
                <div className="w-full h-full p-[10px] gap-[10px] flex flex-row  overflow-hidden">
                  <div className="w-[22%] flex  h-[calc(100%-35px)] overflow-hidden">
                    {/* <img
                      src={ImgOneWay}
                      alt=""
                      className="object-cover w-full h-full overflow-hidden"
                    /> */}
                    <AccessRoadCanvas trafficPosData={trafficPosData}></AccessRoadCanvas>
                  </div>
                  <div className="_boxFilterRadio flex-1 h-[calc(100%-35px)] p-[10px] bg-[#171A1C] overflow-hidden">
                    <div className="w-full flex flex-row items-center justify-between">
                      <span className="title3medium text-text-white">
                        진입/진출
                      </span>
                      <div className="w-fit flex gap-[13px]">
                        {radioOptions.map((option) => (
                          <div
                            key={option.id}
                            className="flex flex-row items-center gap-[10px]"
                          >
                            <input
                              id={option.id}
                              type="radio"
                              name="time"
                              value={option.value}
                              onChange={handleRadioChange} // Handle change
                              checked={radioTimeValue === option.value}
                              className=" w-[15px]! h-[15px]!  cursor-pointer"
                            />
                            <label
                              htmlFor={option.id}
                              className="text-text-white title3medium cursor-pointer"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <section className="_dataGraphTabulator flex flex-col mt-[15px] gap-[15px] w-full h-full overflow-hidden">
                      <div className="box-ChartPieAccessRoad gap-[20px] grid grid-cols-2 relative w-full justify-between">
                        <div className=" w-full flex items-start relative">
                          <PieChartIn series={seriesPieIncoming}/>
                          <div className="flex flex-col w-full gap-[2px]">
                            <div className="flex flex-row gap-[5px]">
                              <span className="text-text-white body2bold">
                                진입
                              </span>
                              <img src={IconIn} alt="" />
                            </div>
                            <div className="flex flex-row w-full items-center gap-[5px] justify-between">
                              <span className="text-text-white body2">
                                승용차
                              </span>
                              <span className="text-text-white title3bold">
                                {incoming301001}
                              </span>
                            </div>
                            <div className="flex flex-row w-full items-center gap-[5px] justify-between">
                              <span className="text-text-white body2">
                                오토바이
                              </span>
                              <span className="text-text-white title3bold">
                                {incoming301006}
                              </span>
                            </div>
                            <div className="flex flex-row w-full items-center gap-[5px] justify-between">
                              <span className="text-text-white body2">
                                버스
                              </span>
                              <span className="text-text-white title3bold">
                                {incoming301005}
                              </span>
                            </div>
                            <div className="flex flex-row w-full items-center gap-[5px] justify-between">
                              <span className="text-text-white body2">
                                트럭
                              </span>
                              <span className="text-text-white title3bold">
                                {incoming301003}
                              </span>
                            </div>
                            <div className="flex flex-row w-full items-center gap-[5px] justify-between">
                              <span className="text-text-white body2">
                                승합차
                              </span>
                              <span className="text-text-white title3bold">
                                {incoming301002}
                              </span>
                            </div>
                            <div className="flex flex-row w-full items-center gap-[5px] justify-between">
                              <span className="text-text-white body2">
                                자전거
                              </span>
                              <span className="text-text-white title3bold">
                                {incoming301007}
                              </span>
                            </div>
                            <div className="flex flex-row w-full items-center gap-[5px] justify-between">
                              <span className="text-text-white body2">
                                대형 트럭
                              </span>
                              <span className="text-text-white title3bold">
                                {incoming301004}
                              </span>
                            </div>
                            <div className="flex flex-row w-full items-center gap-[5px] justify-between">
                              <span className="text-text-white body2">
                                기타
                              </span>
                              <span className="text-text-white title3bold">
                                {incoming301000}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className=" w-full flex items-start relative">
                          <PieChartOut series={seriesPieOutgoing}/>
                          <div className="flex flex-col w-full gap-[2px]">
                            <div className="flex flex-row gap-[5px]">
                              <span className="text-text-white body2bold">
                                진출
                              </span>
                              <img src={IconOut} alt="" />
                            </div>
                            <div className="flex flex-row w-full items-center gap-[5px] justify-between">
                              <span className="text-text-white body2">
                                승용차
                              </span>
                              <span className="text-text-white title3bold">
                                {outgoing301001}
                              </span>
                            </div>
                            <div className="flex flex-row w-full items-center gap-[5px] justify-between">
                              <span className="text-text-white body2">
                                오토바이
                              </span>
                              <span className="text-text-white title3bold">
                                {outgoing301006}
                              </span>
                            </div>
                            <div className="flex flex-row w-full items-center gap-[5px] justify-between">
                              <span className="text-text-white body2">
                                버스
                              </span>
                              <span className="text-text-white title3bold">
                                {outgoing301005}
                              </span>
                            </div>
                            <div className="flex flex-row w-full items-center gap-[5px] justify-between">
                              <span className="text-text-white body2">
                                트럭
                              </span>
                              <span className="text-text-white title3bold">
                                {outgoing301003}
                              </span>
                            </div>
                            <div className="flex flex-row w-full items-center gap-[5px] justify-between">
                              <span className="text-text-white body2">
                                승합차
                              </span>
                              <span className="text-text-white title3bold">
                                {outgoing301002}
                              </span>
                            </div>
                            <div className="flex flex-row w-full items-center gap-[5px] justify-between">
                              <span className="text-text-white body2">
                                자전거
                              </span>
                              <span className="text-text-white title3bold">
                                {outgoing301007}
                              </span>
                            </div>
                            <div className="flex flex-row w-full items-center gap-[5px] justify-between">
                              <span className="text-text-white body2">
                                대형 트럭
                              </span>
                              <span className="text-text-white title3bold">
                                {outgoing301004}
                              </span>
                            </div>
                            <div className="flex flex-row w-full items-center gap-[5px] justify-between">
                              <span className="text-text-white body2">
                                기타
                              </span>
                              <span className="text-text-white title3bold">
                                {outgoing301000}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-text-white title3bold my-[10px]">
                        비교
                      </p>
                      <div className="w-full flex flex-row h-[calc(100%-265px)] items-start justify-between gap-[10px] overflow-hidden">
                        <div className="w-full h-full bg-[#0E1010] p-[10px] rounded-[5px]">
                          <ReactTabulator
                            data={dataEntry}
                            columns={entryColumns}
                            layout={"fitColumns"}
                            id=""
                            className="tabulator-modify-db w-full "
                            //   pagination="local"
                            options={optionsTabulatorEntry}
                          />
                        </div>
                        <div className="w-full h-full bg-[#0E1010] p-[10px] rounded-[5px]">
                          <ReactTabulator
                            data={dataExit}
                            columns={exitColumns}
                            layout={"fitColumns"}
                            id=""
                            className="tabulator-modify-db w-full "
                            //   pagination="local"
                            options={optionsTabulatorEntry}
                          />
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </section>
            </section>
          </div>

          <div className="flex  flex-row gap-[10px] flex-1 overflow-hidden">
            <div className="_boxRowBottom flex w-full gap-[10px] overflow-hidden">
              <section className=" flex flex-1 h-[full] overflow-hidden bg-[#000] rounded-[5px]">
                <div className="bg-header-content w-full h-[36px] flex items-center px-[15px]">
                  <span className="title3bold text-text-white">
                    설치위치 (Installation location)
                  </span>
                </div>
                <div className="_containerStatisticInOutTraffice overflow-hidden h-[calc(100%-35px)] ">
                <div ref={mapRef} className="_maps_accessRoad w-full h-full relative"></div>
                </div>
              </section>

              <section className=" flex flex-1/6 h-[full] overflow-hidden bg-[#000] rounded-[5px]">
                <div className="bg-header-content w-full h-[36px] flex items-center px-[15px]">
                  <span className="title3bold text-text-white">
                    시간별 유입/유출 교통량
                  </span>
                </div>
                <div className="_containerStatisticInOutTraffice overflow-hidden h-[calc(100%-30px)] p-[10px]">
                  <InOutTrafficeOverTimeStatistic series={seriesMovingInOutTime} xAxisCategories={xAxisCategories}/>
                </div>
              </section>
            </div>

            <div className="_boxRowBottom flex w-full gap-[10px] overflow-hidden">
              <section className=" flex flex-1/8 h-[full] overflow-hidden bg-[#000] rounded-[5px]">
                <div className="bg-header-content w-full h-[36px] flex items-center px-[15px]">
                  <span className="title3bold text-text-white">
                    이동류별 차종 교통량 ( Traffic by vehicle type )
                  </span>
                </div>
                <div className="_containerStatisticITrafficeByVehicle overflow-hidden h-[calc(100%-30px)] p-[10px]">
                  <TrafficeByVehicleTypeStatistic />
                </div>
              </section>

              <section className=" flex flex-1 h-[full] overflow-hidden bg-[#000] rounded-[5px]">
                <div className="bg-header-content w-full h-[36px] flex items-center px-[15px]">
                  <span className="title3bold text-text-white">
                    시간별 이동류 교통량 (Traffic by movement over time)
                  </span>
                </div>
                <div className="_containerStatisticITrafficeByVehicle overflow-hidden h-[calc(100%-30px)] p-[10px]">
                  <TrafficeByMovementStatistic />
                </div>
              </section>
            </div>
          </div>
          
        </div>
      </section>
    </>
  );
};

export default AccessRoadDashboard;
