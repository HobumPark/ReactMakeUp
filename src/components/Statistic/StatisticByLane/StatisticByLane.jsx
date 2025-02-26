import React, { useState, useEffect } from "react";
import { ReactTabulator } from "react-tabulator";
import Chart from "react-apexcharts";

const statisticByTypeTabulator = [
  {
    title: "No",
    formatter: "rownum",
    width: 60,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "집계시간",
    field: "aggregation_time",
    hozAlign: "center",
    widthGrow: 2,
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "사이트",
    field: "site",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "접근로",
    field: "access",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "차로 전체",
    field: "all_car",
    WidthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "1차로",
    field: "first_lane",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "2차로",
    field: "second_lane",
    WidthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "3차로",
    field: "third_lane",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "4차로",
    field: "fourth_lane",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "5차로",
    field: "five_lane",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
];

const data = [
  {
    aggregation_time: "2025-01-20 12:30 ~ 2025-01-20 12:35",
    site: "시청사거리",
    access: "시청 방면",
    all_car: "10",
    first_lane: "4",
    second_lane: "2",
    third_lane: "1",
    fourth_lane: "3",
    five_lane: "-",
  },
];

const options = {
  chart: {
    type: "line",
    zoom: {
      enabled: false,
    },
    fontFamily: "Noto Sans KR",
    toolbar: {
      show: false,
    },
  },
  colors: [
    "#171616",
    "#07C403",
    "#BBBE09",
    "#C4032B",
    "#C47703",
    "#29688C",

  ], // ini buat bg warna legend
  markers: {
    size: 4,
    // colors: ["#EA494E", "#FDCA6A", "#439C50"],
    // strokeColors: ["#EA494E", "#FDCA6A", "#439C50"], // ini buat stroke bg warna legend
  },
  stroke: {
    show: true,
    curve: "straight",
    width: 1.5,
  },
  xaxis: {
    categories: [
      "01-20 12:30",
      "01-20 12:35",
      "01-20 12:40",
      "01-20 12:45",
      "01-20 12:50",
      "01-20 12:55",
      "01-20 13:00",
      "01-20 13:05",
      "01-20 13:10",
      "01-20 13:15",
      "01-20 13:20",
    ],
  },
};


const StatisticByLane = () => {

  const optionsTabulator = {
    pagination: true,
    paginationSize: 10,
    rowHeight: 41,
    movableRows: false,
    resizableRows: false,
    footerElement: `<div style="padding: 0 20px 0 0; text-align: right;">총 ${data.length} 건</div>`,
  };

  const averageWaitTime = [
    {
      name: "전체",
      data: [30, 40, 25, 50, 49, 21, 35, 40, 23, 12, 54, 61],
    },
    {
      name: "1차로",
      data: [23, 12, 54, 61, 32, 56, 42, 33, 28, 18, 65, 47],
    },
    {
      name: "2차로",
      data: [24, 20, 5, 75, 42, 79, 10, 24, 33, 45, 12, 34],
    },
    {
      name: "3차로",
      data: [24, 20, 5, 5, 42, 79, 8, 19, 25, 35, 47, 53],
    },
    {
      name: "4차로",
      data: [2, 20, 25, 55, 42, 79, 9, 23, 38, 48, 54, 63],
    },
    {
      name: "5차로",
      data: [2, 0, 25, 55, 102, 79, 30, 60, 45, 35, 25, 15],
    },

  ];

  return (
    <>
          <section>
            <ReactTabulator
              data={data}
              columns={statisticByTypeTabulator}
              layout={"fitColumns"}
              className="tabulator-custom w-full "
              //   pagination="local"
              options={optionsTabulator}
            />
           <div className=" mt-[40px] flex flex-col border-[3px] border-[#E6E6E6] rounded-[3px] p-[10px]">
           <span className="title3bold text-[#545454]">차로별 통행량</span>
           <Chart
              options={options}
              series={averageWaitTime}
              height={350}
              className={"flex w-full !min-h-[0]"}
            />
           </div>
          </section>
        </>
  )
}

export default StatisticByLane
