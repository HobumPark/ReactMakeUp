import React, { useCallback, useEffect, useRef, useState } from "react";
import ContainerCard from "../../components/ContainerCard/ContainerCard";
import Filtering from "../../components/Filtering/Filtering";
import { ReactTabulator } from "react-tabulator";
import DetailForm from "../../components/DetailForm/DetailForm";
import LogList from "../../components/LogList/LogList";
import ButtonGroup from "../../components/ButtonGroup/ButtonGroup";
import Select from "../../components/Select/Select";
import GeneralInput from "../../components/GeneralInput/GeneralInput";
import { useTranslation } from "react-i18next";
import useBoxMgt from "../../hooks/useBoxMgt";
import useCommonCodes from "../../hooks/useCommonCodes";
import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';
import localeEn from 'air-datepicker/locale/en.js'; 
import localeKo from 'air-datepicker/locale/ko.js'; 
import localeId from 'air-datepicker/locale/id.js'; 
import NoticeMessage from "../../plugin/noticemessage/noticemessage";
import useSiteMgt from "../../hooks/useSiteMgt";
import { formatDateKor, formatDateToDDMMYYYY, formatDateToMMDDYYYY, formatDateToYYYYMMDD } from "../../utils/date";


const boxTabulator = [
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
    title: "함체 ID",
    field: "remote_terminal_unit_id",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort:  true,
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
    title: "업데이트 일시",
    field: "updated_time",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: true,
    resizable: false,
  },
];


const BoxManagement = () => {
  const { t, i18n } = useTranslation();
  const tbRef = useRef(null);
  const nameRef = useRef(null);
  const searchRef = useRef(null);
  const [disabledForm, setDisabledForm] = useState(true);
  const [disabledId, setDisabledId] = useState(true);
  const [hasChangesUpdate, setHasChangesUpdate] = useState(false);
  const [hasChangesCreate, setHasChangesCreate] = useState(false);
  const [isNewClicked, setIsNewClicked] = useState(false);
  const hasChangesUpdateRef = useRef(hasChangesUpdate);
  const hasChangesCreateRef = useRef(hasChangesCreate);
  const isNewClickedRef = useRef(isNewClicked);
  const [newId, setNewId] = useState('');


  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, []); 

  //Params 
  const [selectedOption, setSelectedOption] = useState("");
  const [queryParams, setQueryParams] = useState("");
  const [optionParams, setOptionParams] = useState("upper-code=102");
  const [selectedBox, setSelectedBox] = useState({
    rtu_id: null,
  }); 
  const selectedBoxRef = useRef(selectedBox);

  const detailBox = (data) => {
    return {
      remote_terminal_unit_id: data.remote_terminal_unit_id || null,
      site_id: data.site_id || null,
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
      edge1_ip: data.edge1_ip || null,
      router_ip: data.router_ip || null,
      switch_ip: data.switch_ip || null,
      env_board_ip: data.env_board_ip || null,
      env_board_port: data.env_board_port || null,
      env_board_mac: data.env_board_mac || null,
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
    selectedBoxRef.current = selectedBox
  }, [hasChangesUpdate, hasChangesCreate, isNewClicked, selectedBox]);


  //Values
  const [formValues, setFormValues] = useState({
    remote_terminal_unit_id: null,
    site_id: null,
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
    edge1_ip: null,
    router_ip: null,
    switch_ip: null,
    env_board_ip: null,
    env_board_port: null,
    env_board_mac: null,  
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
    setSelectedBox({ rtu_id: null });
  };

  const { boxListData, detailBoxData, createBox, deleteBox, updateBox} = useBoxMgt({
    rtuID: selectedBox?.rtu_id,
    queryParams: queryParams,
    onDeleteSuccess: reloadCallback,
    onUpdateSuccess: () => {
      enableUPDATEButtons();
      setIsNewClicked(false);
      setHasChangesUpdate(false);
    },
    onCreateSuccess: (responseData) => {
      reloadCallback();
      const newID = responseData.remote_terminal_unit_id;
      setNewId(newID);
    },
  });

  const { siteListData } = useSiteMgt({})

  const data = boxListData?.data;
  const siteData = siteListData?.data;
  const dataBox = detailBoxData?.data[0];
  
  const { commonListData } = useCommonCodes({ optionParams });

  const handleInputChange = (e) => {
    const { name, value } = e.target;  
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));

    if (isNewClickedRef.current) {
      setHasChangesCreate(true); 
    } else {

      setHasChangesUpdate(true); 
    }

    if (selectedBoxRef.current?.rtu_id) {
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
    index: "remote_terminal_unit_id",
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
        setSelectedBox({
          rtu_id: rowData.remote_terminal_unit_id,  
        });
        setDisabledForm(false);
        setHasChangesUpdate(false);
        setIsNewClicked(false);
      });
      
    } else {
      const rowData = row.getData();
      setSelectedBox({
        rtu_id: rowData.remote_terminal_unit_id,  
      });
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
        setSelectedBox({ rtu_id: null });
        setDisabledForm(false);
        setHasChangesUpdate(false); 
      });
    } else{
      tbRef.current.deselectRow();
      emptyDetail();
      setIsNewClicked(true);
      enableRegisterButtons();
      setSelectedBox({ rtu_id: null });
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
        const formattedData = detailBox(dataBox);
        formattedData.installed_date = formatDateKor(formattedData.installed_date);
        setFormValues(formattedData);
        setHasChangesUpdate(false);
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
      });
    }
    else{
      emptyDetail();
      setIsNewClicked(false);
      setDisabledForm(true);
      enableInitialButtons();
      setHasChangesCreate(false);
    }
  }   else {
    reloadCallback()
  }
  };


  const handleRegistButtonClick = () => {
    const { remote_terminal_unit_id, description, ...fieldsToCheck } = formValues;

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
    createBox(updatedFormValues);
  }  

  const handleConfirmButtonClick = () => {
    const { remote_terminal_unit_id, description, ...fieldsToCheck } = formValues;

    const isEmptyField = Object.values(fieldsToCheck).some(value => value === null || value === '');
  
    if (isEmptyField) {
      new NoticeMessage('필수 값을 모두 입력해주세요.')
      return;
    }
    
    
    console.log(formValues.installed_date);
    
    const updatedFormValues = {
      ...formValues,
      installed_date: formatDateToYYYYMMDD(formValues.installed_date)
    };
    console.log(updatedFormValues);
    
    updateBox(updatedFormValues);

  }
 

 const handleDeleteButtonClick = () => {
    const message = new NoticeMessage(
      t('msg > delete confirm'),
      {
        mode: "confirm",
      }
    );
    message.confirmClicked().then(() => {
      deleteBox(selectedBox?.rtu_id); 
    }); 
    
  };

  useEffect(() => {
    if (dataBox) {
      const formattedData = detailBox(dataBox);
      formattedData.installed_date = formatDateKor(formattedData.installed_date);
      setFormValues(formattedData);
    }
  }, [dataBox]);
  

   

  const logData = dataBox
  ? [
      { label: t('cmn > registered by'), value: dataBox.registered_by },
      { label: t('cmn > registered time'), value: dataBox.registered_time },
      { label: t('cmn > updated by'), value: dataBox.updated_by },
      { label: t('cmn > updated time'), value: dataBox.updated_time },
    ]
  : [];

  return (
    <>
      <section className="wrap">
        <div className="header-title">
          <h3>자산 관리 </h3>
          <h3>&gt;</h3>
          <h3>함체</h3>
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
            columns={boxTabulator}
            layout={"fitColumns"}
            className="tabulator-custom w-full "
            //   pagination="local"
            options={optionsTabulator}
            onRef={(r) => {
              tbRef.current = r.current;
            }}
            events={{
              rowSelected: handleRowSelected,
              tableBuilt: () => {
                if (selectedBox?.rtu_id) {
                  const row = tbRef.current.getRow(selectedBox?.rtu_id);
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
          <div className="gap-2.5 flex flex-col">
            <span className="title2bold ">기본 정보</span>
            <hr className="border-t border-gray-300" />
          </div>

          <div className="box-management-col flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-[50px]">
              <DetailForm 
              className="items-center!" 
              label="함체 ID" 
              value={formValues.remote_terminal_unit_id || ""} 
              name='remote_terminal_unit_id'
              disabled={disabledId}
              onChange={handleInputChange}
              />

              <DetailForm
                className="items-center!"
                label="명칭"
                formRef={nameRef}
                required={true}
                value={formValues.name || ""}
                name='name'
                disabled={disabledForm}
                onChange={handleInputChange}
                maxLength={100}
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
                    <GeneralInput customInput="w-full" disabled={disabledForm} value={formValues.lat || ""} name='lat' onChange={handleInputChange} maxLength={100} pattern={'^[0-9.]*$'} />
                    <GeneralInput customInput="w-full" disabled={disabledForm} value={formValues.lng || ""} name='lng' onChange={handleInputChange} maxLength={100} pattern={'^[0-9.]*$'} />
                  </div>
                </DetailForm>
              </div>

              <DetailForm
                className="items-center!"
                label="설치 일시"
                required={true}
                value={formValues.installed_date || ""}
                name='installed_date'
                disabled={disabledForm}
                readonly={true}
              />

              <DetailForm
                inputType={'select'}
                className="items-center!"
                label="매핑 사이트"
                required={true}
                value={formValues.site_id || ""}
                name='site_id'
                disabled={disabledForm}
                onChange={handleInputChange}
                optionSelect={
                  siteData
                    ? [
                        { value: "", label: "" },
                        ...siteData.map((site) => ({
                          value: site.site_id, 
                          label: `${site.name} (${site.site_id})`, 
                        })),
                      ]
                    : []
                }
                
              />
            </div>

            <div className="grid grid-cols-3 gap-[50px]">
              <DetailForm
                className="items-center!"
                label="담당자"
                required={true}
                value={formValues.pic_name || ""}
                name='pic_name'
                maxLength={100}
                disabled={disabledForm}
                onChange={handleInputChange}
              />

              <DetailForm
                className="items-center!"
                label="담당자 전화번호"
                required={true}
                value={formValues.pic_phone_number || ""}
                name='pic_phone_number'
                maxLength={100} 
                pattern={'^[0-9]*$'} 
                disabled={disabledForm}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-3 gap-[50px]">
              <DetailForm
                className="items-center!"
                label="모델명"
                required={true}
                value={formValues.model || ""}
                name='model'
                maxLength={100}
                disabled={disabledForm}
                onChange={handleInputChange}
              />

              <DetailForm
                className="items-center!"
                label="시리얼 넘버"
                required={true} 
                value={formValues.s_n || ""}
                name='s_n'
                maxLength={100}
                disabled={disabledForm}
                onChange={handleInputChange}
              />

              <DetailForm
                className="items-center!"
                label="제조사"
                required={true}
                maxLength={100}
                value={formValues.manufacturer || ""}
                name='manufacturer'
                disabled={disabledForm}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1">
              <DetailForm
                className=" h-[90px]"
                inputType="textarea"
                label="설명"
                value={formValues.description || ""}
                name='description'
                disabled={disabledForm}
                onChange={handleInputChange}
                maxLength={500}
              />
            </div>

            <div className="gap-2.5 flex flex-col">
              <span className="title2bold ">구성 기기 정보</span>
              <hr className="border-t border-gray-300" />
            </div>

            <div className="grid grid-cols-3 gap-[50px]">
              <DetailForm
                className="items-center!"
                label="Edge IP"
                required={true}
                value={formValues.edge1_ip || ""}
                name='edge1_ip'
                maxLength={100} 
                pattern={'^[0-9.]*$'} 
                disabled={disabledForm}
                onChange={handleInputChange}
              />

              <DetailForm
                className="items-center!"
                label="Switch IP"
                required={true}
                value={formValues.switch_ip || ""}
                name='switch_ip'
                maxLength={100} 
                pattern={'^[0-9.]*$'} 
                disabled={disabledForm}
                onChange={handleInputChange}
              />

              <DetailForm
                className="items-center!"
                label="Router IP"
                required={true}
                maxLength={100} 
                pattern={'^[0-9.]*$'} 
                value={formValues.router_ip || ""}
                name='router_ip'
                disabled={disabledForm}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-3 gap-[50px]">
              <div className="flex w-full flex-row gap-x-4">
                <DetailForm
                  className="items-center!"
                  label="Env Board IP / PORT"
                  required={true}
                  showInput={false}
                >
                  <div className="flex w-full flex-row gap-x-2 items-center">
                    <GeneralInput
                      customInput="w-full"
                      value={formValues.env_board_ip || ""}
                      name='env_board_ip'
                      maxLength={100}
                       pattern={'^[0-9.]*$'} 
                      disabled={disabledForm}
                      onChange={handleInputChange}
                    />
                    <span>:</span>
                    <GeneralInput 
                      customInput="w-full"
                      value={formValues.env_board_port || ""}
                      name='env_board_port'
                      maxLength={100}
                      pattern={'^[0-9]*$'} 
                      disabled={disabledForm}
                      onChange={handleInputChange} />
                  </div>
                </DetailForm>
              </div>

              <DetailForm
                className="items-center!"
                label="Env Board Mac address"
                required={true}
                value={formValues.env_board_mac || ""}
                name='env_board_mac'
                maxLength={100}
                disabled={disabledForm}
                onChange={handleInputChange}
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
  );
};

export default BoxManagement;
