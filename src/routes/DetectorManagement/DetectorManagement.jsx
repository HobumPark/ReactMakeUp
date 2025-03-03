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
import useDetectorMgt from "../../hooks/useDetectorMgt";
import { useTranslation } from "react-i18next";
import AirDatepicker from "air-datepicker";
import 'air-datepicker/air-datepicker.css';
import localeEn from 'air-datepicker/locale/en.js'; 
import localeKo from 'air-datepicker/locale/ko.js'; 
import localeId from 'air-datepicker/locale/id.js'; 
import NoticeMessage from "../../plugin/noticemessage/noticemessage";
import { formatDateKor, formatDateToYYYYMMDD } from "../../utils/date";
import useUnmappedSiteRoad from "../../hooks/useUnmappedSiteRoad";


const detectorTabulator = [
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
    title: "검지기 ID",
    field: "detector_id",
    hozAlign: "center",
    widthGrow: "0.7",
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


const DetectorManagement = () => {
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

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, []); 

  //Params 
  const [selectedOption, setSelectedOption] = useState("");
  const [queryParams, setQueryParams] = useState("");
  const [optionParams, setOptionParams] = useState("upper-code=102");
  const [resource, setResource] = useState("resource=detector");
  const [selectedDetector, setSelectedDetector] = useState({
    dt_id: null,
  });
  const selectedDetectorRef = useRef(selectedDetector);


  const detailDetector = (data) => {
    return {
      detector_id: data.detector_id || null,
      site_id: data.site_id || 'NO_MAPPING',
      road_id: data.road_id || 'NO_MAPPING',
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
      camera_url: data.camera_url || null,
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

  useEffect(() => {
    hasChangesUpdateRef.current = hasChangesUpdate;
    hasChangesCreateRef.current = hasChangesCreate;
    isNewClickedRef.current = isNewClicked;
    selectedDetectorRef.current = selectedDetector
  }, [hasChangesUpdate, hasChangesCreate, isNewClicked, selectedDetector]);


  //Values
  const [formValues, setFormValues] = useState({
    detector_id: null,
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
    camera_url: null,
    ip: null,
    mac: null
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
    setSelectedDetector({ dt_id: null });
  };


  const { detectorListData, detailDetectorData, deleteDetector, createDetector, updateDetector } = useDetectorMgt({
    dtID: selectedDetector?.dt_id,
    queryParams: queryParams,
    onDeleteSuccess: reloadCallback,
    onUpdateSuccess: () => {
      enableUPDATEButtons();
      setIsNewClicked(false);
      setHasChangesUpdate(false);
    },
    onCreateSuccess: (responseData) => {
      reloadCallback();
      const newID = responseData.detector_id.detector_id;
      setNewId(newID);
    },
  });

  const data = detectorListData?.data;
  const dataDetector = detailDetectorData?.data;


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
      setSelectedSiteId(value);
    }

    if (isNewClickedRef.current) {
      setHasChangesCreate(true); 
    } else {

      setHasChangesUpdate(true); 
    }

    if (selectedDetectorRef.current?.dt_id) {
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
    index:'detector_id',
    resizableRows: false,
    locale: "ko",
    langs: {
      ko: languageTabulator(),
    },
    selectableRowsCheck: (row) => {
      return !row.getElement().classList.contains("tabulator-selected");
    },
    footerElement: `<div style="padding: 0 20px 0 0; text-align: right;">${t('cmn > total')} ${data?.length} ${t('cmn > results')}</div>`,
  };

  const handleSearch = useCallback((inputVal = null) => {
    const resultInput = inputVal ? `input=${inputVal}` : "";
    const resultSelect = selectedOption && selectedOption !== "All"
          ? `&site_type=${selectedOption}`
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
        setSelectedDetector({
          dt_id: rowData.detector_id,  
        });
        setSelectedSiteId(rowData.site_id ?? "NO_MAPPING");
        setResource(`id=${rowData.detector_id}&resource=detector`);
        setDisabledForm(false);
        setHasChangesUpdate(false);
        setHasChangesCreate(false);
        setIsNewClicked(false);
      });
      
    } else {
      const rowData = row.getData();
      setSelectedDetector({
        dt_id: rowData.detector_id,  
      });
      setSelectedSiteId(rowData.site_id ?? "NO_MAPPING");
      setResource(`id=${rowData.detector_id}&resource=detector`);
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
        setSelectedDetector({ dt_id: null });
        setResource(`resource=detector`);
        setSelectedSiteId(null);
        setDisabledForm(false);
        setHasChangesUpdate(false);
        
      });
    } else{
      tbRef.current.deselectRow();
      emptyDetail();
      setIsNewClicked(true);
      enableRegisterButtons();
      setSelectedDetector({ dt_id: null });
      setResource(`resource=detector`);
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
        const formattedData = detailDetector(dataDetector);
        formattedData.installed_date = formatDateKor(formattedData.installed_date);
        setFormValues(formattedData);
        setHasChangesUpdate(false);
        setSelectedSiteId(dataDetector.site_id);
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
    const { detector_id, description, road_id, site_id, ...fieldsToCheck } = formValues;

    const isEmptyField = Object.values(fieldsToCheck).some(value => value === null || value === '');
    
    if (isEmptyField) {

      new NoticeMessage('필수 값을 모두 입력해주세요.')
      return;
    }

    const updatedFormValues = {
      ...formValues,
      road_id: !formValues.road_id || formValues.road_id === "NO_MAPPING" ? null : formValues.road_id,
      site_id: !formValues.site_id || formValues.site_id === "NO_MAPPING" ? null : formValues.site_id,

      installed_date: formatDateToYYYYMMDD(formValues.installed_date)
    };
    console.log(updatedFormValues);
    createDetector(updatedFormValues);
  }  

  const handleConfirmButtonClick = () => {
    const { detector_id, description, road_id, site_id, ...fieldsToCheck } = formValues;

    const isEmptyField = Object.values(fieldsToCheck).some(value => value === null || value === '');
  
    if (isEmptyField) {
      
      new NoticeMessage('필수 값을 모두 입력해주세요.')
      return;
    }

    const updatedFormValues = {
      ...formValues,
      road_id: formValues.road_id === "NO_MAPPING" ? null : formValues.road_id,
      site_id: formValues.site_id === "NO_MAPPING" ? null : formValues.site_id,
      installed_date: formatDateToYYYYMMDD(formValues.installed_date)
    };
    console.log(updatedFormValues);
    updateDetector(updatedFormValues);

  }

 const handleDeleteButtonClick = () => {
    const message = new NoticeMessage(
      t('msg > delete confirm'),
      {
        mode: "confirm",
      }
    );
    message.confirmClicked().then(() => {
      deleteDetector(selectedDetector?.dt_id); 
    }); 
    
  };


  const roadOptions = selectedSiteId
  ? [
      { value: "", label: "" }, 
      { value: "NO_MAPPING", label: "매핑 없음" }, 
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
    if (dataDetector) {
      const formattedData = detailDetector(dataDetector);
      formattedData.installed_date = formatDateKor(formattedData.installed_date);
      setFormValues(formattedData);
    }
  }, [dataDetector]);
  

  const logData = dataDetector
  ? [
      { label: t('cmn > registered by'), value: dataDetector.registered_by },
      { label: t('cmn > registered time'), value: dataDetector.registered_time },
      { label: t('cmn > updated by'), value: dataDetector.updated_by },
      { label: t('cmn > updated time'), value: dataDetector.updated_time },
    ]
  : [];


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
            searchRef={searchRef}
            labelSelect="매핑 사이트 타입"
            placeholder="명칭 / 시리얼 넘버"
            disableFiltering={true}
            onReset = {handleReset}
            onSearch={handleSearch}
          >
            <Select
              value={selectedOption}
              onChange={handleOnChangeInputSelect}
              options={
                commonListData?.["102"]
                    ? [
                        { value: "All", label: t('cmn > all') }, 
                        ...commonListData["102"].code.map((code, index) => ({
                          value: code,
                          label: commonListData["102"].name[index],
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
            columns={detectorTabulator}
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
                if (selectedDetector?.dt_id) {
                  const row = tbRef.current.getRow(selectedDetector?.dt_id);
                  row && row.select();
                }else if (newId){
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
              label="검지기 ID" 
              value={formValues.detector_id || ''}
              name={'detector_id'} 
              disabled={true}
              onChange={handleInputChange} 
              />

              <DetailForm
                className="items-center!"
                label="명칭"
                required={true}
                disabled={disabledForm}
                onChange={handleInputChange}
                value={formValues.name || ''}
                name={'name'}
                maxLength={100}
                formRef={nameRef}
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
                    pattern={'^[0-9.]*$'} />

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
                optionSelect={
                          [
                            { value: "", label: "" },
                            { value: "NO_MAPPING", label: "매핑 없음" },
                            ...(dataSiteRoad?.sites?.map(site => ({
                              value: site.site_id,
                              label: `${site.name} (${site.site_id})`
                            })) || [])
                          ]
                        }
                disabled={disabledForm}
                onChange={handleInputChange}
                value={formValues.site_id ||'' }
                name={'site_id'}
              />
            <DetailForm
                inputType="select"
                className="items-center!"
                label="매핑 접근로"
                optionSelect={roadOptions}
                disabled={disabledForm}
                onChange={handleInputChange}
                value={formValues.road_id || null }
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
                value={formValues.pic_phone_number || ''}
                name={'pic_phone_number'}
                disabled={disabledForm}
                onChange={handleInputChange}
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

              <DetailForm
                className="items-center!"
                label="IP"
                required={true}
                disabled={disabledForm}
                onChange={handleInputChange}
                value={formValues.ip || ''}
                name={'ip'}
                maxLength={100}
                pattern={'^[0-9.]*$'} 
              />

              <DetailForm
                className="items-center!"
                label="카메라 접속 URL"
                required={true}
                disabled={disabledForm}
                onChange={handleInputChange}
                value={formValues.camera_url || ''}
                name={'camera_url'}
                pattern={'^[0-9.]*$'} 
                maxLength={100}
              />
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
    
    </>

  )
}

export default DetectorManagement
