import React, { useState, useRef, useEffect } from "react";
import Header from "../../components/Header/Header";

import IconPower from "../../assets/icon/icon-power.svg";
import SignalAbnormal from "../../assets/icon/icon-signal-abnormal.svg";
import SignalNormal from "../../assets/icon/icon-signal-normal.svg";
import IconNetwork from "../../assets/icon/icon-network.svg";
import IconHeater from "../../assets/icon/icon-heater.svg";
import IconFan from "../../assets/icon/icon-fan.svg";
import IconDoorOpen from "../../assets/icon/icon-door-open.svg";
import IconEdge from "../../assets/icon/icon-edge.svg";
import IconCameraVideo from "../../assets/icon/icon-camera-video.svg";

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
  return (
    <>
      <section className="_EquipmentInfContainer w-full h-screen overflow-hidden flex flex-col bg-bg-grey-400">
        <Header />

        <div className="_layoutEquipment w-full h-[calc(100%-60px)] flex flex-row gap-[10px] p-[10px] overflow-hidden">
          {/* left */}
          <section className="leftEq flex! flex-col gap-[10px] w-[25%] h-full overflow-hidden  rounded-[5px]">
            <div className="contentTopLeft w-full flex flex-col flex-1/14 h-full bg-[#000] overflow-hidden rounded-[5px]">
              <div className="bg-header-content w-full h-[36px] flex items-center px-[15px]">
                <span className="title3bold text-text-white">함체 현황</span>
              </div>
              <div className="w-full h-[calc(100%-30px)] grid grid-cols-2 gap-[8px]  overflow-auto p-[10px]">
                <div className="bx-card-status w-full h-full justify-center flex flex-col gap-[5px] p-[10px] border border-[#4D5152] bg-[#2D3238] rounded-[5px]">
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

                <div className="bx-card-status w-full h-full justify-center flex flex-col gap-[5px] p-[10px] border border-[#4D5152] bg-[#2D3238] rounded-[5px]">
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

                <div className="bx-card-status w-full h-full justify-center flex flex-col gap-[5px] p-[10px] border border-[#4D5152] bg-[#2D3238] rounded-[5px]">
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

                <div className="bx-card-status w-full h-full justify-center flex flex-col gap-[5px] p-[10px] border border-[#4D5152] bg-[#2D3238] rounded-[5px]">
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

                <div className="bx-card-status w-full h-full justify-center flex flex-col gap-[5px] p-[10px] border border-[#4D5152] bg-[#2D3238] rounded-[5px]">
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

                <div className="bx-card-status w-full h-full justify-center flex flex-col gap-[5px] p-[10px] border border-[#4D5152] bg-[#2D3238] rounded-[5px]">
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

                <div className="bx-card-status w-full h-full col-span-2 row-span-4 justify-center flex flex-col gap-[5px] p-[10px] border border-[#4D5152] bg-[#2D3238] rounded-[5px]">
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

                {/* <div className="bx-card-status w-full h-full  p-[10px] border border-[#4D5152] bg-[#2D3238] rounded-[5px]"></div>
                <div className="bx-card-status w-full h-full  p-[10px] border border-[#4D5152] bg-[#2D3238] rounded-[5px]"></div>
                <div className="bx-card-status w-full h-full  p-[10px] border border-[#4D5152] bg-[#2D3238] rounded-[5px]"></div>
                <div className="bx-card-status w-full h-full  p-[10px] border border-[#4D5152] bg-[#2D3238] rounded-[5px]"></div>
                <div className="bx-card-status w-full h-full  p-[10px] border border-[#4D5152] bg-[#2D3238] rounded-[5px]"></div>
                <div className="bx-card-status w-full h-full col-span-2 row-span-3 p-[10px] border border-[#4D5152] bg-[#2D3238] rounded-[5px]"></div> */}
              </div>
            </div>

            <div className="contentBottomLeft w-full flex flex-col flex-1 h-full bg-[#000] overflow-hidden rounded-[5px]">
              <div className="bg-header-content w-full h-[36px] flex items-center px-[15px]">
                <span className="title3bold text-text-white">레이더 현황</span>
              </div>
              <div className="w-full h-[calc(100%-30px)] grid grid-cols-1 gap-[8px]  overflow-auto p-[10px]">
                <div className="bx-card-status w-full h-full justify-center flex flex-col gap-[5px] p-[10px] border border-[#4D5152] bg-[#2D3238] rounded-[5px]">
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
                <div className="bx-card-status w-full h-full justify-center flex flex-col gap-[5px] p-[10px] border border-[#4D5152] bg-[#2D3238] rounded-[5px]">
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
                <div className="bx-card-status w-full h-full justify-center flex flex-col gap-[5px] p-[10px] border border-[#4D5152] bg-[#2D3238] rounded-[5px]">
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
                <div className="bx-card-status w-full h-full justify-center flex flex-col gap-[5px] p-[10px] border border-[#4D5152] bg-[#2D3238] rounded-[5px]">
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
              </div>
            </div>
          </section>
          {/* end left */}

          {/* center */}
          <section className="centerEq flex! flex-col gap-[10px] flex-1/6 h-full overflow-hidden rounded-[5px]">
            <div className="contentTopLeft w-full flex flex-1/14 h-full bg-[#000] overflow-hidden rounded-[5px]">
              <div className="bg-header-content w-full h-[36px] flex items-center px-[15px]">
                <span className="title3bold text-text-white">
                  삼성역 사거리 교차로
                </span>
              </div>
            </div>
            <div className="contentBottomLeft w-full flex flex-col gap-[10px] flex-1 h-full  overflow-hidden rounded-[5px]">
              <div className="_contentDetailCenter bg-[#000] w-full flex-1 flex-col h-full overflow-hidden">
                <div className="bg-header-content w-full h-[36px] flex items-center px-[15px]">
                  <span className="title3bold text-text-white">함체 정보</span>
                </div>
              </div>
              <div className="_contentDetailCenter bg-[#000] w-full flex-1/10 flex-col h-full overflow-hidden">
                <div className="bg-header-content w-full h-[36px] flex items-center px-[15px]">
                  <span className="title3bold text-text-white">온/습도</span>
                </div>
              </div>
            </div>
          </section>
          {/* center */}

          {/* right */}
          <section className="rightEq flex! flex-col gap-[10px] w-[21%] h-full  overflow-hidden rounded-[5px]">
            <div className="contentTopLeft w-full flex flex-1 h-full bg-[#000] overflow-hidden rounded-[5px]">
              <div className="bg-header-content w-full h-[36px] flex items-center px-[15px]">
                <span className="title3bold text-text-white">
                  금일 이벤트 현황
                </span>
              </div>
            </div>
            <div className="contentBottomLeft w-full flex flex-1/2 h-full bg-[#000] overflow-hidden rounded-[5px]">
              <div className="bg-header-content w-full h-[36px] flex items-center px-[15px]">
                <span className="title3bold text-text-white">
                  이벤트 리스트
                </span>
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
