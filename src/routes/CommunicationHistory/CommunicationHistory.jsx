import React, { useState, useEffect } from "react";
import ContainerCard from "../../components/ContainerCard/ContainerCard";
import Filtering from "../../components/Filtering/Filtering";
import { ReactTabulator } from "react-tabulator";
import DetailForm from "../../components/DetailForm/DetailForm";
import LogList from "../../components/LogList/LogList";
import ButtonGroup from "../../components/ButtonGroup/ButtonGroup";
import Select from "../../components/Select/Select";
import GeneralInput from "../../components/GeneralInput/GeneralInput";
import { useTranslation } from "react-i18next";
import localeEn from "air-datepicker/locale/en.js";
import localeKo from "air-datepicker/locale/ko.js";
import localeId from "air-datepicker/locale/id.js";
import AirDatepicker from "air-datepicker";

import Button from "../../components/Button/Button";

const communityHistoryTabulator = [
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
    title: "수집시간",
    field: "collection_time",
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
    title: "방위",
    field: "orientation",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "차선방향",
    field: "lane_direction",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "차로",
    field: "lane",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "차종",
    field: "vehicle_type",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "속도(km/h)",
    field: "speed",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: true,
    resizable: false,
  },
];

const data = [
  {
    collection_time: "2025-01-24 23:10:11",
  
    site: "시청사거리",
    access: "시청 방면",
    orientation: "남",
    lane_direction: "진입",
    lane: "3",
    vehicle_type: "승용차",
    speed: "80",
  },
  {
    collection_time: "2024-01-24 20:10:11",
    site: "시청사거리",
    access: "시청 방면",
    orientation: "남",
    lane_direction: "진입",
    lane: "3",
    vehicle_type: "승용차",
    speed: "50",
  },
];

const CommunicationHistory = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    let locale;
    if (i18n.language === "eng") {
      locale = localeEn;
    } else if (i18n.language === "ind") {
      locale = localeId;
    } else {
      locale = localeKo;
    }

    const optionsDate = {
      autoClose: true,
      locale: locale,
      position: "bottom center",
      onSelect: (date) => {
        setFormValues((prevValues) => ({
          ...prevValues,
          birth: date.formattedDate,
        }));
      },
    };

    const optionsDateSecond = {
      autoClose: true,
      locale: locale,
      position: "bottom center",
      onSelect: (date) => {
        setFormValues((prevValues) => ({
          ...prevValues,
          birth: date.formattedDate,
        }));
      },
    };

    const datepicker1 = new AirDatepicker('[name="first-date"]', optionsDate);
    const datepicker2 = new AirDatepicker(
      '[name="second-date"]',
      optionsDateSecond
    );

    return () => {
      datepicker1.destroy();
      datepicker2.destroy();
    };
  }, [i18n.language]);

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
      <section className="wrap">
        <div className="header-title">
          <h3>이트 관리</h3>
          <h3>&gt;</h3>
          <h3>횡단보도</h3>
        </div>

        <ContainerCard>
          <Filtering
            placeholder="사이트 / 접근로"
            disableFiltering={true}
            customWidthSelect="w-[30%]"
          >
            <div className="flex flex-row gap-2 items-center w-full">
              <DetailForm
                showTitle={false}
                inputType={"text"}
                name={"first-date"}
                isDob={true}
              />
              <span>-</span>
              <DetailForm
                showTitle={false}
                inputType={"text"}
                name={"second-date"}
                isDob={true}
              />
            </div>
          </Filtering>
        </ContainerCard>

        <ContainerCard>
          <ReactTabulator
            data={data}
            columns={communityHistoryTabulator}
            layout={"fitColumns"}
            className="tabulator-custom w-full "
            //   pagination="local"
            options={optionsTabulator}
          />
        </ContainerCard>
      </section>
    </>
  );
};

export default CommunicationHistory;
