import React, {useState, useEffect} from "react";
import Chart from "react-apexcharts";
import "./TemperatureHum.css"

const TemperatureHum = ({data}) => {

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
      categories: data?.map(item => item.timestamp.slice(11, 16)),
      labels: { style: { colors: "#fff" } },
    },
    yaxis: [
      {
        // title: { text: "Temperature", style: { color: "#007BFF" } },
        labels: { style: { colors: "#007BFF" } },
        min:  data && data?.length > 0
        ? -Math.min(...data?.map(item => item.temp), ...data?.map(item => item.hum))
        : -30,
        max: data && data?.length > 0
        ? Math.max(...data?.map(item => item.temp), ...data?.map(item => item.hum))
        : 35,
        opposite: false, // Temperature di kiri
      },
      {
        // title: { text: "Humidity", style: { color: "#28A745" } },
        labels: { style: { colors: "#28A745" } },
        min: data && data?.length > 0
        ? -Math.min(...data?.map(item => item.temp), ...data?.map(item => item.hum))
        : 0,
        max: data && data?.length > 0
        ? Math.max(...data?.map(item => item.temp), ...data?.map(item => item.hum))
        : 35,
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
    { name: "Temperature", data: data?.map(item => item.temp !== undefined ? item.temp : null) || []  },
    { name: "Humidity", data: data?.map(item => item.hum !== undefined ? item.hum : null) || []  },
  ];

  return (
    <>
      <Chart
        type="line"
        options={optionsChart}
        series={series}
        height={"100%"}
        className={"_chartTemptHum flex w-full !min-h-[0]"}
      />
    </>
  );
};

export default TemperatureHum;
