import React from 'react'
import Chart from "react-apexcharts";

const ExitRAte = () => {
  const options = {
    chart: {
      type: "pie",
      background: "transparent",
    },
    labels: [
      "East",
      "West",
      "South",
      "North",
    ],
    colors: [
      "#FB5555",
      "#3F07E2",
      "#21A957",
      "#FFA500",
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
        fontSize: "14px", 
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
      formatter: (val) => `${Math.round(val)}%`,
      style: { fontSize: "12px", fontWeight: "bold", colors: ["#fff"] },
    },
  };

  const series = [35, 30, 20, 30]; 
  return (
     <>
       <Chart
         options={options}
         series={series}
         type="pie"
         height={"100%"}
         className={"_chartTrafficevehicle flex w-full  h-fit!"}
       />
     </>
  )
}

export default ExitRAte
