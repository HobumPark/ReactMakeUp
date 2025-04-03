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
import { Fill, Text } from "ol/style";
import { fromLonLat } from "ol/proj";
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
import { useTranslation } from "react-i18next";
import NoticeMessage from "../../plugin/noticemessage/noticemessage";
import ReactFullpage from '@fullpage/react-fullpage';
import CommandInputModal from '../../components/Modal/CommandInputModal/CommandInputModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCircle } from '@fortawesome/free-solid-svg-icons';
import { Zoom } from 'ol/control';
import { defaults as defaultInteractions } from 'ol/interaction';
import LogList from './LogList';

import useDeviceStatusMgt from "../../hooks/useDeviceStatusMgt";
import useLogInfoMgt from "../../hooks/useLogInfoMgt";
import useCommandInfoMgt from "../../hooks/useCommandInfoMgt";

const MainDashboard = () => {
  const {t} = useTranslation();

  const [deviceList, setDeviceList] = useState([]);//테스트 차량목록

  const [multiStartMode, setMultiStartMode]=useState(false)
  const [multiStopMode, setMultiStopMode]=useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false);
  //단일디바이스 선택시 사용
  const [selectedDeviceId,setselectedDeviceId] = useState('')

  // Check 상태를 별도로 관리 - 다중디바이스 시작,종료에 사용
  const [checkedDevices, setCheckedDevices] = useState(new Set());

  const [inputCommand,setInputCommand] = useState('')
  const [isLogDelete,setIsLogDelete] = useState(false)

  const [deviceStatusQueryParams,setDeviceStatusQueryParams]=useState('')
  const [deviceLogQueryParams,setDeviceLogQueryParams]=useState([])
  const [traceQueryParams,setTraceQueryParams]=useState('')

  const [commandQueryParams,setCommandQueryParams]=useState('')

  const [selectedLogPos, setSelectedLogPos] = useState([]);
  const [selectedLogInfo, setSelectedLogInfo] = useState([]);

  //임시로 파일에서 불러온 차량정보, 차량로그정보
  const {deviceStatus, trace} = useDeviceStatusMgt({
    deviceStatusQueryParams,
    traceQueryParams
  });

  const {deviceLogData, deleteLogList} = useLogInfoMgt({
    deviceLogQueryParams
  });
  
  const {createCommand} = useCommandInfoMgt({
    commandQueryParams
  });
  
  console.log('deviceStatus')
  console.log(deviceStatus)

  //console.log('deviceLogData')
  //console.log(deviceLogData)

  //console.log('trace')
  //console.log(trace)

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
        center: fromLonLat([128.6248063, 35.872628899999995]),//중심좌표 위도, 경도
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
        const newCenter = fromLonLat([128.5549534326, 35.8849888403]);
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
  }, []);

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
    trace?.data.devices.forEach(item => {
           
      //console.log('item')
      //console.log(item)
  
      const device_id = parseInt(item.device_id);

      const traceArray = item.trace[0];
      //console.log('traceArray')
      //console.log(traceArray)
      const last_data_reviced_time = traceArray.heartbeat_time;
      const lat = traceArray.lat;
      const lng = traceArray.lng;

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

      //console.log('deviceType');
      //console.log(deviceType);
      let deviceId = parseInt(device_id)
      if(deviceId==0){//디바이스 아이디 00처리 (0처리)
        deviceType = carColors[10];
      }else{
        deviceType = carColors[deviceId];
      }
      
      //console.log(deviceType);
      const iconSrc = iconMapping[deviceType]; // 아이콘 타입 설정
  
      // 아이콘 Feature 생성
      const iconFeature = new Feature({
        geometry: new Point(fromLonLat([lng, lat])),
      });
  
      iconFeature.setStyle(
        new Style({
          image: new Icon({
            src: iconSrc || 'default-icon.png',
            scale: 1.5,  // 아이콘 크기 조정
          }),
          // 아이콘 위에 표시할 텍스트
          text: new Text({
            text: "CAR "+item.device_id+"\n"+"("+formattedDate+")", // 첫 번째 텍스트: 아이디를 아이콘 위에 표시
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
  
  }, [trace]);
  
  
  const moveMapToPOI = (device_id, lat, lng) => {
    //alert(id)
      //console.log(device_id, lat, lng);
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

        const deviceIds = deviceList
          .filter(device => 
            (device.status === 'DEV_ST_ING' || device.status === 'DEV_ST_BEG') && 
            // 상태가 DEV_ST_ING (진행중) 또는 DEV_ST_BEG (시작대기) 인 device만 필터링
            checkedDevices.has(device.device_id) // 체크된 device만
          )
          .map(device => device.device_id); // 필터링된 device에서 device_id만 추출

        console.log(deviceIds); // 체크된 device_id들을 출력

        const deviceCommandList = {
          commands: deviceIds.map((deviceId) => ({
            command_id: String(deviceId), // command_id를 device_id로 설정
            device_id: deviceId,          // device_id
            command_time: new Date().toISOString(), // 현재 시간 ISO 문자열
            command_type: "CMD_TP_STP",            // command_type 고정값
            test_id: deviceId,                           // test_id 
            test_name: `TEST-${inputCommand}`   // test_name을 "TEST-" + device_id로 설정
          }))
        };
  
        console.log('deviceCommandList')
        console.log(deviceCommandList)
  
        //alert(`다중 시험모드:${selectedDeviceId} 커맨드: ${inputCommand} 시험 시작!`);
        createCommand(deviceCommandList)//API Call

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
    //alert('시작:'+device_id)
    setselectedDeviceId(device_id)
    setIsModalOpen(true)
  }

  const testStop=(device_id)=>{

    let testStopConfirm = new NoticeMessage(t('정말로 시험을 종료하시겠습니까?'), {
      mode: "confirm",
    });
  
    testStopConfirm.confirmClicked().then(() => {
      
      const deviceCommandList = {
        "commands": [
          {
            "command_id": device_id,
            "device_id": device_id,
            "command_time": new Date().toISOString(),
            "command_type": "CMD_TP_STP",
            "test_id": device_id,
            "test_name": `STOP TEST-${device_id}`
          }
        ]
      }

      createCommand(deviceCommandList)

    //alert('종료:'+carId)
    setDeviceList(devices);

    });
  }

  const confirmClick=()=>{
    //명령어까지 선택완료
    //alert('완료!')
    //alert('multiStartMode;'+multiStartMode)
    //alert('multiStopMode:'+multiStopMode)

    if(multiStartMode==true){

      //alert('다중 디바이스 실행')

      const checkedDeviceIds = deviceList
        .filter((device) => checkedDevices.has(device.device_id)) // checkedDevices에 포함된 device_id만 필터링
        .map((device) => device.device_id); // device_id만 추출하여 배열로 생성

      console.log(checkedDeviceIds); // 결과 배열 출력
                
      const deviceCommandList = {
        "commands": checkedDeviceIds.map((selectedDeviceId) => ({
          command_id: String(selectedDeviceId), // command_id를 device_id로 설정
          device_id: selectedDeviceId,          // device_id
          command_time: new Date().toISOString(), // 현재 시간 ISO 문자열
          command_type: "CMD_TP_BEG",            // command_type 고정값
          test_id: selectedDeviceId,                           // test_id 빈 문자열
          test_name: `TEST-${inputCommand}`   // test_name을 "TEST-" + device_id로 설정
        }))
      };

      console.log('deviceCommandList')
      console.log(deviceCommandList)


      //alert(`다중 시험모드:${selectedDeviceId} 커맨드: ${inputCommand} 시험 시작!`);
      createCommand(deviceCommandList)//API Call

      //setDeviceList(devices)
      //setStartAllActive(true)
      setIsModalOpen(false)
      setMultiStartMode(false)
      setInputCommand('')
    }else{
      //다중모드 아닐시엔
      console.log('다중모드 아닐때')
      //alert('단일 디바이스 실행')
      //alert(selectedDeviceId)

      const deviceCommandList = {
        "commands": [
          {
            "command_id": "1",
            "device_id": selectedDeviceId,
            "command_time": new Date().toISOString(),
            "command_type": "CMD_TP_BEG",
            "test_id": selectedDeviceId,
            "test_name": `TEST-${inputCommand}`
          }
        ]
      }

      createCommand(deviceCommandList)

      //setDeviceList(devices)
      setIsModalOpen(false)
      setInputCommand('')
    }


    setIsModalOpen(false)
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

      const deviceCommandList = {
        "commands": [
          {
            "command_id": device_id,
            "device_id": device_id,
            "command_time": new Date().toISOString(),
            "command_type": "CMD_TP_REB",
            "test_id": device_id,
            "test_name": `RESET-TEST ${device_id}`
          }
        ]
      }

      createCommand(deviceCommandList)

    });
  }

  const handleDeleteLog=()=>{
      setIsLogDelete(true)
  }

  const logDeleteConfirm = async () => {
    // 삭제할 로그 정보가 담긴 배열을 "test_id" 키를 가진 객체로 변환
    const requestData = {
      "log_ids": selectedLogInfo, // 배열을 그대로 "test_id" 키에 할당
    };
    console.log('requestData');
    console.log(requestData);
  
    try {
      // 로그 삭제 요청
       deleteLogList(requestData);
  
      // 로그 삭제 완료 후 페이지 리로드
      // 0.5초 후 페이지 리로드
    setTimeout(() => {
      window.location.reload();
    }, 500); // 500ms = 0.5초
  
    } catch (error) {
      console.error('로그 삭제 실패:', error);
      alert('로그 삭제 실패');
    }
  
    setIsLogDelete(false);  // 상태 업데이트
  };
  
  
  const logDeleteCancel=()=>{
    setIsLogDelete(false)
  }

  const checkCarClick=(device_id)=>{
    //alert('차량 체크')
      // 체크 상태 변경
    const updatedCheckedDevices = new Set(checkedDevices);
    if (updatedCheckedDevices.has(device_id)) {
      updatedCheckedDevices.delete(device_id);
    } else {
      updatedCheckedDevices.add(device_id);
    }

    setCheckedDevices(updatedCheckedDevices);

    //setDeviceList(cars)
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


  const logList = deviceLogData?.data?.devices || [];
  console.log('logList:', logList);

  //받아온 로그 데이터 구조 변환
  // Start transforming the data
  //const rows = [];
  const transFormedLogList = []
  const maxLength = Math.max(...logList.map(device => device.logs?.length || 0)); // Get the max length of tests array

  // Loop through all the devices and create a row for each test entry
for (let i = 0; i < maxLength; i++) {
  const row = {};

  // Ensure that we always fill cars in the correct order: car1, car2, car3, ..., car10
  for (let j = 0; j <= 9; j++) {

    const carKey = j == 0? `car0${j}`:`car00`;
    row[carKey] = { log_file_name: '', test_id: null, log_file_id: null }; // Default to empty if no test exists for this car
  }

  logList.forEach((device) => {
    const logs = device.logs[i]; // Get the ith test from the device's tests array
    //console.log('logs')
    //console.log(logs)
    const deviceId = parseInt(device.device_id)
    //console.log('transFormed deviceId:'+deviceId)
    
    const carKey = deviceId ==0? `car0${deviceId}`:`car0${deviceId}`; // `car1`, `car2`, ..., based on the device_id

    // If the test exists and has a log file, assign the file name and include the test ID
    if (logs && logs.log_file_name) {
      row[carKey] = {
        log_file_name: logs.log_file_name, // The log file name
        test_id: logs.test_id, // The test id associated with this log entry
        log_file_id: logs.log_file_id
      };
    } else {
      row[carKey] = { log_file_name: '', test_id: null, log_file_id: null }; // Set test_id to null if there's no log file
    }
  });

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
                              <div className="bg-gray-600 text-white p-1 rounded pl-3">디바이스 다중제어</div>

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
                                    <button className='bg-white text-black py-1 px-9 rounded cursor-pointer hover:opacity-80 font-bold mr-5'
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
                            {deviceList?.map(({ device_id, status, status_value, test_name, error_message,  }) => (
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
                                        icon={checkedDevices.has(device_id) ? faCheckCircle : faCircle} // 활성화된 상태에 따라 아이콘 변경
                                        className={`text-xl cursor-pointer hover:opacity-80 mr-2 mt-1`} //다중시작 일때는 대기
                                        onClick={()=>checkCarClick(device_id)}
                                        />:''
                                      }
                                      {
                                        (status=='DEV_ST_ING' || status=='DEV_ST_BEG') && multiStopMode==true? //다중종료 일때는 진행중 또는 시작대기
                                        <FontAwesomeIcon
                                        icon={checkedDevices.has(device_id) ? faCheckCircle : faCircle} // 활성화된 상태에 따라 아이콘 변경
                                        className={`text-xl cursor-pointer hover:opacity-80 mr-2 mt-1`} // 색상도 바꿀 수 있음
                                        onClick={()=>checkCarClick(device_id)}
                                        />:''
                                      }
                                    
                                        [{status_value}] Car {device_id} 
                                    </span>
                                  </div>
                                  <div>
                                    <button className={`w-[40px] h-[30px] rounded-[5px] font-bold pl-3 pr-10 mr-3 cursor-pointer hover:opacity-80
                                    ${(status === 'DEV_ST_ING' || status=='DEV_ST_ERR' || status=='DEV_ST_BEG' || status=='DEV_ST_STP')? 'bg-gray-300 text-gray-400' : 'bg-white text-black'}`}
                                    //              진행중                    오류                  시작대기
                                    disabled={(status === 'DEV_ST_ING' || status=='DEV_ST_ERR' || status=='DEV_ST_BEG' || status=='DEV_ST_STP')? true:false}
                                    //              진행중                    오류                  시작대기
                                      onClick={()=>testStart(device_id)}>
                                        시작
                                      </button>
                                    <button className={`w-[40px] h-[30px] rounded-[5px] font-bold pl-3 pr-10 mr-3 cursor-pointer hover:opacity-80
                                    ${(status=='DEV_ST_RDY' || status=='DEV_ST_STP')? 'bg-gray-300 text-gray-400' : 'bg-white text-black'} `}
                                    //         대기
                                    disabled={(status=='DEV_ST_RDY' || status=='DEV_ST_STP')? true:false}
                                    //                 대기                    종료대기
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
                                  <div className="flex flex-col gap-[3px] mt-[-4px] mb-[1px] px-[3px]">
                                    <span className="text-white bg-[#31363d] p-1 box-border">
                                      {
                                        status=="DEV_ST_ERR"? //오류일때
                                        <div className="h-[24px] pl-3">{error_message}</div>:''
                                      }
                                      {
                                        status=="DEV_ST_RDY" || status=="DEV_ST_BEG" || status=="DEV_ST_ING" || status=="DEV_ST_STP"? //대기, 시작 대기, 진행중
                                        <div className="h-[24px] pl-3">{test_name}</div>:''
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
                  <button className="w-[100px] h-[50px] bg-[#135a78] text-white rounded cursor-pointer hover:opacity-80 mr-5"
                    onClick={handleDeleteLog}>
                    로그 삭제
                  </button>:
                  <div className="mr-5">
                    <button className="bg-[#135a78] text-white rounded hover:bg-blue-600 cursor-pointer hover:opacity-80 mr-5"
                    style={{ width: "100px", height: "50px" }}
                    onClick={logDeleteConfirm}>
                      완료
                    </button>
                    <button className="bg-gray-300 text-white rounded hover:bg-gray-400 cursor-pointer hover:opacity-80"
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
