import React, { useState } from "react";
import ContainerCard from "../../components/ContainerCard/ContainerCard";
import Filtering from "../../components/Filtering/Filtering";
import { ReactTabulator } from "react-tabulator";
import DetailForm from "../../components/DetailForm/DetailForm";
import LogList from "../../components/LogList/LogList";
import ButtonGroup from "../../components/ButtonGroup/ButtonGroup";
import Select from "../../components/Select/Select";

const boxTabulator = [
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
    title: "함체 ID",
    field: "vesselId",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "명칭",
    field: "name",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "주소",
    field: "address",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "위도 / 경도",
    field: "location",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "접근로 수",
    field: "no_approaches",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "업데이트 일시",
    field: "update_date",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
];

const data = [
  {
    vesselId: "12345",
    address: "서울시 강남구 삼성동",
    name: "삼성역 사거리 교차로",
    location: "5.55572383 / 5.55572383",
    no_approaches: "4",
    update_date: "2025-01-24 23:10:11",
  },
];

const SiteManagement = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const handleChange = (e) => {
    setSelectedOption(e.target.value);
  };
  const options = [
    { value: "전체", label: "전체" },
    { value: "교차로", label: "교차로" },
    { value: "횡단보도", label: "횡단보도" },
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
      <section className="wrap">
        <div className="header-title">
          <h3>sitemanagement </h3>
          <h3>&gt;</h3>
          <h3>함체</h3>
        </div>

        <ContainerCard>
          <Filtering
            labelSelect="매핑 사이트 타입"
            placeholder="명칭 / 시리얼 넘버"
            disableFiltering={true}
          >
            <Select
              options={options}
            //   label="Pilih Opsi"
            //   name="contoh aja coy"
              value={selectedOption}
              onChange={handleChange}
            />
          </Filtering>
        </ContainerCard>

        <ContainerCard>
          <ReactTabulator
            data={data}
            columns={boxTabulator}
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

export default SiteManagement;
