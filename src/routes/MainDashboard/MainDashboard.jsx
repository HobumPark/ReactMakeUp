import React, { useCallback, useEffect, useRef, useState } from "react";
import Header from "../../components/Header/Header";
import "./MainDashboard.css";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
// import { Tile as TileLayer } from "ol/layer";
import { Tile as TileLayer } from "ol/layer";
import { OSM } from "ol/source";
import BingMaps from 'ol/source/BingMaps';  
import { XYZ } from "ol/source";
import { boundingExtent } from "ol/extent";
import Cluster from "ol/source/Cluster";
import { Circle as CircleStyle, Fill, Stroke, Text } from "ol/style";
import { fromLonLat, get as getProjection } from "ol/proj";
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
import { useTranslation } from "react-i18next";
import useTrafficEvent from "../../hooks/useTrafficEvent";
import useObjectCnt from "../../hooks/useObjectCnt";

const MainDashboard = () => {
  const {t} = useTranslation();
  const [POIData, setPOIData] = useState("");
  const [isHidden, setIsHidden] = useState([]);
  const [poiItem, setPoiItem] = useState([]);
  const today = new Date();
  const midnight = new Date(new Date().setHours(0, 0, 0, 0));
  const [dateTime] = useState({
    start_date:formatFullDateTime(midnight),
    end_date:formatFullDateTime(today)
  });
  const [selectedButtons, setSelectedButtons] = useState({
    button1: false,
    button2: false,
  });
  const siteTypeMap = {
    button1: "102001",
    button2: "102002",
  };
  const [inputValue, setInputValue] = useState("");
  const[siteRoadParams, setSiteRoadParams] = useState('site_type=102001&site_type=102002');
  const [trafficEventParams, setTrafficEventParams] = useState('')
  
  
  const {mapInitialView, mapDisplayPOI, siteRoad } = useDashboard({
    siteRoadParams: siteRoadParams,
    trafficEventParams: trafficEventParams
  });

  const {objectUnqCntRoad, objectUnqCnt } = useObjectCnt({
    objectUnqCntParams: `start_time=${dateTime.start_date}&end_time=${dateTime.end_date}`,
    objectUnqCntRoadParams: `start_time=${dateTime.start_date}&end_time=${dateTime.end_date}&top=5`,
  });

  const { trafficEventTime } = useTrafficEvent({
    trafficEventParams: trafficEventParams
  });
  
  const mapInitial = mapInitialView?.data;
  const mapDisplay = mapDisplayPOI?.data;
  const siteRoadData = siteRoad?.data;
  const trafficEventTimeData = trafficEventTime?.data;
  const objectUnqCntData = objectUnqCnt?.data;
  const objectUnqCntRoadData = objectUnqCntRoad?.data; 

  useEffect(() => {
    if (mapDisplay?.poi) {
      setPoiItem(mapDisplay.poi);
    }
  }, [mapDisplay]); 



  const updateSiteRoadParams = () => {
    const resultInput = inputValue ? `input=${inputValue}` : "";
    const siteType = Object.keys(selectedButtons)
      .filter((key) => !selectedButtons[key]) 
      .map((key) => siteTypeMap[key]);
  
    const resultSelect = siteType.length > 0 ? `&site_type=${siteType.join("&site_type=")}` : "";
    const result = resultInput + resultSelect;
    setSiteRoadParams(result);
  };
  

  const handleSearch = useCallback((event) => {
    if (event.key === "Enter") {
      updateSiteRoadParams();
    }
  }, [inputValue]);

  const handleSelect = (button) => {
    setSelectedButtons((prev) => ({
      ...prev,
      [button]: !prev[button],
    }));
  };

  useEffect(() => {
    updateSiteRoadParams(); 
  }, [selectedButtons, inputValue]);

  const [selectBtnEvent, setselectBtnEvent] = useState({
    EVT_TP_WWD: false,
    EVT_TP_STP: false,
    EVT_TP_SPD: false,
    EVT_TP_JW: false,
    EVT_TP_ILP: false,
    EVT_TP_SLV: false,
  });

  const handleBtnEventList = (button) => {
    setselectBtnEvent((prev) => ({
      ...prev,
      [button]: !prev[button],
    }));
  };

  const updateTrafficEventParams = () => {
    const resultInput = dateTime
      ? `start_time=${dateTime.start_date}&end_time=${dateTime.end_date}`
      : "";
    const typeKeys = Object.keys(selectBtnEvent).filter((key) => !selectBtnEvent[key]);
    const resultSelect = typeKeys.length > 0 ? `&type=${typeKeys.join("&type=")}` : "";
    const size = '&size=100'
    const result = resultInput + resultSelect + size;
    setTrafficEventParams(result);
  };

  useEffect(() => {
    updateTrafficEventParams(); 
  }, [selectBtnEvent]);

  const [activeIndex, setActiveIndex] = useState(null);


  const eventTypeColorMap = {
    EVT_TP_WWD: "border-[#135A78]",
    EVT_TP_STP: "border-[#ED3131]",
    EVT_TP_SPD: "border-[#1D7E46]",
    EVT_TP_JW:  "border-[#5791AA]",
    EVT_TP_ILP: "border-[#EE9F17]",
    EVT_TP_SLV: "border-[#F35A19]",  
  };
  
  
  const cardDataEvent = (trafficEventTimeData?.items?.length > 0 
    ? trafficEventTimeData.items.map((event) => ({
        customCard: eventTypeColorMap[event.type_code] || "border-[#000000]",
        title: `${event.site_name} ${event.road_name}`,
        subtitle: `${event.vehicle_type} / ${event.lane_direction} / ${event.lane_moving_direction}`,
        date: event.timestamp,
        data: event
      }))
    : []);

  const mapRef = useRef(null);
  const olMapRef = useRef(null);
  const poiLayerRef = useRef(null);
  const clusterLayerRef = useRef(null);
  
  const [showModal, setShowModal] = useState(false);

  const togglePOIVisibility = (type) => {
    if (isHidden.includes(type)) {
      setIsHidden(isHidden.filter(item => item !== type));
    } else {
      setIsHidden([...isHidden, type]);
    }
  };
  
  
  useEffect(() => {
    const updatedPoiData = mapDisplay?.poi.filter((item) => !isHidden.includes(item.type));
    setPoiItem(updatedPoiData);
  }, [isHidden, mapDisplay]); 


  const opik = "5363C20D-EDEA-3436-88BC-B45CC374A9B4";
  useEffect(() => {
    if (!mapRef.current) return;

    const layerMap = {
      base: new TileLayer({
        title: "Base",
        visible: true,
        type: 'base',
        source: new XYZ({
            url: `http://api.vworld.kr/req/wmts/1.0.0/${opik}/Base/{z}/{y}/{x}.png`,
        }),
      }),
      osm: new TileLayer({
        title: "osm",
        visible: false,
        source: new OSM(),
      }),
      road: new TileLayer({
        title: "road",
        visible: false,
        source: new BingMaps({
          key: "Ag0RC261GIS2piKGzsg9RmnvrT8GHg9jVY27kPWUs28axMxdSfGJhCf2unSg6eeg",  
        }),
      }),
      canvaslight: new TileLayer({
        title: "canvaslight",
        visible: false,
        source: new OSM(),
      }),
      canvasdark: new TileLayer({
        title: "canvasdark",
        visible: false,
        source: new OSM(),
      }),
      satellite: new TileLayer({
        title: "satellite",
        visible: false,
        source: new BingMaps({
          key: "Ag0RC261GIS2piKGzsg9RmnvrT8GHg9jVY27kPWUs28axMxdSfGJhCf2unSg6eeg",  
          imagerySet: "AerialWithLabelsOnDemand",  
        }),
      }),
    };


    const enhanceOption = new Colorize();
    enhanceOption.setFilter({
      operation: "enhance",
      value: Number("0.1"),
    });
    layerMap.osm.addFilter(enhanceOption);
    layerMap.base.addFilter(enhanceOption);
    layerMap.canvasdark.addFilter(enhanceOption);

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
    layerMap.osm.addFilter(colorOption);
    layerMap.base.addFilter(colorOption);

    const blueOption = new Colorize();
    blueOption.setFilter({
      operation: "color",
      red: Number("50"),
      green: Number("30"),
      blue: Number("0"),
      value: Number("1"),
    });
    layerMap.canvasdark.addFilter(blueOption);

    // 'saturation' option => highlight lines on the land
    const saturationOption = new Colorize();
    saturationOption.setFilter({
      operation: "enhance",
      value: Number("0.1"),
    });
    layerMap.osm.addFilter(saturationOption);
    layerMap.osm.addFilter(saturationOption);
    layerMap.canvasdark.addFilter(saturationOption);


    var invert_filter = new Colorize();
    layerMap.osm.addFilter(invert_filter);
    layerMap.canvasdark.addFilter(invert_filter);
    layerMap.base.addFilter(invert_filter);
    invert_filter.setFilter("invert");

    const layers = [
      layerMap["base"],
      layerMap["osm"],
      layerMap["road"],
      layerMap["canvaslight"],
      layerMap["satellite"],
      layerMap["canvasdark"],
    ];

    // Map definition
    const olMap = new Map({
      target: mapRef.current,
      layers: layers,

      view: new View({
        center: fromLonLat([mapInitial?.[0]?.view_lng, mapInitial?.[0]?.view_lat]),
        zoom: mapInitial?.[0]?.view_zoom,
      }),
      
    });

    const changeMapView = () => {
      if (olMap) {
        const newCenter = fromLonLat([mapInitial?.[0]?.view_lng, mapInitial?.[0]?.view_lat]);
        const newZoom = mapInitial?.[0]?.view_zoom || 5;
  
        olMap.getView().animate({
          center: newCenter,
          zoom: newZoom,
          duration: 1000, 
        });
      }
    };

    const changeLayer = (layerTitle) => {
      Object.keys(layerMap).forEach((title) => {
        const layer = layerMap[title];
        if (title === layerTitle) {
          layer.setVisible(true); 
        } else {
          layer.setVisible(false); 
        }
      });
    };

    setTimeout(() => {
      const zoomControl = document.querySelector(".ol-zoom");

      if (zoomControl) {
        zoomControl
          .querySelectorAll(".custom-icon-button")
          .forEach((btn) => btn.remove());

        const icons = [
          {
            src: IconReturn,
            title: "return",
            action: () => changeMapView(),
          },
          {
            src: IconDefault,
            title: "default",
            action: () => changeLayer("base"),
          },
          {
            src: IconRoadMap,
            title: "Location Icon",
            action: () => changeLayer("canvaslight"),
          },
          {
            src: IconDarkMap,
            title: "Dark Map",
            action: () => changeLayer("canvasdark"),
          },
          {
            src: IconSatelite,
            title: "satelit",
            action: () => changeLayer("satellite"),
          },
        ];

        icons.forEach((iconData) => {
          const newButton = document.createElement("button");
          newButton.innerHTML = `<img src="${iconData.src}" alt="${iconData.title}" width="20" height="20">`;
          newButton.className = "custom-icon-button";
          newButton.title = iconData.title;

          newButton.onclick = iconData.action;

          zoomControl.appendChild(newButton);
        });
      }
    }, 100);
    
    olMapRef.current = olMap;

    return () => {
      if (olMapRef.current) {
        olMapRef.current.setTarget(null);
        olMapRef.current = null; // Reset the map reference
      }
    };
  }, [mapInitial, mapDisplay]);


  useEffect(() => {
    const iconMapping = {
      "102001": IconIntersection,  
      "102002": IconCrosswalk,     
      "221001": IconSpeaker,     
      "221002": IconVms,         
      "detector": IconDetector,  
      "box": IconBox               
    };
  //
  
    const features = poiItem?.map(item => {
      const iconSrc = iconMapping[item.type] || IconDefault;  
      const iconFeature = new Feature({
        geometry: new Point(fromLonLat([item.lng, item.lat])),
      });
  
      iconFeature.setStyle(
        new Style({
          image: new Icon({
            src: iconSrc,
            scale: 1 + (olMapRef.current.getView().getZoom() - 10) * 0.1,
          }),
        })
      );
      
      iconFeature.setId(item.type);
      return iconFeature;
    });
  
    // const view = olMapRef.current.getView();
    // const resolution = view.getResolution(); 
    // const distanceInMeters = 3000; 
    // const distanceInPixels = distanceInMeters / resolution; 
  
    const clusterSource = new Cluster({
      distance: 100, 
      source: new VectorSource({
        features: features,
      }),
    });

  
    // **Layer Clustering**
    const clusterLayer = new VectorLayer({
      source: clusterSource,
      zIndex:100,
      style: function (feature) {
        const clusteredFeatures = feature.get("features");
        const size = clusteredFeatures.length;
  
        if (size > 1) {
          return new Style({
            image: new CircleStyle({
              radius: 50 + size * 10,
              fill: new Fill({ color: "rgba(255, 0, 0, 2)" }),
              stroke: new Stroke({ color: "#fff", width: 2 }),
            }),
            text: new Text({
              text: size.toString(),
              fill: new Fill({ color: "#fff" }),
              stroke: new Stroke({ color: "#000", width: 2 }),
              font: 'bold 25px Arial',
            }),
          });
        } else {
          return clusteredFeatures[0].getStyle();
        }
      },
    });
  
    const poiLayer = new VectorLayer({
      source: new VectorSource({
        features: features,
      }), 
    });

    

    
  if (poiLayerRef.current) {
    olMapRef.current.removeLayer(poiLayerRef.current);
  }
  if (clusterLayerRef.current) {
    olMapRef.current.removeLayer(clusterLayerRef.current);
  }

  poiLayerRef.current = poiLayer;
  clusterLayerRef.current = clusterLayer;

  olMapRef.current.addLayer(poiLayerRef.current);
  olMapRef.current.addLayer(clusterLayerRef.current);
  
  
    olMapRef.current.on("click", (event) => {
      let isClusterClicked = false;
    
      olMapRef.current.forEachFeatureAtPixel(event.pixel, (feature) => {
        const clusteredFeatures = feature.get("features");
    
        if (clusteredFeatures && clusteredFeatures.length > 1) {
          const extent = boundingExtent(
            clusteredFeatures.map((f) => f.getGeometry().getCoordinates())
          );
          // const minZoom = 100; 
  
          // olMapRef.current.getView().fit(extent, { 
          //   duration: 1000, 
          //   padding: [200, 200, 200, 200], 
          //   maxZoom: minZoom 
          // });
          olMapRef.current.getView().fit(extent, { 
            duration: 1000, 
            padding: [50, 50, 50, 50], 
            maxZoom: 15
          });
  
    
          isClusterClicked = true; 
          return true; 
        }
      });
    
      if (isClusterClicked) return;
    
      olMapRef.current.forEachFeatureAtPixel(event.pixel, (feature) => {
        const featureId = feature.getId();
        const clickedItem = mapDisplay.poi?.find((item) => item.type === featureId);
    
        if (clickedItem) {
          switch (clickedItem.type) {
            case "box":
              window.open(`/dashboard/equipment-info?id=${clickedItem.id}`, "_blank", "width=800,height=600");
              break;
            case "102001":
              window.open(`/dashboard/crossroad?id=${clickedItem.id}`, "_blank", "width=800,height=600");
              break;
            case "102002":
              window.open(`/dashboard/crosswalk?site_id=${clickedItem.id}&road_id=${clickedItem.road_id}`, "_blank", "width=800,height=600");
              break;
            case "detector":
              setPOIData(clickedItem);
              setShowModal(true);
              break;
            default:
              alert("Unknown icon clicked!");
          }
        }
      });
    });
    poiLayerRef.current.setVisible(true);
    olMapRef.current.on("moveend", function () {
      poiLayerRef.current.setVisible(true);
    });
    
    //
  }, [poiItem]);

  const moveMapToPOI = (id) => {
    const mapEntry = mapDisplay?.poi?.find((entry) => entry.id === id);
    if (mapEntry) {
      const { lat, lng } = mapEntry;
      console.log(id, lat, lng);
      
      if (lat && lng) {
        olMapRef.current.getView().animate({
          center: fromLonLat([lng, lat]),
          zoom: 17,  // Langsung ke zoom level 17
          duration: 1000  // Durasi animasi
        });
      } else {
        console.error("Invalid coordinates for the selected POI");
      }
    } else {
      console.error("No POI found with the given id");
    }
  };





  const vehicleData = [
    { label: "승용차", icon: IconCar, count: objectUnqCntData?.["301001"] },
    { label: "오토바이", icon: IconMotor, count: objectUnqCntData?.["301006"] },
    { label: "버스", icon: IconBus, count: objectUnqCntData?.["301005"] },
    { label: "트럭", icon: IconTruck, count: objectUnqCntData?.["301003"] },
    { label: "승합차", icon: IconVan, count: objectUnqCntData?.["301002"] },
    { label: "자전거", icon: IconBicycles, count: objectUnqCntData?.["301007"] },
    { label: "대형 트럭", icon: IconHeavyTruck, count: objectUnqCntData?.["301004"] },
    { label: "기타", icon: IconUnknown, count: objectUnqCntData?.["301000"] },
  ];
  const maxYValue = Math.max(...(objectUnqCntRoadData?.map(item => item.total_cnt) || [0]));


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
      categories: objectUnqCntRoadData?.map(item => item.road_name),
      labels: {
        style: { colors: "#D1D2D3", fontSize: "10px" },
      },
      axisBorder: {
        show: true,
        color: "#343A3F",
      },
      min: 0,
      max: maxYValue,
      tickAmount: 6
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
      data: objectUnqCntRoadData?.map(item => item.total_cnt), 
    },
  ];

  const [openSections, setOpenSections] = useState([]);
  const [activeCard, setActiveCard] = useState(null);

  const toggleAccordion = (id) => {
    setOpenSections((prev) =>
      prev.includes(id)
        ? prev.filter((sectionId) => sectionId !== id)
        : [...prev, id]
    );
 
    moveMapToPOI(id);
  };

  const handleCardClickSiteList = (cardId, id) => {
    setActiveCard((prev) => (prev === cardId ? null : cardId));
    moveMapToPOI(id);
  };

  const accordionData = siteRoadData?.sites?.map((site) => {
    const borderStyle = site.type === '102001' ? 'border-[#ED3131]' : 'border-[#EE9F17]';
  
    const cardData = site.roads && site.roads.length > 0
    ? site.roads.map((road) => ({
        id: `ACCID${road.road_id}`,
        title: `${t(road.incoming_compass)} / ${t(road.outgoing_compass)} / ${road.incoming_lane_cnt} / ${road.outgoing_lane_cnt}`,
        subtitle: road.name,
        borderStyle: borderStyle,
      }))
    : [];
  
    return {
      id: site.site_id,
      title: site.name,
      count: site.road_cnt,
      cardData: cardData,
    };
  });

  const handleCardClick = (index, data) => {
    setActiveIndex(index);
    moveMapToPOI(data.site_id)
  };

  const handleDoubleClick = (data) => {
    const newWindow = window.open(
      `/img-modal?id=${data._id}`,
      "_blank",
      "width=800,height=600,left=200,top=100"
    );
    if (newWindow) {
      newWindow.dataId = data._id; 
      newWindow.focus();
    }
  };
 

  const totalEVT = [
    "EVT_TP_WWD",
    "EVT_TP_STP",
    "EVT_TP_SPD",
    "EVT_TP_JW",
    "EVT_TP_ILP",
    "EVT_TP_SLV"
  ].reduce((sum, eventType) => sum + (trafficEventTimeData?.cnt?.[eventType] || 0), 0);
   

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
                  <div className="flex flex-row gap-[5px] cursor-pointer" onClick={() => togglePOIVisibility("102002")}>
                    <img src={LegendCrosswalk} alt="" />
                    <span className={`title3 ${isHidden.includes('102002') ? 'text-gray-300' : 'text-[#4B3C3C]'}`}>횡단보도</span>
                    </div>
                  <div className="flex flex-row gap-[5px] cursor-pointer" onClick={() => togglePOIVisibility("102001")}>
                    <img src={LegendIntersection} alt="" />
                    <span className={`title3 ${isHidden.includes('102001') ? 'text-gray-300' : 'text-[#4B3C3C]'}`}>교차로</span>
                  </div>
                </div>
              </div>
              <div className="bg-[#fff] w-fit h-full flex rounded-[4px] overflow-hidden">
                <div className="flex items-center bg-[#212527] min-w-[60px] justify-center" >
                  <span className="title3bold text-text-white text-center">
                    시설물
                  </span>
                </div>
                <div className="flex w-full gap-[20px] flex flex-row justify-beetwen items-center px-[10px]">
                  <div className="flex flex-row gap-[5px]" onClick={() => togglePOIVisibility("221002")}>
                    <img src={LegendBillboard} alt="" />
                    <span className={`title3 ${isHidden.includes('221002') ? 'text-gray-300' : 'text-[#4B3C3C]'}`}>전광판</span>
                    <span className="title3 text-[#4B3C3C]">
                      ( <span className="text-text-danger-500">{mapDisplay?.cnt?.[0]?.vms_error ?? 0}</span> /{" "}
                      <span>{mapDisplay?.cnt?.[0]?.vms_total ?? 0}</span> )
                    </span>
                  </div>
                  <div className="flex flex-row gap-[5px]" onClick={() => togglePOIVisibility("221001")}>
                    <img src={LegendSpeaker} alt="" />
                    <span className={`title3 ${isHidden.includes('221001') ? 'text-gray-300' : 'text-[#4B3C3C]'}`}>전광판</span>
                    <span className="title3 text-[#4B3C3C]">
                      ( <span className="text-text-danger-500">{mapDisplay?.cnt?.[0]?.speaker_error ?? 0}</span> /{" "}
                      <span>{mapDisplay?.cnt?.[0]?.speaker_total ?? 0}</span> )
                    </span>
                  </div>
                  <div className="flex flex-row gap-[5px]" onClick={() => togglePOIVisibility("detector")}>
                    <img src={LegendSignal} alt="" />
                    <span className={`title3 ${isHidden.includes('detector') ? 'text-gray-300' : 'text-[#4B3C3C]'}`}>레이더</span>
                    <span className="title3 text-[#4B3C3C]">
                      ( <span className="text-text-danger-500">{mapDisplay?.cnt?.[0]?.detector_error ?? 0}</span> /{" "}
                      <span>{mapDisplay?.cnt?.[0]?.detector_total ?? 0}</span> )
                    </span>
                  </div>
                  <div className="flex flex-row gap-[5px]" onClick={() => togglePOIVisibility("box")}>
                    <img src={LegendBox} alt="" />
                    <span className={`title3 ${isHidden.includes('box') ? 'text-gray-300' : 'text-[#4B3C3C]'}`}>함체</span>
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
                    교차로  {siteRoadData?.crosswalk_cnt ?? 0}
                  </button>

                  <button
                    className={`w-full title3 py-[5px] border ${
                      selectedButtons.button2
                        ? "bg-transparent border-text-warning-500 text-text-warning-500 text-text-white"
                        : "bg-text-warning-500 text-text-white border-text-warning-500"
                    }`}
                    onClick={() => handleSelect("button2")}
                  >
                  횡단보도  {siteRoadData?.intersection_cnt ?? 0}
                  </button>
                  <input
                    type="text"
                    className="input-db-text w-full col-span-2"
                    placeholder="접근로명 / 접근로ID"
                    onKeyUp={handleSearch}
                    value={inputValue} 
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </div>

                <div className="_contentCardList w-full  flex flex-col gap-[5px] overflow-auto h-full">
                  {accordionData?.map(({ id, title, count, cardData }) => (
                    <div key={id} className="w-full">
                      {/* Accordion Header */}
                      <div
                        className="flex flex-row w-full justify-between items-center bg-[#404953] border border-[#455665] py-[8px] px-[10px] rounded-[5px]  whitespace-nowrap"
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
                                onClick={() => handleCardClickSiteList(cardId, id)}
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
                <span className="title3bold text-text-white">{totalEVT}</span>
              </div>
              <div className="flex flex-col w-full py-[15px] px-[10px] gap-[15px] overflow-hidden flex-1">
                <div className="grid grid-cols-3 gap-[5px]">
                  <button
                    className={`w-full grid grid-cols-1 title3 py-[5px] border ${
                      selectBtnEvent.EVT_TP_WWD
                        ? "bg-transparent border-[#135A78] text-text-white"
                        : "bg-[#135A78] text-text-white border-[#135A78]"
                    }`}
                    onClick={() => handleBtnEventList("EVT_TP_WWD")}
                  >
                    <span className="text-text-white title3">{t('EVT_TP_WWD')}</span>
                    <span className="text-text-white title2bold">{trafficEventTimeData?.cnt?.EVT_TP_WWD}</span>
                  </button>

                  <button
                    className={`w-full grid grid-cols-1 title3 py-[5px] border ${
                      selectBtnEvent.EVT_TP_STP
                        ? "bg-transparent border-text-danger-500 text-text-danger-500 text-text-white"
                        : "bg-text-danger-500 text-text-white border-text-danger-500"
                    }`}
                    onClick={() => handleBtnEventList("EVT_TP_STP")}
                  >
                    <span className="text-text-white title3">{t('EVT_TP_STP')}</span>
                    <span className="text-text-white title2bold">{trafficEventTimeData?.cnt?.EVT_TP_STP}</span>
                  </button>

                  <button
                    className={`w-full grid grid-cols-1 title3 py-[5px] border ${
                      selectBtnEvent.EVT_TP_SPD
                        ? "bg-transparent border-[#1D7E46]  text-text-white"
                        : "bg-[#1D7E46] text-text-white border-[#1D7E46]"
                    }`}
                    onClick={() => handleBtnEventList("EVT_TP_SPD")}
                  >
                    <span className="text-text-white title3">{t('EVT_TP_SPD')}</span>
                    <span className="text-text-white title2bold">{trafficEventTimeData?.cnt?.EVT_TP_SPD}</span>
                  </button>

                  <button
                    className={`w-full grid grid-cols-1 title3 py-[5px] border ${
                      selectBtnEvent.EVT_TP_JW
                        ? "bg-transparent border-[#5791AA]  text-text-white"
                        : "bg-[#5791AA] text-text-white border-[#5791AA]"
                    }`}
                    onClick={() => handleBtnEventList("EVT_TP_JW")}
                  >
                    <span className="text-text-white title3">{t('EVT_TP_JW')}</span>
                    <span className="text-text-white title2bold">{trafficEventTimeData?.cnt?.EVT_TP_JW}</span>
                  </button>

                  <button
                    className={`w-full grid grid-cols-1 title3 py-[5px] border ${
                      selectBtnEvent.EVT_TP_ILP
                        ? "bg-transparent border-[#EE9F17]  text-text-white"
                        : "bg-[#EE9F17] text-text-white border-[#EE9F17]"
                    }`}
                    onClick={() => handleBtnEventList("EVT_TP_ILP")}
                  >
                    <span className="text-text-white title3">{t('EVT_TP_ILP')}</span>
                    <span className="text-text-white title2bold">{trafficEventTimeData?.cnt?.EVT_TP_ILP}</span>
                  </button>

                  <button
                    className={`w-full grid grid-cols-1 title3 py-[5px] border ${
                      selectBtnEvent.EVT_TP_SLV
                        ? "bg-transparent border-[#F35A19]  text-text-white"
                        : "bg-[#F35A19] text-text-white border-[#F35A19]"
                    }`}
                    onClick={() => handleBtnEventList("EVT_TP_SLV")}
                  >
                    <span className="text-text-white title3">{t('EVT_TP_SLV')}</span>
                    <span className="text-text-white title2bold">{trafficEventTimeData?.cnt?.EVT_TP_SLV}</span>
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
                      onClick={() => handleCardClick(index, card.data)}
                      onDoubleClick={() => handleDoubleClick(card.data)} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {showModal && <DbVideoModal data={POIData} currentPage={'main'} onClose={() => setShowModal(false)} />}
        </div>
      </section>
    </>
  );
};

export default MainDashboard;
