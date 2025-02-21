import React, { useCallback, useEffect, useRef, useState } from "react";
import ContainerCard from "../../components/ContainerCard/ContainerCard";
import Filtering from "../../components/Filtering/Filtering";
import { ReactTabulator } from "react-tabulator";
import DetailForm from "../../components/DetailForm/DetailForm";
import LogList from "../../components/LogList/LogList";
import ButtonGroup from "../../components/ButtonGroup/ButtonGroup";
import Select from "../../components/Select/Select";
import GeneralInput from "../../components/GeneralInput/GeneralInput";
import useCommonCodes from "../../hooks/useCommonCodes";
import { useTranslation } from "react-i18next";
import useFacilityMgt from "../../hooks/useFacilityMgt";


const facilityTabulator = [
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
    title: "시설물 ID",
    field: "facility_id",
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
    title: "유형",
    field: "type_value",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "시리얼 넘버",
    field: "s_n",
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
    field: "updated_time",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
];


const FacilityManagement = () => {

  const { t } = useTranslation();
  const tbRef = useRef(null);
  const searchRef = useRef(null);
  const [disabledForm, setDisabledForm] = useState(true);
  const [hasChangesUpdate, setHasChangesUpdate] = useState(false);
  const [hasChangesCreate, setHasChangesCreate] = useState(false);
  const hasChangesUpdateRef = useRef(hasChangesUpdate);
  const hasChangesCreateRef = useRef(hasChangesCreate);
  const [newId, setNewId] = useState('');
  const [isNewClicked, setIsNewClicked] = useState(false);

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, []); 

  //Params 
  const [selectedOption, setSelectedOption] = useState("");
  const [queryParams, setQueryParams] = useState("");
  const [optionParams, setOptionParams] = useState("upper-code=221");
  const [selectedFacility, setSelectedFacility] = useState({
    fc_id: null,
  });
  

  useEffect(() => {
    hasChangesUpdateRef.current = hasChangesUpdate;
    hasChangesCreateRef.current = hasChangesCreate;
  }, [hasChangesUpdate, hasChangesCreate]);


  //Values
  const [formValues, setFormValues] = useState({
    facility_id: null,
    site_id: null,
    road_id: null, 
    name: null,
    description: null,
    installed_date: null,
    pic_name: null,
    pic_phone_number: null,
    model: null,
    s_n: null,
    lat: null,
    lng: null,
    manufacturer: null,
    ip: null,
    mac: null,
    port: null,
    type: null
  });

  const emptyDetail = () => {
    setFormValues((prevValues) => ({
      ...prevValues,
      facility_id: '',
      site_id: '',
      road_id: '', 
      name: '',
      description: '',
      installed_date: '',
      pic_name: '',
      pic_phone_number: '',
      model: '',
      s_n: '',
      lat: '',
      lng: '',
      manufacturer: '',
      ip: '',
      mac: '',
      port: '',
      type: ''
    }));
  };

  //Button 
  const [buttonState, setButtonState] = useState({
    confirm: true,
    cancel: true,
    delete: true,
    create: false,
  });


  const disableAllButtons = () => {
    setButtonState({
      confirm: true,
      cancel: true,
      delete: true,
      create: true,
    });
  };

  const enableInitialButtons = () => {
    disableAllButtons();
    setIsNewClicked(false); 
    setButtonState((prevState) => ({
      ...prevState,
      create: false,
    }));
  };

  const enableUPDATEButtons = () => {
    disableAllButtons();
    setButtonState((prevState) => ({
      ...prevState,
      cancel: false,
      delete: false,
      create: false,
    }));
  };

  const enableRegisterButtons = () => {
    disableAllButtons();
    setButtonState((prevState) => ({
      ...prevState,
      cancel: false,
    }));
  };


  const { facilityListData } = useFacilityMgt({
    fcID: selectedFacility?.fc_id,
    queryParams: queryParams
  });

  const data = facilityListData?.data;

  const { commonListData } = useCommonCodes({ optionParams });

  const handleInputChange = (e) => {
    const { name, value } = e.target;  
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    
    if (isNewClicked) {
      setHasChangesCreate(true); 
    } else {
      setHasChangesUpdate(true); 
    }

    if (selectedFacility?.dt_id){
      setHasChangesUpdate(true);
    }
  };

  const handleOnChangeInputSelect = useCallback(({ target }) => {
    const { value } = target;
    setSelectedOption(value);
  }, []); 

  
  const languageTabulator = () => {
    let datalanguage = {
      pagination: {
        first:  t('cmn > first page'),
        first_title: t('cmn > first page'), 
        last: t('cmn > last page'),
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
    debugInvalidOptions: true,
    pagination: true,
    paginationSize: 10,
    rowHeight: 41,
    selectableRows: 1,
    movableRows: false,
    resizableRows: false,
    locale: "ko",
    langs: {
      ko: languageTabulator(),
    },
    selectableRowsCheck: (row) => {
      return !row.getElement().classList.contains("tabulator-selected");
    },
    footerElement: `<div style="padding: 0 20px 0 0; text-align: right;">총 ${data?.length} 건</div>`,
  };

  const handleSearch = useCallback((inputVal = null) => {
    const resultInput = inputVal ? `input=${inputVal}` : "";
    const resultSelect = selectedOption && selectedOption !== "All"
          ? `&type=${selectedOption}`
          : "";
    const result = resultInput +  resultSelect;
    setQueryParams(result); 
    },[selectedOption]);

  const handleReset= () => {
    setSelectedOption('All');
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
      <h3>자산 관리</h3>
      <h3>&gt;</h3>
      <h3>시설물</h3>
    </div>

    <ContainerCard>
      <Filtering
        searchRef={searchRef}
        labelSelect="유형"
        placeholder="명칭 / 시리얼 넘버"
        disableFiltering={true}
        onReset = {handleReset}
        onSearch={handleSearch}
      >
        <Select
          value={selectedOption}
          onChange={handleOnChangeInputSelect}
          options={
                commonListData?.["221"]
                    ? [
                        { value: "All", label: t('cmn > all') }, 
                        ...commonListData["221"].code.map((code, index) => ({
                          value: code,
                          label: commonListData["221"].name[index],
                        })),
                      ]
                    : []
                  }
        />
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
          <DetailForm 
          className="items-center!" 
          label="시설물 ID" 
          disabled={disabledForm}
          onChange={handleInputChange}
          value={formValues.facility_id}
          name={'facility_id'}
          />

          <DetailForm
            className="items-center!"
            label="명칭"
            required={true}
            disabled={disabledForm}
            onChange={handleInputChange}
            value={formValues.name}
            name={'name'}
          />

        <DetailForm
            inputType="select"
            className="items-center!"
            label="유형"
            required={true}
            disabled={disabledForm}
            onChange={handleInputChange}
            value={formValues.type}
            name={'type'}
            optionSelect={[
              { label: "전광판", value: "전광판" },
              { label: "스피커", value: "스피커" },
           
            ]}
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
                <GeneralInput 
                customInput="w-full" 
                disabled={disabledForm}
                onChange={handleInputChange}
                value={formValues.lat}
                name={'lat'}
                />
                <GeneralInput 
                customInput="w-full" 
                disabled={disabledForm}
                onChange={handleInputChange}
                value={formValues.lng}
                name={'lng'}
                 />
              </div>
            </DetailForm>
          </div>

          <DetailForm
            className="items-center!"
            label="설치 일시"
            required={true}
            disabled={disabledForm}
            onChange={handleInputChange}
            value={formValues.installed_date}
            name={'installed_date'}
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
            disabled={disabledForm}
            onChange={handleInputChange}
            value={formValues.site_id}
            name={'site_id'}

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
          
            disabled={disabledForm}
            onChange={handleInputChange}
            value={formValues.road_id}
            name={'road_id'}
          />

        </div>

        <div className="grid grid-cols-3 gap-[50px]">
          <DetailForm
            className="items-center!"
            label="담당자"
            required={true}
            disabled={disabledForm}
            onChange={handleInputChange}
            value={formValues.pic_name}
            name={'pic_name'}
          />

          <DetailForm
            className="items-center!"
            label="담당자 전화번호"
            required={true}
            inputType= "number"
            disabled={disabledForm}
            onChange={handleInputChange}
            value={formValues.pic_phone_number}
            name={'pic_phone_number'}
          />
        </div>

        <div className="grid grid-cols-3 gap-[50px]">
          <DetailForm
            className="items-center!"
            label="모델명"
            required={true}
            disabled={disabledForm}
            onChange={handleInputChange}
            value={formValues.model}
            name={'model'}
          />

          <DetailForm
            className="items-center!"
            label="시리얼 넘버"
            required={true}
            disabled={disabledForm}
            onChange={handleInputChange}
            value={formValues.s_n}
            name={'s_n'}
          />

          <DetailForm
            className="items-center!"
            label="제조사"
            required={true}
            disabled={disabledForm}
            onChange={handleInputChange}
            value={formValues.manufacturer}
            name={'manufacturer'}
          />
        </div>

        <div className="grid grid-cols-3 gap-[50px]">
          <DetailForm
            className="items-center!"
            label="Mac Address"
            required={true}
            disabled={disabledForm}
            onChange={handleInputChange}
            value={formValues.mac}
            name={'mac'}
          />

        <div className="flex w-full flex-row gap-x-4">
            <DetailForm
              className="items-center!"
              label="IP / PORT"
              required={true}
              showInput={false}
            >
              <div className="flex w-full flex-row gap-x-2 items-center">
                <GeneralInput 
                customInput="w-full" 
                disabled={disabledForm}
                onChange={handleInputChange}
                value={formValues.ip}
                name={'ip'} />
                <span>:</span>
                <GeneralInput 
                customInput="w-full" 
                disabled={disabledForm}
                onChange={handleInputChange}
                value={formValues.port}
                name={'port'} />
              </div>
            </DetailForm>
          </div>
        </div>

        <div className="grid grid-cols-1">
          <DetailForm
            className=" h-[90px]"
            inputType="textarea"
            label="설명"
            disabled={disabledForm}
            onChange={handleInputChange}
            value={formValues.description}
            name={'description'}
          />
        </div>

        <hr className="border-t border-gray-300" />
        <div className="flex items-center justify-between gap-4 w-full">
          <div className="flex-1">
          {disabledForm ? null : <LogList  logs={logData}/>}
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

export default FacilityManagement
