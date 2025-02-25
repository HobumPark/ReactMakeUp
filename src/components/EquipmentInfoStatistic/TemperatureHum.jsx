import React, {useState, useEffect} from "react";
import Chart from "react-apexcharts";
import "./TemperatureHum.css"

const TemperatureHum = () => {
  const optionsChart = {
    chart: {
      type: "line",
      zoom: { enabled: false },
      toolbar: { show: false },
      fontFamily: "Noto Sans KR",
      background: "transparent",
    },
    colors: ["#007BFF", "#28A745"], // Blue for Temperature, Green for Humidity
    stroke: {
      curve: "straight",
      width: 2,
    },
    markers: {
      size: 3,
      colors: ["#26A0FC", "#388A3F"],
    },
    grid: {
      borderColor: "#343A3F",
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      categories: [
        "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00",
      ],
      labels: { style: { colors: "#fff" } },
    },
    yaxis: [
      {
        // title: { text: "Temperature", style: { color: "#007BFF" } },
        labels: { style: { colors: "#007BFF" } },
        min: -30,
        max: 35,
        opposite: false, // Temperature di kiri
      },
      {
        // title: { text: "Humidity", style: { color: "#28A745" } },
        labels: { style: { colors: "#28A745" } },
        min: 0,
        max: 35,
        opposite: true, // Humidity di kanan
      },
    ],
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      labels: { colors: "#fff" },
      markers: {
        width: 10,
        height: 10,
        radius: 50,
        shape: "circle",
      },
    },
  };

  const series = [
    { name: "Temperature", data: [5, 10, 15, 8, 12, 20, 17, 22] },
    { name: "Humidity", data: [15, 20, 10, 18, 25, 28, 22, 30] },
  ];

  return (
    <>
      <Chart
        options={optionsChart}
        series={series}
        height={"100%"}
        className={"_chartTemptHum flex w-full !min-h-[0]"}
      />
    </>
  );
};

export default TemperatureHum;
