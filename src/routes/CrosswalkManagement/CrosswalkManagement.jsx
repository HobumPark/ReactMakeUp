import React, { useState } from "react";
import ContainerCard from "../../components/ContainerCard/ContainerCard";
import Filtering from "../../components/Filtering/Filtering";
import { ReactTabulator } from "react-tabulator";
import DetailForm from "../../components/DetailForm/DetailForm";
import LogList from "../../components/LogList/LogList";
import ButtonGroup from "../../components/ButtonGroup/ButtonGroup";
import Select from "../../components/Select/Select";
import GeneralInput from "../../components/GeneralInput/GeneralInput";


const facilityTabulator = [
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
    title: "교차로 ID",
    field: "intersection_id",
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
    title: "위도, 경도",
    field: "lat_long",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "장비 구성",
    field: "equipment_conf",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },

];

const data = [
  {
    intersection_id: "000123",
    name: "삼성역 사거리",
    address: "서울시 강남구 삼성동",
    lat_long: "5.55572383, 5.55572383",
    equipment_conf: "레이더, 스피커, 전광판",
  },
];


const CrosswalkManagement = () => {

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
    <section className="wrap">
    <div className="header-title">
      <h3>이트 관리</h3>
      <h3>&gt;</h3>
      <h3>횡단보도</h3>
    </div>

    <ContainerCard>
      <Filtering
        // labelSelect="유형"
        placeholder="검색"
        disableFiltering={true}
      >
        {/* <Select
          options={options}
          label="Pilih Opsi"
          name="contoh aja coy"
          value={selectedOption}
          onChange={handleChange}
        /> */}
      </Filtering>
    </ContainerCard>

    <ContainerCard>
      <ReactTabulator
        data={data}
        columns={facilityTabulator}
        layout={"fitColumns"}
        className="tabulator-custom w-full "
        //   pagination="local"
        options={optionsTabulator}
      />
    </ContainerCard>

    <ContainerCard className=" flex flex-col">
      <div className="box-management-col flex flex-col gap-3">
        <div className="grid grid-cols-3 gap-[50px]">
          <DetailForm className="items-center!" label="횡단보도 ID" placeholder= "001" disabled= "disabled"/>

          <DetailForm
            className="items-center!"
            label="명칭"
            placeholder="동대구역 사거리 횡단보도"
          />

          
          <DetailForm
            className="items-center!"
            label="주소"
            placeholder="동서울시 강남구 삼성동"
          />
{/* 
        <DetailForm
            inputType="select"
            className="items-center!"
            label="유형"
            required={true}
            optionSelect={[
              { label: "전광판", value: "전광판" },
              { label: "스피커", value: "스피커" },
           
            ]}
          
            onChange={(e) => console.log("Selected:", e.target.value)}
          /> */}
        </div>

        <div className="grid grid-cols-3 gap-[50px]">
          <div className="flex w-full flex-row gap-x-4">
            <DetailForm
              className="items-center!"
              label="위도 / 경도"
              showInput={false}
            >
              <div className="flex w-full flex-row gap-x-2">
                <GeneralInput customInput="w-full" placeholder="5.55555" />
                <GeneralInput customInput="w-full" placeholder="5.55555" />
              </div>
            </DetailForm>
          </div>


          <div className="flex w-full flex-row gap-x-4">
            <DetailForm
              className="items-center!"
              label="타입"
              required={true}
              showInput={false}
            >
              <div className="flex w-full flex-row gap-x-2">
                <GeneralInput customInput="w-full" placeholder="5m" />
                <GeneralInput customInput="w-full" placeholder="2.5m" />
              </div>
            </DetailForm>
          </div>

          <DetailForm
            className="items-center!"
            label="신호등 여부"
            placeholder="존재"
          
          />

        </div>

        <div className="grid grid-cols-3 gap-[50px]">
        <DetailForm
            className="items-center!"
            label="속도 제한"
            placeholder="60km"
          
          />
        <DetailForm
            className="items-center!"
            label="설치 함체"
            placeholder="BX01001(ID0001)"
          
          />
 
          <DetailForm
            className="items-center!"
            label="설치 검지기"
            placeholder="DT01001(ID0001)"
          />

        </div>

        <div className="grid grid-cols-1">
          <DetailForm
            // inputType="textarea"
            label="설치 시설물"
            placeholder="BA01001(ID0001), SP01002(ID0003)"
      
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
  )
}

export default CrosswalkManagement
