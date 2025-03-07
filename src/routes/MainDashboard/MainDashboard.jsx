import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/Header/Header";
import "./MainDashboard.css";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
// import { Tile as TileLayer } from "ol/layer";
import { Tile as TileLayer } from "ol/layer";
import { OSM } from "ol/source";
import { fromLonLat } from "ol/proj";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import DbVideoModal from "../../components/Modal/DbVideoModal/DbVideoModal";
import CardList from "../../components/CardList/CardList";
import Chart from "react-apexcharts";

import IconCrosswalk from "../../assets/icon/icon-db-crosswalk.svg";
import IconIntersection from "../../assets/icon/icon-db-intersection.svg";
import IconDetector from "../../assets/icon/icon-db-detector.svg";
import IconVms  from "../../assets/icon/icon-db-vms.svg";
import IconBox from "../../assets/icon/icon-db-box.svg";
import IconSpeaker from "../../assets/icon/icon-db-speaker.svg";

import IconCar from "../../assets/icon/icon-db-car.svg";
import IconMotor from "../../assets/icon/icon-db-motorcycles.svg";
import IconBus from "../../assets/icon/icon-db-bus.svg";
import IconTruck from "../../assets/icon/icon-db-truck.svg";
import IconVan from "../../assets/icon/icon-db-van.svg";
import IconBicycles from "../../assets/icon/icon-db-bicycles.svg";
import IconHeavyTruck from "../../assets/icon/icon-db-heavy-truck.svg";
import IconUnknown from "../../assets/icon/icon-db-unknown.svg";

import IconArrow from "../../assets/icon/icon-db-arrow-down.svg";

import LegendCrosswalk from "../../assets/icon/icon-top-crosswalk.svg";
import LegendIntersection from "../../assets/icon/icon-top-intersection.svg";
import LegendSpeaker from "../../assets/icon/icon-top-speaker.svg";
import LegendSignal from "../../assets/icon/icon-top-signal.svg";
import LegendBox from "../../assets/icon/icon-top-box.svg";
import LegendBillboard from "../../assets/icon/icon-top-billboard.svg";

import IconDefault from "../../assets/icon/icon-default.svg";
import IconReturn from "../../assets/icon/icon-return.svg";
import IconRoadMap from "../../assets/icon/icon-road-map.svg";
import IconDarkMap from "../../assets/icon/icon-dark-map.svg";
import IconSatelite from "../../assets/icon/icon-satelite-map.svg";

import Colorize from "ol-ext/filter/Colorize";
import useDashboard from "../../hooks/useDashboard";
import { formatFullDateTime } from "../../utils/date";

const MainDashboard = () => {
  const [id, setId] = useState('');
  const [POIData, setPOIData] = useState("");
  const today = new Date();
  const midnight = new Date(new Date().setHours(0, 0, 0, 0));
  const [dateTime] = useState({
    start_date:formatFullDateTime(midnight),
    end_date:formatFullDateTime(today)
  });

  
  const {mapInitialView, mapDisplayPOI, siteRoad, trafficEventTime, objectUnqCntRoad, objectUnqCnt, trafficEvent } = useDashboard({
    id: id,
    objectUnqCntParams: `start_time=${dateTime.start_date}&end_time=${dateTime.end_date}`,
    objectUnqCntRoadParams: `start_time=${dateTime.start_date}&end_time=${dateTime.end_date}&top=5`,
  });
  
  const mapInitial = mapInitialView?.data;
  const mapDisplay = mapDisplayPOI?.data;
  const siteRoadData = siteRoad?.data;
  const trafficEventTimeData = trafficEventTime?.data;
  const trafficEventData = trafficEvent?.data;
  const objectUnqCntData = objectUnqCnt?.data;
  const objectUnqCntRoadData = objectUnqCntRoad?.data; 


  const [selectedButtons, setSelectedButtons] = useState({
    button1: false,
    button2: false,
  });

  const handleSelect = (button) => {
    setSelectedButtons((prev) => ({
      ...prev,
      [button]: !prev[button],
    }));
  };

  const [selectBtnEvent, setselectBtnEvent] = useState({
    btnEvent1: false,
    btnEvent2: false,
    btnEvent3: false,
    btnEvent4: false,
    btnEvent5: false,
    btnEvent6: false,
  });

  const handleBtnEventList = (button) => {
    setselectBtnEvent((prev) => ({
      ...prev,
      [button]: !prev[button],
    }));
  };

  const [activeIndex, setActiveIndex] = useState(null);

  const handleCardClick = (index) => {
    setActiveIndex(index);
  };

  const cardDataEvent = [
    {
      customCard: "border-[#135A78]",
      title: "삼성역 사거리 교차로 / 시청 방면",
      subtitle: "승용차 / 진입 / 1차로",
      date: "2025-01-20 12:30:00",
    },
    {
      customCard: "border-[#ED3131]",
      title: "강남역 사거리 교차로 / 시청 방면",
      subtitle: "버스 / 진입 / 2차로",
      date: "2025-01-21 14:45:00",
    },
    {
      customCard: "border-[#1D7E46]",
      title: "서울역 사거리 교차로 / 시청 방면",
      subtitle: "택시 / 진입 / 3차로",
      date: "2025-01-22 10:15:00",
    },
  ];

  const mapRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    if (!mapRef.current) return;

    const tileLayer = new TileLayer({
      source: new OSM(),
    });

    // Black (Dark Mode)
    // tileLayer.on("prerender", (event) => {
    //   if (event.context) {
    //     const ctx = event.context;
    //     ctx.filter = "grayscale(100%) invert(100%) contrast(120%)";
    //   }
    // });

    // tileLayer.on("postrender", (event) => {
    //   if (event.context) {
    //     const ctx = event.context;
    //     ctx.filter = "none";
    //   }
    // });

    const enhanceOption = new Colorize();
    enhanceOption.setFilter({
      operation: "enhance",
      value: Number("0.1"),
    });
    tileLayer.addFilter(enhanceOption);

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
    tileLayer.addFilter(colorOption);

    // 'saturation' option => highlight lines on the land
    const saturationOption = new Colorize();
    saturationOption.setFilter({
      operation: "enhance",
      value: Number("0.1"),
    });
    tileLayer.addFilter(saturationOption);

    var invert_filter = new Colorize();
    tileLayer.addFilter(invert_filter);
    invert_filter.setFilter("invert");

    // ✅ Inisialisasi peta
    const olMap = new Map({
      target: mapRef.current,
      layers: [tileLayer],

      view: new View({
        center: fromLonLat([mapInitial?.[0]?.view_lng, mapInitial?.[0]?.view_lat]),
        zoom: mapInitial?.[0]?.view_zoom,
      }),
    });

    setTimeout(() => {
      // Ambil elemen kontrol zoom
      const zoomControl = document.querySelector(".ol-zoom");

      if (zoomControl) {
        // ✅ Hapus semua tombol ikon lama sebelum menambahkan yang baru
        zoomControl
          .querySelectorAll(".custom-icon-button")
          .forEach((btn) => btn.remove());

        const icons = [
          {
            src: IconReturn,
            title: "return",
            action: () => alert("Arrow clicked!"),
          },
          {
            src: IconDefault,
            title: "default",
            action: () => alert("Home clicked!"),
          },
          {
            src: IconRoadMap,
            title: "Location Icon",
            action: () => alert("Location clicked!"),
          },
          {
            src: IconDarkMap,
            title: "Dark MAp",
            action: () => alert("Settings clicked!"),
          },
          {
            src: IconSatelite,
            title: "satelit",
            action: () => alert("Settings clicked!"),
          },
        ];

        icons.forEach((iconData) => {
          // Buat elemen tombol untuk setiap ikon
          const newButton = document.createElement("button");
          newButton.innerHTML = `<img src="${iconData.src}" alt="${iconData.title}" width="20" height="20">`;
          newButton.className = "custom-icon-button";
          newButton.title = iconData.title;

          // Tambahkan event click ke masing-masing tombol
          newButton.onclick = iconData.action;

          // Masukkan ikon ke dalam kontrol zoom
          zoomControl.appendChild(newButton);
        });
      }
    }, 100);

    const iconMapping = {
      "102001": IconIntersection,  
      "102002": IconCrosswalk,     
      "221001": IconSpeaker,     
      "221002": IconVms,         
      "detector": IconDetector,  
      "box": IconBox               
    };

    const features = mapDisplay?.poi?.map(item => {
      const iconSrc = iconMapping[item.type] || IconDefault;  
    const iconFeature = new Feature({
        geometry: new Point(fromLonLat([item.lng, item.lat])),
    });
    
    iconFeature.setStyle(
        new Style({
          image: new Icon({
            src: iconSrc,
            scale: 1,
          }),
        })
      );
      iconFeature.setId(item.type);
      return iconFeature;
    });

    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: features,  
      }),
    });
    

    olMap.addLayer(vectorLayer);

    olMap.on('click', (event) => {
      olMap.forEachFeatureAtPixel(event.pixel, (feature) => {
        const featureId = feature.getId();
        const clickedItem = mapDisplay.poi?.find(item => item.type === featureId);
        
        if (clickedItem) {
          switch (clickedItem.type) {
            case "box":
              alert("Icon Box clicked!");
              break;
            case "102001":
              alert("Icon Intersection clicked!");
              break;
            case "102002":
              alert("Icon Crosswalk clicked!");
              break;
            case "221001":
              alert("Icon Speaker clicked!");
              break;
            case "221002":
              alert("Icon VMS clicked!");
              break;
            case "detector":
              alert("Icon Detector clicked!");
              setPOIData(clickedItem);
              setShowModal(true); 
              break;
            default:
              alert("Unknown icon clicked!");
          }
        }
      });
    });

    return () => olMap.setTarget(null);
  }, [mapInitial, mapDisplay]);

  const vehicleData = [
    { label: "승용차", icon: IconCar, count: objectUnqCntData?.["301000"] },
    { label: "오토바이", icon: IconMotor, count: objectUnqCntData?.["301006"] },
    { label: "버스", icon: IconBus, count: objectUnqCntData?.["301005"] },
    { label: "트럭", icon: IconTruck, count: objectUnqCntData?.["301003"] },
    { label: "승합차", icon: IconVan, count: objectUnqCntData?.["301002"] },
    { label: "자전거", icon: IconBicycles, count: objectUnqCntData?.["301007"] },
    { label: "대형 트럭", icon: IconHeavyTruck, count: objectUnqCntData?.["301004"] },
    { label: "기타", icon: IconUnknown, count: objectUnqCntData?.["301008"] },
  ];

  const options = {
    chart: {
      type: "bar",
      background: "transparent",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "60%",
        distributed: true,
      },
    },
    colors: ["#ff4d4d", "#8c52ff", "#33cc33", "#3399ff", "#ff9933"],
    dataLabels: {
      enabled: true,
      textAnchor: "start",
      style: {
        colors: ["#fff"],
        fontSize: "10px",
        fontWeight: "bold",
      },
      formatter: function (val) {
        return val;
      },
    },
    xaxis: {
      categories: [
        "서울특별시청 방면",
        "갈현교차로 방면",
        "자유로 방면",
        "금촌 방면",
        "제 2자유로 방면",
      ],
      labels: {
        style: { colors: "#D1D2D3", fontSize: "10px" },
      },
      axisBorder: {
        show: true,
        color: "#343A3F",
      },
      min: 0,
      max: 240,
      tickAmount: 6,
    },
    yaxis: {
      labels: {
        style: { colors: "#D1D2D3", fontSize: "10px" },
      },
    },
    grid: {
      borderColor: "#343A3F",
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
    },
    // colors: ["#ff4d4d", "#8c52ff", "#33cc33", "#3399ff", "#ff9933"],
    tooltip: { enabled: false },
    legend: { show: false },
  };

  const series = [
    {
      name: "Data",
      data: [200, 129, 120, 100, 80], // Nilai masing-masing bar
    },
  ];

  const [openSections, setOpenSections] = useState([]);
  const [activeCard, setActiveCard] = useState(null);
  // Fungsi untuk toggle status accordion
  const toggleAccordion = (id) => {
    setOpenSections((prev) =>
      prev.includes(id)
        ? prev.filter((sectionId) => sectionId !== id)
        : [...prev, id]
    );
  };

  const handleCardClickSiteList = (cardId) => {
    setActiveCard((prev) => (prev === cardId ? null : cardId));
  };

  const accordionData = [
    {
      id: 1,
      title: "횡단보도",
      subtitle: "제 2자유로 방면",
      count: 400,
      cardData: [
        {
          id: "ACCID0001",

          title: "북 (6차선) / 남(6차선)",
          subtitle: "제 2자유로 방면",
          borderStyle: "border-[#ED3131]",
        },
        {
          id: "ACCID0002",
          title: "동 (4차선) / 서(4차선)",
          subtitle: "제 3자유로 방면",
          borderStyle: "border-[#ED3131]",
        },
      ],
    },
    {
      id: 2,
      title: "횡단보도",
      subtitle: "제 3자유로 방면",
      count: 250,
      cardData: [
        {
          id: "ACCID0003",
          title: "남 (3차선) / 북(3차선)",
          subtitle: "제 1자유로 방면",
          borderStyle: "border-[#EE9F17]",
        },
        {
          id: "ACCID0004",
          title: "북 (6차선) / 남(6차선)",
          subtitle: "제 2자유로 방면",
          borderStyle: "border-[#EE9F17]",
        },
      ],
    },
    {
      id: 3,
      title: "Palangkaraya",
      subtitle: "제 1자유로 방면",
      count: 150,
      cardData: [
        {
          id: "ACCID0005",
          title: "남 (3차선) / 북(3차선)",
          subtitle: "제 1자유로 방면",
          borderStyle: "border-[#EE9F17]",
        },
        {
          id: "ACCID0006",
          title: "동 (4차선) / 서(4차선)",
          subtitle: "제 3자유로 방면",
          borderStyle: "border-[#EE9F17]",
        },
      ],
    },
  ];

  return (
    <>
      <section className="w-full h-screen overflow-hidden flex flex-col">
        <Header />
        {/* ini maps ya */}
        <div ref={mapRef} className="w-full h-full relative">
          {/* ini maps ya */}

          <div className="_legendTop absolute z-10 w-max h-[31px] top-[25px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-[4px] overflow-hidden">
            <div className="flex gap-[30px] h-full">
              <div className="bg-[#fff] w-fit h-full flex rounded-[4px]">
                <div className="flex items-center bg-[#212527] min-w-[60px] justify-center">
                  <span className="title3bold text-text-white text-center">
                    SITE
                  </span>
                </div>
                <div className="flex w-full gap-[20px] flex flex-row justify-beetwen items-center px-[10px]">
                  <div className="flex flex-row gap-[5px]">
                    <img src={LegendCrosswalk} alt="" />
                    <span className="title3 text-[#4B3C3C]">횡단보도</span>
                  </div>
                  <div className="flex flex-row gap-[5px]">
                    <img src={LegendIntersection} alt="" />
                    <span className="title3 text-[#4B3C3C]">교차로</span>
                  </div>
                </div>
              </div>
              <div className="bg-[#fff] w-fit h-full flex rounded-[4px] overflow-hidden">
                <div className="flex items-center bg-[#212527] min-w-[60px] justify-center">
                  <span className="title3bold text-text-white text-center">
                    시설물
                  </span>
                </div>
                <div className="flex w-full gap-[20px] flex flex-row justify-beetwen items-center px-[10px]">
                  <div className="flex flex-row gap-[5px]">
                    <img src={LegendBillboard} alt="" />
                    <span className="title3 text-[#4B3C3C]">전광판</span>
                    <span className="title3 text-[#4B3C3C]">
                      ( <span className="text-text-danger-500">{mapDisplay?.cnt?.[0]?.vms_error ?? 0}</span> /{" "}
                      <span>{mapDisplay?.cnt?.[0]?.vms_total ?? 0}</span> )
                    </span>
                  </div>
                  <div className="flex flex-row gap-[5px]">
                    <img src={LegendSpeaker} alt="" />
                    <span className="title3 text-[#4B3C3C]">전광판</span>
                    <span className="title3 text-[#4B3C3C]">
                      ( <span className="text-text-danger-500">{mapDisplay?.cnt?.[0]?.speaker_error ?? 0}</span> /{" "}
                      <span>{mapDisplay?.cnt?.[0]?.speaker_total ?? 0}</span> )
                    </span>
                  </div>
                  <div className="flex flex-row gap-[5px]">
                    <img src={LegendSignal} alt="" />
                    <span className="title3 text-[#4B3C3C]">레이더</span>
                    <span className="title3 text-[#4B3C3C]">
                      ( <span className="text-text-danger-500">{mapDisplay?.cnt?.[0]?.detector_error ?? 0}</span> /{" "}
                      <span>{mapDisplay?.cnt?.[0]?.detector_total ?? 0}</span> )
                    </span>
                  </div>
                  <div className="flex flex-row gap-[5px]">
                    <img src={LegendBox} alt="" />
                    <span className="title3 text-[#4B3C3C]">함체</span>
                    <span className="title3 text-[#4B3C3C]">
                      ( <span className="text-text-danger-500">{mapDisplay?.cnt?.[0]?.box_error ?? 0}</span> /{" "}
                      <span>{mapDisplay?.cnt?.[0]?.box_total ?? 0}</span> )
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* bg-left */}
          <div className="flex flex-col gap-[5px] overflow-hidden p-[10px] top-[10px] left-[10px] w-[20%] absolute z-10 h-[calc(100vh-80px)] rounded-lg bg-[rgba(59,71,84,0.52)] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
            <div className="_boxTrafficVihacle flex w-full bg-db-black shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex-col rounded-[5px] overflow-hidden">
              <div className="bg-header-content w-full h-[36px] flex items-center px-[15px]">
                <span className="title3bold text-text-white">
                  차종별 교통량
                </span>
              </div>
              <div className="flex flex-col w-full p-[15px] gap-[15px]">
                <div className="grid grid-cols-4 gap-[15px]">
                  {vehicleData.map((vehicle, index) => (
                    <div
                      key={index}
                      className="w-full items-center flex flex-col gap-[2px]"
                    >
                      <span className="body2medium text-text-white">
                        {vehicle.label}
                      </span>
                      <img src={vehicle.icon} alt={vehicle.label} />
                      <span className="title3bold text-text-white">
                        {vehicle.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="_boxTopFiveTraffic flex w-full bg-db-black shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex-col rounded-[5px] overflow-hidden">
              <div className="bg-header-content w-full h-[36px] flex items-center px-[15px]">
                <span className="title3bold text-text-white">TOP5 교통량</span>
              </div>
              <div className="flex flex-col w-full p-[15px] gap-[15px]">
                <Chart
                  options={options}
                  series={series}
                  type="bar"
                  className={"flex w-full !min-h-[0] h-fit mt-[-30px]"}
                />
              </div>
            </div>

            <div className="_boxListSite flex w-full bg-db-black shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex-col rounded-[5px] overflow-hidden flex-1">
              <div className="bg-header-content w-full h-[36px] flex items-center px-[15px]">
                <span className="title3bold text-text-white">
                  사이트 리스트
                </span>
              </div>
              <div className="flex flex-col w-full py-[15px] px-[10px] gap-[15px] overflow-hidden flex-1">
                <div className="grid grid-cols-2 gap-[10px]">
                  <button
                    className={`w-full title3 py-[5px] border ${
                      selectedButtons.button1
                        ? "bg-transparent border-text-danger-500 text-text-danger-500 text-text-white"
                        : "bg-text-danger-500 text-text-white border-text-danger-500"
                    }`}
                    onClick={() => handleSelect("button1")}
                  >
                    교차로
                  </button>

                  <button
                    className={`w-full title3 py-[5px] border ${
                      selectedButtons.button2
                        ? "bg-transparent border-text-warning-500 text-text-warning-500 text-text-white"
                        : "bg-text-warning-500 text-text-white border-text-warning-500"
                    }`}
                    onClick={() => handleSelect("button2")}
                  >
                    교차로
                  </button>
                  <input
                    type="text"
                    className="input-db-text w-full col-span-2"
                    placeholder="number event"
                  />
                </div>

                <div className="_contentCardList w-full  flex flex-col gap-[5px] overflow-auto h-full">
                  {accordionData.map(({ id, title, count, cardData }) => (
                    <div key={id} className="w-full">
                      {/* Accordion Header */}
                      <div
                        className="flex flex-row w-full justify-between items-center bg-[#404953] border border-[#455665] py-[8px] px-[10px] rounded-[5px]"
                        onClick={() => toggleAccordion(id)}
                      >
                        <div className="flex flex-row w-full items-center gap-[8px]">
                        <img src={IconArrow} alt="" className={`transition-transform duration-300 ${openSections.includes(id) ? "rotate-180" : "rotate-0"}`}/>
                          <span className="title3bold text-text-white">
                            {title}
                          </span>
                        </div>
                        <span className="title3bold text-text-white">
                          {count}
                        </span>
                      </div>

                      {/* Accordion Content */}
                      {openSections.includes(id) && (
                        <div className="flex flex-col gap-[3px] mt-[5px] px-[3px]">
                          {cardData.map(
                            ({ id: cardId, title, subtitle, borderStyle }) => (
                              <CardList
                                key={cardId}
                                type="listSite"
                                customCard={borderStyle}
                                title={title}
                                id={cardId}
                                subtitle={subtitle}
                                isActive={activeCard === cardId}
                                onClick={() => handleCardClickSiteList(cardId)}
                              />
                            )
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* bg-right */}
          <div className="overflow-hidden top-[10px] p-[10px] right-[10px] w-[20%] absolute z-10 h-[calc(100vh-80px)] rounded-lg bg-[rgba(59,71,84,0.52)] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
            <div className="_eventListRight flex w-full bg-db-black shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex-col rounded-[5px] overflow-hidden h-full">
              <div className="bg-header-content w-full h-[36px] flex items-center px-[15px] justify-between">
                <span className="title3bold text-text-white">
                  이벤트 리스트
                </span>
                <span className="title3bold text-text-white">600</span>
              </div>
              <div className="flex flex-col w-full py-[15px] px-[10px] gap-[15px] overflow-hidden flex-1">
                <div className="grid grid-cols-3 gap-[5px]">
                  <button
                    className={`w-full grid grid-cols-1 title3 py-[5px] border ${
                      selectBtnEvent.btnEvent1
                        ? "bg-transparent border-[#135A78] text-text-white"
                        : "bg-[#135A78] text-text-white border-[#135A78]"
                    }`}
                    onClick={() => handleBtnEventList("btnEvent1")}
                  >
                    <span className="text-text-white title3">역주행</span>
                    <span className="text-text-white title2bold">500</span>
                  </button>

                  <button
                    className={`w-full grid grid-cols-1 title3 py-[5px] border ${
                      selectBtnEvent.btnEvent2
                        ? "bg-transparent border-text-danger-500 text-text-danger-500 text-text-white"
                        : "bg-text-danger-500 text-text-white border-text-danger-500"
                    }`}
                    onClick={() => handleBtnEventList("btnEvent2")}
                  >
                    <span className="text-text-white title3">정차</span>
                    <span className="text-text-white title2bold">500</span>
                  </button>

                  <button
                    className={`w-full grid grid-cols-1 title3 py-[5px] border ${
                      selectBtnEvent.btnEvent3
                        ? "bg-transparent border-[#1D7E46]  text-text-white"
                        : "bg-[#1D7E46] text-text-white border-[#1D7E46]"
                    }`}
                    onClick={() => handleBtnEventList("btnEvent3")}
                  >
                    <span className="text-text-white title3">정차</span>
                    <span className="text-text-white title2bold">500</span>
                  </button>

                  <button
                    className={`w-full grid grid-cols-1 title3 py-[5px] border ${
                      selectBtnEvent.btnEvent4
                        ? "bg-transparent border-[#5791AA]  text-text-white"
                        : "bg-[#5791AA] text-text-white border-[#5791AA]"
                    }`}
                    onClick={() => handleBtnEventList("btnEvent4")}
                  >
                    <span className="text-text-white title3">보행자</span>
                    <span className="text-text-white title2bold">500</span>
                  </button>

                  <button
                    className={`w-full grid grid-cols-1 title3 py-[5px] border ${
                      selectBtnEvent.btnEvent5
                        ? "bg-transparent border-[#EE9F17]  text-text-white"
                        : "bg-[#EE9F17] text-text-white border-[#EE9F17]"
                    }`}
                    onClick={() => handleBtnEventList("btnEvent5")}
                  >
                    <span className="text-text-white title3">불법 주정차</span>
                    <span className="text-text-white title2bold">500</span>
                  </button>

                  <button
                    className={`w-full grid grid-cols-1 title3 py-[5px] border ${
                      selectBtnEvent.btnEvent6
                        ? "bg-transparent border-[#F35A19]  text-text-white"
                        : "bg-[#F35A19] text-text-white border-[#F35A19]"
                    }`}
                    onClick={() => handleBtnEventList("btnEvent6")}
                  >
                    <span className="text-text-white title3">정지선 위반</span>
                    <span className="text-text-white title2bold">500</span>
                  </button>
                </div>

                <div className="_containerCardEvntList flex flex-col gap-[3px] overflow-auto h-full">
                  {cardDataEvent.map((card, index) => (
                    <CardList
                      type="event"
                      showId={false}
                      key={index}
                      {...card}
                      isActive={activeIndex === index}
                      onClick={() => handleCardClick(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {showModal && <DbVideoModal data={POIData} onClose={() => setShowModal(false)} />}
        </div>
      </section>
    </>
  );
};

export default MainDashboard;
