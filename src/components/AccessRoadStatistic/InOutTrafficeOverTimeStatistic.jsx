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
      events: {
        mouseMove: function(event) {
          event.target.style.cursor = 'pointer';  // 바 위에 마우스 있을 때 커서 포인터로 변경
        },
        mouseOut: function(event) {
          event.target.style.cursor = 'default';  // 바를 벗어나면 기본 커서로 복원
        }
      }
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
        width: 6,
        height: 6,
        radius: 10,
        shape: "circle",
        strokeWidth: 0,
        strokeColor: "transparent",
      },
      labels: { colors: "#fff" },
      
    },
    tooltip: {
      enabled: true,
      theme: "dark", // 툴팁 배경색
      style: {
        fontSize: '12px',
        fontFamily: 'Arial, sans-serif',
      },
      // tooltip 아이템에서 마커 없이 텍스트만 보여주기
      custom: function ({ seriesIndex, dataPointIndex, w }) {
        const seriesName = w.globals.seriesNames[seriesIndex];
        const dataValue = w.globals.series[seriesIndex][dataPointIndex];
        return `<div style="padding: 10px; background: #333; border-radius: 5px; color: #fff;">
                  <strong>${seriesName}</strong>: ${dataValue}
              </div>`;
      },
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
