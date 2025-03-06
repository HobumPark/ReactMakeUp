import React, { useState, useEffect } from "react";
import { ReactTabulator } from "react-tabulator";
import { useTranslation } from "react-i18next";
import localeEn from "air-datepicker/locale/en.js";
import localeKo from "air-datepicker/locale/ko.js";
import localeId from "air-datepicker/locale/id.js";
import Chart from "react-apexcharts";

const allStatisticTabulator = [
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
    widthGrow: "2",
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
    title: "평균 대기길이(m)",
    field: "que_len_avg",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
    formatter: (cell) => cell.getValue() ? cell.getValue() : "-"
  },
  {
    title: "최대 대기길이(m)",
    field: "que_len_max",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
    formatter: (cell) => cell.getValue() ? cell.getValue() : "-"
  },
  {
    title: "평균 점유율(%)",
    field: "occupancy_avg",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
    formatter: (cell) => cell.getValue() ? cell.getValue() : "-"
  },
  {
    title: "평균속도(km/h)",
    field: "speed_avg",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
    formatter: (cell) => cell.getValue() ? cell.getValue() : "-"
  },
  {
    title: "최고속도(km/h)",
    field: "speed_max",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
    formatter: (cell) => cell.getValue() ? cell.getValue() : "-"
  },
];




const AllStatistic = ({data, chartData}) => {
  
  const flatData = data?.flat(Infinity);
  const dataTraffic = flatData?.map(item => {
    const { 
      aggregate_end_time, 
      aggregate_start_time, 
      aggregated_time, 
      occupancy_avg, 
      que_len_avg, 
      que_len_max, 
      road_id, 
      road_name, 
      site_id, 
      site_name, 
      speed_avg, 
      speed_max 
    } = item; 
  
    return {
      aggregate_end_time,
      aggregate_start_time,
      aggregated_time,
      occupancy_avg,
      que_len_avg,
      que_len_max,
      road_id,
      road_name,
      site_id,
      site_name,
      speed_avg,
      speed_max
    };
  });  
  const dataTrafficChart = chartData?.length
  ? {
      ...Object.fromEntries(
        Object.keys(chartData[0]).map((key) => [
          key,
          chartData.map((item) => item[key] ?? 0), 
        ])
      ),
    }
  : null;


  const { t, i18n } = useTranslation();

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
      curve: "straight",
      width: 2,
    },
    xaxis: {
      categories: dataTrafficChart?.aggregate_start_time,
    },
  };
    


    const averageWaitTime = [
        {
          data: dataTrafficChart?.que_len_avg,
        },
      
      ];

    const maximumWait= [
        {
          data: dataTrafficChart?.que_len_max,
        },
      
      ]

    const averageOccupancy= [
        {
          data: dataTrafficChart?.occupancy_avg,
        },
      
      ];

    const averageSpeed= [
        {
          data: dataTrafficChart?.speed_avg,
        },
      
      ];

    const maximumSpeed= [
        {
          data: dataTrafficChart?.speed_max,
        },
      
      ];
    

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
    footerElement: `<div style="padding: 0 20px 0 0; text-align: right;">총 ${dataTraffic?.length || 0} 건</div>`,
  };
  return (
    <>
      <section>
        <ReactTabulator
          data={dataTraffic}
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
                    type="line"
                />
            </div>
            <div className="border-[3px] border-[#E6E6E6] rounded-[3px] p-[10px]">
            <span className="title3bold text-[#545454]">최대 대기길이</span>
                <Chart
                    options={options}
                    series={maximumWait}
                    height={244}
                    className={"flex !min-h-[0]"}
                    type="line"
                />
            </div>
            <div className="border-[3px] border-[#E6E6E6] rounded-[3px] p-[10px]">
            <span className="title3bold text-[#545454]">평균 점유율</span>
                <Chart
                    options={options}
                    series={averageOccupancy}
                    height={244}
                    className={"flex !min-h-[0]"}
                    type="line"
                />
            </div>
            

            </div>
            <div className="_chartAllStatistic w-full grid! grid-cols-2 gap-[20px]">
        
            <div className="border-[3px] border-[#E6E6E6] rounded-[3px] p-[10px]">
                <span className="title3bold text-[#545454]">평균속도</span>
                <Chart
                    options={options}
                    series={averageSpeed}
                    height={244}
                    className={"flex !min-h-[0]"}
                    type="line"
                />
            </div>
            <div className="border-[3px] border-[#E6E6E6] rounded-[3px] p-[10px]">
            <span className="title3bold text-[#545454]">최고속도</span>
                <Chart
                    options={options}
                    series={maximumSpeed}
                    height={244}
                    className={"flex !min-h-[0]"}
                    type="line"
                />
            </div>
            </div>

        </section>

      </section>
    </>
  );
};

export default AllStatistic;
