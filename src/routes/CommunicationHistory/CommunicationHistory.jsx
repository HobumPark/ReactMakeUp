import React, { useState, useEffect, useCallback } from "react";
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
import UseStatistic from "../../hooks/useStatistic";
import { formatDateTime, getLocalISOString } from "../../utils/date";

const communityHistoryTabulator = [
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
    title: "수집시간",
    field: "timestamp",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: true,
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
    title: "방위",
    field: "lane_compass",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "차선방향",
    field: "lane_moving_direction",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "차로",
    field: "lane_number",
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
    headerSort: false,
    resizable: false,
  },
];


const CommunicationHistory = () => {
  const { t, i18n } = useTranslation();

  const today = new Date();
  const [isResetClicked, setIsResetClicked] = useState(false)

  const getYesterdayMidnight = () => {
    const date = new Date();
    date.setDate(date.getDate() - 1); 
    date.setHours(23, 59, 59, 999);
    return date;
  };

  const yesterdayMidnight = getYesterdayMidnight();
  const [dateTime, setDateTime] = useState({
    start_date:formatDateTime(yesterdayMidnight),
    end_date: formatDateTime(today)
  });

  const [queryParams, setQueryParams] = useState(`start_date=${getLocalISOString(yesterdayMidnight)}&end_date=${getLocalISOString(today)}`);
  const { objectListData } = UseStatistic({
    queryParams: queryParams
  })


  const data = objectListData?.data;
 
  useEffect(() => {
    let locale;
    if (i18n.language === "eng") {
      locale = localeEn;
    } else if (i18n.language === "ind") {
      locale = localeId;
    } else {
      locale = localeKo;
    }

    const today = new Date();

    const optionsDate = {
      autoClose: true,
      locale: locale,
      position: "bottom center",
      selectedDates: [yesterdayMidnight],
      timepicker: true,
      timeFormat: "HH:mm",
      dateFormat: "yyyy-MM-dd",
      onSelect: (date) => {
        setDateTime((prevValues) => ({
          ...prevValues,
          start_date: date.formattedDate,
        }));
      },
    };

    const optionsDateSecond = {
      autoClose: true,
      locale: locale,
      position: "bottom center",
      selectedDates: [today],
      timepicker: true,
      timeFormat: "HH:mm",
      dateFormat: "yyyy-MM-dd",
      onSelect: (date) => {
        setDateTime((prevValues) => ({
          ...prevValues,
          end_date: date.formattedDate,
        }));
      },
    };

    const datepicker1 = new AirDatepicker('[name="start_date"]', optionsDate);
    const datepicker2 = new AirDatepicker(
      '[name="end_date"]',
      optionsDateSecond
    );
    setIsResetClicked(false);

    return () => {
      datepicker1.destroy();
      datepicker2.destroy();
    };
  }, [i18n.language, isResetClicked]);



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
    footerElement: `<div style="padding: 0 20px 0 0; text-align: right;">총 ${data?.length || 0} 건</div>`,
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;  
      setDateTime((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
  };

  const handleReset= () => {
    
    setIsResetClicked(true);
    setDateTime({
      start_date:formatDateTime(yesterdayMidnight),
      end_date:formatDateTime(today)
    })

  };

  const handleSearch = useCallback((inputVal = null) => {
    const resultInput = inputVal ? `input=${inputVal}` : "";
    const { start_date, end_date } = dateTime;
    const dateParams = [];
    if (start_date) {
      dateParams.push(`start_time=${getLocalISOString(start_date)}`);
    }

    if (end_date) {
      dateParams.push(`end_time=${getLocalISOString(end_date)}`);
    }
  
    const result = [resultInput, ...dateParams].join("&");
    setQueryParams(result); 
  },[dateTime]);

  return (
    <>
      <section className="wrap">
        <div className="header-title">
          <h3>소통정보 이력</h3>
          {/* <h3>이트 관리</h3> */}
          {/* <h3>&gt;</h3>
          <h3>횡단보도</h3> */}
        </div>

        <ContainerCard>
          <Filtering
            placeholder="사이트 / 접근로"
            disableFiltering={true}
            customWidthSelect="w-[30%]"
            onReset={handleReset}
            onSearch={handleSearch}
          >
            <div className="flex flex-row gap-2 items-center w-full">
            <GeneralInput 
              isDob={true} 
              inputType = "text"
              name={"start_date"}
              onChange={handleInputChange}
              value={dateTime.start_date}
            />
            <span>-</span>
            <GeneralInput 
              isDob={true} 
              inputType = "text"
              name={"end_date"}
              onChange={handleInputChange}
              value={dateTime.end_date}
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
