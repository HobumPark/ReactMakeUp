import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "../../components/Header/Header";

import IconCar from "../../assets/crossroad/car.svg";
import IconMotor from "../../assets/crossroad/motorcycle.svg";
import IconBus from "../../assets/crossroad/bus.svg";
import IconTruck from "../../assets/crossroad/truck.svg";
import IconVan from "../../assets/crossroad/van.svg";
import IconBicycles from "../../assets/crossroad/bicycle.svg";
import IconHeavyTruck from "../../assets/crossroad/long_truck.svg";
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
    objCompassTimeParams: `start_time=${dateTime.start_time}&end_time=${dateTime.end_date}&site_id=${site_id}&interval=30`,
    objCompassParamsExit: `start_time=${dateTime.start_date}&end_time=${dateTime.end_date}&site_id=${site_id}&moving_direction=108002`,
    objCompassParamsEntry: `start_time=${dateTime.start_date}&end_time=${dateTime.end_date}&site_id=${site_id}&moving_direction=108001`
  })

  const srDetectorData = srDetector?.data;
  const objCntData = objectUnqCnt?.data;
  const objCntCompassTimeData = objCntCompassTime?.data;
  const objCompassEntry = objCntCompassEntry?.data;
  const objCompassExit = objCntCompassExit?.data;

  const [videos, setVideos] = useState([]);


  const [selectedValue, setSelectedValue] = useState("5");
  const radioOptions = [
    { id: "radio-5min", label: "5분", value: "5" },
    { id: "radio-15min", label: "15분", value: "15" },
    { id: "radio-30min", label: "30분", value: "30" },
  ];

  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value); 
  };
 
  const compassMapping = {
    "103001": "N",
    "103002": "NE",
    "103003": "E",
    "103004": "SE",
    "103005": "S",
    "103006": "SW",
    "103007": "W",
    "103008": "NW"
  };

  const roadPasses = srDetectorData?.roads?.map(road => ({
    road_id: road.road_id,
    incoming_compass: compassMapping[road.detector?.incoming_compass] || "Unknown" 
  })) 
  const [selectedIcons, setSelectedIcons] = useState([]);
  const selectedIconsRef = useRef(selectedIcons); 

  const [trafficPosData, setTrafficPosData] = useState([]);

  const fetchDataForRoads = async (roadIds) => {
    try {
      const results = await Promise.all(
        roadIds.map(async (roadId) => {
          const response = await fetch(`http://192.168.20.200:7120/api/dsh/real-time-object?road_id=${roadId}`, {
            method: 'GET',
            credentials: 'include', 
          });
          const data = await response.json();
          return { road_id: roadId, data: data.data };
        })
      );
     
    //  const filteredResults = results.map((road) => ({
    //   ...road,
    //   data: road.data.filter((vehicle) => {
    //       if (selectedIconsRef.current.length === 0) {
    //         return true;  
    //       }
    //       return !selectedIconsRef.current.includes(vehicle.vehicle_type);
    //   }),
    // }));
      setTrafficPosData(results); 
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const roadIds = srDetectorData?.roads?.map(road => road.road_id) || [];

  const [isFocused, setIsFocused] = useState(true);

  useEffect(() => {
    const fetchDataWithInterval = () => {
      fetchDataForRoads(roadIds);

      const interval = setInterval(() => {
        fetchDataForRoads(roadIds); 
      }, 1000); 

      return () => clearInterval(interval);
    };
    if (roadIds.length !== 0){
      return fetchDataWithInterval();
    }

  }, [srDetectorData]); 

  // const onFocus = () => setIsFocused(true);
  // const onBlur = () => setIsFocused(false);

  // useEffect(() => {
  //   window.addEventListener("focus", onFocus);
  //   window.addEventListener("blur", onBlur);
  //   // Specify how to clean up after this effect:
  //   return () => {
  //       window.removeEventListener("focus", onFocus);
  //       window.removeEventListener("blur", onBlur);
  //   };
  // },[]);
  
  const [roads, setRoads] = useState([]);


  useEffect(() => {
    const data = srDetectorData?.roads?.map((road) => ({
      road_id: road.road_id,
      stream_url: road.detector?.stream_url
    })) || [];
      setVideos(data);
      setRoads(roadPasses);
  }, [srDetectorData]);



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
  

  
  //untuk filter mobil


  const vehicleIcons = [
    { id: "301001", src: IconCar, alt: "Car" },
    { id: "301002", src: IconVan, alt: "Van" },
    { id: "301003", src: IconTruck, alt: "Truck" },
    { id: "301004", src: IconHeavyTruck, alt: "Heavy Truck" },
    { id: "301005", src: IconBus, alt: "Bus" },
    { id: "301006", src: IconMotor, alt: "Motorcycle" },
    { id: "301007", src: IconBicycles, alt: "Bicycle" },
  ];
  

  const handleClick = (id) => {
    setSelectedIcons((prev) => {
      if (prev.includes(id)) {
        return prev.filter((iconId) => iconId !== id);
      } else {
        return [...prev, id];
      }
    });
  }
  //untuk filter mobil


  // useEffect(() => {
  //   selectedIconsRef.current = selectedIcons;
  //   const filteredData = trafficPosData?.map((road) => {
  //     const filteredVehicles = road?.data?.filter(
  //       (vehicle) => !selectedIcons.includes(vehicle.vehicle_type)
  //     );
  //     return {
  //       ...road,
  //       data: filteredVehicles,
  //     };
  //   });
  //   setTrafficPosData(filteredData);
  // }, [selectedIcons]);


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


  
  const orderedDirectionsTop = ["NW", "N", "NE"];
  const orderedDirectionsMiddle= ["W", "E"];
  const orderedDirectionsBottom= ["SW", "S", "SE"];


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
                            <img src={video.stream_url} className="w-full h-full object-cover"  />
                              <img src={IconRightCircle} alt="스트리밍" className="cursor-pointer absolute right-[20px] top-[10px]"
                                onClick={() => {
                                  window.open(`/dashboard/accessroad?site_id=${site_id}&road_id=${video.road_id}`, "_blank", "width=800,height=600");
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
                            checked={selectedValue === option.value} 
                            onChange={handleRadioChange} 
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
                      {vehicleIcons.map((icon) => (
                        <img
                          key={icon.id}
                          src={icon.src}
                          alt={icon.alt}
                          className={`cursor-pointer transition-opacity duration-300 ${
                            selectedIcons.includes(icon.id)
                              ? "opacity-50"
                              : "opacity-100"
                          }`}
                          onClick={() => handleClick(icon.id)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="_imgMapsArea w-full h-full flex bg-[#1E2223] relative">
                  {roads && roads.length > 0 ? (
                        <CrossRoadCanvas roads={roads} trafficPosData={trafficPosData} />
                      ) : (
                        <div></div>
                      )}

                    {/* <img
                      src={imgMaps}
                      alt=""
                      className=" w-full h-full object-cover"
                    /> */}
                    <div className="_totalTop absolute p-[10px] justify-between z-20 flex flex-row w-full">
                    {orderedDirectionsTop.map((direction, index) => {
                        const road = srDetectorData?.roads?.find(road => compassMapping[road.detector.incoming_compass] === direction);
                        return (
                          <VehicleCount
                            key={index}
                            customeStyle={road ? "" : "invisible"}
                            title={road ? road.name : 'Road Name'}
                            entryCount={road ? road.entryCount || "0" : "0"}
                            exitCount={road ? road.exitCount || "0" : "0"}
                            countTurnLeft={road ? road.countTurnLeft || "0" : "0"}
                            countStraight={road ? road.countStraight || "0" : "0"}
                            countTrunRight={road ? road.countTrunRight || "0" : "0"}
                          />
                        );
                      })}
                    </div>
                    <div className="_totalCenter absolute top-[48%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-[10px] justify-between z-20 flex flex-row w-full">
                    {orderedDirectionsMiddle.map((direction, index) => {
                        const road = srDetectorData?.roads?.find(road => compassMapping[road.detector.incoming_compass] === direction);
                        return (
                          <VehicleCount
                            key={index}
                            customeStyle={road ? "" : "invisible"}
                            title={road ? road.name : 'Road Name'}
                            entryCount={road ? road.entryCount || "0" : "0"}
                            exitCount={road ? road.exitCount || "0" : "0"}
                            countTurnLeft={road ? road.countTurnLeft || "0" : "0"}
                            countStraight={road ? road.countStraight || "0" : "0"}
                            countTrunRight={road ? road.countTrunRight || "0" : "0"}
                          />
                        );
                      })}
                    </div>

                    <div className="_totalBottom absolute bottom-[0px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-[10px] justify-between z-20 flex flex-row w-full">
                    {orderedDirectionsBottom.map((direction, index) => {
                        const road = srDetectorData?.roads?.find(road => compassMapping[road.detector.incoming_compass] === direction);
                        return (
                          <VehicleCount
                            key={index}
                            customeStyle={road ? "" : "invisible"}
                            title={road ? road.name : 'Road Name'}
                            entryCount={road ? road.entryCount || "0" : "0"}
                            exitCount={road ? road.exitCount || "0" : "0"}
                            countTurnLeft={road ? road.countTurnLeft || "0" : "0"}
                            countStraight={road ? road.countStraight || "0" : "0"}
                            countTrunRight={road ? road.countTrunRight || "0" : "0"}
                          />
                        );
                      })}
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
                <TrafficeByDirection data = {objCntCompassTimeData || []} />
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
                    <TrafficeByVehicle data={objCntData || []} />
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
                <EntryRate data={objCompassEntry || []}/>
              </div>
            </section>
            <section className=" flex flex-1 h-[full] overflow-hidden bg-[#000] rounded-[5px]">
              <div className="bg-header-content w-full h-[36px] flex items-center px-[15px]">
                <span className="title3bold text-text-white">
                  진출 비율 (Exit Rate)
                </span>
              </div>
              <div className="_containerStatisticTrafficbyDirection overflow-hidden h-[calc(100%-30px)] p-[10px]">
                <ExitRate data={objCompassExit || []} />
              </div>
            </section>
          </div>
        </div>
      </section>
    </>
  );
};

export default CrossRoadDashboard;
