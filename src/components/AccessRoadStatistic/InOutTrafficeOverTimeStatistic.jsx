import React from "react";
import Chart from "react-apexcharts";
import "./InOutTrafficeOverTimeStatistic.css"

const InOutTrafficeOverTimeStatistic = ({series, xAxisCategories }) => {


  const options = {
    chart: {
      type: "bar",
      background: "transparent",
      foreColor: "#fff",
      toolbar: {
        show: false, // ini buat icon burger biar gak mncul coyu
      },
    },
    dataLabels: {
      enabled: false, // 데이터 레이블을 비활성화하여 값이 표시되지 않도록 함
    },
    xaxis: {
      categories: xAxisCategories || [ // xAxisCategories가 전달되지 않으면 기본값 사용
      ],
      labels: { style: { colors: "#fff" } },
    },
    yaxis: {
      // min: 0,
      // max: 24,
      labels: { style: { colors: "#fff" } },
    },
    colors: ["#E0E0E0", "#4682B4"],
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
