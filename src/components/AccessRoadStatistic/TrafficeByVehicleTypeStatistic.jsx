import React from "react";
import Chart from "react-apexcharts";
import "./TrafficeByVehicleTypeStatistic.css";

const series = [
  {
    name: "승용차",
    data: [60, 72, 80, 60],
  },
  {
    name: "오토바이",
    data: [100, 12, 14, 16],
  },
  {
    name: "버스",
    data: [60, 120, 14, 16],
  },
  {
    name: "트럭",
    data: [5, 19, 14, 16],
  },
  {
    name: "승합차",
    data: [5, 19, 74, 90],
  },
  {
    name: "자전거",
    data: [50, 19, 74, 90],
  },
  {
    name: "대형 트럭",
    data: [50, 47, 24, 90],
  },
  {
    name: "기타",
    data: [50, 47, 24, 90],
  },
];

const options = {
  chart: {
    type: "bar",
    background: "transparent",
    foreColor: "#fff",
    toolbar: {
      show: false, // ini buat icon burger biar gak mncul coyu
    },
  },
  xaxis: {
    categories: ["Straight", "Left Turn", "Right Turn", "U-Turn"],
    labels: { style: { colors: "#fff" } },
  },
  yaxis: [
    {
      labels: { style: { colors: "#fff" } }, 
    },
    {
      opposite: true,
      labels: { style: { colors: "#fff" } },
    },
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
  grid: {
    borderColor: "#343A3F",
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
  },
  legend: {
    position: "bottom",
    horizontalAlign: "center",
    //   floating: true,
    markers: {
      width: 10,
      height: 10,
      radius: 50,
      shape: "circle",
      strokeWidth: 0,
      strokeColor: "transparent",
    },
    labels: { colors: "#fff" },
  },
};

const TrafficeByVehicleTypeStatistic = () => {
  return (
    <>
      <Chart
        options={options}
        series={series}
        type="bar"
        height={"100%"}
        className={
          "_chartTrafficeByVehicleType flex m-auto w-full  !min-h-[0] h-fit!"
        }
      />
    </>
  );
};

export default TrafficeByVehicleTypeStatistic;
