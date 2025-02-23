import React, { useState } from "react";
import Header from "../../components/Header/Header";
import "./AccessRoadDashboard.css";
import { ReactTabulator } from "react-tabulator";

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
import ExitRAte from "../../components/CrossRoadStatistic/ExitRAte";

import PieChartOut from "../../components/AccessRoadStatistic/PieChartOut";
import PieChartIn from "../../components/AccessRoadStatistic/PieChartIn";
import InOutTrafficeOverTimeStatistic from "../../components/AccessRoadStatistic/InOutTrafficeOverTimeStatistic";
import TrafficeByVehicleTypeStatistic from "../../components/AccessRoadStatistic/TrafficeByVehicleTypeStatistic";
import TrafficeByMovementStatistic from "../../components/AccessRoadStatistic/TrafficeByMovementStatistic";


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

  return (
    <>
      <section className="_AccessRoadContainer w-full h-screen overflow-hidden flex flex-col bg-bg-grey-400">
        <Header />

        <div className="_layoutAccessRoad w-full h-[calc(100%-60px)] flex flex-col gap-[10px] p-[10px] overflow-hidden">
          <div className="flex  flex-row gap-[10px] flex-2 overflow-hidden">
            <section className="leftToproad flex flex-1 h-full bg-[#000] overflow-hidden rounded-[5px]">
              <div className="bg-header-content w-full h-[36px] flex items-center px-[15px]">
                <span className="title3bold text-text-white">
                  제 2자유로 방면
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
              </section>

              <section className=" flex flex-1/6 h-[full] overflow-hidden bg-[#000] rounded-[5px]">
                <div className="bg-header-content w-full h-[36px] flex items-center px-[15px]">
                  <span className="title3bold text-text-white">
                    시간별 진입/진출 교통량 (Inbound/outbound traffic over time)
                  </span>
                </div>
                <div className="_containerStatisticInOutTraffice overflow-hidden h-[calc(100%-30px)] p-[10px]">
                  <InOutTrafficeOverTimeStatistic />
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
