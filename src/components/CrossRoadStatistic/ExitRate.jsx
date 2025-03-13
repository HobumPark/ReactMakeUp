import React from 'react'
import Chart from "react-apexcharts";

const ExitRate = ({data}) => {

  const categoryMapping = {
    "103001": 0, 
    "103002": 1, 
    "103003": 2, 
    "103004": 3, 
    "103005": 4, 
    "103006": 5, 
    "103007": 6,
    "103008": 7, 

  };

  const series = new Array(8).fill(0);
  
  Object.keys(data || {}).forEach((key) => {
    if (categoryMapping[key] !== undefined) {
      series[categoryMapping[key]] = data[key] ;
    }
  });

  const options = {
    chart: {
      type: "pie",
      background: "transparent",
    },
    labels: [
      "North",
      "Norteast",
      "East",
      "Southest",
      "South",
      "Southwest",
      "West",
      "Northwest",
    ],
    colors: ["#28a745", "#007bff", "#ffc107", "#dc3545", "#17a2b8", "#6c757d", "#6610f2", "#fd7e14"],
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

export default ExitRate;
