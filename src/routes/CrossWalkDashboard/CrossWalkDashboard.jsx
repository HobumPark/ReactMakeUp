import React, { useState, useRef, useEffect } from "react";
import Header from "../../components/Header/Header";
// import "./AccessRoadDashboard.css";
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
import IconPlay from "../../assets/icon/icon-db-play-white.svg";
import IconVideo from "../../assets/icon/icon-db-video.svg";
import IconVideoActive from "../../assets/icon/icon-db-video-active.svg";

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

import imgMaps from "../../assets/icon/img-lane-maps.svg";

import VehicleCount from "../../components/VehicleCount/VehicleCount";

import TrafficeByDirection from "../../components/CrossRoadStatistic/TrafficeByDirection";
import TrafficeByVehicle from "../../components/CrossRoadStatistic/TrafficeByVehicle";
import EntryRate from "../../components/CrossRoadStatistic/EntryRate";
import PieChartIn from "../../components/CrossWalkStatistic/PieChartIn";
import PieChartOut from "../../components/CrossWalkStatistic/PieChartOut";

// tabulator exit

const entryVehicleTabullator = [
  {
    title: "진입",
    field: "entry",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
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
];

const dataEntry = [
  {
    entry: "승용차",
    today: "1300",
    yesterday: "1300",
    one_week: "1300",
  },
  {
    entry: "승합차",
    today: "1300",
    yesterday: "1300",
    one_week: "1300",
  },
  {
    entry: "트럭",
    today: "1300",
    yesterday: "1300",
    one_week: "1300",
  },
  {
    entry: "대형트럭",
    today: "1300",
    yesterday: "1300",
    one_week: "1300",
  },
  {
    entry: "버스",
    today: "1300",
    yesterday: "1300",
    one_week: "1300",
  },
  {
    entry: "오토바이",
    today: "1300",
    yesterday: "1300",
    one_week: "1300",
  },
  {
    entry: "자전거",
    today: "1300",
    yesterday: "1300",
    one_week: "1300",
  },
  {
    entry: "기타",
    today: "1300",
    yesterday: "1300",
    one_week: "1300",
  },
];

//end tabulator exit

// trabulator exit
const exitVehicleTabullator = [
  {
    title: "진입",
    field: "entry",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
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
];

const dataExit = [
  {
    entry: "승용차",
    today: "1300",
    yesterday: "1300",
    one_week: "1300",
  },
  {
    entry: "승합차",
    today: "1300",
    yesterday: "1300",
    one_week: "1300",
  },
  {
    entry: "트럭",
    today: "1300",
    yesterday: "1300",
    one_week: "1300",
  },
  {
    entry: "대형트럭",
    today: "1300",
    yesterday: "1300",
    one_week: "1300",
  },
  {
    entry: "버스",
    today: "1300",
    yesterday: "1300",
    one_week: "1300",
  },
  {
    entry: "오토바이",
    today: "1300",
    yesterday: "1300",
    one_week: "1300",
  },
  {
    entry: "자전거",
    today: "1300",
    yesterday: "1300",
    one_week: "1300",
  },
  {
    entry: "기타",
    today: "1300",
    yesterday: "1300",
    one_week: "1300",
  },
];
//end trabulator exit

// tabulator facility info asset
const FacilityInfoTabullator = [
  {
    title: "구분",
    field: "separation",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "ID",
    field: "id",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "명칭",
    field: "name",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "시리얼 넘버",
    field: "serial_number",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "업데이트 일시",
    field: "update_date",
    widthGrow: 1.8,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
];

const dataFacilityInfo = [
  {
    separation: "함체",
    id: "1101",
    name: "DT01001",
    serial_number: "0222-22",
    update_date: "2025-01-24 23:10:11",
  },
  {
    separation: "시설물",
    id: "1101",
    name: "DT01001",
    serial_number: "0222-22",
    update_date: "2025-01-24 23:10:11",
  },
];

// end tabulator facility info asset

// tabulator events
const eventsTabulator = [
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
    widthGrow: 1.8,
    headerHozAlign: "center",
    headerSort: false,
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
    title: "차종crt",
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
      window.open("/img-modal", "_blank", "width=686,height=552");
    },
  },
];

const dataEvents = [
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
  {
    event_time: "2025-01-24 23:10:11",
    site: "시청사거리",
    access: "시청 방면",
    vehicle_type: "승용차",
    event_type: "역주행",
    lane_direction: "진입",
    lane: "3",
    direction: "좌회전",
  }
];

// tabulator events

const CrossWalkDashboard = () => {
  const optionsTabulatorEntry = {
    pagination: false,
    height: "100%",
    paginationSize: 10,
    rowHeight: 33,
    movableRows: false,
    resizableRows: false,
    // footerElement: `<div style="padding: 0 20px 0 0; text-align: right;">총 ${data.length} 건</div>`,
  };

  const radioOptions = [
    { id: "radio-5min", label: "5분", value: "5" },
    { id: "radio-15min", label: "15분", value: "15" },
    { id: "radio-30min", label: "30분", value: "30" },
  ];

  const mapRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const iconFeatureRef = useRef(null); // Simpan referensi ke ikon
  
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
      <section className="_crossWalkContainer w-full h-screen overflow-hidden flex flex-col bg-bg-grey-400">
        <Header />

        <div className="_layoutCrossWalksRoad w-full h-[calc(100%-60px)] flex flex-col gap-[10px] p-[10px] overflow-hidden">
          <div className="flex  flex-row gap-[10px] flex-2 overflow-hidden">
            <section className="leftToproad flex flex-1 h-full bg-[#000] overflow-hidden rounded-[5px]">
              <div className="bg-header-content w-full h-[36px] flex items-center px-[15px]">
                <span className="title3bold text-text-white">
                  아현역 2번출구 횡단보도
                </span>
              </div>

              <div className="w-full h-full  overflow-hidden p-[10px]">
                <div className="_containerVideoAccerssRoad w-full h-[calc(100%-35px)] bg-[#171A1C]">
                  {/* you can fill in container */}
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
                    <img
                      src={ImgOneWay}
                      alt=""
                      className="object-cover w-full h-full overflow-hidden"
                    />
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
                          <PieChartOut />
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
                                200
                              </span>
                            </div>
                            <div className="flex flex-row w-full items-center gap-[5px] justify-between">
                              <span className="text-text-white body2">
                                오토바이
                              </span>
                              <span className="text-text-white title3bold">
                                200
                              </span>
                            </div>
                            <div className="flex flex-row w-full items-center gap-[5px] justify-between">
                              <span className="text-text-white body2">
                                버스
                              </span>
                              <span className="text-text-white title3bold">
                                200
                              </span>
                            </div>
                            <div className="flex flex-row w-full items-center gap-[5px] justify-between">
                              <span className="text-text-white body2">
                                트럭
                              </span>
                              <span className="text-text-white title3bold">
                                200
                              </span>
                            </div>
                            <div className="flex flex-row w-full items-center gap-[5px] justify-between">
                              <span className="text-text-white body2">
                                승합차
                              </span>
                              <span className="text-text-white title3bold">
                                200
                              </span>
                            </div>
                            <div className="flex flex-row w-full items-center gap-[5px] justify-between">
                              <span className="text-text-white body2">
                                자전거
                              </span>
                              <span className="text-text-white title3bold">
                                200
                              </span>
                            </div>
                            <div className="flex flex-row w-full items-center gap-[5px] justify-between">
                              <span className="text-text-white body2">
                                대형 트럭
                              </span>
                              <span className="text-text-white title3bold">
                                200
                              </span>
                            </div>
                            <div className="flex flex-row w-full items-center gap-[5px] justify-between">
                              <span className="text-text-white body2">
                                기타
                              </span>
                              <span className="text-text-white title3bold">
                                200
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className=" w-full flex items-start relative">
                          <PieChartIn />
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
                                200
                              </span>
                            </div>
                            <div className="flex flex-row w-full items-center gap-[5px] justify-between">
                              <span className="text-text-white body2">
                                오토바이
                              </span>
                              <span className="text-text-white title3bold">
                                200
                              </span>
                            </div>
                            <div className="flex flex-row w-full items-center gap-[5px] justify-between">
                              <span className="text-text-white body2">
                                버스
                              </span>
                              <span className="text-text-white title3bold">
                                200
                              </span>
                            </div>
                            <div className="flex flex-row w-full items-center gap-[5px] justify-between">
                              <span className="text-text-white body2">
                                트럭
                              </span>
                              <span className="text-text-white title3bold">
                                200
                              </span>
                            </div>
                            <div className="flex flex-row w-full items-center gap-[5px] justify-between">
                              <span className="text-text-white body2">
                                승합차
                              </span>
                              <span className="text-text-white title3bold">
                                200
                              </span>
                            </div>
                            <div className="flex flex-row w-full items-center gap-[5px] justify-between">
                              <span className="text-text-white body2">
                                자전거
                              </span>
                              <span className="text-text-white title3bold">
                                200
                              </span>
                            </div>
                            <div className="flex flex-row w-full items-center gap-[5px] justify-between">
                              <span className="text-text-white body2">
                                대형 트럭
                              </span>
                              <span className="text-text-white title3bold">
                                200
                              </span>
                            </div>
                            <div className="flex flex-row w-full items-center gap-[5px] justify-between">
                              <span className="text-text-white body2">
                                기타
                              </span>
                              <span className="text-text-white title3bold">
                                200
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
                            columns={entryVehicleTabullator}
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
                            columns={exitVehicleTabullator}
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
                <div className="_bxPageMaps overflow-hidden h-[calc(100%-35px)] ">
                  <div
                    ref={mapRef}
                    className="_maps_accessRoad w-full h-full relative"
                  ></div>
                </div>
              </section>

              <section className=" flex flex-1/6 h-[full] overflow-hidden bg-[#212527] rounded-[5px]">
                <div className="bg-header-content w-full h-[36px] flex items-center px-[15px]">
                  <span className="title3bold text-text-white">
                    함체/검지기/시설물 정보 (Vessel/Detector/Facility
                    Information)
                  </span>
                </div>
                <div className="_containerFacilityTabullator overflow-hidden h-[calc(100%-55px)] m-[10px] p-[10px] rounded-[5px] bg-[#171A1C]">
                  <ReactTabulator
                    data={dataFacilityInfo}
                    columns={FacilityInfoTabullator}
                    layout={"fitColumns"}
                    id=""
                    className="tabulator-modify-db w-full "
                    //   pagination="local"
                    options={optionsTabulatorEntry}
                  />
                </div>
              </section>
            </div>

            <div className="_boxRowBottom flex w-full gap-[10px] overflow-hidden">
              <section className=" flex flex-1/8 h-[full] overflow-hidden bg-[#212527] rounded-[5px]">
                <div className="bg-header-content w-full h-[36px] flex items-center px-[15px]">
                  <span className="title3bold text-text-white">
                    발생 이벤트 ( events )
                  </span>
                </div>
                <div className="_containerEventsTabullator overflow-hidden h-[calc(100%-55px)] m-[10px] p-[10px] rounded-[5px] bg-[#171A1C]">
                  <ReactTabulator
                    data={dataEvents}
                    columns={eventsTabulator}
                    layout={"fitColumns"}
                    id=""
                    className="tabulator-modify-db w-full "
                    //   pagination="local"
                    options={optionsTabulatorEntry}
                  />
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CrossWalkDashboard;
