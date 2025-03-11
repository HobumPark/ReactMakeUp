import React from "react";
import Chart from "react-apexcharts";
import "./TrafficeByVehicle.css"

const TrafficeByVehicle = ({data}) => {
  
  const categoryMapping = {
    "301000": 7, // 기타 (Etc)
    "301001": 0, // 승용차 (Car)
    "301002": 4, // 승합차 (Van)
    "301003": 3, // 트럭 (Truck)
    "301004": 6, // 대형 트럭 (Large Truck)
    "301005": 2, // 버스 (Bus)
    "301006": 1, // 오토바이 (Motorcycle)
    "301007": 5  // 자전거 (Bicycle)
  };
  
  const series = new Array(8).fill(0);
  
  Object.keys(data || {}).forEach((key) => {
    if (categoryMapping[key] !== undefined) {
      series[categoryMapping[key]] = data[key] ;
    }
  });
  
  const isAllZero = series.every((val) => val === 0);
  const adjustedSeries = series.map((val) => (val === 0 ? 0.01 : val));


  const options = {
    chart: {
      type: "pie",
      background: "transparent",
      
    },
    labels: [
      "승용차",
      "오토바이",
      "버스",
      "트럭",
      "승합차",
      "자전거",
      "대형 트럭",
      "기타",
    ],
    colors: [
      "#3F07E2",
      "#D533B2",
      "#21A957",
      "#FFA500",
      "#AD00FF",
      "#6A1E55",
      "#26EFFC",
      "#FB5555",
    ],
    stroke: {
      show: false,
    },
    legend: {
      position: "right",
      horizontalAlign: "right", 
      offsetX: 0, 
      offsetY: 0, 
      labels: {
        colors: "#fff",
        useSeriesColors: false,
        fontSize: "12px", 
      },
      markers: {
        width: 12, 
        height: 12,
        radius: 12, 
        strokeWidth: 0, 
        strokeColor: "transparent",
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => (isAllZero ? "0%" : `${Math.round(val)}%`),
      style: { fontSize: "12px", fontWeight: "bold", colors: ["#fff"] },
    },
    tooltip: {
    y: {
      formatter: (val) => (val < 0.01 ? "0%" : `${Math.round(val)}%`),
    },
  },
  };


  return (
    <>
      <Chart
        options={options}
        series={adjustedSeries}
        type="pie"
        height={"100%"}
        className={"_chartTrafficevehicle flex w-full !min-h-[0] h-fit!"}
      />
    </>
  );
};

export default TrafficeByVehicle;
