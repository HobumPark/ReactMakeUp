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

// ini copmponent proggresbar ya
const ProgressBar = ({ label, percentage, showLabel = true }) => {
  const getColor = () => {
    if (percentage <= 50) return "bg-[#1070C8]";
    if (percentage <= 80) return "bg-[#FFA500]";
    return "bg-[#E94545]";
  };

  return (
    <div className="w-full flex flex-col gap-[5px]">
      {showLabel && (
        <div className="text-text-white title3">
          {label} <span className="title3bold">{percentage}%</span>
        </div>
      )}
      <div className="w-full h-[6px] bg-gray-300 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor()} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};
// ini copmponent proggresbar ya

const EquipmentInfoDashboard = () => {
  const [isOn, setIsOn] = useState(false);
  const [isOnFan, setIsOnFan] = useState(false);

  const mapRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const iconFeatureRef = useRef(null);

  // ini buat filtering btnevent ya fren

  const [selectBtnFilter, setSelectBtnFilter] = useState({
    btnTemperature: false,
    btnHumidity: false,
    btnNetwork: false,
    btnDoorOpen: false,
    btnPower: false,
  });

  const handleBtnFilter = (button) => {
    setSelectBtnFilter((prev) => ({
      ...prev,
      [button]: !prev[button],
    }));
  };

  // ini buat filtering btnevent ya fren

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
        center: fromLonLat([106.8456, -6.2088]),
        zoom: 10,
      }),
    });

    // Buat ikon pertama
    const iconFeature = new Feature({
      geometry: new Point(fromLonLat([106.8456, -6.2088])),
    });

    iconFeature.setStyle(
      new Style({
        image: new Icon({
          src: IconVideo, // Ikon default
          scale: 1,
        }),
      })
    );

    iconFeatureRef.current = iconFeature; // Simpan referensi ikon

    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [iconFeature],
      }),
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
  }, []); // Tidak ada dependensi agar tidak re-render ulang

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
                <div className="bx-card-status w-full h-full justify-center flex flex-col gap-[5px] px-[10px] py-[4px] border border-[#4D5152] bg-[#2D3238] rounded-[5px]">
                  <div className="flex w-full justify-between flex-row gap-[3px] items-center">
                    <div className="flex flex-row gap-[8px] items-center">
                      <img src={IconPower} alt="" />
                      <span className="title3bold text-text-danger-400">
                        OFF
                      </span>
                    </div>
                    <div className="ml-auto">
                      <img src={SignalAbnormal} alt="" srcset="" />
                    </div>
                  </div>
                  <div className="flex w-full justify-between flex-row gap-[3px] items-center">
                    <div className="flex flex-row gap-[8px] items-center">
                      <span className="title3bold text-text-white">OFF</span>
                    </div>
                    <div className="ml-auto">
                      <span className="title3bold text-text-white">
                        199 Volt
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bx-card-status w-full h-full justify-center flex flex-col gap-[5px] px-[10px] py-[4px] border border-[#4D5152] bg-[#2D3238] rounded-[5px]">
                  <div className="flex w-full justify-between flex-row gap-[3px] items-center">
                    <div className="flex flex-col gap-[8px] items-start">
                      <div className="flex flex-row w-fit gap-[8px] items-center">
                        <img src={IconNetwork} alt="" srcset="" />
                        <span className="title3bold text-text-white">ON</span>
                      </div>
                      <span className="title3bold text-text-white">
                        Network
                      </span>
                    </div>
                    <div className="ml-auto">
                      <img src={SignalNormal} alt="" />
                    </div>
                  </div>
                </div>

                <div className="bx-card-status w-full h-full justify-center flex flex-col gap-[5px] px-[10px] py-[4px] border border-[#4D5152] bg-[#2D3238] rounded-[5px]">
                  <div className="flex w-full justify-between flex-row gap-[3px] items-center">
                    <div className="flex flex-row gap-[8px] items-center">
                      <img src={IconPower} alt="" />
                    </div>
                    <div className="ml-auto">
                      <span className="title3bold text-text-danger-400">
                        Abnormal
                      </span>
                    </div>
                  </div>
                  <div className="flex w-full justify-between flex-row gap-[3px] items-center">
                    <div className="flex flex-row gap-[8px] items-center">
                      <span className="title3bold text-text-white">
                        Temp / Hum
                      </span>
                    </div>
                    <div className="ml-auto flex flex-row gap-[5px]">
                      <span className="body2bold text-text-white">75°C</span>
                      <span className="body2bold text-text-white">/</span>
                      <span className="body2bold text-text-danger-400">
                        50%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bx-card-status w-full h-full justify-center flex flex-col gap-[5px] px-[10px] py-[4px] border border-[#4D5152] bg-[#2D3238] rounded-[5px]">
                  <div className="flex w-full justify-between flex-row gap-[3px] items-center">
                    <div className="flex flex-col gap-[8px] items-start">
                      <div className="flex flex-row w-fit gap-[8px] items-center">
                        <img src={IconHeater} alt="" srcset="" />
                      </div>
                      <span className="title3bold text-text-white">Heater</span>
                    </div>
                    <div className="ml-auto">
                      <div
                        className={`w-14 h-8 flex items-center px-1 rounded-full cursor-pointer transition-all duration-300 ${
                          isOn ? "bg-[#8AC63F]" : "bg-[#BBC0C7]"
                        }`}
                        onClick={() => setIsOn(!isOn)}
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

                <div className="bx-card-status w-full h-full justify-center flex flex-col gap-[5px] px-[10px] py-[4px] border border-[#4D5152] bg-[#2D3238] rounded-[5px]">
                  <div className="flex w-full justify-between flex-row gap-[3px] items-center">
                    <div className="flex flex-col gap-[8px] items-start">
                      <div className="flex flex-row w-fit gap-[8px] items-center">
                        <img src={IconDoorOpen} alt="" srcset="" />
                      </div>
                      <span className="title3bold text-text-white">
                        Door Open
                      </span>
                    </div>
                    <div className="ml-auto flex flex-row items-center h-full gap-[5px]">
                      <div className="bg-[#31373E] p-[6px] gap-[5px] w-full h-full flex items-center flex-col rounded-[5px]">
                        <span className="body2 text-text-white">Front</span>
                        <span className="body2bold text-text-danger-400 ">
                          Open
                        </span>
                      </div>
                      <div className="bg-[#31373E] p-[6px] gap-[5px] w-full h-full flex items-center flex-col rounded-[5px]">
                        <span className="body2 text-text-white">Front</span>
                        <span className="body2bold text-text-white ">Open</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bx-card-status w-full h-full justify-center flex flex-col gap-[5px] px-[10px] py-[4px] border border-[#4D5152] bg-[#2D3238] rounded-[5px]">
                  <div className="flex w-full justify-between flex-row gap-[3px] items-center">
                    <div className="flex flex-col gap-[8px] items-start">
                      <div className="flex flex-row w-fit gap-[8px] items-center">
                        <img src={IconFan} alt="" srcset="" />
                      </div>
                      <span className="title3bold text-text-white">Fan</span>
                    </div>
                    <div className="ml-auto">
                      <div
                        className={`w-14 h-8 flex items-center px-1 rounded-full cursor-pointer transition-all duration-300 ${
                          isOnFan ? "bg-[#8AC63F]" : "bg-[#BBC0C7]"
                        }`}
                        onClick={() => setIsOnFan(!isOnFan)}
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

                <div className="bx-card-status w-full h-full col-span-2 row-span-4 justify-center flex flex-col gap-[5px] px-[10px] py-[4px] border border-[#4D5152] bg-[#2D3238] rounded-[5px]">
                  <div className="flex w-full justify-between flex-row gap-[3px] items-center">
                    <div className="flex flex-row gap-[8px] items-center">
                      <img src={IconEdge} alt="" />
                      <span className="title3bold text-text-white">OFF</span>
                    </div>
                    <div className="ml-auto">
                      <img src={SignalAbnormal} alt="" srcset="" />
                    </div>
                  </div>
                  <div className="flex w-full justify-between flex-row gap-[3px] items-center">
                    <div className="flex flex-row gap-[8px] items-center">
                      <span className="title3bold text-text-white">Edge</span>
                    </div>
                    <div className="ml-auto">
                      <button className="body2bold text-text-white min-w-[73px] py-[3px] bg-[#1070C8] rounded-[3px]">
                        Restart
                      </button>
                    </div>
                  </div>
                  <div className="_bxStorage flex flex-col gap-[5px]">
                    <ProgressBar label="CPU" percentage={40} />
                    <ProgressBar label="RAM" percentage={60} />
                    <ProgressBar label="Storage" percentage={90} />
                    <div className="flex flex-row gap-[2px]">
                      <span className="title3bold text-text-white">241</span>
                      <span className="title3 text-text-white">free of</span>
                      <span className="title3bold text-text-white">480GB</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="contentBottomLeft w-full flex flex-col flex-1 h-full bg-[#212527] overflow-hidden rounded-[5px]">
              <div className="bg-header-content w-full h-[36px] flex items-center px-[15px]">
                <span className="title3bold text-text-white">레이더 현황</span>
              </div>
              <div className="w-full h-[calc(100%-30px)] grid grid-cols-1 gap-[8px]  overflow-auto p-[10px]">
                <div className="bx-card-status w-full h-full justify-center flex flex-col gap-[5px] px-[10px] py-[3px] border border-[#4D5152] bg-[#2D3238] rounded-[5px]">
                  <div className="flex w-full justify-between flex-row gap-[3px] items-center">
                    <div className="flex flex-row gap-[8px] items-center">
                      <img src={IconCameraVideo} alt="" />
                      <span className="title3bold text-text-white">OFF</span>
                    </div>
                    <div className="ml-auto">
                      <img src={SignalNormal} alt="" srcset="" />
                    </div>
                  </div>

                  <div className="flex w-full justify-between flex-row gap-[3px] items-center">
                    <div className="flex flex-row gap-[8px] items-center">
                      <span className="body2bold text-text-white">
                        BXID0010 | 남쪽 접근로{" "}
                      </span>
                    </div>
                    <div className="ml-auto flex flex-row gap-[5px]">
                      <button class="body2bold text-text-white px-[8px] py-[3px] bg-[#1070C8] rounded-[3px]">
                        <img src={VideoRecord} alt="" />
                      </button>
                      <button class="body2bold text-text-white min-w-[73px] py-[3px] bg-[#1070C8] rounded-[3px]">
                        Restart
                      </button>
                    </div>
                  </div>

                  <div className="flex w-full justify-between flex-row gap-[3px] items-center">
                    <div className="flex flex-row gap-[8px] items-center">
                      <span className="body2 text-text-white">
                        2025-01-20 12:30:00
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bx-card-status w-full h-full justify-center flex flex-col gap-[5px] px-[10px] py-[3px] border border-[#4D5152] bg-[#2D3238] rounded-[5px]">
                  <div className="flex w-full justify-between flex-row gap-[3px] items-center">
                    <div className="flex flex-row gap-[8px] items-center">
                      <img src={IconCameraVideo} alt="" />
                      <span className="title3bold text-text-danger-400">
                        OFF
                      </span>
                    </div>
                    <div className="ml-auto">
                      <img src={SignalAbnormal} alt="" srcset="" />
                    </div>
                  </div>

                  <div className="flex w-full justify-between flex-row gap-[3px] items-center">
                    <div className="flex flex-row gap-[8px] items-center">
                      <span className="body2bold text-text-white">
                        BXID0010 | 남쪽 접근로{" "}
                      </span>
                    </div>
                    <div className="ml-auto flex flex-row gap-[5px]">
                      <button class="body2bold text-text-white px-[8px] py-[3px] bg-[#1070C8] rounded-[3px]">
                        <img src={VideoRecord} alt="" />
                      </button>
                      <button class="body2bold text-text-white min-w-[73px] py-[3px] bg-[#1070C8] rounded-[3px]">
                        Restart
                      </button>
                    </div>
                  </div>

                  <div className="flex w-full justify-between flex-row gap-[3px] items-center">
                    <div className="flex flex-row gap-[8px] items-center">
                      <span className="body2 text-text-white">
                        2025-01-20 12:30:00
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bx-card-status w-full h-full justify-center flex flex-col gap-[5px] px-[10px] py-[3px] border border-[#4D5152] bg-[#2D3238] rounded-[5px]">
                  <div className="flex w-full justify-between flex-row gap-[3px] items-center">
                    <div className="flex flex-row gap-[8px] items-center">
                      <img src={IconCameraVideo} alt="" />
                      <span className="title3bold text-text-danger-400">
                        OFF
                      </span>
                    </div>
                    <div className="ml-auto">
                      <img src={SignalAbnormal} alt="" srcset="" />
                    </div>
                  </div>

                  <div className="flex w-full justify-between flex-row gap-[3px] items-center">
                    <div className="flex flex-row gap-[8px] items-center">
                      <span className="body2bold text-text-white">
                        BXID0010 | 남쪽 접근로{" "}
                      </span>
                    </div>
                    <div className="ml-auto flex flex-row gap-[5px]">
                      <button class="body2bold text-text-white px-[8px] py-[3px] bg-[#1070C8] rounded-[3px]">
                        <img src={VideoRecord} alt="" />
                      </button>
                      <button class="body2bold text-text-white min-w-[73px] py-[3px] bg-[#1070C8] rounded-[3px]">
                        Restart
                      </button>
                    </div>
                  </div>

                  <div className="flex w-full justify-between flex-row gap-[3px] items-center">
                    <div className="flex flex-row gap-[8px] items-center">
                      <span className="body2 text-text-white">
                        2025-01-20 12:30:00
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bx-card-status w-full h-full justify-center flex flex-col gap-[5px] px-[10px] py-[3px] border border-[#4D5152] bg-[#2D3238] rounded-[5px]">
                  <div className="flex w-full justify-between flex-row gap-[3px] items-center">
                    <div className="flex flex-row gap-[8px] items-center">
                      <img src={IconCameraVideo} alt="" />
                      <span className="title3bold text-text-danger-400">
                        OFF
                      </span>
                    </div>
                    <div className="ml-auto">
                      <img src={SignalAbnormal} alt="" srcset="" />
                    </div>
                  </div>

                  <div className="flex w-full justify-between flex-row gap-[3px] items-center">
                    <div className="flex flex-row gap-[8px] items-center">
                      <span className="body2bold text-text-white">
                        BXID0010 | 남쪽 접근로{" "}
                      </span>
                    </div>
                    <div className="ml-auto flex flex-row gap-[5px]">
                      <button class="body2bold text-text-white px-[8px] py-[3px] bg-[#1070C8] rounded-[3px]">
                        <img src={VideoRecord} alt="" />
                      </button>
                      <button class="body2bold text-text-white min-w-[73px] py-[3px] bg-[#1070C8] rounded-[3px]">
                        Restart
                      </button>
                    </div>
                  </div>

                  <div className="flex w-full justify-between flex-row gap-[3px] items-center">
                    <div className="flex flex-row gap-[8px] items-center">
                      <span className="body2 text-text-white">
                        2025-01-20 12:30:00
                      </span>
                    </div>
                  </div>
                </div>
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
                      <span className="text-text-white body2bold">01111</span>
                    </div>
                    <div className="flex flex-1 flex-row gap-[5px] items-baseline">
                      <span className="text-text-white body2  min-w-[160px]">
                        명칭
                      </span>
                      <span className="text-text-white body2bold">
                        BOXID10010
                      </span>
                    </div>
                    <div className="flex flex-1 flex-row gap-[5px] items-baseline">
                      <span className="text-text-white body2  min-w-[160px]">
                        매핑 사이트
                      </span>
                      <span className="text-text-white body2bold">
                        삼성역 사거리 교차로(SITEID0001)
                      </span>
                    </div>
                    <div className="flex flex-1 flex-row gap-[5px] items-baseline">
                      <span className="text-text-white body2  min-w-[160px]">
                        설치 위/경도
                      </span>
                      <span className="text-text-white body2bold">
                        5.555323232 / 27.21829828
                      </span>
                    </div>
                    <div className="flex flex-1 flex-row gap-[5px] items-baseline">
                      <span className="text-text-white body2  min-w-[160px]">
                        설치 일시
                      </span>
                      <span className="text-text-white body2bold">
                        2025.01.20
                      </span>
                    </div>
                  </div>

                  <div className="_lineDivider w-full h-[0.5px] flex bg-[#CACACA]"></div>

                  <div className="_groupDetailInfo w-full grid grid-cols-3 gap-x-[5px] gap-y-[5px] ">
                    <div className="flex flex-1 flex-row gap-[5px] items-baseline">
                      <span className="text-text-white body2  min-w-[160px]">
                        Edge IP
                      </span>
                      <span className="text-text-white body2bold">
                        192.168.1.1
                      </span>
                    </div>
                    <div className="flex flex-1 flex-row gap-[5px] items-baseline">
                      <span className="text-text-white body2  min-w-[160px]">
                        Switch IP
                      </span>
                      <span className="text-text-white body2bold">
                        192.168.1.1
                      </span>
                    </div>
                    <div className="flex flex-1 flex-row gap-[5px] items-baseline">
                      <span className="text-text-white body2  min-w-[160px]">
                        Router IP
                      </span>
                      <span className="text-text-white body2bold">
                        192.168.1.1
                      </span>
                    </div>
                    <div className="flex flex-1 flex-row gap-[5px] items-baseline">
                      <span className="text-text-white body2  min-w-[160px]">
                        설치 위/경도
                      </span>
                      <span className="text-text-white body2bold">
                        5.555323232 / 27.21829828
                      </span>
                    </div>
                    <div className="flex flex-1 flex-row gap-[5px] items-baseline">
                      <span className="text-text-white body2  min-w-[160px]">
                        Env Board Mac address
                      </span>
                      <span className="text-text-white body2bold">
                        2025.01.20
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="_contentDetailCenter bg-[#212527] w-full flex-1/10 flex-col h-full rounded-[5px] overflow-hidden">
                <div className="bg-header-content w-full h-[36px] flex items-center px-[15px]">
                  <span className="title3bold text-text-white">온/습도</span>
                </div>
                <div className="flex flex-col w-full p-[10px]  h-[calc(100%-40px)] overflow-hidden">
                  <TemperatureHum />
                </div>
              </div>
            </div>
          </section>
          {/* center */}

          {/* right */}
          <section className="rightEq flex! flex-col gap-[10px] w-[21%] h-full  overflow-hidden rounded-[5px]">
            <div className="contentTopLeft w-full flex flex-col  bg-[#212527] overflow-hidden rounded-[5px]">
              <div className="bg-header-content w-full h-[36px] flex items-center px-[15px]">
                <span className="title3bold text-text-white">
                  금일 이벤트 현황
                </span>
              </div>
              <div className="w-full grid grid-cols-6 gap-[5px] items-center p-[10px]">
                <div className="bx-card-status col-span-3 w-full h-full justify-center items-center flex flex-col gap-[5px] p-[10px] border border-[#4D5152] bg-[#2D3238]">
                  <span className="title3bold text-text-white">네트워크 </span>
                  <div className="w-full flex flex-row gap-[5px] justify-center items-center">
                    <img src={IconNetwork} alt="" />
                    <span className="text-text-white title3bold">/</span>
                    <span className="text-text-white title3bold">200</span>
                  </div>
                </div>
                <div className="bx-card-status col-span-3 w-full h-full justify-center items-center flex flex-col gap-[5px] p-[10px] border border-[#4D5152] bg-[#2D3238]">
                  <span className="title3bold text-text-white">전원</span>
                  <div className="w-full flex flex-row gap-[5px] justify-center items-center">
                    <img src={IconPower} alt="" />
                    <span className="text-text-white title3bold">/</span>
                    <span className="text-text-white title3bold">200</span>
                  </div>
                </div>
                <div className="bx-card-status col-span-2 w-full h-full justify-center items-center flex flex-col gap-[5px] p-[10px] border border-[#4D5152] bg-[#2D3238]">
                  <span className="title3bold text-text-white">온도</span>
                  <div className="w-full flex flex-row gap-[5px] justify-center items-center">
                    <img src={IconTemp} alt="" />
                    <span className="text-text-white title3bold">/</span>
                    <span className="text-text-white title3bold">200</span>
                  </div>
                </div>
                <div className="bx-card-status col-span-2 w-full h-full justify-center items-center flex flex-col gap-[5px] p-[10px] border border-[#4D5152] bg-[#2D3238]">
                  <span className="title3bold text-text-white">습도</span>
                  <div className="w-full flex flex-row gap-[5px] justify-center items-center">
                    <img src={IconHum} alt="" />
                    <span className="text-text-white title3bold">/</span>
                    <span className="text-text-white title3bold">200</span>
                  </div>
                </div>
                <div className="bx-card-status col-span-2 w-full h-full justify-center items-center flex flex-col gap-[5px] p-[10px] border border-[#4D5152] bg-[#2D3238]">
                  <span className="title3bold text-text-white">문열림</span>
                  <div className="w-full flex flex-row gap-[5px] justify-center items-center">
                    <img src={IconDoorOpen} alt="" />
                    <span className="text-text-white title3bold">/</span>
                    <span className="text-text-white title3bold">200</span>
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
                      value="22-04-2003"
                    />
                    <span className="text-text-white">-</span>
                    <input
                      type="text"
                      className="input-db-date"
                      value="22-04-2003"
                    />
                  </div>
                  <input
                    type="text"
                    className="input-db-text w-full"
                    placeholder="Search, Number Event"
                  />
                </div>

                <div className="groupFilteringBtn grid grid-cols-5 gap-[5px]">
                  {/* <button class="w-full title3 py-[5px] border bg-[#135A78] text-text-white border-[#135A78]">온도</button> */}
                  <button
                    className={`w-full title3 py-[5px] border ${
                      selectBtnFilter.btnTemperature
                        ? "bg-transparent text-white border-[#135A78]"
                        : "bg-[#135A78] text-white border-[#135A78]"
                    }`}
                    onClick={() => handleBtnFilter("btnTemperature")}
                  >
                    온도
                  </button>

                  <button
                    className={`w-full title3 py-[5px] border ${
                      selectBtnFilter.btnHumidity
                        ? "bg-transparent text-white border-[#1D7E46]"
                        : "bg-[#1D7E46] text-white border-[#1D7E46]"
                    }`}
                    onClick={() => handleBtnFilter("btnHumidity")}
                  >
                    습도
                  </button>

                  <button
                    className={`w-full title3 py-[5px] border ${
                      selectBtnFilter.btnNetwork
                        ? "bg-transparent text-white border-[#D32F2F]"
                        : "bg-[#D32F2F] text-white border-[#D32F2F]"
                    }`}
                    onClick={() => handleBtnFilter("btnNetwork")}
                  >
                    네트워크
                  </button>

                  <button
                    className={`w-full title3 py-[5px] border ${
                      selectBtnFilter.btnDoorOpen
                        ? "bg-transparent text-white border-[#F35A19]"
                        : "bg-[#F35A19] text-white border-[#F35A19]"
                    }`}
                    onClick={() => handleBtnFilter("btnDoorOpen")}
                  >
                    교차로
                  </button>

                  <button
                    className={`w-full title3 py-[5px] border ${
                      selectBtnFilter.btnPower
                        ? "bg-transparent text-white border-[#EE9F17]"
                        : "bg-[#EE9F17] text-white border-[#EE9F17]"
                    }`}
                    onClick={() => handleBtnFilter("btnPower")}
                  >
                    전원
                  </button>
                </div>

                <div className="_bxCardEventList w-full flex flex-col gap-[3px] h-full  overflow-auto">
                  <CardList
                    type="event"
                    title="삼성역 사거리 교차로"
                    showID="true"
                    id="BX10010"
                    customCard="border-[#1D7E46]"
                    subtitle="온도   |  95 ℃"
                    date="2025-01-20 12:30:00"
                  />
                  <CardList
                    type="event"
                    title="삼성역 사거리 교차로"
                    showID="true"
                    id="BX10010"
                    customCard="border-[#1D7E46]"
                    subtitle="온도   |  95 ℃"
                    date="2025-01-20 12:30:00"
                  />
                  <CardList
                    type="event"
                    title="삼성역 사거리 교차로"
                    showID="true"
                    id="BX10010"
                    customCard="border-[#135A78]"
                    subtitle="습도  |  85 %"
                    date="2025-01-20 12:30:00"
                  />
                  <CardList
                    type="event"
                    title="삼성역 사거리 교차로"
                    showID="true"
                    id="BX10010"
                    customCard="border-[#135A78]"
                    subtitle="습도  |  85 %"
                    date="2025-01-20 12:30:00"
                  />
                  <CardList
                    type="event"
                    title="삼성역 사거리 교차로"
                    showID="true"
                    id="BX10010"
                    customCard="border-[#ED3131]"
                    subtitle="네트워크 | Disconnected"
                    date="2025-01-20 12:30:00"
                  />
                  <CardList
                    type="event"
                    title="삼성역 사거리 교차로"
                    showID="true"
                    id="BX10010"
                    customCard="border-[#ED3131]"
                    subtitle="네트워크 | Disconnected"
                    date="2025-01-20 12:30:00"
                  />
                  <CardList
                    type="event"
                    title="삼성역 사거리 교차로"
                    showID="true"
                    id="BX10010"
                    customCard="border-[#F35A19]"
                    subtitle="문열림 | Open"
                    date="2025-01-20 12:30:00"
                  />
                  <CardList
                    type="event"
                    title="삼성역 사거리 교차로"
                    showID="true"
                    id="BX10010"
                    customCard="border-[#EE9F17]"
                    subtitle="전원 | 262.3v"
                    date="2025-01-20 12:30:00"
                  />
                </div>
              </div>
            </div>
          </section>
          {/* end right */}
        </div>
      </section>
    </>
  );
};

export default EquipmentInfoDashboard;
