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
    widthGrow: 2.5,
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "사이트",
    field: "site_name",
    widthGrow: 2,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "접근로",
    field: "road_name",
    widthGrow: 2,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "차종 전체",
    field: "all_cnt",
    width: 70,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
    formatter: (cell) => cell.getValue() ? cell.getValue() : "-"
  },
  {
    title: "승용차",
    field: "car_cnt",
    width: 70,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
    formatter: (cell) => cell.getValue() ? cell.getValue() : "-"
  },
  {
    title: "승합차",
    field: "van_cnt",
    width: 70,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
    formatter: (cell) => cell.getValue() ? cell.getValue() : "-"
  },
  {
    title: "트럭",
    field: "truck_cnt",
    width: 70,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
    formatter: (cell) => cell.getValue() ? cell.getValue() : "-"
  },
  {
    title: "대형 트럭",
    field: "long_truck_cnt",
    width: 70,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
    formatter: (cell) => cell.getValue() ? cell.getValue() : "-"
  },
  {
    title: "버스",
    field: "bus_cnt",
    width: 70,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
    formatter: (cell) => cell.getValue() ? cell.getValue() : "-"
  },
  {
    title: "오토바이",
    field: "motorcycle_cnt",
    width: 70,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
    formatter: (cell) => cell.getValue() ? cell.getValue() : "-"
  },
  {
    title: "자전거",
    field: "bicycle_cnt",
    width: 70,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
    formatter: (cell) => cell.getValue() ? cell.getValue() : "-"
  },
  {
    title: "기타",
    field: "unknown_cnt",
    width: 60,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
    formatter: (cell) => cell.getValue() ? cell.getValue() : "-"
  },
];


const StatisticByType = ({data , chartData}) => {
  
  const { t, i18n } = useTranslation();
  const flatData = data?.flat(Infinity);
  const dataCnt = flatData?.map(item => {
    const { 
      aggregate_end_time, 
      aggregate_start_time, 
      aggregated_time, 
      all_cnt, 
      car_cnt, 
      van_cnt, 
      truck_cnt,
      long_truck_cnt,
      bus_cnt,
      motorcycle_cnt,
      bicycle_cnt,
      unknown_cnt,
      road_id, 
      road_name, 
      site_id, 
      site_name, 
    } = item; 
  
    return {
      aggregate_end_time,
      aggregate_start_time,
      aggregated_time,
      all_cnt, 
      car_cnt, 
      van_cnt, 
      truck_cnt,
      long_truck_cnt,
      bus_cnt,
      motorcycle_cnt,
      bicycle_cnt,
      unknown_cnt,
      road_id,
      road_name,
      site_id,
      site_name,
    };
  });

  const dataCntChart = chartData?.length
  ? {
      ...Object.fromEntries(
        Object.keys(chartData[0]).map((key) => [
          key,
          chartData.map((item) => item[key] ?? 0), 
        ])
      ),
    }
  : null;



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
    footerElement: `<div style="padding: 0 20px 0 0; text-align: right;">총 ${dataCnt?.length || 0} 건</div>`,
  };


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
      "#0316C4",
      "#9D03C4",
      "#C4032B",
      "#C47703",
      "#FF0000",
      "#A8A8A8",
      "#678C29",
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
      categories: dataCntChart?.aggregate_start_time,
    },
  };

  const averageWaitTime = [
    {
      name: "전체",
      data: dataCntChart?.all_cnt,
    },
    {
      name: "승용차",
      data: dataCntChart?.car_cnt,
    },
    {
      name: "승합차",
      data: dataCntChart?.van_cnt,
    },
    {
      name: "트럭",
      data: dataCntChart?.truck_cnt,
    },
    {
      name: "대형 트럭",
      data: dataCntChart?.long_truck_cnt,
    },
    {
      name: "버스",
      data: dataCntChart?.bus_cnt,
    },
    {
      name: "오토바이",
      data: dataCntChart?.motorcycle_cnt,
    },
    {
      name: "자전거",
      data: dataCntChart?.bicycle_cnt,
    },
    {
      name: "기타",
      data: dataCntChart?.unknown_cnt,
    },
  ];

  return (
    <>
      <section>
        <ReactTabulator
          data={dataCnt}
          columns={statisticByTypeTabulator}
          layout={"fitColumns"}
          className="tabulator-custom w-full "
          //   pagination="local"
          options={optionsTabulator}
        />
       <div className=" mt-[40px] flex flex-col border-[3px] border-[#E6E6E6] rounded-[3px] p-[10px]">
       <span className="title3bold text-[#545454]">차종별 통행량</span>
       <Chart
          options={options}
          series={averageWaitTime}
          height={350}
          className={"flex w-full !min-h-[0]"}
        />
       </div>
      </section>
    </>
  );
};

export default StatisticByType;
