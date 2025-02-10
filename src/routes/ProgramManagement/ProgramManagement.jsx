import React, { useCallback, useEffect, useRef, useState } from 'react';
import ContainerCard from '../../components/ContainerCard/ContainerCard';
import Filtering from '../../components/Filtering/Filtering';
import { ReactTabulator } from 'react-tabulator';
import DetailForm from '../../components/DetailForm/DetailForm';
import LogList from '../../components/LogList/LogList';
import ButtonGroup from '../../components/ButtonGroup/ButtonGroup';
import Select from '../../components/Select/Select';
import useProgramMgt from '../../hooks/useProgramMgt';
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
    hozAlign: "center",
    headerHozAlign: "center",
    sorter: "alphanum",
    headerSort: false,
    resizable: false,
    visible: false,
  },
  {
    title: "Program Group",
    field: "upper_program",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "Program",
    field: "lower_program",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "Program Name (ENG)",
    field: "eng",
    widthGrow: 2,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
    formatter: function (cell) {
      const data = cell.getRow().getData();
      return data.lower_program
        ? "　└　" + cell.getValue()
        : cell.getValue();
    },
  },
  {
    title: "Program Name (IND)",
    field: "ind",
    widthGrow: 2,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
    formatter: function (cell) {
      const data = cell.getRow().getData();
      return data.lower_program
        ? "　└　" + cell.getValue()
        : cell.getValue();
    },
  },
  {
    title: "Sort Order",
    field: "sort_order",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
];


const ProgramManagement = () => {
  const tbRef = useRef(null);
    //Disabled
  const [disabled, setDisabled] = useState(true);
  const [disabledProgram, setDisabledProgram] = useState(true);
  const [disabledProgramGroup, setDisabledProgramGroup] = useState(true);
    //Change state
  const [hasChangesUpdate, setHasChangesUpdate] = useState(false);
  const [hasChangesCreate, setHasChangesCreate] = useState(false);
  const [isRequired, setIsRequired] = useState(true);
  const hasChangesUpdateRef = useRef(hasChangesUpdate);
  const hasChangesCreateRef = useRef(hasChangesCreate);  
  const [newId, setNewId] = useState('');

  useEffect(() => {
    hasChangesUpdateRef.current = hasChangesUpdate;
    hasChangesCreateRef.current = hasChangesCreate;
  }, [hasChangesUpdate, hasChangesCreate]); 

    //params  
  const [queryParams, setQueryParams] = useState("");
  const [selectedIsProgramGroup, setSelectedIsProgramGroup]  = useState("")
  const [optionParams, setOptionParams] = useState("upper-code=001&upper-code=002");
  const [selectedProgram, setSelectedProgram] = useState({
        id: null,
    });



  const [formValues, setFormValues] = useState({
    upper_program: null,
    lower_program: null,
    description: null,
    link_url: null,
    usage: null,
    eng: null,
    ind: null,
    kor: null,
    language4: null,
    language5: null,
    sort_order: null
  });
  
  const emptyDetail = () => {
    setFormValues({
      upper_program: '',
      lower_program: '',
      description: '',
      link_url: '',
      usage: '',
      eng: '',
      ind: '',
      kor: '',
      language4: '',
      language5: '',
      sort_order: '',
      programType:''
    });
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
      setDisabledProgram(true);
      setDisabledProgramGroup(true);
      setHasChangesUpdate(false);
      setSelectedProgram({ id: null });
      setIsNewClicked(false);
      setHasChangesCreate(false);
    };
    const updateCallback = () => {
      enableUPDATEButtons();
      setIsNewClicked(false);
      setHasChangesUpdate(false);
    }; 


    const { programListData ,programListSelect, detailProgramError, detailProgramData, createLowerProgram, createUpperProgram, updateLowerProgram, updateUpperProgram, deleteProgram} = useProgramMgt({
      programID: selectedProgram?.id,
      queryParams: queryParams  || "deletion=001002",
      onUpdateSuccess: (responseData) => {
        updateCallback()
        // const newProgramId = responseData?.id;
        // setSelectedProgram({ id: newProgramId });
        // const row = tbRef.current.getRow(newProgramId);
        // row && row.select();
      },
      onDeleteSuccess: reloadCallback,
      onCreateSuccess: (responseData) => {
        reloadCallback();
        const newUserId = responseData.id;
        setNewId(newUserId);
      },
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
      footerElement: `<div id="footer-bottom" style="padding: 0 20px 0 0; text-align: right;">Total ${programListData?.length || 0} Results</div>`,
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
        setSelectedProgram({
          id: rowData.id,  
        });
        setDisabled(false);
        if (rowData.lower_program !== null) {
          setDisabledProgram(false); 
          setDisabledProgramGroup(true);
          setFormValues((prevValues) => ({
            ...prevValues,
            programType: "Program",
          }));
          
        } else if (rowData.lower_program == null){
          setDisabledProgramGroup(false); 
          setDisabledProgram(true);
          setFormValues((prevValues) => ({
            ...prevValues,
            programType: "Program Group",
          }));
          
        }
        setHasChangesUpdate(false);
        setIsNewClicked(false);
      });
    } else {      
      const rowData = row.getData(); 
      setSelectedProgram((cur) => ({ ...cur, id: rowData.id }));
      setFormValues({
        id:rowData.id,
        eng: rowData.eng,
        ind: rowData.ind,
        upper_program: rowData.upper_program,
        lower_program: rowData.lower_program,
        programType: rowData.programType,
        usage: rowData.usage,
        description: rowData.description,
        sort_order: rowData.sort_order,
        link_url: rowData.link_url
      });
      setDisabled(false); 
      enableUPDATEButtons();
      setIsNewClicked(false);
      if (rowData.lower_program !== null) {
        setDisabledProgram(false); 
        setDisabledProgramGroup(true);
        setFormValues((prevValues) => ({
          ...prevValues,
          programType: "Program",
        }));
        
      } else if (rowData.lower_program == null){
        setDisabledProgramGroup(false); 
        setDisabledProgram(true)
        setFormValues((prevValues) => ({
          ...prevValues,
          programType: "Program Group",
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

      if (selectedProgram?.id){
        if(!isNewClicked){
          setHasChangesUpdate(true);
        }
      }
  

    }; 
    
    const handleOnChangeInputSelect = useCallback(({ target }) => {
      const { value } = target;
      setSelectedIsProgramGroup(value);
    }, []);

    const handleSearch = useCallback(
        (inputVal = null, radioVal = null, radioUsageVal = null) => {
          const resultInput = inputVal ? `input=${inputVal}` : "";
          const resultRadio = radioVal && radioVal !== "All" ? `&deletion=${radioVal}` : `&deletion=001002`;
          const resultRadioUsageVal = radioUsageVal && radioUsageVal !== "All" ? `&usage=${radioUsageVal}` : "";
          const resultSelectCode = selectedIsProgramGroup
          ? `&upper_program=${selectedIsProgramGroup}`
          : "";
          const result = resultInput + resultRadio +resultRadioUsageVal + resultSelectCode;
          setQueryParams(result); 
        },
        [selectedIsProgramGroup]
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
            setDisabledProgram(true);
            setDisabledProgramGroup(true);
            setDisabled(true);
            enableInitialButtons();
            setHasChangesCreate(false);
          });
        }
        else{
          emptyDetail();
          setIsNewClicked(false);
          setDisabled(true);
          setDisabledProgram(true);
          setDisabledProgramGroup(true);
          enableInitialButtons();
          setHasChangesCreate(false);
          setSelectedProgram({id:null})
        }
      } else {
        reloadCallback()
      }
      };
    const handleNewButtonClick = () => {
        if (selectedProgram?.id){
          tbRef.current.deselectRow();
          setDisabledProgram(false);
          setDisabledProgramGroup(true);
          emptyDetail();
          setFormValues((prevValues) => ({
            ...prevValues,
            programType: "Program",
            upper_program: detailProgramData[0].upper_program
          }));  
          setHasChangesUpdate(false);
          enableRegisterButtons();
          setIsNewClicked(true);
        } else { 
          tbRef.current.deselectRow();
          emptyDetail();
          setFormValues((prevValues) => ({
            ...prevValues,
            programType: "Program Group",
          }));
          
          setDisabled(false);
          setDisabledProgramGroup(false);
          setDisabledProgram(true);
          setIsNewClicked(true);
          enableRegisterButtons();
          setSelectedProgram({ id: null });
          setHasChangesUpdate(false);
        }
    };

  const handleRegistButtonClick = () => {
    if (selectedProgram?.id){  
      console.log(formValues)
      createLowerProgram(formValues);
    }else{
      createUpperProgram(formValues);
    }
  }
  const handleConfirmButtonClick = () => {
    if(!formValues.lower_program){
      updateUpperProgram(formValues);
    } else{
      updateLowerProgram(formValues)
      
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
      deleteProgram(selectedProgram?.id); 
    });
    
  };
  useEffect(() => {
   }, [selectedProgram, formValues]); 

   useEffect(() => {

    if (detailProgramData && Array.isArray(detailProgramData)) {
      const firstDetail = detailProgramData[0];
      
      setFormValues((prevValues) => ({
        ...prevValues, 
        eng: firstDetail?.eng,
        ind: firstDetail?.ind,
        upper_program: firstDetail?.upper_program,
        lower_program: firstDetail?.lower_program,
        usage: firstDetail?.usage,
        description: firstDetail?.description,
        sort_order: firstDetail?.sort_order,
        link_url: firstDetail?.link_url
      }));
    }
  }, [detailProgramData]);
  
  const logs = detailProgramData && Array.isArray(detailProgramData) 
    ? [
        { label: "Registered By", value: detailProgramData[0]?.registered_by },
        { label: "Registered Time", value: detailProgramData[0]?.registered_time },
        { label: "Updated By", value: detailProgramData[0]?.updated_by },
        { label: "Updated Time", value: detailProgramData[0]?.updated_time },
      ]
    : [];
  

  return (
<>
        <section className='wrap'>
          <div className='header-title'>
            <h3>SYSTEM</h3>
            <h3>&gt;</h3>
            <h3>Program Management</h3>
          </div>

          <ContainerCard justifyContent='flex-end'>
            <Filtering 
            placeholder="Program / Program Name / URL"
            onSearch={handleSearch}
            onReset={'test'}
            labelSelect={'Program Group'}
            optionsRadioFilter={optionsRadioFilterDeleted}
            optionsRadioFilterUsage ={optionsRadioFilterUsage}
            isUsage ={true}
            >
              <Select 
                  value={selectedIsProgramGroup}
                  onChange={handleOnChangeInputSelect}
                  className={'custom-select'}
                  options={
                    programListSelect
                      ? [
                          { value: "", label: "All" },  
                          ...programListSelect
                            .filter(item => item.upper_program === item.id) 
                            .map(item => ({
                              value: item.upper_program, 
                              label: item.eng 
                            }))
                        ]
                      : []
                  }>

              </Select>
            </Filtering>
          </ContainerCard>
        </section>
        <ContainerCard>
        <ReactTabulator
            className="container-tabullator"
            data={programListData || []}
            columns={columnsHistory}
            layout={"fitColumns"}
            options={optionsTabulator}
            onRef={(r) => {
              tbRef.current = r.current;
            }}
            events={{
              rowSelected: handleRowSelected,
              tableBuilt: () => {
                if (selectedProgram?.id) {
                  const row = tbRef.current.getRow(selectedProgram?.id);
                  row && row.select();
                } else if (newId){
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
            <div className="grid grid-cols-3 gap-x-[40px] gap-y-[10px]">
              <DetailForm
                label={"Program Type"}
                value={formValues.programType}
                inputType={'select'}
                onChange={handleInputChange}
                name={"programType"}
                disabled={disabled} 
                optionSelect={
                  [{ value: "", label: "" },
                  { value: "Program Group", label: "Program Group", disabled: disabledProgramGroup },
                   { value: "Program", label: "Program", disabled: disabledProgram }]}
                />
              <DetailForm
                label={"Program Name (ENG)"}
                value={formValues.eng || ''}
                inputType={'text'}
                onChange={handleInputChange}
                required={isRequired}
                name="eng"
                disabled={disabled}/>
              <DetailForm
                label={"Usage"}
                name="usage"
                value={formValues.usage || ''} 
                inputType={'select'}
                onChange={handleInputChange}
                required={isRequired} 
                disabled={disabled} 
                optionSelect={commonListData?.["002"] ? [
                  { value: "", label: "" },
                  ...commonListData["002"].code.map((code, index) => ({
                    value: code, 
                    label: commonListData["002"].name[index]
                  }))
                ] : []} />
               <DetailForm
                label={"Program Group"}
                value={formValues.upper_program || ''}
                inputType={'text'}
                onChange={handleInputChange}
                required={isRequired}
                name={"upper_program"}
                disabled={disabledProgramGroup}  />

              <DetailForm
                label={"Program Name (IND)"}
                value={formValues.ind || ''}
                inputType={'text'}
                onChange={handleInputChange}
                name={"ind"}
                required={isRequired}
                disabled={disabled}/>

              <DetailForm
                label={"Sort Order"}
                value={formValues.sort_order || ''}
                inputType={'number'}
                onChange={handleInputChange}
                name={"sort_order"}
                disabled={disabled}/>
                
              <DetailForm
                label={"Program"}
                value={formValues.lower_program || ''}
                inputType={'text'}
                onChange={handleInputChange}
                name={"lower_program"}
                required={isRequired} 
                disabled={disabledProgram} 
                />
              <DetailForm
                label={"URL Link"}
                value={formValues.link_url || ''}
                inputType={'text'}
                onChange={handleInputChange}
                name={"link_url"}
                disabled={disabled}/>

              <DetailForm
                label={"Description"}
                value={formValues.description || ''}
                onChange={handleInputChange}
                name={"description"}
                inputType={'text'}
                disabled={disabled}/>
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
          newButtonState={hasChangesCreate ? false :buttonState.create}/>
        </div>
      </div>

        </div>
        
        </ContainerCard>

        </>
     
   
  );
};

export default ProgramManagement;