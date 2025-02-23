import React from "react";
import Chart from "react-apexcharts";
import "./TrafficeByMovementStatistic.css";

const series = [
  { name: "Straight", data: [5, 10, 15, 20, 12, 14, 18] },
  { name: "Left turn", data: [8, 14, 10, 16, 18, 22, 20] },
  { name: "Right turn", data: [6, 12, 8, 14, 16, 18, 19] },
  { name: "U-turn", data: [4, 8, 6, 10, 12, 14, 13] },
  { name: "LOS", data: [18, 14, 16, 22, 24, 20, 21] }, // Garis tambahan untuk Level of Service
];

const options = {
  chart: {
    type: "line",
    background: "transparent",
    foreColor: "#fff",
    toolbar: { show: false },
  },
  xaxis: {
    categories: ["09:00", "09:15", "09:30", "10:00", "10:15", "10:30"],
    labels: { style: { colors: "#fff" } },
  },
  yaxis: [
    {
      // min: 0,
      // max: 24,
      labels: { show: false },
      labels: { style: { colors: "#fff" } },
    },
    {
      opposite: true,
      // min: 0,
      // max: 24,
      labels: {
        style: { colors: "#fff" },
        formatter: (value) => {
          if (value >= 22) return "FFF";
          if (value >= 20) return "FF";
          if (value >= 18) return "F";
          if (value >= 14) return "E";
          if (value >= 10) return "D";
          if (value >= 6) return "C";
          if (value >= 2) return "B";
          return "A";
        },
      },
    },
  ],
  colors: ["#3F07E2", "#D533B2", "#00E396", "#FFA500", "#DFEAEB"],
  stroke: {
    width: [2, 2, 2, 2, 3],
    curve: "smooth",
  },
  annotations: {
    points: [
      {
        x: "09:00",
        y: 18,
        marker: { size: 5, fillColor: "#fff" },
        label: {
          text: "A",
          borderColor: "#dc3545",
          style: { background: "#fff", color: "#000" },
        },
      },
      {
        x: "09:15",
        y: 12,
        marker: { size: 5, fillColor: "#fff" },
        label: {
          text: "B",
          borderColor: "#dc3545",
          style: { background: "#fff", color: "#000" },
        },
      },
      {
        x: "10:00",
        y: 17,
        marker: { size: 5, fillColor: "#fff" },
        label: {
          text: "F",
          borderColor: "#dc3545",
          style: { background: "#fff", color: "#000" },
        },
      },
      {
        x: "10:30",
        y: 14,
        marker: { size: 5, fillColor: "#fff" },
        label: {
          text: "C",
          borderColor: "#dc3545",
          style: { background: "#fff", color: "#000" },
        },
      },
      {
        x: "10:45",
        y: 10,
        marker: { size: 5, fillColor: "#fff" },
        label: {
          text: "D",
          borderColor: "#dc3545",
          style: { background: "#fff", color: "#000" },
        },
      },
    ],
  },
  markers: {
    size: [0, 0, 0, 0, 5],
    colors: ["#fff"],
    strokeWidth: 1,
  },
  grid: {
    borderColor: "#343A3F",
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
  },
  legend: {
    position: "bottom",
    horizontalAlign: "center",
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

const TrafficeByMovementStatistic = () => {
  return (
    <Chart
      options={options}
      series={series}
      type="line"
      height={"100%"}
      className="_chartTrafficeByMovement flex m-auto w-full h-fit!"
    />
  );
};

export default TrafficeByMovementStatistic;
