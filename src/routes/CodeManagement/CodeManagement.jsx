import React, { useCallback, useEffect, useRef, useState } from 'react';
import ContainerCard from '../../components/ContainerCard/ContainerCard';
import Filtering from '../../components/Filtering/filtering';
import { ReactTabulator } from 'react-tabulator';
import DetailForm from '../../components/DetailForm/DetailForm';
import LogList from '../../components/LogList/LogList';
import ButtonGroup from '../../components/ButtonGroup/ButtonGroup';
import Select from '../../components/Select/Select';
import useCodeMgt from '../../hooks/useCodeMgt';
import useCommonCodes from '../../hooks/useCommonCodes';
import NoticeMessage from '../../plugin/noticemessage/noticemessage';


// tabulator top

const columnsHistory = [
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
    title: "ID",
    field: "id",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
    visible: false,
  },
  {
    title: "Code Group",
    field: "upper_code",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "Code",
    field: "lower_code",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "Code Name (ENG)",
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
    title: "Code Name (IND)",
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



const CodeManagement = () => {
    const tbRef = useRef(null);
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

    useEffect(() => {
      hasChangesUpdateRef.current = hasChangesUpdate;
      hasChangesCreateRef.current = hasChangesCreate;
    }, [hasChangesUpdate, hasChangesCreate]);
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
    const [isNewClicked, setIsNewClicked] = useState(false);

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
        const newCodeId = responseData.id;
        setSelectedCode({ id: newCodeId });
        const row = tbRef.current.getRow(newCodeId);
        row && row.select();
      },
      onDeleteSuccess: reloadCallback,
      onCreateSuccess: reloadCallback,
    });
    
    const { commonListData } = useCommonCodes({ optionParams });
    
    const optionsRadioFilterDeleted = commonListData?.["001"]
    ? [
        { value: "All", label: "All", code: "All" }, 
        ...commonListData["001"].code.map((code, index) => ({
          value: code,
          label: commonListData["001"].name[index],
          code: code,
        })),
      ]
    : [];
  useEffect(() => {
    if (detailCodeError) {
      new NoticeMessage('Failed to load data. Please reload the page.')
    }
  }, [detailCodeError]);
    const optionsRadioFilterUsage = commonListData?.["002"]
    ? [
        { value: "All", label: "All", code: "All" }, 
        ...commonListData["002"].code.map((code, index) => ({
          value: code,
          label: commonListData["002"].name[index],
          code: code,
        })),
      ]
    : [];

    const optionsTabulator = {
      debugInvalidOptions: true,
      pagination: true,
      movableRows: false,
      resizableRows: false,
      index: "id",
      paginationSize: 10,
      selectableRows: 1,
      rowHeight: 41,
      footerElement: `<div id="footer-bottom" style="padding: 0 20px 0 0; text-align: right;">Total ${codeListData?.length || 0} Results</div>`,
      selectableRowsCheck: (row) => {
        return !row.getElement().classList.contains("tabulator-selected");
      },
    };

    const handleRowSelected = useCallback((row) => {
    if(hasChangesCreateRef.current || hasChangesUpdateRef.current){
      const message = new NoticeMessage(
        "Changes you made may not be saved, would you like to continue?",
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
          
        } else if (rowData.lower_code == null){
          setDisabledCodeGroup(false); 
          setDisabledCode(true);
          setFormValues((prevValues) => ({
            ...prevValues,
            codeType: "Code Group",
          }));
          
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
        
      } else if (rowData.lower_code == null){
        setDisabledCodeGroup(false); 
        setDisabledCode(true)
        setFormValues((prevValues) => ({
          ...prevValues,
          codeType: "Code Group",
        }));
        
      }
    }
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
          const resultInput = inputVal ? `input=${inputVal}` : "";
          const resultRadio = radioVal && radioVal !== "All" ? `&deletion=${radioVal}` : `&deletion=001002`;
          const resultRadioUsageVal = radioUsageVal && radioUsageVal !== "All" ? `&usage=${radioUsageVal}` : "";
          const resultSelectCode = selectedIsCodeGroup
          ? `&upper_code=${selectedIsCodeGroup}`
          : "";
          const result = resultInput + resultRadio +resultRadioUsageVal + resultSelectCode;
          setQueryParams(result); 
        },
        [selectedIsCodeGroup]
      );
      
      const handleCancelButtonClick = () => {
        if (hasChangesUpdate){
          const message = new NoticeMessage(
            "Changes you made may not be saved, would you like to continue?",
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
            "Changes you made may not be saved, would you like to continue?",
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
        }
    };

  const handleRegistButtonClick = () => {
    if (selectedCode?.id){
      createLowerCode(formValues);
    }else{
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
      "Are you sure you want to delete this data?",
      {
        mode: "confirm",
      }
    );
    message.confirmClicked().then(() => {
      deleteCode(selectedCode?.id); 
    });
    
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
      { label: "Registered By", value: detailCodeData.registered_by },
      { label: "Registered Time", value: detailCodeData.registered_time },
      { label: "Updated By", value: detailCodeData.updated_by },
      { label: "Updated Time", value: detailCodeData.updated_time },
    ]
  : [];
  return (
    <>
        <section className='wrap'>
          <div className='header-title'>
            <h3>System Management</h3>
            <h3>&gt;</h3>
            <h3>Code Management</h3>
          </div>

          <ContainerCard>
            <Filtering 
            placeholder="Group Code / Code Name / Description"
            onSearch={handleSearch}
            labelSelect={'Code Group'}
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
                          { value: "", label: "All" },  
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
                }
              },
            }}
          />
        </ContainerCard>
        <ContainerCard>
        <div className="flex w-full flex-col gap-[10px]">
        <div className="grid grid-cols-3 gap-4 items-center">
        <DetailForm 
          label="Code Type" 
          value={formValues.codeType} 
          inputType="select" 
          onChange={handleInputChange} 
          name="codeType" 
          disabled={disabled} 
          optionSelect={[
          { value: "", label: "" },
          { value: "Code Group", label: "Code Group", disabled:disabledCodeGroup },
          { value: "Code", label: "Code", disabled:disabledCode },
        ]}
        />

        <DetailForm 
          label="Code Name (ENG)" 
          value={formValues.eng || ''} 
          inputType="text" 
          onChange={handleInputChange} 
          name="eng" 
          required={isRequired} 
          disabled={disabled} 
        />

        <DetailForm 
          label="Sort Order" 
          value={formValues.sort_order || ''} 
          inputType="number" 
          onChange={handleInputChange} 
          name="sort_order" 
          disabled={disabled} 
        />

        <DetailForm 
          label="Group Code" 
          value={formValues.upper_code || ''} 
          inputType="text" 
          onChange={handleInputChange} 
          name="upper_code" 
          required={isRequired} 
          disabled={disabledCodeGroup} 
          maxLength={6}
        />

        <DetailForm 
          label="Code Name (IND)" 
          value={formValues.ind || ''} 
          inputType="text" 
          onChange={handleInputChange} 
          name="ind" 
          required={isRequired} 
          disabled={disabled} 
        />

        <DetailForm 
          label="Description" 
          value={formValues.description || ''} 
          inputType="textarea" 
          onChange={handleInputChange} 
          name="description" 
          disabled={disabled} 
          className="row-span-2" 
        />

        <DetailForm 
          label="Code" 
          value={formValues.lower_code || ''} 
          inputType="text" 
          onChange={handleInputChange} 
          name="lower_code" 
          required={isRequired} 
          disabled={disabledCode} 
          maxLength={6}
        />

        <DetailForm 
          label="Usage" 
          value={formValues.usage || ''} 
          inputType="select" 
          onChange={handleInputChange} 
          name="usage" 
          required={isRequired} 
          disabled={disabled}
          optionSelect={
                      commonListData?.["002"]
                        ? [
                            { value: "", label: ""}, 
                            ...commonListData["002"].code.map((code, index) => ({
                              value: code,
                              label: commonListData["002"].name[index],
                            })),
                          ]
                        : []
                    } 
        />

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