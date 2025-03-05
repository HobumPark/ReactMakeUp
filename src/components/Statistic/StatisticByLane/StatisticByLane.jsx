import React, { useState, useEffect } from "react";
import { ReactTabulator } from "react-tabulator";
import Chart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import localeEn from "air-datepicker/locale/en.js";
import localeKo from "air-datepicker/locale/ko.js";
import localeId from "air-datepicker/locale/id.js";


const statisticByTypeTabulator = [
  {
    title: "No",
    formatter: (cell) => {
      let row = cell.getRow();
      let page = row.getTable().getPage();
      let pageSize = row.getTable().getPageSize();
      return (page - 1) * pageSize + row.getPosition(true);
    },
    width: 60,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "집계시간",
    field: "aggregated_time",
    hozAlign: "center",
    widthGrow: 2,
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "사이트",
    field: "site_name",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "접근로",
    field: "road_name",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "차로 전체",
    field: "lane_all",
    WidthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
    formatter: (cell) => cell.getValue() ? cell.getValue() : "-"
  },
  {
    title: "1차로",
    field: "lane_1",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
    formatter: (cell) => cell.getValue() ? cell.getValue() : "-"
  },
  {
    title: "2차로",
    field: "lane_2",
    WidthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
    formatter: (cell) => cell.getValue() ? cell.getValue() : "-"
  },
  {
    title: "3차로",
    field: "lane_3",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
    formatter: (cell) => cell.getValue() ? cell.getValue() : "-"
  },
  {
    title: "4차로",
    field: "lane_4",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
    formatter: (cell) => cell.getValue() ? cell.getValue() : "-"
  },
  {
    title: "5차로",
    field: "lane_5",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
    formatter: (cell) => cell.getValue() ? cell.getValue() : "-"
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


const StatisticByLane = ({data}) => {
 
  const { t, i18n } = useTranslation();
  const flatData = data?.flat(Infinity);
  const dataCntLane = flatData?.map(item => {
    const { 
      aggregate_end_time, 
      aggregate_start_time, 
      aggregated_time, 
      lane_all,
      lane_1,
      lane_2,
      lane_3,
      lane_4,
      lane_5,
      road_id, 
      road_name, 
      site_id, 
      site_name, 

    } = item; 
  
    return {
      aggregate_end_time,
      aggregate_start_time,
      aggregated_time,
      lane_all,
      lane_1,
      lane_2,
      lane_3,
      lane_4,
      lane_5,
      road_id,
      road_name,
      site_id,
      site_name,

    };
  });

  
  const languageTabulator = () => {
    let datalanguage = {
      pagination: {
        first: t('cmn > first page'), //text for the first page button
        first_title:t('cmn > first page'), //tooltip text for the first page button
        last:t('cmn > last page'),
        last_title: t('cmn > last page'),
        prev: t('cmn > page before'),
        prev_title: t('cmn > page before'),
        next: t('cmn > next page'),
        next_title: t('cmn > next page'),
      },
    }
    return datalanguage
  }

  const optionsTabulator = {
    pagination: true,
    paginationSize: 10,
    rowHeight: 41,
    movableRows: false,
    index: "id",
    locale: "ko",
    langs: {
      ko: languageTabulator(),
    },
    resizableRows: false,
    footerElement: `<div style="padding: 0 20px 0 0; text-align: right;">총 ${dataCntLane?.length || 0} 건</div>`,
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
              data={dataCntLane}
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
