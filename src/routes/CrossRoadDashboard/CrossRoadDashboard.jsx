import React, { useState } from "react";
import Header from "../../components/Header/Header";

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
import ExitRate from "../../components/CrossRoadStatistic/ExitRate";

const CrossRoadDashboard = () => {
  const radioOptions = [
    { id: "radio-5min", label: "5분", value: "5" },
    { id: "radio-15min", label: "15분", value: "15" },
    { id: "radio-30min", label: "30분", value: "30" },
  ];

  //untuk filter mobil
  const [selectedIcons, setSelectedIcons] = useState([]);

  const vehicleIcons = [
    { src: IconCar, alt: "Car" },
    { src: IconVan, alt: "Van" },
    { src: IconMotor, alt: "Motor" },
    { src: IconBicycles, alt: "Bicycle" },
    { src: IconBus, alt: "Bus" },
    { src: IconHeavyTruck, alt: "Heavy Truck" },
    { src: IconTruck, alt: "Truck" },
  ];

  const handleClick = (index) => {
    setSelectedIcons((prev) => {
      if (prev.includes(index)) {
        return prev.filter((iconIndex) => iconIndex !== index);
      } else {
        return [...prev, index];
      }
    });
  };
  //untuk filter mobil

  return (
    <>
      <section className="_CrossRoadContainer w-full h-screen overflow-hidden flex flex-col bg-bg-grey-400">
        <Header />

        <div className="_layoutCrossRoad w-full h-[calc(100%-60px)] flex flex-col gap-[10px] p-[10px] overflow-hidden">
          <div className="flex  flex-row gap-[10px] flex-2 overflow-hidden">
            <section className="leftToproad flex flex-1/6 h-full bg-[#000] overflow-hidden rounded-[5px]">
              <div className="bg-header-content w-full h-[36px] flex items-center px-[15px]">
                <span className="title3bold text-text-white">
                  삼성역 사거리 교차로
                </span>
              </div>
              <div className="w-full h-[calc(100%-35px)] grid grid-cols-2 gap-[5px] p-[10px]">
                <div className="_boxVideo w-full h-full flex bg-[#171A1C] overflow-hidden "></div>
                <div className="_boxVideo w-full h-full flex bg-[#171A1C] overflow-hidden "></div>
                <div className="_boxVideo w-full h-full flex bg-[#171A1C] overflow-hidden "></div>
                <div className="_boxVideo w-full h-full flex bg-[#171A1C] overflow-hidden "></div>
              </div>
            </section>
            <section className="rightToproad flex flex-1 h-FULL bg-[#000] overflow-hidden rounded-[5px] ">
              <section className="leftToproad flex flex-1/6 h-full bg-[#000] overflow-hidden rounded-[5px]">
                <div className="bg-header-content w-full h-[36px] flex items-center px-[15px]">
                  <span className="title3bold text-text-white">
                    교차로 교통량 현황
                  </span>
                </div>
                <div className="w-full h-[calc(100%-35px)] gap-[5px]  overflow-hidden">
                  <div className="_boxFilterRadio flex w-full justify-between px-[10px] py-[5px]">
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
                    <div className="_boxFilterByVihacle bg-red w-fit flex gap-[27px] flex-row bg-bg-grey-500 py-[5px] px-[10px]">
                      <span className="text-text-white title3medium">ALL</span>
                      {vehicleIcons.map((icon, index) => (
                        <img
                          key={index}
                          src={icon.src}
                          alt={icon.alt}
                          className={`cursor-pointer transition-opacity duration-300 ${
                            selectedIcons.includes(index)
                              ? "opacity-50"
                              : "opacity-100"
                          }`}
                          onClick={() => handleClick(index)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="_imgMapsArea w-full h-full flex bg-[#1E2223] relative">
                    <img
                      src={imgMaps}
                      alt=""
                      className=" w-full h-full object-cover"
                    />
                    <div className="_totalTop absolute p-[10px] justify-between z-20 flex flex-row w-full">
                      <VehicleCount
                        customeStyle=""
                        title="갈현교차로 방면 [북]"
                        entryCount="300"
                        exitCount="300"
                        countTurnLeft="1200"
                        countStraight="1200"
                        countTrunRight="1200"
                      />
                      <VehicleCount
                        customeStyle=""
                        title="Rangkas Bitung"
                        entryCount="300"
                        exitCount="300"
                        countTurnLeft="1200"
                        countStraight="1200"
                        countTrunRight="1200"
                      />
                      <VehicleCount
                        customeStyle=""
                        title="Bandung"
                        entryCount="300"
                        exitCount="300"
                        countTurnLeft="1200"
                        countStraight="1200"
                        countTrunRight="1200"
                      />
                    </div>
                    <div className="_totalCenter absolute top-[48%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-[10px] justify-between z-20 flex flex-row w-full">
                      <VehicleCount
                        customeStyle=""
                        title="jakarta"
                        entryCount="300"
                        exitCount="300"
                        countTurnLeft="1200"
                        countStraight="1200"
                        countTrunRight="1200"
                      />
                      <VehicleCount
                        customeStyle=""
                        title="surabaya"
                        entryCount="300"
                        exitCount="300"
                        countTurnLeft="1200"
                        countStraight="1200"
                        countTrunRight="1200"
                      />
                    </div>

                    <div className="_totalBottom absolute bottom-[0px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-[10px] justify-between z-20 flex flex-row w-full">
                      <VehicleCount
                        customeStyle=""
                        title="Sulawesi"
                        entryCount="300"
                        exitCount="300"
                        countTurnLeft="1200"
                        countStraight="1200"
                        countTrunRight="1200"
                      />
                      <VehicleCount
                        customeStyle="Karawang"
                        title="surabaya"
                        entryCount="300"
                        exitCount="300"
                        countTurnLeft="1200"
                        countStraight="1200"
                        countTrunRight="1200"
                      />
                      <VehicleCount
                        customeStyle=""
                        title="Aceh"
                        entryCount="300"
                        exitCount="300"
                        countTurnLeft="1200"
                        countStraight="1200"
                        countTrunRight="1200"
                      />
                    </div>
                  </div>
                </div>
              </section>
            </section>
          </div>
          <div className="flex  flex-row gap-[10px] flex-1 overflow-hidden">
            <section className=" flex flex-1/12 h-[full] overflow-hidden bg-[#000] rounded-[5px]">
              <div className="bg-header-content w-full h-[36px] flex items-center px-[15px]">
                <span className="title3bold text-text-white">
                  방향별 교통량 (Trafice by Direction)
                </span>
              </div>
              <div className="_containerStatisticTrafficbyDirection overflow-hidden h-[calc(100%-30px)] p-[10px]">
                <TrafficeByDirection />
              </div>
            </section>
            <section className=" flex flex-1/12 h-[full] overflow-hidden bg-[#000] rounded-[5px]">
              <div className="bg-header-content w-full h-[36px] flex items-center px-[15px]">
                <span className="title3bold text-text-white">
                  차종별 교통량 (traffic by Vehicle Type)
                </span>
              </div>
              <div className="_containerStatisticTrafficbyDirection overflow-hidden h-[calc(100%-30px)] p-[10px]">
                <div className="flex flex-row gap-[10px] h-full items-center justify-between overflow-hidden">
                  <div className="flex gap-[10px] flex-row justify-between w-full items-center flex-1">
                    <div className="w-full flex flex-col h-full gap-[15px]">
                      <div className="w-full flex-col gap-2">
                        <span className="text-text-white body2">승용차</span>
                        <div className="flex gap-[2px] flex-row w-full items-center">
                          <img src={IconCar} alt="" />
                          <span className="text-text-white body2">/</span>
                          <span className="text-text-white body2 title3bold">
                            300
                          </span>
                        </div>
                      </div>
                      <div className="w-full flex-col gap-2">
                        <span className="text-text-white body2">오토바이</span>
                        <div className="flex gap-[2px] flex-row w-full items-center">
                          <img src={IconMotor} alt="" />
                          <span className="text-text-white body2">/</span>
                          <span className="text-text-white body2 title3bold">
                            300
                          </span>
                        </div>
                      </div>
                      <div className="w-full flex-col gap-2">
                        <span className="text-text-white body2">버스</span>
                        <div className="flex gap-[2px] flex-row w-full items-center">
                          <img src={IconBus} alt="" />
                          <span className="text-text-white body2">/</span>
                          <span className="text-text-white body2 title3bold">
                            300
                          </span>
                        </div>
                      </div>
                      <div className="w-full flex-col gap-2">
                        <span className="text-text-white body2">트럭</span>
                        <div className="flex gap-[2px] flex-row w-full items-center">
                          <img src={IconTruck} alt="" />
                          <span className="text-text-white body2">/</span>
                          <span className="text-text-white body2 title3bold">
                            300
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full flex flex-col h-full gap-[15px]">
                      <div className="w-full flex-col gap-2">
                        <span className="text-text-white body2">승합차</span>
                        <div className="flex gap-[2px] flex-row w-full items-center">
                          <img src={IconVan} alt="" />
                          <span className="text-text-white body2">/</span>
                          <span className="text-text-white body2 title3bold">
                            300
                          </span>
                        </div>
                      </div>
                      <div className="w-full flex-col gap-2">
                        <span className="text-text-white body2">자전거</span>
                        <div className="flex gap-[2px] flex-row w-full items-center">
                          <img src={IconBicycles} alt="" />
                          <span className="text-text-white body2">/</span>
                          <span className="text-text-white body2 title3bold">
                            300
                          </span>
                        </div>
                      </div>
                      <div className="w-full flex-col gap-2">
                        <span className="text-text-white body2">대형 트럭</span>
                        <div className="flex gap-[2px] flex-row w-full items-center">
                          <img src={IconHeavyTruck} alt="" />
                          <span className="text-text-white body2">/</span>
                          <span className="text-text-white body2 title3bold">
                            300
                          </span>
                        </div>
                      </div>
                      <div className="w-full flex-col gap-2">
                        <span className="text-text-white body2">기타</span>
                        <div className="flex gap-[2px] flex-row w-full items-center">
                          <img src={IconUnknown} alt="" />
                          <span className="text-text-white body2">/</span>
                          <span className="text-text-white body2 title3bold">
                            300
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center flex-1/2 w-full h-full relative">
                    <TrafficeByVehicle />
                  </div>
                </div>
              </div>
            </section>
            <section className=" flex flex-1 h-[full] overflow-hidden bg-[#000] rounded-[5px]">
              <div className="bg-header-content w-full h-[36px] flex items-center px-[15px]">
                <span className="title3bold text-text-white">
                  진입 비율 (Entry Rate)
                </span>
              </div>
              <div className="_containerStatisticTrafficbyDirection overflow-hidden h-[calc(100%-30px)] p-[10px]">
                <EntryRate />
              </div>
            </section>
            <section className=" flex flex-1 h-[full] overflow-hidden bg-[#000] rounded-[5px]">
              <div className="bg-header-content w-full h-[36px] flex items-center px-[15px]">
                <span className="title3bold text-text-white">
                  진출 비율 (Exit Rate)
                </span>
              </div>
              <div className="_containerStatisticTrafficbyDirection overflow-hidden h-[calc(100%-30px)] p-[10px]">
                <ExitRate />
              </div>
            </section>
          </div>
        </div>
      </section>
    </>
  );
};

export default CrossRoadDashboard;
