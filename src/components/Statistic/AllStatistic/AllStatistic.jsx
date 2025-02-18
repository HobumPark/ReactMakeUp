import React, { useState, useEffect } from "react";
import { ReactTabulator } from "react-tabulator";

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

const AllStatistic = () => {
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
      </section>
    </>
  );
};

export default AllStatistic;
