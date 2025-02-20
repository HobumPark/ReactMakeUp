import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/Header/Header";
import "./MainDashboard.css";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import { Tile as TileLayer } from "ol/layer";
import { OSM } from "ol/source";
import { fromLonLat } from "ol/proj";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";

import CardList from "../../components/CardList/CardList";

import Chart from "react-apexcharts";

import IconCrosswalk from "../../assets/icon/icon-db-crosswalk.svg";
import IconIntersection from "../../assets/icon/icon-db-intersection.svg";
import IconCar from "../../assets/icon/icon-db-car.svg";
import IconMotor from "../../assets/icon/icon-db-motorcycles.svg";
import IconBus from "../../assets/icon/icon-db-bus.svg";
import IconTruck from "../../assets/icon/icon-db-truck.svg";
import IconVan from "../../assets/icon/icon-db-van.svg";
import IconBicycles from "../../assets/icon/icon-db-bicycles.svg";
import IconHeavyTruck from "../../assets/icon/icon-db-heavy-truck.svg";
import IconUnknown from "../../assets/icon/icon-db-unknown.svg";
import IconArrow from "../../assets/icon/icon-db-arrow-down.svg";

const MainDashboard = () => {
  const [selectedButtons, setSelectedButtons] = useState({
    button1: false,
    button2: false,
  });

  const handleSelect = (button) => {
    setSelectedButtons((prev) => ({
      ...prev,
      [button]: !prev[button], // Toggle select/unselect for each button
    }));
  };

  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // ✅ Inisialisasi peta
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

    const iconFeature = new Feature({
      geometry: new Point(fromLonLat([106.8456, -6.2088])), // Lokasi Jakarta
    });

    iconFeature.setStyle(
      new Style({
        image: new Icon({
          src: IconCrosswalk,
          scale: 1,
        }),
      })
    );

    const iconFeature2 = new Feature({
      geometry: new Point(fromLonLat([106.85, -6.21])),
    });

    iconFeature2.setStyle(
      new Style({
        image: new Icon({
          src: IconIntersection,
          scale: 1,
        }),
      })
    );

    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [iconFeature, iconFeature2],
      }),
    });

    olMap.addLayer(vectorLayer);

    olMap.on("click", (event) => {
      const feature = olMap.forEachFeatureAtPixel(event.pixel, (feature) => {
        return feature;
      });

      if (feature) {
        if (feature === iconFeature) {
          alert("Icon Crosswalk clicked!");
        } else if (feature === iconFeature2) {
          alert("Icon Intersection clicked!");
        }
      }
    });

    return () => olMap.setTarget(null);
  }, []);

  const vehicleData = [
    { label: "승용차", icon: IconCar, count: 300 },
    { label: "오토바이", icon: IconMotor, count: 300 },
    { label: "버스", icon: IconBus, count: 300 },
    { label: "트럭", icon: IconTruck, count: 300 },
    { label: "승합차", icon: IconVan, count: 300 },
    { label: "자전거", icon: IconBicycles, count: 300 },
    { label: "대형 트럭", icon: IconHeavyTruck, count: 300 },
    { label: "기타", icon: IconUnknown, count: 300 },
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

  // Fungsi untuk toggle status accordion
  const toggleAccordion = (id) => {
    setOpenSections((prev) => {
      if (prev.includes(id)) {
        return prev.filter((sectionId) => sectionId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  const accordionData = [
    {
      id: 1,
      title: "북 (6차선) / 남(6차선)",
      subtitle: "제 2자유로 방면",
      count: 400,
      cardData: [
        {
          id: "ACCID0001",
          title: "북 (6차선) / 남(6차선)",
          subtitle: "제 2자유로 방면",
          borderStyle: "border-red-500",
        },
        {
          id: "ACCID0002",
          title: "동 (4차선) / 서(4차선)",
          subtitle: "제 3자유로 방면",
          borderStyle: "border-green-500",
        },
      ],
    },
    {
      id: 2,
      title: "동 (4차선) / 서(4차선)",
      subtitle: "제 3자유로 방면",
      count: 250,
      cardData: [
        {
          id: "ACCID0003",
          title: "남 (3차선) / 북(3차선)",
          subtitle: "제 1자유로 방면",
          borderStyle: "border-blue-500",
        },
        {
          id: "ACCID0004",
          title: "북 (6차선) / 남(6차선)",
          subtitle: "제 2자유로 방면",
          borderStyle: "border-yellow-500",
        },
      ],
    },
    {
      id: 3,
      title: "남 (3차선) / 북(3차선)",
      subtitle: "제 1자유로 방면",
      count: 150,
      cardData: [
        {
          id: "ACCID0005",
          title: "남 (3차선) / 북(3차선)",
          subtitle: "제 1자유로 방면",
          borderStyle: "border-purple-500",
        },
        {
          id: "ACCID0006",
          title: "동 (4차선) / 서(4차선)",
          subtitle: "제 3자유로 방면",
          borderStyle: "border-teal-500",
        },
      ],
    },
  ];

  return (
    <>
      <section className="w-full h-screen overflow-hidden flex flex-col">
        <Header />
        <div ref={mapRef} className="w-full h-full relative">
          {/* bg-left */}
          <div class="flex flex-col gap-[5px] overflow-hidden p-[10px] top-[10px] left-[10px] w-[20%] absolute z-10 h-[calc(100vh-80px)] rounded-lg bg-[rgba(59,71,84,0.52)] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
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
                  사이트 리스트cvb cb
                </span>
              </div>
              <div className="flex flex-col w-full p-[15px] gap-[15px] overflow-hidden flex-1">
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

                <div className="_contentCardList w-full  flex flex-col gap-[8px] overflow-auto h-full">
                  {accordionData.map(
                    ({ id, title, subtitle, count, cardData }) => (
                      <div key={id} className="w-full">
                        <div
                          className="flex flex-row w-full justify-between items-center bg-[#404953] border border-[#455665] py-[8px] px-[10px] rounded-[5px]"
                          onClick={() => toggleAccordion(id)} 
                        >
                          <div className="flex flex-row w-full items-center gap-[8px]">
                            <img src={IconArrow} alt="" />
                            <span className="title3bold text-text-white">{title}</span>
                          </div>
                          <span className="title3bold text-text-white">{count}</span>
                        </div>
                        {openSections.includes(id) && ( 
                          <div className="flex flex-col gap-[3px] mt-[5px] px-[3px]">
                            {cardData.map(
                              ({
                                id: cardId,
                                title,
                                subtitle,
                                borderStyle,
                              }) => (
                                <CardList
                                  key={cardId}
                                  customCard={borderStyle} // Mengirimkan kelas borderStyle ke CardList
                                  title={title}
                                  id={cardId}
                                  subtitle={subtitle}
                                />
                              )
                            )}
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* bg-right */}
          <div class="overflow-hidden top-[10px] right-[10px] w-[20%] absolute z-10 h-[calc(100vh-80px)] rounded-lg bg-[rgba(59,71,84,0.52)] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"></div>
        </div>
      </section>
    </>
  );
};

export default MainDashboard;
