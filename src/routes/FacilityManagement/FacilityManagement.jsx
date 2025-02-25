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
import AirDatepicker from "air-datepicker";
import 'air-datepicker/air-datepicker.css';
import localeEn from 'air-datepicker/locale/en.js'; 
import localeKo from 'air-datepicker/locale/ko.js'; 
import localeId from 'air-datepicker/locale/id.js';
import useUnmappedSiteRoad from "../../hooks/useUnmappedSiteRoad";
import NoticeMessage from "../../plugin/noticemessage/noticemessage";
import { formatDateKor, formatDateToYYYYMMDD } from "../../utils/date";


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
    headerSort: true,
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
    field: "site_type_value",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "매핑 사이트",
    field: "site_name",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "매핑 접근로",
    field: "road_name",
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
    headerSort: true,
    resizable: false,
  },
];


const FacilityManagement = () => {
  const { t, i18n } = useTranslation();
  const tbRef = useRef(null);
  const nameRef = useRef(null);
  const searchRef = useRef(null);
  const [disabledForm, setDisabledForm] = useState(true);
  const [hasChangesUpdate, setHasChangesUpdate] = useState(false);
  const [hasChangesCreate, setHasChangesCreate] = useState(false);
  const [isNewClicked, setIsNewClicked] = useState(false);
  const hasChangesUpdateRef = useRef(hasChangesUpdate);
  const hasChangesCreateRef = useRef(hasChangesCreate);
  const isNewClickedRef = useRef(isNewClicked);
  const [newId, setNewId] = useState('');
  const [selectedSiteId, setSelectedSiteId] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, []); 


  //Params 
  const [selectedOption, setSelectedOption] = useState("");
  const [queryParams, setQueryParams] = useState("");
  const [optionParams, setOptionParams] = useState("upper-code=221");
  const [resource, setResource] = useState("");
  const [selectedFacility, setSelectedFacility] = useState({
    fc_id: null,
  });
  const selectedFacilityRef = useRef(selectedFacility);
  

  useEffect(() => {
    hasChangesUpdateRef.current = hasChangesUpdate;
    hasChangesCreateRef.current = hasChangesCreate;
    isNewClickedRef.current = isNewClicked;
    selectedFacilityRef.current = selectedFacility
  }, [hasChangesUpdate, hasChangesCreate, isNewClicked, selectedFacility]);


  const detailFacility = (data) => {
    return {
      facility_id: data.facility_id || null,
      site_id: data.site_id || null,
      road_id: data.road_id || null,
      name: data.name || null,
      description: data.description || null,
      installed_date: data.installed_date || null,
      pic_name: data.pic_name || null,
      pic_phone_number: data.pic_phone_number || null,
      model: data.model || null,
      s_n: data.s_n || null,
      lat: data.lat || null,
      lng: data.lng || null,
      manufacturer: data.manufacturer || null,
      ip: data.ip || null,
      mac: data.mac || null,
      port: data.port || null,
      type: data.type || null,
    };
  };

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
      position: "top center",
      onSelect: (date) => {
        handleInputChange({
          target: {
            name: "installed_date",
            value: date.formattedDate,
          },
        });
        setFormValues((prevValues) => ({
          ...prevValues,
          installed_date: date.formattedDate,
        }));
      },
    };

    const datepicker = new AirDatepicker('[name="installed_date"]', optionsDate);

    return () => {
      datepicker.destroy();
    };
  }, [i18n.language]);

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
    setFormValues((prevValues) =>
      Object.keys(prevValues).reduce((acc, key) => {
        acc[key] = '';
        return acc;
      }, {})
    );
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

  const reloadCallback = () => {
    enableInitialButtons();
    tbRef.current.deselectRow();
    emptyDetail();
    setDisabledForm(true);
    setHasChangesUpdate(false);
    setIsNewClicked(false);
    setHasChangesCreate(false);
    setSelectedSiteId(null)
    setSelectedFacility({ fc_id: null });
  };

  const { facilityListData, detailFacilityData, deleteFacility, createFacility, updateFacility } = useFacilityMgt({
    fcID: selectedFacility?.fc_id,
    queryParams: queryParams,
    onDeleteSuccess: reloadCallback,
    onUpdateSuccess: () => {
      enableUPDATEButtons();
      setIsNewClicked(false);
      setHasChangesUpdate(false);
    },
    onCreateSuccess: (responseData) => {
      reloadCallback();
      console.log(responseData);
      const newID = responseData.facility_id;
      setNewId(newID);
    },
  });

  const data = facilityListData?.data;
  const dataFacility = detailFacilityData?.data;

  const { commonListData } = useCommonCodes({ optionParams });
  const { unmappedSiteRoad } = useUnmappedSiteRoad({ resource });

  const dataSiteRoad = unmappedSiteRoad?.data;

  const handleInputChange = (e) => {
    const { name, value } = e.target;  
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

  
    if (name === "site_id") {
      console.log("Site changed:", value);
      setSelectedSiteId(value);
    }

    if (isNewClickedRef.current) {
      setHasChangesCreate(true); 
      if (name === 'type') {
        if (value === "221001") {
          setResource("resource=speaker");
        } else if (value === "221002") {
          setResource("resource=vms");
        } else {
          setResource(""); 
        }
      }
    } else {
      setHasChangesUpdate(true);
    }

    if (selectedFacilityRef.current?.fc_id) {
      setHasChangesUpdate(true);
      if (name === 'type') {
        if (value === "221001") {
          setResource(`id=${selectedFacilityRef.current?.fc_id}&resource=speaker`);
        } else if (value === "221002") {
          setResource(`id=${selectedFacilityRef.current?.fc_id}&resource=vms`);
        } else {
          setResource(""); 
        }
      }
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
    index: 'facility_id',
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


  const handleRowSelected = useCallback((row) => {
    if(hasChangesCreateRef.current || hasChangesUpdateRef.current){
      const message = new NoticeMessage(
        t('msg > flush confirm'),
        {
          mode: "confirm",
        }
      );
      message.confirmClicked().then(() => {
        const rowData = row.getData();

        
        setSelectedFacility({
          fc_id: rowData.facility_id,  
        });
        setSelectedSiteId(rowData.site_id);
        if (rowData.type === "221001") {
          setResource(`id=${rowData.facility_id}&resource=speaker`);
        } else if (rowData.type === "221002") {
          setResource(`id=${rowData.facility_id}&resource=vms`);
        } 
        setDisabledForm(false);
        setHasChangesUpdate(false);
        setIsNewClicked(false);
      });
      
    } else {
      const rowData = row.getData();
      setSelectedFacility({
        fc_id: rowData.facility_id,  
      });
      if (rowData.type === "221001") {
        setResource(`id=${rowData.facility_id}&resource=speaker`);
      } else if (rowData.type === "221002") {
        setResource(`id=${rowData.facility_id}&resource=vms`);
      } 
      setSelectedSiteId(rowData.site_id);
      setDisabledForm(false);
      enableUPDATEButtons();
      setIsNewClicked(false);
    }
    requestAnimationFrame(() => {
      if (nameRef.current) {
        nameRef.current.focus();
      }
    }); 
  }, []);

  const handleNewButtonClick = () => {
    if(hasChangesCreate || hasChangesUpdate){
      const message = new NoticeMessage(
        t('msg > flush confirm'),
        {
          mode: "confirm",
        }
      );
      message.confirmClicked().then(() => {
        tbRef.current.deselectRow();
        emptyDetail();
        setIsNewClicked(true);
        enableRegisterButtons();
        setSelectedFacility({fc_id: null});
        setSelectedSiteId(null);
        setDisabledForm(false);
        setHasChangesUpdate(false);
      });
    } else{
      tbRef.current.deselectRow();
      emptyDetail();
      setIsNewClicked(true);
      enableRegisterButtons();
      setSelectedFacility({fc_id: null});
      setSelectedSiteId(null);
      setDisabledForm(false); 
      setHasChangesUpdate(false);
    }
    requestAnimationFrame(() => {
      if (nameRef.current) {
        nameRef.current.focus();
      }
    }); 

  };

  const handleCancelButtonClick = () => {
    if (hasChangesUpdate){
      const message = new NoticeMessage(
        t('msg > flush confirm'),
        {
          mode: "confirm",
        }
      );
      message.confirmClicked().then(() => {
        setDisabledForm(false);
        const formattedData = detailFacility(dataFacility);
        formattedData.installed_date = formatDateKor(formattedData.installed_date);
        setFormValues(formattedData);
        setHasChangesUpdate(false);
        setSelectedSiteId(dataFacility.site_id);
        requestAnimationFrame(() => {
          if (nameRef.current) {
            nameRef.current.focus();
          }
        }); 
      });
    }
    
    else if(isNewClicked){
      if(hasChangesCreate){
      const message = new NoticeMessage(
        t('msg > flush confirm'),
        {
          mode: "confirm",
        }
      );
      message.confirmClicked().then(() => {
        emptyDetail();
        setIsNewClicked(false);
        setDisabledForm(true);
        enableInitialButtons();
        setHasChangesCreate(false);
        setSelectedSiteId(null)
      });
    }
    else{
      emptyDetail();
      setIsNewClicked(false);
      setDisabledForm(true);
      enableInitialButtons();
      setHasChangesCreate(false);
      setSelectedSiteId(null)
    }
  }   else {
    reloadCallback()
  }
  };

  const handleRegistButtonClick = () => {
    const { facility_id, description, ...fieldsToCheck } = formValues;

    const isEmptyField = Object.values(fieldsToCheck).some(value => value === null || value === '');
    
    if (isEmptyField) {
      new NoticeMessage('필수 값을 모두 입력해주세요.')
      return;
    }

    const updatedFormValues = {
      ...formValues,
      installed_date: formatDateToYYYYMMDD(formValues.installed_date)
    };
    console.log(updatedFormValues);
    createFacility(updatedFormValues);
  }  

  const handleConfirmButtonClick = () => {
    const { facility_id, description, ...fieldsToCheck } = formValues;

    const isEmptyField = Object.values(fieldsToCheck).some(value => value === null || value === '');
  
    if (isEmptyField) {
      
      new NoticeMessage('필수 값을 모두 입력해주세요.')
      return;
    }
    console.log("Installed Date:", formValues.installed_date);

    const updatedFormValues = {
      ...formValues,
      installed_date: formatDateToYYYYMMDD(formValues.installed_date)
    };
    console.log(updatedFormValues);
    updateFacility(updatedFormValues);

  }

 const handleDeleteButtonClick = () => {
    const message = new NoticeMessage(
      t('msg > delete confirm'),
      {
        mode: "confirm",
      }
    );
    message.confirmClicked().then(() => {
      deleteFacility(selectedFacility?.fc_id); 
    }); 
  };

  const roadOptions = selectedSiteId
  ? [
      { value: "", label: "" }, 
      ...(dataSiteRoad?.sites
        ?.find(site => site.site_id === Number(selectedSiteId))
        ?.roads.map(road => ({
          value: road.road_id,
          label: `${road.name} (${road.road_id})`,
        })) || [])
    ]
  : [{ value: "", label: "" }]; 
;


  
  useEffect(() => {
    if (dataFacility) {
      const formattedData = detailFacility(dataFacility);
      formattedData.installed_date = formatDateKor(formattedData.installed_date);
      setFormValues(formattedData);
    }
  }, [dataFacility]);
  

  const logData = dataFacility
  ? [
      { label: t('cmn > registered by'), value: dataFacility.registered_by },
      { label: t('cmn > registered time'), value: dataFacility.registered_time },
      { label: t('cmn > updated by'), value: dataFacility.updated_by },
      { label: t('cmn > updated time'), value: dataFacility.updated_time },
    ]
  : [];

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
        onRef={(r) => {
          tbRef.current = r.current;
        }}
        options={optionsTabulator}
        events={{
          rowSelected: handleRowSelected,
          tableBuilt: () => {
            if (selectedFacility?.fc_id) {
              const row = tbRef.current.getRow(selectedFacility?.fc_id);
              row && row.select();
            }else if (newId){
              console.log(newId)
              const row = tbRef.current.getRow(newId);
              tbRef.current.scrollToRow(row, "bottom", true);
              tbRef.current.selectRow(newId);
        }
          }
        }}
      />
    </ContainerCard>

    <ContainerCard className=" flex flex-col">
      <div className="box-management-col flex flex-col gap-3">
        <div className="grid grid-cols-3 gap-[50px]">
          <DetailForm 
          className="items-center!" 
          label="시설물 ID" 
          disabled={true}
          onChange={handleInputChange}
          value={formValues.facility_id || ''}
          name={'facility_id'}
          />

          <DetailForm
            className="items-center!"
            label="명칭"
            formRef={nameRef}
            required={true}
            disabled={disabledForm}
            onChange={handleInputChange}
            value={formValues.name || ''}
            name={'name'}
            maxLength={100}
          />

        <DetailForm
            inputType="select"
            className="items-center!"
            label="유형"
            required={true}
            disabled={disabledForm}
            onChange={handleInputChange}
            value={formValues.type || ''}
            name={'type'}
            optionSelect={
              commonListData?.["221"]
                  ? [
                      { value: "", label: "" },
                      ...commonListData["221"].code.map((code, index) => ({
                        value: code,
                        label: commonListData["221"].name[index],
                      })),
                    ]
                  : []
                }
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
                value={formValues.lat || ''}
                name={'lat'}
                maxLength={100}
                pattern={'^[0-9.]*$'}
                />
                <GeneralInput 
                customInput="w-full" 
                disabled={disabledForm}
                onChange={handleInputChange}
                value={formValues.lng || ''}
                name={'lng'}
                maxLength={100}
                pattern={'^[0-9.]*$'}
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
            value={formValues.installed_date || ''} 
            name={'installed_date'}
            readonly={true}
          />

        </div>

        <div className="grid grid-cols-3 gap-[50px]">
        <DetailForm
            inputType="select"
            className="items-center!"
            label="매핑 사이트"
            required={true}
            optionSelect={
              dataSiteRoad?.sites
                ? [
                    { value: "", label: "" },
                    ...dataSiteRoad?.sites.map((site) => ({
                      value: site.site_id, 
                      label: `${site.name} (${site.site_id})`, 
                    })),
                  ]
                : []
            }
            disabled={disabledForm}
            onChange={handleInputChange}
            value={formValues.site_id || ''}
            name={'site_id'}

          />
        <DetailForm
            inputType="select"
            className="items-center!"
            label="매핑 접근로"
            required={true}
            optionSelect={roadOptions}
            disabled={disabledForm}
            onChange={handleInputChange}
            value={formValues.road_id || ''}
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
            value={formValues.pic_name || ''}
            name={'pic_name'}
            maxLength={100}
          />

          <DetailForm
            className="items-center!"
            label="담당자 전화번호"
            required={true}
            disabled={disabledForm}
            onChange={handleInputChange}
            value={formValues.pic_phone_number || ''}
            name={'pic_phone_number'}
            maxLength={100} 
            pattern={'^[0-9]*$'} 
          />
        </div>

        <div className="grid grid-cols-3 gap-[50px]">
          <DetailForm
            className="items-center!"
            label="모델명"
            required={true}
            disabled={disabledForm}
            onChange={handleInputChange}
            value={formValues.model || ''}
            name={'model'}
            maxLength={100}
          />

          <DetailForm
            className="items-center!"
            label="시리얼 넘버"
            required={true}
            disabled={disabledForm}
            onChange={handleInputChange}
            value={formValues.s_n || ''}
            name={'s_n'}
            maxLength={100}
          />

          <DetailForm
            className="items-center!"
            label="제조사"
            required={true}
            disabled={disabledForm}
            onChange={handleInputChange}
            value={formValues.manufacturer || ''}
            name={'manufacturer'}
            maxLength={100}
          />
        </div>

        <div className="grid grid-cols-3 gap-[50px]">
          <DetailForm
            className="items-center!"
            label="Mac Address"
            required={true}
            disabled={disabledForm}
            onChange={handleInputChange}
            value={formValues.mac || ''}
            name={'mac'}
            maxLength={100}
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
                value={formValues.ip || ''}
                name={'ip'}
                maxLength={100}
                pattern={'^[0-9.]*$'}  />
                <span>:</span>
                <GeneralInput 
                customInput="w-full" 
                disabled={disabledForm}
                onChange={handleInputChange}
                value={formValues.port || ''}
                name={'port'}
                maxLength={100}
                pattern={'^[0-9.]*$'} />
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
            value={formValues.description || ''}
            name={'description'}
            maxLength={500}
          />
        </div>

        <hr className="border-t border-gray-300" />
        <div className="flex items-center justify-between gap-4 w-full">
          <div className="flex-1">
          {disabledForm ? null : <LogList  logs={logData}/>}
          </div>
          <div className="flex-none">
            <ButtonGroup
              onClickDelete={handleDeleteButtonClick}
              onClickNew={handleNewButtonClick}
              onClickCancel={handleCancelButtonClick}
              onClickRegist={handleRegistButtonClick}
              onClickConfirm ={handleConfirmButtonClick}
              isNewClicked={isNewClicked}
              cancelButtonState={buttonState.cancel}
              confirmButtonState={hasChangesUpdate ? false : buttonState.confirm}
              deleteButtonState={buttonState.delete}
              newButtonState={hasChangesCreate ? false :buttonState.create}
            />
          </div>
        </div>
      </div>
    </ContainerCard>
  </section>
  )
}

export default FacilityManagement
