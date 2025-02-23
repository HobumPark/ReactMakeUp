import React from "react";
import Chart from "react-apexcharts";
import "./InOutTrafficeOverTimeStatistic.css"

const InOutTrafficeOverTimeStatistic = () => {
  const series = [
    {
      name: "East",
      data: [6, 7, 8, 6, 7, 8, 7, 20],
    },
    {
      name: "West",
      data: [10, 12, 14, 16, 18, 20, 12, 15],
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
      categories: [
        "09:00",
        "10.00",
        "11.00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
      ],
      labels: { style: { colors: "#fff" } },
    },
    yaxis: {
      // min: 0,
      // max: 24,
      labels: { style: { colors: "#fff" } },
    },
    colors: ["#FFA500", "#FB5555"],
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
  };

  
  return (
    <>
      <Chart
        options={options}
        series={series}
        type="bar"
        height={"100%"}
        className={"_chartInOutTrafficOverTime flex m-auto w-full  !min-h-[0] h-fit!"}
      />
    </>
  );
};

export default InOutTrafficeOverTimeStatistic;
