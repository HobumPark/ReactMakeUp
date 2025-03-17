import React, { useState, useEffect, useCallback, useRef } from "react";
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
import useHistory from "../../hooks/useHistory";
import { URLS } from "../../config/urls";




const CommunicationHistory = () => {
  const { t, i18n } = useTranslation();
  const tbRef = useRef(null);
  const today = new Date();
  const [isResetClicked, setIsResetClicked] = useState(false)

  const getYesterdayMidnight = () => {
    const date = new Date();
    date.setDate(date.getDate()); 
    date.setHours(0, 0, 0, 999);
    return date;
  };

  const yesterdayMidnight = getYesterdayMidnight();
  const [dateTime, setDateTime] = useState({
    start_date:formatDateTime(yesterdayMidnight),
    end_date: formatDateTime(today)
  });

  const [queryParams, setQueryParams] = useState(`start_date=${getLocalISOString(yesterdayMidnight)}&end_date=${getLocalISOString(today)}`);
  const [page, setPages] = useState(`start_date=${getLocalISOString(yesterdayMidnight)}&end_date=${getLocalISOString(today)}`)
  
  const { objectListData } = useHistory({
    queryParams: page
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
  const [sortDirection, setSortDirection] = useState('desc');

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
      // sorter: (column, dir, sorter) => {
      //   const newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      //   setSortDirection(newSortDirection);
      //   setQueryParams(queryParams+`&order=${sortDirection}&sort=timestamp`);        
      // },
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



  const optionsTabulator = {
    pagination:true, //enable pagination
    paginationMode:"remote", 
    paginationSize: 10,
    paginationInitialPage: 1,   
    rowHeight: 41,
    movableRows: false,
    index: "id",
    locale: "ko",
    langs: {
      ko: languageTabulator(),
    },
    resizableRows: false,
    footerElement: `<div style="padding: 0 20px 0 0; text-align: right;">총 <a id="list_count"></a> 건</div>`,
    ajaxURL: `${`${URLS.BACK_DSH}`}/object?${queryParams}`,
    ajaxConfig: {
      method: "GET",
      credentials: "include",
    },  
    ajaxResponse: (url, params, response) => {
      console.log(params);
      
      return {
        data: response.data.items,
        last: response.data.total_pages
      };
    }, 
    dataReceiveParams: {
      last_page: 'last',
    },
    ajaxURLGenerator: function (url, config, params) {
      let myUrl = url;

      let page = params['page'];
      let size = params['size'];
      if (page) {
        myUrl += `&page=${page}&size=${size || 10}`;
      }
      
      if (params['sort'].length > 0) {
        let field = params['sort'][0]['field'];
        let dir = params['sort'][0]['dir'];
        myUrl += `&sort=${field}&order=${dir}`;
      }

      return myUrl;
    },
    dataLoader: false, 
    sortMode:"remote"

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


  useEffect(() => {
    console.log(queryParams);
    if (tbRef.current) {
        tbRef.current.setData(`${`${URLS.BACK_DSH}`}/object?${queryParams}`);
    }
}, [queryParams]);



useEffect(() => {
  if (data) {
    const footerElement = document.getElementById('list_count');
    if (footerElement) {
      footerElement.textContent = data?.total_cnt;
    }
  }
}, [data]); 

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
            paginationCounter={true}
            columns={communityHistoryTabulator}
            layout={"fitColumns"}
            className="tabulator-custom w-full "
            onRef={(r) => {
              tbRef.current = r.current;
            }}
            options={optionsTabulator}
            events={{
            tableBuilt: () => {
                tbRef.current.setSort("timestamp", "desc"); 
            },
            dataLoaded: function (data) {
              console.log('dataLoaded', data);
              const footerElement = document.getElementById('list_count');
              if (footerElement) {
                footerElement.textContent = tbRef.current.recalc();
              }
            },
            pageLoaded: (pageNumber) => {
              setPages((prevPage) => prevPage + `&page=${pageNumber}`)
              console.log("Current Page:", pageNumber);
              console.log("Max Page:", tbRef.current.getPageMax()); // Logs the max pages after the page is loaded
                }
            }}
          />
        </ContainerCard>
      </section>
    </>
  );
};

export default CommunicationHistory;
