import React, { useState } from "react";
import ContainerCard from "../../components/ContainerCard/ContainerCard";
import Filtering from "../../components/Filtering/Filtering";
import { ReactTabulator } from "react-tabulator";
import DetailForm from "../../components/DetailForm/DetailForm";
import LogList from "../../components/LogList/LogList";
import ButtonGroup from "../../components/ButtonGroup/ButtonGroup";
import Select from "../../components/Select/Select";
import GeneralInput from "../../components/GeneralInput/GeneralInput";
import DynamicForm from "../../components/DynamicForm/DynamicForm";
import IconDelete from "../../assets/icon/icon-delete-circle.svg";
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
    title: "사이트 ID",
    field: "site_id",
    WidthGrow: 1,
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
    site_id: "SITE00100",
    name: "삼성역 사거리 교차로",
    address: "서울시 강남구 삼성동",
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

  const logData = [
    { label: "등록자", value: "김철수" },
    { label: "등록 시간", value: "02-22-2022 12:02:47 " },
    { label: "수정자", value: "박철수" },
    { label: "수정 시간", value: "02-23-2022 12:02:47 " },
  ];

  const [groupList, setGroupList] = useState([]);

  const addDynamicGroup = () => {
    setGroupList([...groupList, groupList.length + 1]); 
  };

  const deleteDynamicGroup = (index) => {
    const newGroupList = groupList.filter((_, i) => i !== index); 
    setGroupList(newGroupList);
  };

  //same with DB table
  const [formValues, setFormValues] = useState({
    site_id:'',
    name:'',
    address:'',
    latitude:'',
    longitude:'',
    type:'교차로',
    number_of_access_roads:'',
    mapping_box:''
  })

  
  const handleInputChange = (e) =>{
    const { name, value } = e.target; 
    console.log(name)
    console.log(value)
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    console.log(formValues)
  }

  return (
    <>
      <section className="wrap">
        <div className="header-title">
          <h3>사이트 관리</h3>
          <h3>&gt;</h3>
          <h3>사이트</h3>
        </div>

        <ContainerCard>
          <Filtering
            // labelSelect="매핑 사이트 타입"
            placeholder="명칭 / 시리얼 넘버"
            disableFiltering={true}
          >
            {/* <Select
              options={options}
              //   label="Pilih Opsi"
              //   name="contoh aja coy"
              value={selectedOption}
              onChange={handleChange}
            /> */}
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

        <ContainerCard className=" flex flex-col">
          <div className="gap-2.5 flex flex-col">
            <span className="title2bold ">사이트</span>
            {/* <hr className="border-t border-gray-300" /> */}
          </div>

          <div className="box-management-col flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-[50px]">
              <DetailForm 
              className="items-center!" 
              label="사이트 ID" 
              onChange={handleInputChange}
              name="site_id"
              />

              <DetailForm
                className="items-center!"
                label="명칭"
                required={true}
                placeholder="삼성역 사거리 교차로"
                onChange={handleInputChange}
                name="name"
              />

              <DetailForm
                className="items-center!"
                label="주소"
                required={true}
                placeholder="서울시 강남구 삼성동"
                onChange={handleInputChange}
                name="address"
              />
            </div>

            <div className="grid grid-cols-3 gap-[50px]">
              <div className="flex w-full flex-row gap-x-4">
                <DetailForm
                  className="items-center!"
                  label="위도 / 경도"
                  required={true}
                  showInput={false}
                >
                  <div className="flex w-full flex-row gap-x-2">
                    <GeneralInput customInput="w-full" placeholder="5.55555" onChange={handleInputChange} name="latitude"/>
                    <GeneralInput customInput="w-full" placeholder="5.55555" onChange={handleInputChange} name="longitude"/>
                  </div>
                </DetailForm>
              </div>

              <DetailForm
                inputType="select"
                className="items-center!"
                label="타입"
                required={true}
                optionSelect={[
                  { label: "교차로", value: "교차로" },
                  { label: "횡단보도", value: "횡단보도" },
                ]}
                //onChange={(e) => console.log("Selected:", e.target.value)}
                onChange={handleInputChange} name="type"
              />

              <DetailForm 
                className="items-center!" 
                label="접근로 수" 
                onChange={handleInputChange} 
                name="number_of_access_roads"
              />
            </div>

            <div className="grid grid-cols-3 gap-[50px]">
              <DetailForm
                className="items-center!"
                label="매핑 함체"
                required={true}
                placeholder="BX01001(ID0001)"
                onChange={handleInputChange} 
                name="mapping_box"
              />
            </div>

            <hr className="border-t border-gray-300" />

            <div className="gap-2.5 flex flex-row items-center">
              <span className="title2bold ">접근로</span>
              <span
                className="body1bold px-[20px] py-[3px] bg-[#3D6B85] text-[#FEFEFE] "
                onClick={addDynamicGroup}
              >
                Add +
              </span>
              {/* <hr className="border-t border-gray-300" /> */}
            </div>

            {groupList.map((_, index) => (
              <div key={index}>
                <DynamicForm index={index} onDelete={deleteDynamicGroup} />
              </div>
            ))}

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
  );
};

export default SiteManagement;
