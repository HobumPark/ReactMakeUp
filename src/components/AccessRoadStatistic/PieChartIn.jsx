import React from "react";
import Chart from "react-apexcharts";

const options = {
  chart: {
    type: "pie",
    background: "transparent",
    events: {
      mouseMove: function(event) {
        event.target.style.cursor = 'pointer';  // 바 위에 마우스 있을 때 커서 포인터로 변경
      },
      mouseOut: function(event) {
        event.target.style.cursor = 'default';  // 바를 벗어나면 기본 커서로 복원
      }
    }
  },
  labels: [
    "승용차",
    "오토바이",
    "버스",
    "트럭",
    "승합차",
    "자전거",
    "대형 트럭",
    "기타",
  ],
  colors: [
    "#3F07E2",
    "#D533B2",
    "#21A957",
    "#FFA500",
    "#AD00FF",
    "#6A1E55",
    "#26EFFC",
    "#FB5555",
  ],
  stroke: {
    show: false,
  },
  legend: {
    show: false,
    position: "right",
    horizontalAlign: "right",
    offsetX: 0,
    offsetY: 0,
    labels: {
      colors: "#fff",
      useSeriesColors: false,
      fontSize: "12px",
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

const series = [35, 30, 20, 30, 15, 10, 10, 5];

const PieChartIn = ({series}) => {
  return (
    <>
      <Chart
        options={options}
        series={series}
        type="pie"
        height={"100%"}
        className={"_chartIn flex m-auto w-[60%]  !min-h-[0] h-fit!"}
      />
    </>
  );
};

export default PieChartIn;
