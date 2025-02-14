import React, { useState } from "react";
import ContainerCard from "../../components/ContainerCard/ContainerCard";
import Filtering from "../../components/Filtering/Filtering";
import { ReactTabulator } from "react-tabulator";
import DetailForm from "../../components/DetailForm/DetailForm";
import LogList from "../../components/LogList/LogList";
import ButtonGroup from "../../components/ButtonGroup/ButtonGroup";
import Select from "../../components/Select/Select";
import GeneralInput from "../../components/GeneralInput/GeneralInput";


const detectorTabulator = [
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
    title: "검지기 ID",
    field: "detector_id",
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
    title: "시리얼 넘버",
    field: "serial_number",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "매핑 사이트 타입",
    field: "site_type",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "매핑 사이트",
    field: "mapping_site",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "매핑 접근로",
    field: "mapping_approach",
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
    detector_id: "000123",
    name: "DT01001",
    serial_number: "0222-2222",
    site_type: "삼성역 사거리 교차로",
    mapping_site: "삼성역 사거리 교차로",
    mapping_approach: "북쪽 접근로",
    update_date: "2025-01-24 23:10:11",
  },
];

const DetectorManagement = () => {

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
  
    const logData = [
      { label: "등록자", value: "김철수" },
      { label: "등록 시간", value: "02-22-2022 12:02:47 " },
      { label: "수정자", value: "박철수" },
      { label: "수정 시간", value: "02-23-2022 12:02:47 " },
  
    ];


  return (
    <>
     <section className="wrap">
        <div className="header-title">
          <h3>자산 관리</h3>
          <h3>&gt;</h3>
          <h3>검지기</h3>
        </div>

        <ContainerCard>
          <Filtering
            labelSelect="매핑 사이트 타입"
            placeholder="명칭 / 시리얼 넘버"
            disableFiltering={true}
          >
            <Select
              options={options}
              label="Pilih Opsi"
              name="contoh aja coy"
              value={selectedOption}
              onChange={handleChange}
            />
          </Filtering>
        </ContainerCard>

        <ContainerCard>
          <ReactTabulator
            data={data}
            columns={detectorTabulator}
            layout={"fitColumns"}
            className="tabulator-custom w-full "
            //   pagination="local"
            options={optionsTabulator}
          />
        </ContainerCard>

        <ContainerCard className=" flex flex-col">
          <div className="box-management-col flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-[50px]">
              <DetailForm className="items-center!" label="검지기 ID" placeholder= "00123"/>

              <DetailForm
                className="items-center!"
                label="명칭"
                required={true}
                placeholder="BX01001"
              />
            </div>

            <div className="grid grid-cols-3 gap-[50px]">
              <div className="flex w-full flex-row gap-x-4">
                <DetailForm
                  className="items-center!"
                  label="설치 위/경도"
                  required={true}
                  showInput={false}
                >
                  <div className="flex w-full flex-row gap-x-2">
                    <GeneralInput customInput="w-full" placeholder="5.55555" />
                    <GeneralInput customInput="w-full" placeholder="5.55555" />
                  </div>
                </DetailForm>
              </div>

              <DetailForm
                className="items-center!"
                label="설치 일시"
                placeholder="2025.01.20"
                required={true}
              />

            </div>

            <div className="grid grid-cols-3 gap-[50px]">
            <DetailForm
                inputType="select"
                className="items-center!"
                label="매핑 사이트"
                required={true}
                optionSelect={[
                  { label: "사이트 1", value: "site1" },
                  { label: "사이트 2", value: "site2" },
                  { label: "사이트 3", value: "site3" }
                ]}
                value="site1" 
                onChange={(e) => console.log("Selected:", e.target.value)}
              />
            <DetailForm
                inputType="select"
                className="items-center!"
                label="매핑 접근로"
                required={true}
                optionSelect={[
                  { label: "남쪽 접근로(ROAD001)", value: "site1" },
                  { label: "남쪽 접근로(ROAD002)", value: "site2" },
                  { label: "남쪽 접근로(ROAD003)", value: "site3" }
                ]}
              
                onChange={(e) => console.log("Selected:", e.target.value)}
              />

            </div>

            <div className="grid grid-cols-3 gap-[50px]">
              <DetailForm
                className="items-center!"
                label="담당자"
                required={true}
                placeholder="김철수"
              />

              <DetailForm
                className="items-center!"
                label="담당자 전화번호"
                required={true}
                inputType= "number"
                placeholder="089502606853"
              />
            </div>

            <div className="grid grid-cols-3 gap-[50px]">
              <DetailForm
                className="items-center!"
                label="모델명"
                required={true}
                placeholder="ABCD-1234"
              />

              <DetailForm
                className="items-center!"
                label="시리얼 넘버"
                required={true}
                placeholder="0222-2222"
              />

              <DetailForm
                className="items-center!"
                label="제조사"
                required={true}
                placeholder="비트센싱"
              />
            </div>

            <div className="grid grid-cols-3 gap-[50px]">
              <DetailForm
                className="items-center!"
                label="Mac Address"
                required={true}
                placeholder="00-1A-2B-3C-4D-5E"
              />

              <DetailForm
                className="items-center!"
                label="IP"
                required={true}
                placeholder="192.168.1.1"
              />

              <DetailForm
                className="items-center!"
                label="카메라 접속 URL"
                required={true}
                placeholder="192.168.1.1"
              />
            </div>

            <div className="grid grid-cols-1">
              <DetailForm
                className=" h-[90px]"
                inputType="textarea"
                label="설명"
                value="해당 장비는 기기들을 관리하는 장비로써....."
              />
            </div>

            <hr className="border-t border-gray-300" />
            <div className="flex items-center justify-between gap-4 w-full">
              <div className="flex-1">
                <LogList logs={logData} />
              </div>
              <div className="flex-none">
                <ButtonGroup

                  cancelButtonState={false}
                  confirmButtonState={false}
                  deleteButtonState={false}
                  newButtonState={false}
                />
              </div>
            </div>
          </div>
        </ContainerCard>
      </section>
    
    </>

  )
}

export default DetectorManagement
