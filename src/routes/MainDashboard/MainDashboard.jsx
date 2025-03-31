import React, { useCallback, useEffect, useRef, useState } from "react";
import Header from "../../components/Header/Header";
import "./MainDashboard.css";
import "./tool-tip.css";

import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
// import { Tile as TileLayer } from "ol/layer";
import { Tile as TileLayer } from "ol/layer";
import { OSM } from "ol/source";
import BingMaps from 'ol/source/BingMaps';  
import { XYZ } from "ol/source";
import Cluster from "ol/source/Cluster";
import { Circle as CircleStyle, Fill, Stroke, Text } from "ol/style";
import { fromLonLat, get as getProjection } from "ol/proj";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";

import IconRedCar from "../../assets/icon/car/icon-db-car-red.svg";
import IconOrangeCar from "../../assets/icon/car/icon-db-car-orange.svg";
import IconYellowCar from "../../assets/icon/car/icon-db-car-yellow.svg";
import IconGreenCar from "../../assets/icon/car/icon-db-car-green.svg";
import IconBlueCar from "../../assets/icon/car/icon-db-car-blue.svg";
import IconNavyCar from "../../assets/icon/car/icon-db-car-navy.svg";
import IconPurpleCar from "../../assets/icon/car/icon-db-car-purple.svg";
import IconPinkCar from "../../assets/icon/car/icon-db-car-pink.svg";
import IconTealCar from "../../assets/icon/car/icon-db-car-teal.svg";
import IconSkyBlueCar from "../../assets/icon/car/icon-db-car-skyblue.svg";

import IconDefault from "../../assets/icon/icon-default.svg";
import IconReturn from "../../assets/icon/icon-return.svg";
import IconRoadMap from "../../assets/icon/icon-road-map.svg";
import IconDarkMap from "../../assets/icon/icon-dark-map.svg";
import IconBing from "../../assets/icon/icon-bing-map.svg";

import Colorize from "ol-ext/filter/Colorize";
import useDashboard from "../../hooks/useDashboard";
import { useTranslation } from "react-i18next";
import NoticeMessage from "../../plugin/noticemessage/noticemessage";
import { formatFullDateTime } from "../../utils/date";
import ReactFullpage from '@fullpage/react-fullpage';
import CommandInputModal from '../../components/Modal/CommandInputModal/CommandInputModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCircle } from '@fortawesome/free-solid-svg-icons';
import { Zoom, Attribution } from 'ol/control';
import { defaults as defaultInteractions } from 'ol/interaction';
import LogList from './LogList';

import useDeviceStatusMgt from "../../hooks/useDeviceStatusMgt";
import useLogInfoMgt from "../../hooks/useLogInfoMgt";
import useCommandInfoMgt from "../../hooks/useCommandInfoMgt";

const MainDashboard = () => {
  const {t} = useTranslation();

  const [poiItem, setPoiItem] = useState([]);
  const [poiTestItem, setPoiTestItem] = useState([]);//테스트 poi
  const [deviceList, setDeviceList] = useState([]);//테스트 차량목록

  const [multiStartMode, setMultiStartMode]=useState(false)
  const [multiStopMode, setMultiStopMode]=useState(false)

  const [startAllActive, setStartAllActive]=useState(false)
  const [stopAllActive, setStopAllActive]=useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeviceId,setselectedDeviceId] = useState('')
  const [inputCommand,setInputCommand] = useState('')
  const [isLogDelete,setIsLogDelete] = useState(false)

  const [deviceStatusQueryParams,setDeviceStatusQueryParams]=useState('')
  const [deviceLogQueryParams,setDeviceLogQueryParams]=useState('logList')
  const [commandQueryParams,setCommandQueryParams]=useState('')

  const [selectedLogPos, setSelectedLogPos] = useState([]);
  const [selectedLogInfo, setSelectedLogInfo] = useState([]);
  //mapDisplayPOITest 는 지도 출력 샘플데이터 시험용
  const {mapInitialView, mapDisplayPOI, mapDisplayPOITest, mapDisplayPOIOneTest } = useDashboard({
  });

  //임시로 파일에서 불러온 차량정보, 차량로그정보
  const {deviceStatus} = useDeviceStatusMgt({
    deviceStatusQueryParams
  });

  const {deviceLogData, deleteLogList} = useLogInfoMgt({
    deviceLogQueryParams
  });

  const {createCommand} = useCommandInfoMgt({

  });

  //mapDisplayPOITest 는 샘플데이터 시험용
  const mapInitial = mapInitialView?.data;
  const mapDisplay = mapDisplayPOI?.data;
  const mapDisplayTest = mapDisplayPOIOneTest?.data;
  //const mapDisplayOneTest = mapDisplayPOIOneTest?.data;

  console.log('mapDisplay')
  console.log(mapDisplay)
  console.log('mapDisplayTest')
  console.log(mapDisplayTest)

  console.log('deviceStatus')
  console.log(deviceStatus)

  console.log('deviceLogData')
  console.log(deviceLogData)

  useEffect(() => {
    console.log('mapDisplay store')
    if (mapDisplay?.poi) {
      setPoiItem(mapDisplay.poi);
    }
  }, [mapDisplay]); 

  useEffect(() => {
    console.log('mapDisplayTest store')
    if (mapDisplayTest) {
      setPoiTestItem(mapDisplayTest);
    }
  }, [mapDisplayTest]); 


  const mapRef = useRef(null);
  const olMapRef = useRef(null);
  const poiLayerRef = useRef(null);
  const clusterLayerRef = useRef(null);
  
  const opik = "5363C20D-EDEA-3436-88BC-B45CC374A9B4";
  useEffect(() => {
    if (!mapRef.current) return;

    const layerMap = {
      base: new TileLayer({
        title: "Base",
        visible: true,
        type: 'base',
        source: new XYZ({
            url: `http://api.vworld.kr/req/wmts/1.0.0/${opik}/Base/{z}/{y}/{x}.png`,
        }),
      }),
      osm: new TileLayer({
        title: "osm",
        visible: false,
        source: new OSM(),
      }),
      road: new TileLayer({
        title: "road",
        visible: false,
        source: new BingMaps({
          key: "Ag0RC261GIS2piKGzsg9RmnvrT8GHg9jVY27kPWUs28axMxdSfGJhCf2unSg6eeg",  
        }),
      }),
      canvaslight: new TileLayer({
        title: "canvaslight",
        visible: false,
        source: new OSM(),
      }),
      canvasdark: new TileLayer({
        title: "canvasdark",
        visible: false,
        source: new OSM(),
      }),
      satellite: new TileLayer({
        title: "satellite",
        visible: false,
        source: new BingMaps({
          key: "Ag0RC261GIS2piKGzsg9RmnvrT8GHg9jVY27kPWUs28axMxdSfGJhCf2unSg6eeg",  
          imagerySet: "AerialWithLabelsOnDemand",  
        }),
      }),
    };


    const enhanceOption = new Colorize();
    enhanceOption.setFilter({
      operation: "enhance",
      value: Number("0.1"),
    });
    layerMap.osm.addFilter(enhanceOption);
    layerMap.base.addFilter(enhanceOption);
    layerMap.canvasdark.addFilter(enhanceOption);

    // alt black mode (30, 20, 10)
    // 'color' option - RGB4 ( Blue Dark =  50, 30, 0 )
    const colorOption = new Colorize();
    colorOption.setFilter({
      operation: "color",
      red: Number("0"),
      green: Number("0"),
      blue: Number("0"),
      value: Number("1"),
    });
    layerMap.osm.addFilter(colorOption);
    layerMap.base.addFilter(colorOption);

    const blueOption = new Colorize();
    blueOption.setFilter({
      operation: "color",
      red: Number("50"),
      green: Number("30"),
      blue: Number("0"),
      value: Number("1"),
    });
    layerMap.canvasdark.addFilter(blueOption);

    // 'saturation' option => highlight lines on the land
    const saturationOption = new Colorize();
    saturationOption.setFilter({
      operation: "enhance",
      value: Number("0.1"),
    });
    layerMap.osm.addFilter(saturationOption);
    layerMap.osm.addFilter(saturationOption);
    layerMap.canvasdark.addFilter(saturationOption);


    var invert_filter = new Colorize();
    layerMap.osm.addFilter(invert_filter);
    layerMap.canvasdark.addFilter(invert_filter);
    layerMap.base.addFilter(invert_filter);
    invert_filter.setFilter("invert");

    const layers = [
      layerMap["base"],
      layerMap["osm"],
      //layerMap["road"],
      //layerMap["canvaslight"],
      //layerMap["satellite"],
      //layerMap["canvasdark"],
    ];

    // Map definition
    const olMap = new Map({
      target: mapRef.current,
      layers: layers,

      view: new View({
        //center: fromLonLat([mapInitial?.[0]?.view_lng, mapInitial?.[0]?.view_lat]),
        center: fromLonLat([126.9780, 37.5665]),//서울시청 위치로 시작함
        zoom: 15,
        minZoom: 8, 
      }),
      controls: [
        new Zoom({
          zoomInLabel: '+',  // 확대 버튼에 ' +' 텍스트 표시
          zoomOutLabel: '-' // 축소 버튼에 ' -' 텍스트 표시
        }),  // Zoom 컨트롤만 추가
      ],
      interactions: defaultInteractions({ 
        mouseWheelZoom: false // 휠로 인한 확대/축소 비활성화
      }),
    });

    // CSS로 Zoom 컨트롤을 우측으로 배치
    const style = document.createElement('style');
    style.innerHTML = `
      .ol-zoom {
        position: absolute;
        width:50px;
        height:100px;
        top:50px;
        left:73%; /* 우측에 위치 */
        z-index: 100; /* 컨트롤이 맵 위로 오도록 z-index 추가 */
        cursor:pointer;
      }
      .ol-zoom > button {
        font-size: 28px !important;
        width: 50px !important;
        height: 50px !important;
        cursor: pointer;
        box-sizing:border-box !important;
      }
      *[title="Default"] {
        display: none !important;
      }
      *[title="Light Map"] {
        display: none !important;
      }
      *[title="Dark Map"] {
        display: none !important;
      }
      *[title="Satellite"] {
        display: none !important;
      }
      .ol-zoom-in{
        font-size: 50px !important;
        width:100% !important;
        height:50% !important;
      }
      .ol-zoom-out{
        width:100% !important;
        height:50% !important;
      }
    `;
    document.head.appendChild(style);

    const changeMapView = () => {
      if (olMap) {
        //const newCenter = fromLonLat([mapInitial?.[0]?.view_lng, mapInitial?.[0]?.view_lat]);
        const newCenter = fromLonLat([126.9780, 37.5665]);
        const newZoom =  15;
  
        olMap.getView().animate({
          center: newCenter,
          zoom: newZoom,
          duration: 1000, 
        });
      }
    };

    const changeLayer = (layerTitle) => {
      Object.keys(layerMap).forEach((title) => {
        const layer = layerMap[title];
        if (title === layerTitle) {
          layer.setVisible(true); 
        } else {
          layer.setVisible(false); 
        }
      });
    };

    setTimeout(() => {
      const zoomControl = document.querySelector(".ol-zoom");

      if (zoomControl) {
        zoomControl
          .querySelectorAll(".custom-icon-button")
          .forEach((btn) => btn.remove());

        const icons = [
          {
            src: IconReturn,
            title: "Return",
            action: () => changeMapView(),
          },
          {
            src: IconDefault,
            title: "Default",
            action: () => changeLayer("base"),
          },
          {
            src: IconRoadMap,
            title: "Light Map",
            action: () => changeLayer("canvaslight"),
          },
          {
            src: IconDarkMap,
            title: "Dark Map",
            action: () => changeLayer("canvasdark"),
          },
          {
            src: IconBing,
            title: "Satellite",
            action: () => changeLayer("satellite"),
          },
        ];

        icons.forEach((iconData) => {
          const newButton = document.createElement("button");
          newButton.innerHTML = `<img src="${iconData.src}" alt="${iconData.title}" width="20" height="20">`;
          newButton.className = "custom-icon-button";
          newButton.title = iconData.title;

          newButton.onclick = iconData.action;

          zoomControl.appendChild(newButton);
        });
      }
    }, 100);
    
    olMapRef.current = olMap;

    return () => {
      if (olMapRef.current) {
        olMapRef.current.setTarget(null);
        olMapRef.current = null; // Reset the map reference
      }
    };
  }, [mapInitial, mapDisplay]);

  useEffect(() => {
    const iconMapping = {
      "red-car": IconRedCar,
      "orange-car": IconOrangeCar,
      "yellow-car": IconYellowCar,
      "green-car": IconGreenCar,
      "blue-car": IconBlueCar,
      "navy-car": IconNavyCar,
      "purple-car": IconPurpleCar,
      "pink-car": IconPinkCar,
      "teal-car": IconTealCar,
      "skyblue-car": IconSkyBlueCar,
    };
  
    // 아이콘 Features 배열 (ID별로 그룹화 하지 않고 직접 추가)
    const Iconfeatures = [];
  
    // 데이터 아이템을 반복하면서 아이콘을 Features 배열에 추가
    deviceStatus?.data.forEach(item => {
      console.log('poiItem mapping');
      console.log(item);
  
      const { lat, lng, device_id, last_data_reviced_time } = item;
      console.log('item')
      console.log(item)
      
       // observationTime을 Date 객체로 변환
      const date = new Date(last_data_reviced_time);

      // 연도, 월, 일, 시간, 분 추출
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');  // 월은 0부터 시작하므로 1을 더해줘야 합니다.
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      // 원하는 형식으로 날짜와 시간 포맷팅
      const formattedDate = `${String(year).slice(2,4)}.${month}.${day} ${hours}:${minutes}`;

      let deviceType = "";

      // 색상 배열 정의
      const carColors = [
        "","red-car","orange-car","yellow-car","green-car","blue-car","navy-car","purple-car","pink-car","teal-car","skyblue-car"
      ];

      console.log('deviceType');
      console.log(deviceType);
      deviceType = carColors[device_id];

      const iconSrc = iconMapping[deviceType]; // 아이콘 타입 설정
  
      // 아이콘 Feature 생성
      const iconFeature = new Feature({
        geometry: new Point(fromLonLat([lng, lat])),
      });
  
      iconFeature.setStyle(
        new Style({
          image: new Icon({
            src: iconSrc,
            scale: 1.5,  // 아이콘 크기 조정
          }),
          // 아이콘 위에 표시할 텍스트
          text: new Text({
            text: item.device_id+"\n"+"["+formattedDate+"]", // 첫 번째 텍스트: 아이디를 아이콘 위에 표시
            font: 'bold 12px sans-serif',  // 글자를 굵게 설정
            fill: new Fill({
              color: 'rgba(255, 255, 255, 1)',  // 진한 흰색
            }),
            offsetY: -30,  // 아이콘 위로 텍스트를 이동
          }),
          
        })
      );
      
      // Features 배열에 추가 (ID별로 그룹화 하지 않음)
      Iconfeatures.push(iconFeature);
    });
  
    const view = olMapRef.current.getView();
    const zoom = view.getZoom();
  
    const clusterSource = new Cluster({
      distance: 100,
      minDistance: 0,
      source: new VectorSource({
        features: Iconfeatures,
      }),
    });
  
    const poiLayer = new VectorLayer({
      source: new VectorSource({
        features: [...Iconfeatures],
      }),
    });
  
    if (poiLayerRef.current) {
      olMapRef.current.removeLayer(poiLayerRef.current);
    }
  
    if (clusterLayerRef.current) {
      olMapRef.current.removeLayer(clusterLayerRef.current);
    }
  
    poiLayerRef.current = poiLayer;
  
    olMapRef.current.addLayer(poiLayerRef.current);
  
    poiLayerRef.current.setVisible(true);
    olMapRef.current.on("moveend", function () {
      poiLayerRef.current.setVisible(true);
    });
  
    olMapRef.current.getView().on('change:resolution', function () {
      clusterSource.refresh();
    });
  
  }, [deviceStatus]);
  
  
  const moveMapToPOI = (device_id, lat, lng) => {
    //alert(id)
      console.log(device_id, lat, lng);
      const isInSouthKorea = lat >= 33.0 && lat <= 38.6 && lng >= 124.6 && lng <= 131.0;

      if (lat && lng && isInSouthKorea) {
        olMapRef.current.getView().animate({
          center: fromLonLat([lng, lat]),
          zoom: 17,  
          duration: 1000 
        });
      } else {
        new NoticeMessage("좌표가 대한민국 범위를 벗어났습니다.");
      }
  };

  const [openSections, setOpenSections] = useState([]);

  const handleStartAll = () => {

    setStartAllActive(!startAllActive)
  
    if(stopAllActive==true){
      setStopAllActive(false)
    }

    const devices = deviceList.map((device) =>{
      return { ...device, status:'대기',isActive: false }
    })
      
    setDeviceList(devices);

  };

  const multiModeStart=()=>{
    //alert('다중 시험 시작')
    setMultiStartMode(true)
    //setSelectedAll(true)
    //setIsModalOpen(true)
  }
  
  const multiModeConfirm=()=>{
    //alert('선택 완료')
    //setIsModalOpen(true)
    console.log('multiModeStart')
    console.log(multiStartMode)
    if(multiStartMode===true){
      //alert('진입')
      setIsModalOpen(true)
      //setMultiStartMode(false)
      //스타트 모드는 커맨드 입력 모달창
    }else if(multiStopMode==true){
      //그냥 종료
      let multiStopConfirm = new NoticeMessage(t('정말로 시험을 종료하시겠습니까?'), {
        mode: "confirm",
      });
    
      multiStopConfirm.confirmClicked().then(() => {
        
        const updatedDeivceList = deviceList.map(device => {
          // checked가 true인 항목만 status를 "대기"로 변경
          
          if (device.checked) {
            return { ...device, status:"DEV_ST_RDY",status_eng: "Ready",status_kor: "대기" };
          }
          return device;
        });

        // 업데이트된 deviceList를 상태로 반영
        setDeviceList(updatedDeivceList);
        setMultiStopMode(false)
      });

    }
  }

  const multiModeStop=()=>{
    //alert('다중 시험 종료')
    setMultiStopMode(true)
  }

  const multiModeCancel=()=>{
    //alert('취소')
    setMultiStartMode(false)
    setMultiStopMode(false)
  }

  const handleStopAll = () => {
    setStopAllActive(!stopAllActive)
  
    if(startAllActive==true){
      setStartAllActive(false)
    }
  };

  const handleInputCommand=(e)=>{
    console.log('handleInputCommand')
    // 입력 값에서 공백 및 한글을 제거
    const value = e.target.value;

    // 정규 표현식으로 공백과 한글을 검사하여 거르기
    if (/[\sㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(value)) {
      // 공백이나 한글이 포함되면 입력을 막고 상태를 변경하지 않음
      return;
    }

    // 조건에 맞는 경우에만 상태 업데이트
    setInputCommand(value);
  }

  const testStart=(device_id)=>{
    //alert('시작:'+carId)
    setselectedDeviceId(device_id)
    setIsModalOpen(true)
  }

  const testStop=(device_id)=>{

    let testStopConfirm = new NoticeMessage(t('정말로 시험을 종료하시겠습니까?'), {
      mode: "confirm",
    });
  
    testStopConfirm.confirmClicked().then(() => {
      
    //alert('종료:'+carId)
    const devices = deviceList.map((device) =>
      device.device_id === device_id ? 
    { ...device, status:"DEV_ST_RDY", status_eng:"Ready", status_kor:"대기" } : device
    )
    setDeviceList(devices);

    });
  }

  const confirmClick=()=>{
    //명령어까지 선택완료
    //alert('완료!')
    //alert('multiStartMode;'+multiStartMode)
    //alert('multiStopMode:'+multiStopMode)

    if(multiStartMode==true){
      const devices = deviceList.map((device) => {
        // If car.checked is true, set isActive to true and status to '진행중'
        if (device.checked==true) {
          return {
            ...device,
            status:"DEV_ST_ING",status_eng: "Test-ing",status_kor: "진행중",
            isActive: true    // Set isActive to true if checked is true
          };
        }
      
        // Otherwise, keep the original values
        return {
          ...device,
        };
      });
      
      //alert(`다중 시험모드:${selectedDeviceId} 커맨드: ${inputCommand} 시험 시작!`);
      createCommand('test command')//API Call

      setDeviceList(devices)
      //setStartAllActive(true)
      setIsModalOpen(false)
      setMultiStartMode(false)
      setInputCommand('')
    }else{
      //다중모드 아닐시엔
      console.log('다중모드 아닐때')
      const devices = deviceList.map((device) => {
        // If car.checked is true, set isActive to true and status to '진행중'
        console.log(device)
        if (device.device_id==selectedDeviceId) {
          return {
            ...device,
            status:"DEV_ST_ING",status_eng: "Test-ing",status_kor: "진행중",
            isActive: true    // Set isActive to true if checked is true
          };
        }
        
        return device;
      });

      createCommand('test command')//API Call

      setDeviceList(devices)
      setIsModalOpen(false)
      setInputCommand('')
    }
  }
  //
  const cancelClick=()=>{
    //alert('취소!')
    setIsModalOpen(false)
  }
  //
  const handleReset=(device_id)=>{
    //alert(id+' 리셋!')

    let testResetConfirm = new NoticeMessage(t('정말로 Reset 하시겠습니까?'), {
      mode: 'confirm',
    });
  
    testResetConfirm.confirmClicked().then(() => {
      
      const cars = deviceList.map((car) =>
        car.device_id === device_id ? { ...car, status:'DEV_ST_RDY',status_eng:'Ready',status_kor:'대기'} : car
      )
      setDeviceList(cars);
  
    });
  }

  const handleDeleteLog=()=>{
      setIsLogDelete(true)
  }

  const logDeleteConfirm=()=>{
    //console.log('삭제할 로그위치')
    //console.log(selectedLogPos)
    //alert('삭제할 로그위치')
    //alert(selectedLogPos)
    alert('삭제할 로그 정보')
    alert(selectedLogInfo)
    deleteLogList(selectedLogInfo)

    
    setIsLogDelete(false)
  }

  const logDeleteCancel=()=>{
    setIsLogDelete(false)
  }

  const checkCarClick=(device_id)=>{
    //alert('차량 체크')
    const cars = deviceList.map((device) =>
      device.device_id === device_id ? { ...device, checked:!device.checked } : device
    )
    setDeviceList(cars)
  }


  useEffect(() => {
      console.log('deviceList store')
      if (deviceStatus) {
        const updatedDeviceList = deviceStatus.data.map(device => ({
          ...device,       // 기존 device 정보 그대로 복사
          checked: false   // checked 속성 추가
      }));
      
      setDeviceList(updatedDeviceList);
      
      const ids = deviceStatus.data.map(device => device.device_id);
      setOpenSections(ids)
    }
  }, [deviceStatus]); 


  useEffect(() => {
    // 페이지 로딩 시 body에 overflow-y: scroll 추가
    document.body.style.overflowY = 'scroll';
    document.body.style.height = '100%';

    // cleanup: 컴포넌트 언마운트 시 body overflow 스타일 초기화
    return () => {
      document.body.style.overflowY = 'auto';
    };
  }, []);

  const [isScrolling, setIsScrolling] = useState(false); // 휠 스크롤 방지 상태

  useEffect(() => {
    const handleWheel = (event) => {
      event.preventDefault(); // 휠 이벤트 기본 동작을 막음
      if (isScrolling) return;

      setIsScrolling(true); // 스크롤을 시작함

      // 잠시 후 스크롤을 다시 활성화
      setTimeout(() => {
        setIsScrolling(false);
      }, 800); // 휠 이벤트 처리 후 800ms 대기
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isScrolling]);

  const logList = deviceLogData?.data?.devices || [];
  console.log('logList:', logList);

  // Start transforming the data
  //const rows = [];
  const transFormedLogList = []
  const maxLength = Math.max(...logList.map(device => device.tests?.length || 0)); // Get the max length of tests array

  // Loop through all the devices and create a row for each test entry
  for (let i = 0; i < maxLength; i++) {
    const row = {};

    logList.forEach((device, index) => {
      const test = device.tests[i]; // Get the ith test from the device's tests array
      // Ensure that all 10 cars (car1 to car10) are represented
      row[`car${index + 1}`] = test ? test.test_id : ''; // Add car1, car2, ... for each test entry
    });

    // Fill missing cars with empty string if necessary (car4, car5, ... up to car10)
    for (let j = logList.length; j < 10; j++) {
      row[`car${j + 1}`] = ''; // If a car doesn't exist, add empty string
    }

    transFormedLogList.push(row); // Push the row into the final data array
  }

  console.log('Transformed Data:', transFormedLogList);

  return (
    <>
    <ReactFullpage
      licenseKey={'YOUR_KEY_HERE'} // 필요 시, 라이센스 키를 입력하세요.
      autoScrolling={true}
      scrollOverflow={true} // 스크롤 오버플로우 설정을 true로
      scrollingSpeed={800}    // 스크롤 속도 조정
      navigation={true}       // 네비게이션 활성화
      //onWheel={handleWheel} // 휠 이벤트 핸들러 추가
      render={({ state, fullpageApi }) => {
        return (
          <div>
            <div className="section w-full h-[100vh] overflow-hidden">
              <div className="w-full">
                <section className="flex flex-grow overflow-hidden">
                  <Header />
                  {/* ini maps ya */}
                  <div ref={mapRef} className="w-full h-[calc(100vh-45px)] relative">
                    {/* ini maps ya */}

                    <div className="_legendTop absolute z-10 w-max h-[31px] top-[10px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-[4px] overflow-hidden">
                      <div className="flex gap-[30px] h-full">
                        <div className="bg-[#fff] w-fit h-full flex rounded-[4px]">
                            
                        </div>
                        <div className="bg-[#fff] w-fit h-full flex rounded-[4px] overflow-hidden">
                          
                        </div>
                      </div>
                    </div>

                    {/* bg-left */}
                    <div className="flex flex-col gap-[5px] overflow-hidden p-[5px] top-[5px] left-[10px] w-[450px] absolute z-10  h-[94vh] rounded-lg bg-[rgba(59,71,84,0.52)] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
                      
                      <div className="_boxListSite flex w-full bg-db-black shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex-col rounded-[5px] overflow-hidden flex-1">
                        <div className="bg-header-content w-full h-[23px] flex items-center px-[15px]">
                          <span className="title3bold text-text-white">
                            디바이스 리스트
                          </span>
                        </div>
                        <div className="flex flex-col w-full py-[2px] px-[10px] gap-[15px] overflow-hidden flex-1">
                          
                          <div className="grid grid-row-2 gap-[0px] bg-gray-800 rounded">
                            {/* First row with dark gray background */}
                              <div className="bg-gray-600 text-white p-1 rounded">디바이스 다중제어</div>

                              {/* Second row with darker gray background */}
                              <div className="bg-gray-700 text-white p-1 flex justify-center items-center gap-4 -mb-2">
                                  {/* Button styles */}
                                  {
                                    multiStartMode==true || multiStopMode==true?
                                    <button className='bg-white text-black py-1 px-9 rounded cursor-pointer hover:opacity-80 font-bold'
                                    onClick={()=>multiModeConfirm()}>
                                      선택 완료
                                    </button>
                                    :
                                    <button className='bg-white text-black py-1 px-9 rounded cursor-pointer hover:opacity-80 font-bold'
                                    onClick={()=>multiModeStart()}>
                                      다중 시험 시작
                                    </button>
                                  }
                                  {
                                    multiStartMode==true || multiStopMode==true?
                                    <button className="bg-white text-black py-1 px-9 rounded cursor-pointer hover:opacity-80 font-bold"
                                    onClick={()=>multiModeCancel()}>
                                      취소
                                    </button>
                                    :
                                    <button className="bg-white text-black py-1 px-9 rounded cursor-pointer hover:opacity-80 font-bold" 
                                    onClick={()=>multiModeStop()}>
                                      다중 시험 종료
                                    </button>
                                  }
                                  
                              </div>
                          </div>

                          <div className="_contentCardList w-full  flex flex-col gap-[8px] overflow-auto h-full bg-transparent">
                            {deviceList?.map(({ device_id, status, status_value, status_kor, checked, test_name, log_file_name, error_message,  }) => (
                              <div key={device_id} className="w-full mb-[5px] bg-transparent">
                                {/* Accordion Header */}
                                <div
                                  className={`flex flex-row w-full justify-between items-center py-[1px] px-[10px] rounded-[5px] whitespace-nowrap mb-[5px] rounded bg-[#404953]
                                    ${
                                      status === "DEV_ST_ERR" ? "bg-red-500 text-white":'' // 오류
                                    }
                                    ${
                                      status === 'DEV_ST_ING'? "bg-green-500 text-white":'' //진행중
                                    }
                                    ${
                                      status === 'DEV_ST_RDY' || status === 'DEV_ST_BEG'? "bg-[##404953] text-white":'' //대기 , 시작대기
                                    }`
                                  }
                                  //onClick={() => toggleAccordion(id,lat,lng)}
                                >
                                  <div className="flex flex-row w-full items-center gap-[5px]">
                                    <span className="title3bold text-text-white">
                                      {
                                        status=='DEV_ST_RDY' && multiStartMode==true? //대기
                                        <FontAwesomeIcon
                                        icon={checked ? faCheckCircle : faCircle} // 활성화된 상태에 따라 아이콘 변경
                                        className={`text-xl cursor-pointer hover:opacity-80 mr-2 mt-1`} // 색상도 바꿀 수 있음
                                        onClick={()=>checkCarClick(device_id)}
                                        />:''
                                      }
                                      {
                                        (status=='DEV_ST_ING' || status=='진행중') && multiStopMode==true? //시작대기
                                        <FontAwesomeIcon
                                        icon={checked ? faCheckCircle : faCircle} // 활성화된 상태에 따라 아이콘 변경
                                        className={`text-xl cursor-pointer hover:opacity-80 mr-2 mt-1`} // 색상도 바꿀 수 있음
                                        onClick={()=>checkCarClick(device_id)}
                                        />:''
                                      }
                                    
                                        [{status_value}] Car {device_id} 
                                    </span>
                                  </div>
                                  <div>
                                    <button className={`w-[40px] h-[30px] rounded-[5px] font-bold pl-3 pr-10 mr-3 cursor-pointer hover:opacity-80
                                    ${status === 'DEV_ST_ING' || status=='DEV_ST_ERR' || status=='DEV_ST_BEG'? 'bg-gray-300 text-gray-400' : 'bg-white text-black'}`}
                                    //              진행중                    오류                  시작대기
                                    disabled={status === 'DEV_ST_ING' || status=='DEV_ST_ERR' || status=='DEV_ST_BEG'? true:false}
                                    //              진행중                    오류                  시작대기
                                      onClick={()=>testStart(device_id)}>
                                        시작
                                      </button>
                                    <button className={`w-[40px] h-[30px] rounded-[5px] font-bold pl-3 pr-10 mr-3 cursor-pointer hover:opacity-80
                                    ${status=='DEV_ST_RDY'? 'bg-gray-300 text-gray-400' : 'bg-white text-black'} `}
                                    //         대기
                                    disabled={status=='DEV_ST_RDY'? true:false}
                                    //                 대기
                                      onClick={()=>testStop(device_id)}>
                                        종료
                                      </button>
                                    <button className="w-[40px] h-[30px] bg-white text-black rounded-[5px] font-bold pl-3 pr-14 cursor-pointer hover:opacity-80"
                                      onClick={()=>handleReset(device_id)}>
                                        Reset
                                      </button>
                                  </div>
                                </div>

                                {/* Accordion Content */}
                                {openSections.includes(device_id) && (
                                  <div className="flex flex-col gap-[3px] mt-[-4px] mb-[2px] px-[3px]">
                                    <span className="text-white bg-[#31363d] p-1 box-border">
                                      {
                                        status=="DEV_ST_ERR"? //오류일때
                                        <span>
                                            {error_message}
                                        </span>:
                                         <span>
                                            {test_name} / {log_file_name}
                                        </span>
                                      }
                                      
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                  </div>
                  <CommandInputModal
                  isOpen={isModalOpen}
                  confirmClick={confirmClick}
                  cancelClick={cancelClick}
                  inputCommand={inputCommand}
                  handleInputCommand={handleInputCommand}
                  onClose={() => setIsModalOpen(false)}/>
                </section>
        
              </div>
            </div>
            <div className="section w-full h-[100vh] mt-10">
              <div className="w-full flex justify-end h-[80px] pt-0">
                {
                  isLogDelete==false?
                  <button className="w-[100px] h-[50px] bg-blue-500 text-white rounded cursor-pointer hover:opacity-80 mr-5"
                    onClick={handleDeleteLog}>
                    로그 삭제
                  </button>:
                  <div className="mr-5">
                    <button className="bg-[#3b4e6c] text-white rounded hover:bg-blue-600 cursor-pointer hover:opacity-80 mr-5"
                    style={{ width: "100px", height: "50px" }}
                    onClick={logDeleteConfirm}>
                      완료
                    </button>
                    <button className="bg-gray-300 text-black rounded hover:bg-gray-400 cursor-pointer hover:opacity-80"
                    style={{ width: "100px", height: "50px" }}
                    onClick={logDeleteCancel}>
                      취소
                    </button>
                </div>
                }
                
              </div>
              <div>
                  <LogList 
                  className="mr-2 mt-25"
                  //deviceLogData={deviceLogData?.data.devices || []} 
                  deviceLogData={transFormedLogList || []} 
                  isLogDelete={isLogDelete}
                  selectedLogPos={selectedLogPos}
                  setSelectedLogPos={setSelectedLogPos }
                  selectedLogInfo={selectedLogInfo}
                  setSelectedLogInfo={setSelectedLogInfo}
                  />
              </div>
            </div>
          </div>
        );
      }}
    />
    </>
    
  );
};

export default MainDashboard;
