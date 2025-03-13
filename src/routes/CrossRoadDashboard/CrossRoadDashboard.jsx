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
import IconRightCircle from "../../assets/icon/icon-db-right-circle.svg";
// import imgMaps from "../../assets/icon/img-lane-maps.svg";
import imgMaps from "../../assets/icon/img-lane-maps-2.svg";

import VehicleCount from "../../components/VehicleCount/VehicleCount";

import TrafficeByDirection from "../../components/CrossRoadStatistic/TrafficeByDirection";
import TrafficeByVehicle from "../../components/CrossRoadStatistic/TrafficeByVehicle";
import EntryRate from "../../components/CrossRoadStatistic/EntryRate";
import ExitRate from "../../components/CrossRoadStatistic/ExitRate";
import { useLocation } from "react-router-dom";
import useSRDetector from "../../hooks/useSRDetector";
import useObjectCnt from "../../hooks/useObjectCnt";
import { getLocalISOString } from "../../utils/date";
import { CrossRoadCanvas } from "../../components/CrossRoadSvgMap/CrossRoadCanvas";


const CrossRoadDashboard = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const site_id = queryParams.get('id'); 
  const { srDetector }  = useSRDetector({
    id: site_id
  })

  const today = new Date();
  const midnight = new Date(new Date().setHours(0, 0, 0, 0));
  const startTime = new Date(today.getTime() - 2 * 60 * 60 * 1000);
  const [dateTime] = useState({
    start_date:getLocalISOString(midnight),
    end_date:getLocalISOString(today),
    start_time: getLocalISOString(startTime), 
  });

  const { objectUnqCnt, objCntCompassTime, objCntCompassEntry,objCntCompassExit } = useObjectCnt({
    objectUnqCntParams: `start_time=${dateTime.start_date}&end_time=${dateTime.end_date}&site_id=${site_id}`,
    objCompassTimeParams: `start_time=${dateTime.start_time}&end_time=${dateTime.end_date}&site_id=${site_id}&interval=15`,
    objCompassParamsExit: `start_time=${dateTime.start_date}&end_time=${dateTime.end_date}&site_id=${site_id}&moving_direction=108002`,
    objCompassParamsEntry: `start_time=${dateTime.start_date}&end_time=${dateTime.end_date}&site_id=${site_id}&moving_direction=108001`
  })

  const srDetectorData = srDetector?.data;
  const objCntData = objectUnqCnt?.data;
  const objCntCompassTimeData = objCntCompassTime?.data;
  const objCompassEntry = objCntCompassEntry?.data;
  const objCompassExit = objCntCompassExit?.data;

  const [videos, setVideos] = useState([
    srDetectorData?.roads?.map((road) => road.detector?.stream_url) || []
  ]);
  
  const [trafficPosData, setTrafficPosData] = useState([
    {
      road_id: "1",
      data: [
        {
        "vehicle_type": "301003",
        "xrelpos": 300.31,
        "yrelpos": 0.769999999999982
        },
        {
        "vehicle_type": "301001",
        "xrelpos": 200.05,
        "yrelpos": -200.44
        },
        {
        "vehicle_type": "301005",
        "xrelpos": 50.01,
        "yrelpos": -42.44
        }
      ]
    },
    {
      road_id: "2",
      data: [
        {
        "vehicle_type": "301003",
        "xrelpos": 300.31,
        "yrelpos": 0.769999999999982
        },
        {
        "vehicle_type": "301001",
        "xrelpos": 200.05,
        "yrelpos": -200.44
        },
        {
        "vehicle_type": "301005",
        "xrelpos": 50.01,
        "yrelpos": -42.44
        }
      ]
    },
    {
      road_id: "3",
      data: [
        {
        "vehicle_type": "301003",
        "xrelpos": 300.31,
        "yrelpos": 0.769999999999982
        },
        {
        "vehicle_type": "301001",
        "xrelpos": 200.05,
        "yrelpos": -200.44
        },
        {
        "vehicle_type": "301005",
        "xrelpos": 50.01,
        "yrelpos": -42.44
        }
      ]
    },
    {
      road_id: "4",
      data: [
        {
        "vehicle_type": "301003",
        "xrelpos": 300.31,
        "yrelpos": 0.769999999999982
        },
        {
        "vehicle_type": "301001",
        "xrelpos": 200.05,
        "yrelpos": -200.44
        },
        {
        "vehicle_type": "301005",
        "xrelpos": 50.01,
        "yrelpos": -42.44
        }
      ]
    }
  ])
  
  const [roads, setRoads] = useState([
    {"road_id": 1, "incoming_compass": "E"},
    {"road_id": 2, "incoming_compass": "S"},
    {"road_id": 3, "incoming_compass": "W"},
    {"road_id": 4, "incoming_compass": "N"},
    {"road_id": 5, "incoming_compass": "NE"},
    {"road_id": 6, "incoming_compass": "SE"},
    {"road_id": 7, "incoming_compass": "SW"},
    {"road_id": 8, "incoming_compass": "NW"},
  ])

  // Fungsi untuk menentukan jumlah kolom grid berdasarkan jumlah video
  const getGridCols = (count) => {
    if (count === 1) return "grid-cols-1"; 
    if (count === 2) return "grid-cols-2"; 
    if (count === 3) return "grid-cols-2"; 
    if (count === 4) return "grid-cols-2"; 
    if (count === 5) return "grid-cols-3"; 
    if (count === 6) return "grid-cols-3"; 
    // if (count <= 4) return "grid-cols-2 grid-rows-2 md:grid-cols-4";
    return "grid-cols-4";
  };
  
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


  // Tambah video baru secara dinamis
  const addVideo = () => {
    const newVideo = `video${videos.length + 1}.mp4`; // Simulasi nama video
    setVideos([...videos, newVideo]);
  };

  // Hapus video terakhir
  const removeVideo = () => {
    if (videos.length > 0) {
      setVideos(videos.slice(0, -1));
    }
  };


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
                {/* <div className={`w-full h-[calc(100%-35px)] grid ${getGridCols(videos.length)} gap-2 p-4`}>
                    {videos.map((video, index) => (
                      <div key={index} className="_boxVideo w-full h-full flex bg-[#171A1C] overflow-hidden">
                        <video src={video} className="w-full h-full object-cover" controls />
                      </div>
                    ))}
                  </div> */}
                  <div className={`w-full h-[calc(100%-35px)] grid ${videos.length > 0 ? getGridCols(videos.length) : "grid-cols-1"} gap-2 p-4`}>
                      {videos.length > 0 ? (
                        videos.map((video, index) => (
                          <div key={index} className="_boxVideo w-full h-full relative flex bg-[] overflow-hidden">
                            <video src={video} className="w-full h-full object-cover" controls />
                              <img src={IconRightCircle} alt="" className="cursor-pointer absolute right-[20px] top-[10px]"
                                onClick={() => {
                                  window.open("/dashboard/accessroad", "_blank", "width=800,height=600");
                                }}
                              />
                            {/* <div className="text-text-white absolute right-[20px] top-[10px]">ok</div> */}
                          </div>
                        ))
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white bg-[#171A1C] p-4 rounded-md">
                          No Video
                        </div>
                      )}
                    </div>
              {/* <div className="w-full h-[calc(100%-35px)] grid grid-cols-4 grid-rows-4 gap-[5px] p-[10px]">
                <div className="_boxVideo w-full h-full flex bg-[#171A1C] overflow-hidden "></div>
                <div className="_boxVideo w-full h-full flex bg-[#171A1C] overflow-hidden "></div>
                <div className="_boxVideo w-full h-full flex bg-[#171A1C] overflow-hidden "></div>
                <div className="_boxVideo w-full h-full flex bg-[#171A1C] overflow-hidden "></div>
                <div className="_boxVideo w-full h-full flex bg-[#171A1C] overflow-hidden "></div>
                <div className="_boxVideo w-full h-full flex bg-[#171A1C] overflow-hidden "></div>
                <div className="_boxVideo w-full h-full flex bg-[#171A1C] overflow-hidden "></div>
                <div className="_boxVideo w-full h-full flex bg-[#171A1C] overflow-hidden "></div>
                <div className="_boxVideo w-full h-full flex bg-[#171A1C] overflow-hidden "></div>
    
              </div> */}
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
                    <CrossRoadCanvas roads={roads} trafficPosData={trafficPosData}></CrossRoadCanvas>
                    {/* <img
                      src={imgMaps}
                      alt=""
                      className=" w-full h-full object-cover"
                    /> */}
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
                <TrafficeByDirection data = {objCntCompassTimeData} />
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
                         { objCntData?.["301001"]}
                          </span>
                        </div>
                      </div>
                      <div className="w-full flex-col gap-2">
                        <span className="text-text-white body2">오토바이</span>
                        <div className="flex gap-[2px] flex-row w-full items-center">
                          <img src={IconMotor} alt="" />
                          <span className="text-text-white body2">/</span>
                          <span className="text-text-white body2 title3bold">
                          { objCntData?.["301006"]}
                          </span>
                        </div>
                      </div>
                      <div className="w-full flex-col gap-2">
                        <span className="text-text-white body2">버스</span>
                        <div className="flex gap-[2px] flex-row w-full items-center">
                          <img src={IconBus} alt="" />
                          <span className="text-text-white body2">/</span>
                          <span className="text-text-white body2 title3bold">
                          { objCntData?.["301005"]}
                          </span>
                        </div>
                      </div>
                      <div className="w-full flex-col gap-2">
                        <span className="text-text-white body2">트럭</span>
                        <div className="flex gap-[2px] flex-row w-full items-center">
                          <img src={IconTruck} alt="" />
                          <span className="text-text-white body2">/</span>
                          <span className="text-text-white body2 title3bold">
                          { objCntData?.["301003"]}
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
                          { objCntData?.["301002"]}
                          </span>
                        </div>
                      </div>
                      <div className="w-full flex-col gap-2">
                        <span className="text-text-white body2">자전거</span>
                        <div className="flex gap-[2px] flex-row w-full items-center">
                          <img src={IconBicycles} alt="" />
                          <span className="text-text-white body2">/</span>
                          <span className="text-text-white body2 title3bold">
                          { objCntData?.["301007"]}
                          </span>
                        </div>
                      </div>
                      <div className="w-full flex-col gap-2">
                        <span className="text-text-white body2">대형 트럭</span>
                        <div className="flex gap-[2px] flex-row w-full items-center">
                          <img src={IconHeavyTruck} alt="" />
                          <span className="text-text-white body2">/</span>
                          <span className="text-text-white body2 title3bold">
                          { objCntData?.["301004"]}
                          </span>
                        </div>
                      </div>
                      <div className="w-full flex-col gap-2">
                        <span className="text-text-white body2">기타</span>
                        <div className="flex gap-[2px] flex-row w-full items-center">
                          <img src={IconUnknown} alt="" />
                          <span className="text-text-white body2">/</span>
                          <span className="text-text-white body2 title3bold">
                          { objCntData?.["301008"]}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center flex-1/2 w-full h-full relative">
                    <TrafficeByVehicle data={objCntData} />
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
                <EntryRate data={objCompassEntry}/>
              </div>
            </section>
            <section className=" flex flex-1 h-[full] overflow-hidden bg-[#000] rounded-[5px]">
              <div className="bg-header-content w-full h-[36px] flex items-center px-[15px]">
                <span className="title3bold text-text-white">
                  진출 비율 (Exit Rate)
                </span>
              </div>
              <div className="_containerStatisticTrafficbyDirection overflow-hidden h-[calc(100%-30px)] p-[10px]">
                <ExitRate data={objCompassExit} />
              </div>
            </section>
          </div>
        </div>
      </section>
    </>
  );
};

export default CrossRoadDashboard;
