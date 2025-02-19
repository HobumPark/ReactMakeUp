import React, { useState, useEffect } from "react";
import { ReactTabulator } from "react-tabulator";

import Chart from "react-apexcharts";

const allStatisticTabulator = [
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
    headerHozAlign: "center",
    headerSort: true,
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
    title: "평균 대기길이(m)",
    field: "average_wait",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "최대 대기길이(m)",
    field: "maximum_wait",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "평균 점유율(%)",
    field: "average_ocupancy",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "평균속도(km/h)",
    field: "average_speed",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "",
    field: "peek_speed",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: true,
    resizable: false,
  },
];

const data = [
  {
    aggregation_time: "2025-01-20 12:30 ~ 2025-01-20 12:35",
    site: "시청사거리",
    access: "시청 방면",
    average_wait: "51.89",
    maximum_wait: "121",
    average_ocupancy: "0.42 ",
    average_speed: "55",
    peek_speed: "80",
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
    // colors: ["#EA494E", "#FDCA6A", "#439C50"],
    // markers: {
    //   size: 1,
    //   colors: ["#EA494E", "#FDCA6A", "#439C50"],
    //   strokeColors: ["#EA494E", "#FDCA6A", "#439C50"],
    // },
    colors: ["#439C50"],
    markers: {
      size: 1,
      colors: ["#EA494E", "#FDCA6A", "#439C50"],
      strokeColors: ["#439C50"],
    },
    stroke: {
      show: true,
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      categories: ["01-20 12:30", "01-20 12:35", "01-20 12:40", "01-20 12:45", "01-20 12:50"],
    },
  };




const AllStatistic = () => {

    const averageWaitTime = [
        {
          data: [30, 40, 25, 50, 49, 21],
        },
      
      ];

    const maximumWait= [
        {
          data: [30, 40, 25, 50, 49, 21],
        },
      
      ]

    const averageOccupancy= [
        {
          data: [30, 40, 25, 50, 49, 21],
        },
      
      ];

    const averageSpeed= [
        {
          data: [30, 40, 25, 50, 49, 21],
        },
      
      ];

    const maximumSpeed= [
        {
          data: [30, 40, 25, 50, 49, 21],
        },
      
      ];
    

  const optionsTabulator = {
    pagination: true,
    paginationSize: 10,
    rowHeight: 41,
    movableRows: false,
    resizableRows: false,
    footerElement: `<div style="padding: 0 20px 0 0; text-align: right;">총 ${data.length} 건</div>`,
  };
  return (
    <>
      <section>
        <ReactTabulator
          data={data}
          columns={allStatisticTabulator}
          layout={"fitColumns"}
          className="tabulator-custom w-full "
          //   pagination="local"
          options={optionsTabulator}
        />

        <section className=" flex! flex-col w-full gap-[20px]">
            <div className="_chartAllStatistic mt-[40px] w-full grid! grid-cols-3 gap-[20px]">
        
            <div className="border-[3px] border-[#E6E6E6] rounded-[3px] p-[10px]">
                <span className="title3bold text-[#545454]">평균 대기길이</span>
                <Chart
                    options={options}
                    series={averageWaitTime}
                    height={244}
                    className={"flex !min-h-[0]"}
                />
            </div>
            <div className="border-[3px] border-[#E6E6E6] rounded-[3px] p-[10px]">
            <span className="title3bold text-[#545454]">평균 대기길이</span>
                <Chart
                    options={options}
                    series={maximumWait}
                    height={244}
                    className={"flex !min-h-[0]"}
                />
            </div>
            <div className="border-[3px] border-[#E6E6E6] rounded-[3px] p-[10px]">
            <span className="title3bold text-[#545454]">평균 점유율</span>
                <Chart
                    options={options}
                    series={averageOccupancy}
                    height={244}
                    className={"flex !min-h-[0]"}
                />
            </div>
            

            </div>
            <div className="_chartAllStatistic w-full grid! grid-cols-2 gap-[20px]">
        
            <div className="border-[3px] border-[#E6E6E6] rounded-[3px] p-[10px]">
                <span className="title3bold text-[#545454]">평균 대기길이</span>
                <Chart
                    options={options}
                    series={averageSpeed}
                    height={244}
                    className={"flex !min-h-[0]"}
                />
            </div>
            <div className="border-[3px] border-[#E6E6E6] rounded-[3px] p-[10px]">
            <span className="title3bold text-[#545454]">평균 대기길이</span>
                <Chart
                    options={options}
                    series={maximumSpeed}
                    height={244}
                    className={"flex !min-h-[0]"}
                />
            </div>
            </div>

        </section>

      </section>
    </>
  );
};

export default AllStatistic;
