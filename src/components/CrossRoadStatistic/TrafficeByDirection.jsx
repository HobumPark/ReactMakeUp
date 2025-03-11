import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import "./TrafficeByDirection.css";

const TrafficeByDirection = ({data}) => {
  console.log(data);
  
  const options = {
    chart: {
      type: "line",
      background: "transparent",
      foreColor: "#fff",
      toolbar: {
        show: false, // ini buat icon burger biar gak mncul coyu
      },
    },
    xaxis: {
      categories: ["09:00", "09:15", "09:30", "10:00", "10:15", "10:30"],
      labels: { style: { colors: "#fff" } },
    },
    yaxis: [
      {
        min: 0,
        max: 24,
        labels: { style: { colors: "#fff" } },
        // title: { text: "Traffic Count", style: { color: "#fff" } }
      },
      {
        opposite: true,
        min: 0,
        max: 24,
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
        // title: { text: "LOS Level", style: { color: "#fff" } }
      },
    ],
    colors: ["#28a745", "#007bff", "#ffc107", "#dc3545", "#fff"],
    stroke: {
      width: [0, 0, 0, 0, 2], // Pastikan hanya seri LOS yang punya garis
      curve: "smooth",
    },
    markers: {
      size: [0, 0, 0, 0, 5],
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
  };

  const series = [
    { name: "East", data: [6, 7, 8, 6, 7, 8] },
    { name: "West", data: [10, 12, 14, 16, 18, 20] },
    { name: "North", data: [12, 10, 14, 12, 14, 12] },
    { name: "South", data: [14, 15, 13, 14, 13, 15] },
    { name: "LOS", type: "line", data: [18, 12, 17, 9, 14, 10] },
  ];
  return (
    <>
      <Chart
        options={options}
        series={series}
        type="bar"
        height={"100%"}
        className={
          "_chartTrafficeByDirectioncompo flex w-full !min-h-[0] h-fit!"
        }
      />
    </>
  );
};

export default TrafficeByDirection;
