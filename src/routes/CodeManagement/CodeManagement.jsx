import React, { useCallback, useEffect, useRef, useState } from 'react';
import ContainerCard from '../../components/ContainerCard/ContainerCard';
import Filtering from '../../components/Filtering/Filtering';
import { ReactTabulator } from 'react-tabulator';
import DetailForm from '../../components/DetailForm/DetailForm';
import LogList from '../../components/LogList/LogList';
import ButtonGroup from '../../components/ButtonGroup/ButtonGroup';
import Select from '../../components/Select/Select';
import useCodeMgt from '../../hooks/useCodeMgt';
import useCommonCodes from '../../hooks/useCommonCodes';
import NoticeMessage from '../../plugin/noticemessage/noticemessage';
import { useTranslation } from 'react-i18next';



const CodeManagement = () => {
    const { t } = useTranslation();
    const storedTranslations = JSON.parse(localStorage.getItem('translations'));
    
    // tabulator top

    const columnsHistory = [
      {
        title: 'No',
        formatter: "rownum",
        width: 65,
        hozAlign: "center",
        headerHozAlign: "center",
        headerSort: false,
        resizable: false,
      },
      {
        title: t('user > id'),
        field: "id",
        widthGrow: 1,
        hozAlign: "center",
        headerHozAlign: "center",
        headerSort: false,
        resizable: false,
        visible: false,
      },
      {
        title: t('code > code group'),
        field: "upper_code",
        widthGrow: 1,
        hozAlign: "center",
        headerHozAlign: "center",
        headerSort: false,
        resizable: false,
      },
      {
        title: t('code > code'),
        field: "lower_code",
        widthGrow: 1,
        hozAlign: "center",
        headerHozAlign: "center",
        headerSort: false,
        resizable: false,
      },
      {
        title: t('code > ENG name'),
        field: "eng",
        widthGrow: 2,
        hozAlign: "center",
        headerHozAlign: "center",
        headerSort: false,
        resizable: false,
        formatter: function (cell) {
          const data = cell.getRow().getData();
          return data.lower_code
            ? "　└　" + cell.getValue()
            : cell.getValue();
        },
      },
      {
        title: t('code > IND name'),
        field: "ind",
        widthGrow: 2,
        hozAlign: "center",
        headerHozAlign: "center",
        headerSort: false,
        resizable: false,
        formatter: function (cell) {
          const data = cell.getRow().getData();
          return data.lower_code
            ? "　└　" + cell.getValue()
            : cell.getValue();
        },
      },
    ];


    const tbRef = useRef(null);
    const searchRef = useRef(null);
    const codeRef = useRef(null);
    const codeGroupRef = useRef(null);
    //Disabled
    const [disabled, setDisabled] = useState(true);
    const [disabledCode, setDisabledCode] = useState(true);
    const [disabledCodeGroup, setDisabledCodeGroup] = useState(true);
    //Change state
    const [hasChangesUpdate, setHasChangesUpdate] = useState(false);
    const [hasChangesCreate, setHasChangesCreate] = useState(false);
    const [isRequired, setIsRequired] = useState(true);
    const hasChangesUpdateRef = useRef(hasChangesUpdate);
    const hasChangesCreateRef = useRef(hasChangesCreate);
    const [newId, setNewId] = useState('');
    const [isNewClicked, setIsNewClicked] = useState(false);

    useEffect(() => {
      hasChangesUpdateRef.current = hasChangesUpdate;
      hasChangesCreateRef.current = hasChangesCreate;
    }, [hasChangesUpdate, hasChangesCreate]);

    useEffect(() => {
      if (searchRef.current) {
        searchRef.current.focus();
      }
    }, []);

    //params  
    const [queryParams, setQueryParams] = useState("");
    const [selectedIsCodeGroup, setSelectedIsCodeGroup]  = useState("")
    const [optionParams, setOptionParams] = useState("upper-code=001&upper-code=002");
    const [selectedCode, setSelectedCode] = useState({
        id: null,
    });
    //Values
    const [formValues, setFormValues] = useState({
      lower_code: null,
      upper_code: null,
      eng: null,
      ind: null,
      kor: null,
      language4: null,
      language5: null,
      sort_order: null,
      usage: null,
      description: null,
      });  

    const emptyDetail = () => {
      setFormValues((prevValues) => ({
        ...prevValues,
        lower_code: '',
        upper_code: '',
        eng: '',
        ind: '',
        kor: '',
        language4: '',
        language5: '',
        sort_order: '',
        usage: '',
        description: '',
        codeType:''
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

    const reloadCallback = () => {
      enableInitialButtons();
      tbRef.current.deselectRow();
      emptyDetail();
      setDisabled(true);
      setDisabledCode(true);
      setDisabledCodeGroup(true);
      setHasChangesUpdate(false);
      setSelectedCode({ id: null });
      setIsNewClicked(false);
      setHasChangesCreate(false);
    };
    const updateCallback = () => {
      enableUPDATEButtons();
      setIsNewClicked(false);
      setHasChangesUpdate(false);
    };


    const { codeListData,codeListSelect, detailCodeError, detailCodeData, createUpperCode, createLowerCode, updateUpperCode, updateLowerCode, deleteCode} = useCodeMgt({
      codeID: selectedCode?.id,
      queryParams: queryParams  || "deletion=001002",
      onUpdateSuccess: (responseData) => {
        updateCallback()
        // const newCodeId = responseData?.id;
        // setSelectedCode({ id: newCodeId });
        // const row = tbRef.current.getRow(newCodeId);
        // row && row.select();
      },
      onDeleteSuccess: reloadCallback,
      onCreateSuccess: (responseData) => {
        reloadCallback();
        const newUserId = responseData.id;
        setNewId(newUserId);
        
      }
    });


    useEffect(() => {
      console.log(selectedCode.id);
      
    }, [selectedCode]);
    
    const { commonListData } = useCommonCodes({ optionParams });
    
    const optionsRadioFilterDeleted = commonListData?.["001"]
    ? [
        { value: "All", label: t('cmn > all'), code: "All" }, 
        ...commonListData["001"].code.map((code, index) => ({
          value: code,
          label: commonListData["001"].name[index],
          code: code,
        })),
      ]
    : [];
  useEffect(() => {
    if (detailCodeError) {
      new NoticeMessage(t('msg > load data fail'))
    }
  }, [detailCodeError]);

    const optionsRadioFilterUsage = commonListData?.["002"]
    ? [
        { value: "All", label: t('cmn > all'), code: "All" }, 
        ...commonListData["002"].code.map((code, index) => ({
          value: code,
          label: commonListData["002"].name[index],
          code: code,
        })),
      ]
    : [];

    const languageTabulator = () => {
      let datalanguage = {
        pagination: {
          first:  t('cmn > first page'), //text for the first page button
          first_title: t('cmn > first page'), //tooltip text for the first page button
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
      movableRows: false,
      resizableRows: false,
      locale: "ko",
      langs: {
        ko: languageTabulator(),
      },
      index: "id",
      paginationSize: 10,
      selectableRows: 1,
      rowHeight: 41,
      footerElement: `<div id="footer-bottom" style="padding: 0 20px 0 0; text-align: right;">${t('cmn > total')} ${codeListData?.length || 0} ${t('cmn > results')}</div>`,
      selectableRowsCheck: (row) => {
        return !row.getElement().classList.contains("tabulator-selected");
      },
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
        setSelectedCode({
          id: rowData.id,  
        });
        setDisabled(false);
        if (rowData.lower_code !== null) {
          setDisabledCode(false); 
          setDisabledCodeGroup(true);
          setFormValues((prevValues) => ({
            ...prevValues,
            codeType: "Code",
          }));
          requestAnimationFrame(() => {
            if (codeRef.current) {
              codeRef.current.focus();
            }
          }); 
          
        } else if (rowData.lower_code == null){
          setDisabledCodeGroup(false); 
          setDisabledCode(true);
          setFormValues((prevValues) => ({
            ...prevValues,
            codeType: "Code Group",
          }));
          requestAnimationFrame(() => {
            if (codeGroupRef.current) {
              codeGroupRef.current.focus();
            }
          }); 
          
        }
        setHasChangesUpdate(false);
        setIsNewClicked(false);
      });
    } else {      
      const rowData = row.getData(); 
      setSelectedCode((cur) => ({ ...cur, id: rowData.id }));
      setFormValues({
        id:rowData.id,
        eng: rowData.eng,
        ind: rowData.ind,
        upper_code: rowData.upper_code,
        lower_code: rowData.lower_code,
        codeType: rowData.codeType,
        usage: rowData.usage,
        description: rowData.description,
        sort_order: rowData.sort_order,
      });
      setDisabled(false); 
      enableUPDATEButtons();
      setIsNewClicked(false);
      if (rowData.lower_code !== null) {
        setDisabledCode(false); 
        setDisabledCodeGroup(true);
        setFormValues((prevValues) => ({
          ...prevValues,
          codeType: "Code",
        }));
        requestAnimationFrame(() => {
          if (codeRef.current) {
            codeRef.current.focus();
          }
        }); 
        
      } else if (rowData.lower_code == null){
        setDisabledCodeGroup(false); 
        setDisabledCode(true)
        setFormValues((prevValues) => ({
          ...prevValues,
          codeType: "Code Group",
        }));
        requestAnimationFrame(() => {
          if (codeGroupRef.current) {
            codeGroupRef.current.focus();
          }
        }); 
        
      }
    }

    requestAnimationFrame(() => {
      if (!disabledCodeGroup && codeGroupRef.current) {
        console.log('test');
        
        codeGroupRef.current.focus();
      } else if (!disabledCode && codeRef.current || isNewClicked) {
        codeRef.current.focus();
      }

    }); 
    
    }, []);

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

      if (selectedCode?.id){
        if(!isNewClicked){
          setHasChangesUpdate(true);
        }
      }
  

    }; 
    
    const handleOnChangeInputSelect = useCallback(({ target }) => {
      const { value } = target;
      setSelectedIsCodeGroup(value);
    }, []);

    const handleSearch = useCallback(
        (inputVal = null, radioVal = null, radioUsageVal = null) => {
          console.log(radioUsageVal);
          
          const resultInput = inputVal ? `input=${inputVal}` : "";
          const resultRadio = radioVal && radioVal !== "All" ? `&deletion=${radioVal}` : `&deletion=001002`;
          const resultRadioUsageVal = radioUsageVal && radioUsageVal !== "All" ? `&usage=${radioUsageVal}` : "";
          const resultSelectCode = selectedIsCodeGroup && selectedIsCodeGroup !== "All"
          ? `&upper_code=${selectedIsCodeGroup}`
          : "";
          const result = resultInput + resultRadio +resultRadioUsageVal + resultSelectCode;
          setQueryParams(result); 
        },
        [selectedIsCodeGroup]
      );
      
      console.log(queryParams);
      
      const handleCancelButtonClick = () => {
        if (hasChangesUpdate){
          const message = new NoticeMessage(
            t('msg > flush confirm'),
            {
              mode: "confirm",
            }
          );
          message.confirmClicked().then(() => {
            setHasChangesUpdate(false);
          });
        }
        
       if(isNewClicked){
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
            setDisabledCode(true);
            setDisabledCodeGroup(true);
            setDisabled(true);
            enableInitialButtons();
            setHasChangesCreate(false);
          });
        }
        else{
          emptyDetail();
          setIsNewClicked(false);
          setDisabled(true);
          setDisabledCode(true);
          setDisabledCodeGroup(true);
          enableInitialButtons();
          setHasChangesCreate(false);
          setSelectedCode({id:null})
        }
      } else {
        reloadCallback()
      }
      };
    const handleNewButtonClick = () => {
        if (selectedCode?.id){
          tbRef.current.deselectRow();
          setDisabledCode(false);
          setDisabledCodeGroup(true);
          emptyDetail();
          setFormValues((prevValues) => ({
            ...prevValues,
            codeType: "Code",
            upper_code: detailCodeData.upper_code
          }));
          setHasChangesUpdate(false);
          enableRegisterButtons();
          setIsNewClicked(true);
          requestAnimationFrame(() => {
            if (codeRef.current) {
              codeRef.current.focus();
            }
          }); 
        } else { 
          tbRef.current.deselectRow();
          emptyDetail();
          setFormValues((prevValues) => ({
            ...prevValues,
            codeType: "Code Group",
          }));
          
          setDisabled(false);
          setDisabledCodeGroup(false);
          setDisabledCode(true);
          setIsNewClicked(true);
          enableRegisterButtons();
          setSelectedCode({ id: null });
          setHasChangesUpdate(false);
          requestAnimationFrame(() => {
            if (codeGroupRef.current) {
              codeGroupRef.current.focus();
            }
          }); 
        }
 
    };

  const handleRegistButtonClick = () => {
    if (selectedCode?.id){
      createLowerCode(formValues);
    }else{
      console.log(formValues);
      
      createUpperCode(formValues);
    }
  }
  const handleConfirmButtonClick = () => {
    if(!formValues.lower_code){
      updateUpperCode(formValues);
    } else{
      updateLowerCode(formValues)
      
    }  
  }
  const handleDeleteButtonClick = () => {
    
    const message = new NoticeMessage(
      t('msg > delete confirm'),
      {
        mode: "confirm",
      }
    );
    message.confirmClicked().then(() => {
      deleteCode(selectedCode?.id); 
    });
    
  };
  const handleReset= () => {
    setSelectedIsCodeGroup('All')
};
  useEffect(() => {
   }, [selectedCode, formValues]); 
  useEffect(() => {
    if (detailCodeData) {
      setFormValues((prevValues) => ({
        ...prevValues, 
        eng: detailCodeData?.eng,
        ind: detailCodeData?.ind,
        upper_code: detailCodeData?.upper_code,
        lower_code: detailCodeData?.lower_code,
        usage: detailCodeData?.usage,
        description: detailCodeData?.description,
        sort_order: detailCodeData?.sort_order,
      }));
      
    }
  }, [detailCodeData]); 

  const logs = detailCodeData
  ? [
      { label: t('cmn > registered by'), value: detailCodeData.registered_by },
      { label: t('cmn > registered time'), value: detailCodeData.registered_time },
      { label: t('cmn > updated by'), value: detailCodeData.updated_by },
      { label: t('cmn > updated time'), value: detailCodeData.updated_time },
    ]
  : [];
  return (
    <>
        <section className='wrap'>
          <div className='header-title'>
            <h3>{t('SYSTEM')}</h3>
            <h3>&gt;</h3>
            <h3>{t('SYSTEM-CODE')}</h3>
          </div>

          <ContainerCard>
            <Filtering 
            searchRef={searchRef}
            placeholder={t('user > group code') + ' / ' + t('code > code') + ' / ' + t('code > code name') + ' / ' + t('code > description')}
            onSearch={handleSearch}
            onReset={handleReset}
            labelSelect={t('code > code group')}
            optionsRadioFilter={optionsRadioFilterDeleted}
            optionsRadioFilterUsage ={optionsRadioFilterUsage}
            isUsage ={true}
            >
                <Select 
                  value={selectedIsCodeGroup}
                  onChange={handleOnChangeInputSelect}
                  className={'custom-select'}
                  options={
                    codeListSelect
                      ? [
                          { value: "All", label: t('cmn > all') },  
                          ...codeListSelect
                            .filter(item => item.upper_code === item.id) 
                            .map(item => ({
                              value: item.upper_code, 
                              label: item.eng 
                            }))
                        ]
                      : []
                  }
                />
            </Filtering>
          </ContainerCard>
        </section>
        <ContainerCard>
        <ReactTabulator
            className="container-tabullator"
            data={codeListData  || []}
            columns={columnsHistory}
            layout={"fitColumns"}
            options={optionsTabulator}
            onRef={(r) => {
              tbRef.current = r.current;
            }}
            events={{
              rowSelected: handleRowSelected,
              tableBuilt: () => {
                if (selectedCode?.id) {
                  const row = tbRef.current.getRow(selectedCode?.id);
                  row && row.select();
                }  else if (newId){
                    const row = tbRef.current.getRow(newId);
                    tbRef.current.scrollToRow(row, "bottom", true);
                    tbRef.current.selectRow(newId);
              }
              },
            }}
          />
        </ContainerCard>
        <ContainerCard>
        <div className="flex w-full flex-col gap-[10px]">
        <div className="grid grid-cols-3 gap-4">

        <div className="flex flex-col gap-4">
          <DetailForm label={t('code > code type')} value={formValues.codeType} inputType="select" onChange={handleInputChange} name="codeType" disabled={disabled} optionSelect={[{ value: "", label: "" }, { value: 'Code Group', label: t('code > code group'), disabled: disabledCodeGroup }, { value: "Code", label: t('code > code'), disabled: disabledCode }]} />
          <DetailForm label={t('code > code group')} value={formValues.upper_code || ''} inputType="text" onChange={handleInputChange} name="upper_code" required={isRequired} disabled={disabledCodeGroup} maxLength={6} formRef={codeGroupRef}/>
          <DetailForm label={t('code > code')} value={formValues.lower_code || ''} inputType="text" onChange={handleInputChange} name="lower_code" required={isRequired} disabled={disabledCode} maxLength={6} formRef={codeRef} />
        </div>


        <div className="flex flex-col gap-4">
          <DetailForm label={t('code > ENG name')} value={formValues.eng || ''} inputType="text" onChange={handleInputChange} name="eng" required={isRequired} disabled={disabled} />
          <DetailForm label={t('code > IND name')} value={formValues.ind || ''} inputType="text" onChange={handleInputChange} name="ind" required={isRequired} disabled={disabled} />
          <DetailForm label={t('code > usage')} value={formValues.usage || ''} inputType="select" onChange={handleInputChange} name="usage" required={isRequired} disabled={disabled} optionSelect={commonListData?.["002"] ? [{ value: "", label: "" }, ...commonListData["002"].code.map((code, index) => ({ value: code, label: commonListData["002"].name[index] }))] : []} />
        </div>


        <div className="flex flex-col gap-4">
          <DetailForm label={t('code > sort order')} value={formValues.sort_order || ''} inputType="number" onChange={handleInputChange} name="sort_order" disabled={disabled} />
          <DetailForm label={t('code > description')} value={formValues.description || ''} inputType="textarea" onChange={handleInputChange} name="description" disabled={disabled}  className={'flex-grow'} />
        
        </div>
      </div>
        <hr className="border-t border-gray-300" />
        <div className="flex items-center justify-between gap-4 w-full">
        <div className="flex-1">
        {disabled ? null : <LogList logs={logs}/>}
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
        </>
  );
};

export default CodeManagement;