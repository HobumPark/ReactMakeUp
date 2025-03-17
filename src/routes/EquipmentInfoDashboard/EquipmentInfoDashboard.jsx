import React, { useState, useRef, useEffect } from "react";
import "./EquipmentInfoDashboard.css";
import Header from "../../components/Header/Header";

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

import CardList from "../../components/CardList/CardList";

import TemperatureHum from "../../components/EquipmentInfoStatistic/TemperatureHum";

import IconVideo from "../../assets/icon/icon-db-video.svg";
import IconVideoActive from "../../assets/icon/icon-db-video-active.svg";

import IconPower from "../../assets/icon/icon-power.svg";
import SignalAbnormal from "../../assets/icon/icon-signal-abnormal.svg";
import SignalNormal from "../../assets/icon/icon-signal-normal.svg";
import IconNetwork from "../../assets/icon/icon-network.svg";
import IconHeater from "../../assets/icon/icon-heater.svg";
import IconFan from "../../assets/icon/icon-fan.svg";
import IconDoorOpen from "../../assets/icon/icon-door-open.svg";
import IconEdge from "../../assets/icon/icon-edge.svg";
import IconCameraVideo from "../../assets/icon/icon-camera-video.svg";
import VideoRecord from "../../assets/icon/icon-video.svg";
import IconTemp from "../../assets/icon/icon-temp.svg";
import IconHum from "../../assets/icon/icon-hum.svg";
import IconTempHum from "../../assets/icon/icon-db-temp-hum.svg";
import { useLocation } from "react-router-dom";
import useBox from "../../hooks/useBox";
import { useTranslation } from "react-i18next";
import { formatDateToYYYYMMDD, getLocalISOString } from "../../utils/date";
import AirDatepicker from "air-datepicker";
import localeEn from "air-datepicker/locale/en.js";
import localeKo from "air-datepicker/locale/ko.js";
import localeId from "air-datepicker/locale/id.js";
import DbVideoModal from "../../components/Modal/DbVideoModal/DbVideoModal";
import useSRDetector from "../../hooks/useSRDetector";

// ini copmponent proggresbar ya
const ProgressBar = ({ label, percentage, showLabel = true }) => {
  const getColor = () => {
    if (percentage <= 50) return "bg-[#1070C8]";
    if (percentage <= 80) return "bg-[#FFA500]";
    return "bg-[#E94545]";
  };
  const displayPercentage = percentage === null ? '0%' : `${percentage}%`;
  return (
    <div className="w-full flex flex-col gap-[5px]">
      {showLabel && (
        <div className="text-text-white title3">
          {label} <span className="title3bold">{displayPercentage}</span>
        </div>
      )}
      <div className="w-full h-[6px] bg-gray-300 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor()} transition-all duration-300`}
          style={{ width: percentage === null ? 0 : `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};
// ini copmponent proggresbar ya

const EquipmentInfoDashboard = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const rtu_id = queryParams.get('id'); 
  const [detectorData, setDetectorData] = useState(null);
  const today = new Date();
  const oneWeekAgo = new Date(today); 
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const startTime = new Date(today.getTime() - 8 * 60 * 60 * 1000);
  const [dateTime] = useState({
    start_date:getLocalISOString(startTime),
    end_date:getLocalISOString(today),
  });
  
  const [date, setDate] = useState({
    start_date:formatDateToYYYYMMDD(oneWeekAgo),
    end_date:formatDateToYYYYMMDD(today),
  });
  const [inputValue, setInputValue] = useState("");

  // ini buat filtering btnevent ya fren

  const [selectBtnFilter, setSelectBtnFilter] = useState({
    EVT_TP_TMP: false,
    EVT_TP_HUM: false,
    EVT_TP_NW: false,
    EVT_TP_DO: false,
    EVT_TP_PW: false,
  });

  const eventTypeMap = {
    EVT_TP_TMP: "EVT_TP_TMP",
    EVT_TP_HUM: "EVT_TP_HUM",
    EVT_TP_NW: "EVT_TP_NW",
    EVT_TP_DO: "EVT_TP_DO",
    EVT_TP_PW: "EVT_TP_PW",
  };

  const eventTypes = Object.keys(eventTypeMap);

  const handleBtnFilter = (button) => {
    setSelectBtnFilter((prev) => ({
      ...prev,
      [button]: !prev[button],
    }));
  };

  // ini buat filtering btnevent ya fren
  
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
      position: "bottom left",
      selectedDates: [oneWeekAgo],
      dateFormat: "yyyy-MM-dd",
      onSelect: (date) => {
        setDate((prevValues) => ({
          ...prevValues,
          start_date: date.formattedDate,
        }));
      },
    };

    const optionsDateSecond = {
      autoClose: true,
      locale: locale,
      position: "bottom right",
      selectedDates: [today],
      dateFormat: "yyyy-MM-dd",
      onSelect: (date) => {
        setDate((prevValues) => ({
          ...prevValues,
          end_date: date.formattedDate,
        }));
      },
    };

    const datepicker1 = new AirDatepicker('[name="start_date"]', optionsDate);
    const datepicker2 = new AirDatepicker('[name="end_date"]',optionsDateSecond);

    return () => {
      datepicker1.destroy();
      datepicker2.destroy();
    };
  }, [i18n.language]);


  const [ boxEventParams, setBoxEventParams ] = useState(`start_time=${date.start_date}&end_time=${date.end_date}&event_type=${eventTypes.join("&event_type=")}`);

  const { boxData, boxStatusData, BoxEventDataList, boxEventCntData, boxTempHumData, boxCommand, mosCommand } = useBox({
    id: rtu_id,
    boxTempHumpParams: `start_time=${dateTime.start_date}&end_time=${dateTime.end_date}`,
    boxEventParams: boxEventParams
  })
  
  const box = boxData?.data[0];
  const boxStatus = boxStatusData?.data;
  const boxEvent = BoxEventDataList?.data;
  const boxEventCnt = boxEventCntData?.data[0];
  const boxTempHump = boxTempHumData?.data;
  const site_id = boxStatus?.site_id;

  const { srDetector }  = useSRDetector({
    id: site_id
  });

  const siteRoadDetector = srDetector?.data;
  const [isOn, setIsOn] = useState(false);
  const [isOnFan, setIsOnFan] = useState(false);

  const updateStatus = (status) => status === '203002';

  useEffect(() => {
    setIsOnFan(updateStatus(boxStatus?.fan_status));
    setIsOn(updateStatus(boxStatus?.heater_status));
  }, [boxStatus]);


  const mapRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const iconFeatureRef = useRef(null);
  
  
  //Ini Map
  useEffect(() => {
    if (!mapRef.current) return;

    const olMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([siteRoadDetector?.lng, siteRoadDetector?.lat]),
        zoom: 18,
      }),
    });

    const vectorSource = new VectorSource();
    siteRoadDetector?.roads?.forEach((road) => {
      if (road.detector) {
        const { lat, lng } = road.detector;
    
        const iconFeature = new Feature({
          geometry: new Point(fromLonLat([lng, lat])), 
        });
    
        iconFeature.setStyle(
          new Style({
            image: new Icon({
              src: IconVideo,
              scale: 1,
            }),
          })
        );
        vectorSource.addFeature(iconFeature);
      }
    });
    

    const vectorLayer = new VectorLayer({
      source: vectorSource, 
    });
    
    olMap.addLayer(vectorLayer);

    // Tambahkan event listener klik
    olMap.on("click", (event) => {
      olMap.forEachFeatureAtPixel(event.pixel, (feature) => {
        if (feature === iconFeatureRef.current) {
          // Ambil ikon saat ini
          const currentIcon = feature.getStyle().getImage().getSrc();
          // Toggle ikon
          feature.setStyle(
            new Style({
              image: new Icon({
                src: currentIcon === IconVideo ? IconVideoActive : IconVideo,
                scale: 1,
              }),
            })
          );
        }
      });
    });

    return () => {
      olMap.setTarget(null);
    };
  }, [srDetector]); 


  useEffect(() => {
    const resultInput = inputValue ? `input=${inputValue}` : "";
    const dateParams = `start_date=${date.start_date}&end_date=${date.end_date}`;
  
    const eventType = Object.keys(selectBtnFilter)
      .filter((key) => !selectBtnFilter[key]) 
      .map((key) => eventTypeMap[key]);
  
    const resultSelect = eventType.length > 0 ? `&event_type=${eventType.join("&event_type=")}` : "";
    
    const result = `${resultInput}&${dateParams}&${resultSelect}`;
    setBoxEventParams(result);
  }, [selectBtnFilter, inputValue,date]);  


  const eventData = boxEvent?.map((event, index) => {
    let customCard = '';
    let subtitle = '';
    let title = '';
    const eventType = t(event.type);
    const doorOpen = t(event.front_door_status);
    const power = event.ac_24v_input_volt ? 'ON' : 'OFF';
    const network = t(event.network_status);

    if (event.type === "EVT_TP_TMP") {
      title = event.site_name
      customCard = "border-[#135A78]";
      subtitle = `${eventType} | ${event.temp} ℃`;
    } else if (event.type === "EVT_TP_HUM") {
      title = event.site_name
      customCard = "border-[#1D7E46]";
      subtitle = `${eventType} | ${event.hum} %`;
    } else if (event.type === "EVT_TP_NW") {
      title = event.site_name
      customCard = "border-[#D32F2F]";
      subtitle = `${eventType} | ${network}`;
    } else if (event.type === "EVT_TP_DO") {
      title = event.site_name
      customCard = "border-[#F35A19]";
      subtitle = `${eventType} | ${doorOpen}`;
    } else if (event.type === "EVT_TP_PW") {
      title = event.site_name
      customCard = "border-[#EE9F17]";
      subtitle = `${eventType} | ${power}`;
    } else {
      title = event.site_name
      customCard = "border-[#000]";
      subtitle = "알 수 없는 이벤트";
    }

    return {
      ...event,
      title,
      customCard,
      subtitle,
      date: event.occurred_time, 
      index
    };
  });

  const openModal = (road) => {
    const { name, detector } = road;
    setDetectorData({
      road_name: name,
      stream_url: detector.stream_url,  
    });
    setShowModal(true);  
  };


  const handleRestart = (type, { target, action }) => {
    const command = {
      target,
      action,
    };

    boxCommand(rtu_id,command)

  };

  const handlePowerHeater = () => {
    if(isOn){
      setIsOn(!isOn)
      const command = {
        target: boxStatus?.heater_mos,
        action: 'Off'
      }
      console.log(command);
      mosCommand(site_id,command)
    }else {
      setIsOn(true)
      const command = {
        target: boxStatus?.heater_mos,
        action: 'On'
      }
      console.log(command);
      mosCommand(site_id,command)
    }
  };

  const handlePowerFan = () => {
    if(isOnFan){
      setIsOnFan(!isOnFan)
      const command = {
        target: boxStatus?.fan_mos,
        action: 'Off'
      }
      console.log(command);
      mosCommand(site_id,command)
    }else {
      setIsOnFan(true)
      const command = {
        target: boxStatus?.fan_mos,
        action: 'On'
      }
      console.log(command);
      // mosCommand(site_id,command)
    }
  };


  return (
    <>
      <section className="_EquipmentInfContainer w-full h-screen overflow-hidden flex flex-col bg-bg-grey-400">
        <Header />

        <div className="_layoutEquipment w-full h-[calc(100%-60px)] flex flex-row gap-[10px] p-[10px] overflow-hidden">
          {/* left */}
          <section className="leftEq flex! flex-col gap-[10px] w-[25%] h-full overflow-hidden  rounded-[5px]">
            <div className="contentTopLeft w-full flex flex-col flex-1/14 h-full bg-[#212527] overflow-hidden rounded-[5px]">
              <div className="bg-header-content w-full h-[36px] flex items-center px-[15px]">
                <span className="title3bold text-text-white">함체 현황</span>
              </div>
              <div className="w-full h-[calc(100%-30px)] grid grid-cols-2 gap-[8px]  overflow-auto p-[10px]">
                <div className="bx-card-status w-full flex-row h-full justify-center flex flex-col gap-[5px] px-[10px] py-[4px] border border-[#4D5152] bg-[#2D3238] rounded-[5px]">
                  <div className="flex w-full justify-between flex-row gap-[3px] items-center">
                    <div className="flex flex-row gap-[5px] items-center">
                      <img
                        src={IconPower}
                        alt=""
                        className="w-[35px] h-[35px]"
                      />
                      <span className="title2bold text-text-white">Power</span>
                    </div>
                  </div>
                  <div className="flex w-full flex-col justify-between flex-row gap-[3px] items-center">
                    <div className="ml-auto flex flex-col justify-end items-end">
                      <span className="title2bold text-text-danger-400">
                      {(boxStatus?.ac_24v_input_volt === null || boxStatus?.ac_24v_input_volt === 0) ? 'OFF' : 'ON'}
                      </span>
                      <span className="title2bold text-text-white">
                        {boxStatus?.ac_24v_input_volt} Volt
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bx-card-status w-full flex-row h-full justify-center flex flex-col gap-[5px] px-[10px] py-[6px] border border-[#4D5152] bg-[#2D3238] rounded-[5px]">
                  <div className="flex w-full justify-between flex-row gap-[3px] items-center">
                    <div className="flex flex-row gap-[5px] items-center">
                      <img
                        src={IconNetwork}
                        alt=""
                        className="w-[35px] h-[35px]"
                      />
                      <span className="title2bold text-text-white">
                        Network
                      </span>
                    </div>
                  </div>
                  <div className="flex w-full flex-col justify-between flex-row gap-[3px] items-center">
                    <div className="ml-auto flex flex-col justify-end items-end">
                      <span className="title2bold text-text-danger-400">
                        {t(boxStatus?.network_status)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bx-card-status w-full flex-row h-full justify-center flex flex-col gap-[5px] px-[10px] py-[6px] border border-[#4D5152] bg-[#2D3238] rounded-[5px]">
                  <div className="flex w-full justify-between flex-row gap-[3px] items-center">
                    <div className="flex flex-row gap-[5px] items-center">
                      <img
                        src={IconTempHum}
                        alt=""
                        className="w-[35px] h-[35px]"
                      />
                      <div className="flex flex-col">
                        <span className="title2bold text-text-white">Temp</span>
                        <span className="title2bold text-text-white">Hum</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full flex-col justify-between flex-row gap-[3px] items-center">
                    <div className="ml-auto flex flex-col justify-end items-end">
                      <span className="title2bold text-[#8AC63F]">{boxStatus?.temp}°C </span>
                      <span className="title2bold text-text-white"> {boxStatus?.hum}%</span>
                    </div>
                  </div>
                </div>

                <div className="bx-card-status w-full flex-row h-full justify-center flex flex-col gap-[5px] px-[10px] py-[6px] border border-[#4D5152] bg-[#2D3238] rounded-[5px]">
                  <div className="flex w-full justify-between flex-row gap-[3px] items-center">
                    <div className="flex flex-row gap-[5px] items-center">
                      <img
                        src={IconHeater}
                        alt=""
                        className="w-[35px] h-[35px]"
                      />
                      <span className="title2bold text-text-white">Heater</span>
                    </div>
                  </div>
                  <div className="flex w-full flex-col justify-between flex-row gap-[3px] items-center">
                    <div className="ml-auto flex flex-col justify-end items-end">
                      <div
                        className={`w-14 h-8 flex items-center px-1 rounded-full cursor-pointer transition-all duration-300 ${
                          isOn ? "bg-[#8AC63F]" : "bg-[#BBC0C7]"
                        }`}
                        onClick={() => handlePowerHeater()}
                      >
                        <div
                          className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-300 ${
                            isOn ? "translate-x-6" : "translate-x-0"
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bx-card-status w-full flex-row h-full justify-center flex flex-col gap-[5px] px-[10px] py-[6px] border border-[#4D5152] bg-[#2D3238] rounded-[5px]">
                  <div className="flex w-full justify-between flex-row gap-[3px] items-center">
                    <div className="flex flex-row gap-[5px] items-center">
                      <img
                        src={IconDoorOpen}
                        alt=""
                        className="w-[35px] h-[35px]"
                      />
                      <span className="title2bold text-text-white">
                        Door Open
                      </span>
                    </div>
                  </div>
            
                  <div className="flex w-fit flex-col justify-between flex-row gap-[3px] items-center">
                    <div className="ml-auto w-full flex flex-col justify-center items-center bg-bg-grey-500 rounded-[5px] p-[5px]">
                      <span className="title3 text-text-white">{boxStatus?.back_door_status === '204001' ? 'ON' : 'OFF'} </span>
                      <span className="title3bold text-text-danger-400 ">
                        {t(boxStatus?.back_door_status)}
                      </span>
                    </div>
                  </div>
                </div>


                <div className="bx-card-status w-full flex-row h-full justify-center flex flex-col gap-[5px] px-[10px] py-[6px] border border-[#4D5152] bg-[#2D3238] rounded-[5px]">
                  <div className="flex w-full justify-between flex-row gap-[3px] items-center">
                    <div className="flex flex-row gap-[5px] items-center">
                      <img src={IconFan} alt="" className="w-[35px] h-[35px]" />
                      <span className="title2bold text-text-white">Fan</span>
                    </div>
                  </div>
                  <div className="flex w-full flex-col justify-between flex-row gap-[3px] items-center">
                    <div className="ml-auto flex flex-col justify-end items-end">
                      <div
                        className={`w-14 h-8 flex items-center px-1 rounded-full cursor-pointer transition-all duration-300 ${
                          isOnFan ? "bg-[#8AC63F]" : "bg-[#BBC0C7]"
                        }`}
                        onClick={() => handlePowerFan()}
                      >
                        <div
                          className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-300 ${
                            isOnFan ? "translate-x-6" : "translate-x-0"
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>



                <div className="bx-card-status w-full h-full col-span-2 row-span-4 justify-center flex flex-col gap-[5px] px-[10px] py-[6px] border border-[#4D5152] bg-[#2D3238] rounded-[5px]">
                  <div className="flex w-full justify-between flex-row gap-[3px] items-center">
                    <div className="flex flex-row gap-[8px] items-center">
                      <img
                        src={IconEdge}
                        alt=""
                        className="w-[35px] h-[35px]"
                      />
                      <span className="title2bold text-text-white">Edge</span>
                    </div>
                    <div className="ml-auto flex flex-col  gap-[5px] justify-end items-end">
                      <span className="title2bold text-text-white"> {t(boxStatus?.edge1_network_status)}</span>
                      <button className="body2bold text-text-white min-w-[73px] py-[3px] bg-[#1070C8] rounded-[3px]"  onClick={() => handleRestart('edge', { target: 'AC24V', action: 'ON'})} >
                        Restart
                      </button>
                    </div>
                  </div>

                  <div className="_bxStorage flex flex-col justify-around h-full gap-[5px]">
                    <ProgressBar label="CPU" percentage={boxStatus?.edge1_cpu} />
                    <ProgressBar label="RAM" percentage={boxStatus?.edge1_memory} />
                    <ProgressBar label="Storage" percentage={boxStatus?.edge1_disk_used} />
                    <div className="flex flex-row gap-[2px]">
                      <span className="title3bold text-text-white mr-2">{!boxStatus?.edge_disk ? '-' : boxStatus?.edge_disk}</span>
                      <span className="title3 text-text-white">free of</span>
                      <span className="title3bold text-text-white ml-2">{!boxStatus?.edge_disk_size ? '-' : boxStatus?.edge_disk_size}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="contentBottomLeft w-full flex flex-col flex-1 h-full bg-[#212527] overflow-hidden rounded-[5px]">
              <div className="bg-header-content w-full flex flex-row justify-between h-[36px] flex items-center px-[15px]">
                <span className="title3bold text-text-white">레이더 현황</span>
                <span className="title3bold text-text-white">총 4개</span>
              </div>
              <div className="w-full h-[calc(100%-30px)] grid grid-cols-1 gap-[8px]  overflow-auto p-[10px]">
              {siteRoadDetector?.roads?.map((road, index) => (
                      road?.detector && (
                        <div key={index} className="bx-card-status w-full flex-row h-full justify-center flex flex-col gap-[5px] px-[10px] py-[6px] border border-[#4D5152] bg-[#2D3238] rounded-[5px]">
                          <div className="flex w-full justify-between flex-row gap-[3px] items-center">
                            <div className="flex flex-row gap-[5px] items-center">
                              <img
                                src={IconCameraVideo}
                                alt=""
                                className="w-[35px] h-[35px]"
                              />
                              <div className="flex flex-col">
                                <span className="title2bold text-text-white whitespace-nowrap">
                                  {road?.name} 
                                </span>
                                <span className="title2 text-text-white">
                                {road?.detector?.installed_date} 
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex w-full flex-col justify-between flex-row gap-[3px] items-center">
                            <div className="ml-auto flex flex-col justify-end items-end">
                              <span className="title2bold text-text-white">  {t(road?.detector?.network_status)}</span> 
                              <div className="ml-auto flex flex-row gap-[5px]">
                                <button className="body2bold text-text-white px-[8px] py-[3px] bg-[#1070C8] rounded-[3px]" onClick={() => openModal(road)}>
                                  <img src={VideoRecord} alt="" />
                                </button>
                                <button className="body2bold text-text-white min-w-[73px] py-[3px] bg-[#1070C8] rounded-[3px]" onClick={() => handleRestart('box', { target: road?.detector?.power_ch, action: 'ON'})}>
                                  Restart
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    ))}


              </div>
            </div>
          </section>
          {/* end left */}

          {/* center */}
          <section className="centerEq flex! flex-col gap-[10px] flex-1/6 h-full overflow-hidden rounded-[5px]">
            <div className="contentTopLeft w-full flex flex-col flex-1/14 h-full bg-[#212527] overflow-hidden rounded-[5px]">
              <div className="bg-header-content w-full h-[36px] flex items-center px-[15px]">
                <span className="title3bold text-text-white">
                  삼성역 사거리 교차로
                </span>
              </div>
              {/* maps coy */}
              <div className="_bxPageMap w-full flex overflow-hidden h-[calc(100%-35px)]">
                <div
                  ref={mapRef}
                  className="_maps_accessRoad w-full h-full relative"
                ></div>
              </div>
              {/* maps coy */}
            </div>
            <div className="contentBottomLeft w-full flex flex-col gap-[10px] flex-1 h-full  overflow-hidden rounded-[5px]">
              <div className="_contentDetailCenter bg-[#212527] w-full flex-1 flex-col rounded-[5px] h-full overflow-hidden">
                <div className="bg-header-content w-full h-[36px] flex items-center px-[15px]">
                  <span className="title3bold text-text-white">함체 정보</span>
                </div>
                <div className="flex flex-col gap-[5px] h-[calc(100%-40px)] overflow-auto p-[10px] justify-between">
                  <div className="_groupDetailInfo w-full grid grid-cols-3 gap-x-[5px]">
                    <div className="flex flex-1 flex-row gap-[5px] items-baseline">
                      <span className="text-text-white body2  min-w-[160px]">
                        함체 ID
                      </span>
                      <span className="text-text-white title3bold">{box?.remote_terminal_unit_id}</span>
                    </div>
                    <div className="flex flex-1 flex-row gap-[5px] items-baseline">
                      <span className="text-text-white body2  min-w-[160px]">
                        명칭
                      </span>
                      <span className="text-text-white title3bold">
                        {box?.name}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-row gap-[5px] items-baseline">
                      <span className="text-text-white body2  min-w-[160px]">
                        매핑 사이트
                      </span>
                      <span className="text-text-white title3bold">
                        {box?.site_name}({box?.site_id})
                      </span>
                    </div>
                    <div className="flex flex-1 flex-row gap-[5px] items-baseline">
                      <span className="text-text-white body2  min-w-[160px]">
                        설치 위/경도
                      </span>
                      <span className="text-text-white title3bold">
                        {box?.lat} / {box?.lng}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-row gap-[5px] items-baseline">
                      <span className="text-text-white body2  min-w-[160px]">
                        설치 일시
                      </span>
                      <span className="text-text-white title3bold">
                        {box?.installed_date}
                      </span>
                    </div>
                  </div>
                  <div className="w-full flex">

                  <div className="_lineDivider w-full h-[0.5px] flex bg-[#CACACA]"></div>
                  </div>


                  <div className="_groupDetailInfo w-full grid grid-cols-3 gap-x-[5px] gap-y-[5px] ">
                    <div className="flex flex-1 flex-row gap-[5px] items-baseline">
                      <span className="text-text-white body2  min-w-[160px]">
                        Edge IP
                      </span>
                      <span className="text-text-white title3bold">
                        {box?.edge1_ip}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-row gap-[5px] items-baseline">
                      <span className="text-text-white body2  min-w-[160px]">
                        Switch IP
                      </span>
                      <span className="text-text-white title3bold">
                        {box?.switch_ip}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-row gap-[5px] items-baseline">
                      <span className="text-text-white body2  min-w-[160px]">
                        Router IP
                      </span>
                      <span className="text-text-white title3bold">
                        {box?.router_ip}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-row gap-[5px] items-baseline">
                      <span className="text-text-white body2  min-w-[160px]">
                       Env Board IP/Port
                      </span>
                      <span className="text-text-white title3bold">
                        {box?.env_board_ip}:{box?.env_board_port}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-row gap-[5px] items-baseline">
                      <span className="text-text-white body2  min-w-[160px]">
                        Env Board Mac address
                      </span>
                      <span className="text-text-white title3bold">
                        {box?.env_board_mac}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="_contentDetailCenter bg-[#212527] w-full flex-1 flex-col h-full rounded-[5px] overflow-hidden">
                <div className="bg-header-content w-full h-[36px] flex items-center px-[15px]">
                  <span className="title3bold text-text-white">온/습도</span>
                </div>
                <div className="flex flex-col w-full p-[10px]  h-full overflow-hidden">
                  <TemperatureHum data={boxTempHump}/>
                </div>
              </div>
            </div>
         
          </section>
          {/* center */}

          {/* right */}
          <section className="rightEq flex! flex-col gap-[10px] w-[21%] h-full  overflow-hidden rounded-[5px]">
            <div className="contentTopLeft w-full flex flex-col  bg-[#212527] overflow-hidden rounded-[5px]">
              <div className="bg-header-content w-full flex flex-row justify-between h-[36px] flex items-center px-[15px]">
                <span className="title3bold text-text-white">
                  금일 이벤트 현황
                </span>
                <span className="title3bold text-text-white">{boxEventCnt ? Object.values(boxEventCnt).reduce((sum, value) => sum + value, 0) : 0}</span>
              </div>
              <div className="w-full grid grid-cols-6 gap-[5px] items-center p-[10px]">
                <div className="bx-card-status col-span-3 w-full h-full justify-center items-center flex flex-col gap-[5px] p-[10px] border border-[#4D5152] bg-[#2D3238]">
                  <span className="title3bold text-text-white">네트워크 </span>
                  <div className="w-full flex flex-row gap-[5px] justify-center items-center">
                    <img src={IconNetwork} alt="" />
                    <span className="text-text-white title3bold">/</span>
                    <span className="text-text-white title3bold">{boxEventCnt?.EVT_TP_NW}</span>
                  </div>
                </div>
                <div className="bx-card-status col-span-3 w-full h-full justify-center items-center flex flex-col gap-[5px] p-[10px] border border-[#4D5152] bg-[#2D3238]">
                  <span className="title3bold text-text-white">전원</span>
                  <div className="w-full flex flex-row gap-[5px] justify-center items-center">
                    <img src={IconPower} alt="" />
                    <span className="text-text-white title3bold">/</span>
                    <span className="text-text-white title3bold">{boxEventCnt?.EVT_TP_PW}</span>
                  </div>
                </div>
                <div className="bx-card-status col-span-2 w-full h-full justify-center items-center flex flex-col gap-[5px] p-[10px] border border-[#4D5152] bg-[#2D3238]">
                  <span className="title3bold text-text-white">온도</span>
                  <div className="w-full flex flex-row gap-[5px] justify-center items-center">
                    <img src={IconTemp} alt="" />
                    <span className="text-text-white title3bold">/</span>
                    <span className="text-text-white title3bold">{boxEventCnt?.EVT_TP_TMP}</span>
                  </div>
                </div>
                <div className="bx-card-status col-span-2 w-full h-full justify-center items-center flex flex-col gap-[5px] p-[10px] border border-[#4D5152] bg-[#2D3238]">
                  <span className="title3bold text-text-white">습도</span>
                  <div className="w-full flex flex-row gap-[5px] justify-center items-center">
                    <img src={IconHum} alt="" />
                    <span className="text-text-white title3bold">/</span>
                    <span className="text-text-white title3bold">{boxEventCnt?.EVT_TP_HUM}</span>
                  </div>
                </div>
                <div className="bx-card-status col-span-2 w-full h-full justify-center items-center flex flex-col gap-[5px] p-[10px] border border-[#4D5152] bg-[#2D3238]">
                  <span className="title3bold text-text-white">문열림</span>
                  <div className="w-full flex flex-row gap-[5px] justify-center items-center">
                    <img src={IconDoorOpen} alt="" />
                    <span className="text-text-white title3bold">/</span>
                    <span className="text-text-white title3bold">{boxEventCnt?.EVT_TP_DO}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="contentBottomLeft w-full flex flex-col flex-1/2 h-full bg-[#212527] overflow-hidden rounded-[5px]">
              <div className="bg-header-content w-full h-[36px] flex items-center px-[15px]">
                <span className="title3bold text-text-white">
                  이벤트 리스트
                </span>
              </div>
              <div className="w-full h-full flex flex-col gap-[15px] p-[10px] overflow-hidden">
                <div className="_groupInfoDate flex flex-col gap-[10px]">
                  <div className="w-full flex flex-row gap-[8px] items-center">
                    <input
                      type="text"
                      className="input-db-date"
                      name="start_date"
                      value={date.start_date}
                      readOnly={true}
                    />
                    <span className="text-text-white">-</span>
                    <input
                      type="text"
                      className="input-db-date"
                      value={date.end_date}
                      name="end_date"
                      readOnly={true}
                    />
                  </div>
                  <input
                    type="text"
                    className="input-db-text w-full"
                    placeholder="Search, Number Event"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </div>

                <div className="groupFilteringBtn grid grid-cols-5 gap-[5px]">
                  {/* <button class="w-full title3 py-[5px] border bg-[#135A78] text-text-white border-[#135A78]">온도</button> */}
                  <button
                    className={`w-full title3 py-[5px] border ${
                      selectBtnFilter.EVT_TP_TMP
                        ? "bg-transparent text-white border-[#135A78]"
                        : "bg-[#135A78] text-white border-[#135A78]"
                    }`}
                    onClick={() => handleBtnFilter("EVT_TP_TMP")}
                  >
                    온도
                  </button>

                  <button
                    className={`w-full title3 py-[5px] border ${
                      selectBtnFilter.EVT_TP_HUM
                        ? "bg-transparent text-white border-[#1D7E46]"
                        : "bg-[#1D7E46] text-white border-[#1D7E46]"
                    }`}
                    onClick={() => handleBtnFilter("EVT_TP_HUM")}
                  >
                    습도
                  </button>

                  <button
                    className={`w-full title3 py-[5px] border ${
                      selectBtnFilter.EVT_TP_NW
                        ? "bg-transparent text-white border-[#D32F2F]"
                        : "bg-[#D32F2F] text-white border-[#D32F2F]"
                    }`}
                    onClick={() => handleBtnFilter("EVT_TP_NW")}
                  >
                    네트워크
                  </button>

                  <button
                    className={`w-full title3 py-[5px] border ${
                      selectBtnFilter.EVT_TP_DO
                        ? "bg-transparent text-white border-[#F35A19]"
                        : "bg-[#F35A19] text-white border-[#F35A19]"
                    }`}
                    onClick={() => handleBtnFilter("EVT_TP_DO")}
                  >
                    교차로
                  </button>

                  <button
                    className={`w-full title3 py-[5px] border ${
                      selectBtnFilter.EVT_TP_PW
                        ? "bg-transparent text-white border-[#EE9F17]"
                        : "bg-[#EE9F17] text-white border-[#EE9F17]"
                    }`}
                    onClick={() => handleBtnFilter("EVT_TP_PW")}
                  >
                    전원
                  </button>
                </div>

                <div className="_bxCardEventList w-full flex flex-col gap-[3px] h-full  overflow-auto">
                {eventData?.map((event,index) => (
                    <CardList
                      key={index}
                      type="event"
                      title={event.title}
                      showID={true}
                      // id={event.event_id}
                      customCard={event.customCard}
                      subtitle={event.subtitle}
                      date={event.date}
                    />
                ))}
                </div>
              </div>
            </div>
          </section>
          {/* end right */}
        </div>
      </section>
      {showModal && <DbVideoModal data= {detectorData} currentPage={'equipment'} onClose={() => setShowModal(false)} />}
    </>
  );
};

export default EquipmentInfoDashboard;
