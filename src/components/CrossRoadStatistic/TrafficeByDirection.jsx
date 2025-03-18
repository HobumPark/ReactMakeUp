import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import "./TrafficeByDirection.css";

const TrafficeByDirection = ({data}) => {
  const getMaxValue = (data) => {
    const values = [
      ...data.map(item => item["103001"]), 
      ...data.map(item => item["103002"]), 
      ...data.map(item => item["103003"]), 
      ...data.map(item => item["103004"]), 
      ...data.map(item => item["103005"]), 
      ...data.map(item => item["103006"]), 
      ...data.map(item => item["103007"]), 
      ...data.map(item => item["103008"]), 
    ];
    return Math.max(...values); 
  };

  let maxValue = 0; 

  if (data && data.length > 0) {
    maxValue = getMaxValue(data); 
  }
  
  const losLevels = ['A', 'B', 'C', 'D', 'E', 'F', 'FF'];

  const convertLOSToNumber = (data) => {
    if (!data || data.length === 0) return []; 
  
    return data?.map(item => {
      const index = losLevels.indexOf(item.los);
      return index !== -1 ? index : null; 
    });
  };

  const options = {
    chart: {
      type: "line",
      background: "transparent",
      foreColor: "#fff",
      toolbar: {
        show: false,// Hide toolbar icon
      },
    },
    xaxis: {
      categories: data?.map(item => item.aggregate_start_time.slice(11, 16)),
      labels: { style: { colors: "#fff" } },
    },
    yaxis: [
      {
        min: 0,
        max: maxValue,
        labels: { style: { colors: "#fff" } },
        // title: { text: "Traffic Count", style: { color: "#fff" } }
      },
      {
        opposite: true,
        min: 0,
        max: 6,
        tickAmount: 6, 
       labels: {
        formatter: function (value, index) {
          return ['A', 'B', 'C', 'D', 'E', 'F', 'FF'][index] || value;
        }
        // title: { text: "LOS Level", style: { color: "#fff" } }
      },
    }
    ],
    colors: ["#28a745", "#007bff", "#ffc107", "#dc3545", "#17a2b8", "#6c757d", "#6610f2", "#fd7e14", "#fff"],
    stroke: {
      width: [0, 0, 0, 0, 0, 0, 0, 0, 2], 
      curve: "smooth",
    },
    markers: {
      size: [0, 0, 0, 0, 0, 0, 0, 0, 5],
      colors: ["#fff"],
      strokeWidth: 2,
    },
    grid: {
      borderColor: "#343A3F",
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      //   floating: true,
      fontSize: '9px',
      markers: {
        width: 10,
        height: 10,
        radius: 50,
        size: 6,
        shape: "circle",
        strokeWidth: 0,
        strokeColor: "transparent",
      },
      labels: { colors: "#fff" },
      
    },
    dataLabels: {
      enabled: false, 
    },
    tooltip: {
      shared: true, 
      intersect: false, 
      y: {
        formatter: function (value, { seriesIndex }) {
          const lastSeriesIndex = series.length - 1; 
          if (seriesIndex === lastSeriesIndex) {
            return losLevels[Math.round(value)] || value;
          }
          return value;
        },
      },
    },
  };

  const series = [
    { name: "North", type: "bar", data: data?.map(item => item["103001"] ?? null) },
    { name: "Northeast", type: "bar", data: data?.map(item => item["103002"] ?? null) },
    { name: "East", type: "bar", data: data?.map(item => item["103003"] ?? null) },
    { name: "Southeast", type: "bar", data: data?.map(item => item["103004"] ?? null) },
    { name: "South", type: "bar", data: data?.map(item => item["103005"] ?? null) },
    { name: "Southwest", type: "bar", data: data?.map(item => item["103006"] ?? null) },
    { name: "West", type: "bar", data: data?.map(item => item["103007"] ?? null) },
    { name: "Northwest", type: "bar", data: data?.map(item => item["103008"] ?? null) },
    { name: "LOS", type: "line", data: convertLOSToNumber(data) },
  ];
  
  

  return (
    <>
      <Chart
        options={options}
        series={series}
        height={"100%"}
        type="bar"
        className={
          "_chartTrafficeByDirectioncompo flex w-full !min-h-[0] h-fit!"
        }
      />
    </>
  );
};

export default TrafficeByDirection;
