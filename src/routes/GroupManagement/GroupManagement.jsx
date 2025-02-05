import React, { useCallback, useEffect, useRef, useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import ContainerCard from '../../components/ContainerCard/ContainerCard';
import Filtering from '../../components/Filtering/Filtering';
import { ReactTabulator } from 'react-tabulator';
import DetailForm from '../../components/DetailForm/DetailForm';
import Button from '../../components/Button/Button';
import LogList from '../../components/LogList/LogList';
import ButtonGroup from '../../components/ButtonGroup/ButtonGroup';
import Select from '../../components/Select/Select';
import ContainerSlide from '../../components/ContainerSlide/ContainerSlide';
import BoxLeft from '../../components/BoxLeft/BoxLeft';
import useAuthorityMgt from '../../hooks/useAuthorityMgt';
import useProgram from '../../hooks/useProgram';
import useCommonCodes from '../../hooks/useCommonCodes';
import NoticeMessage from '../../plugin/noticemessage/noticemessage';
import useUserMgt from '../../hooks/useUserMgt';
import useUserAuthority from '../../hooks/useUserAuthority';
import { faL } from '@fortawesome/free-solid-svg-icons';


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
    title: "Group Group",
    field: "group_code",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
    visible:false
  },
  {
    title: "Group Name",
    field: "group_name",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "Usage",
    field: "usage",
    widthGrow: 2,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
];

const columnStandby = [
  {
    formatter: "rowSelection",
    titleFormatter: "rowSelection",
    width: "60",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
  },
  {
    title: "User ID",
    field: "account_id",
    width: "120",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "Name",
    field: "name",
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "ID",
    field: "id",
    width: "100",
    visible: false,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
]


const GroupManagement = () => {
    const tbRefInit = useRef(null);
    const tbRefStandby = useRef(null);
    const tbRefAssign = useRef(null);
    const [queryParams, setQueryParams] = useState("");
    const [disabled, setDisabled] = useState(true);
    const [hasChanged, setHasChanged] = useState('');
    const [disabledLog, setDisabledLog] = useState(true);
    const [selectedIsCodeGroup, setSelectedIsCodeGroup]  = useState("")
    const [users, setUsers] = useState([]);
    const [selectedPosition, setSelectedPosition]  = useState("")
    const [optionParams] = useState("upper-code=002&upper-code=021");
    const [groupName, setGroupName] = useState('');
    const [queryParamsUser, setQueryParamsUser] = useState("");
    const [selectedCode, setSelectedCode] = useState({
        group_code: '',
    });
    //Change state
    const [hasChangesUpdate, setHasChangesUpdate] = useState(false);
    const [hasChangesCreate, setHasChangesCreate] = useState(false);
    const hasChangedRef = useRef(hasChanged);
    useEffect(() => {
      hasChangedRef.current = hasChanged;
    }, [hasChanged]);
     //Button 
     const [buttonState, setButtonState] = useState({
       confirm: true,
       cancel: true,
       delete: true,
       create: false,
       restore: true,
       arrow:true
     });
     const [isNewClicked, setIsNewClicked] = useState(false);
 
     const disableAllButtons = () => {
       setButtonState({
         confirm: true,
         cancel: true,
         delete: true,
         create: true,
         restore:true,
         arrow:true
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
         arrow: false,
         restore: false
       }));
     };      

     const reloadCallback = () => {
      enableInitialButtons();
      tbRefInit.current.deselectRow();
      emptyDetail();
      setDisabled(true);
      setDisabledLog(true);
      setHasChangesUpdate(false);
      setSelectedCode({ id: null });
      setIsNewClicked(false);
      setHasChangesCreate(false);
    };
    const { userAuthenticated, authorityUserInfo, authorityUserAssign } = useUserAuthority({
      id: selectedCode?.group_code,
      queryParams: queryParamsUser,
    });
    const { initialAuthority } = useAuthorityMgt({
      id: selectedCode?.group_code,
      queryParams: queryParams,
    })

    const { commonListData } = useCommonCodes({ optionParams });

    const [formValues, setFormValues] = useState({
      group_name:'',
      is_used:'',
      description:''
      });  

    const emptyDetail = () => {
    setFormValues({
      group_name:'',
      is_used:'',
      description:''
    });
  };
    const optionsInit = {
      debugInvalidOptions: true,
      pagination: true,
      movableRows: false,
      resizableRows: false,
      paginationSize: 5,
      rowHeight: 41,
      selectableRows: 1,
      selectableRowsCheck: (row) => {
        return !row.getElement().classList.contains("tabulator-selected");
      },
      footerElement: `<div id="footer-bottom" style="padding: 0 20px 0 0; text-align: right;">Total ${ 0} Results</div>`,
    };
    const optionsAssign = {
      height: '270px',
      placeholder:'No Data',
      debugInvalidOptions: true,
      movableRows: false,
      resizableRows: false,
      layout: "fitColumns",
      index: "code_id",
      rowHeight: 41,
      selectableRows: true,
      footerElement: `<div id="footer-bottom" style="padding: 0 20px 0 0; text-align: right;">Total ${ 0} Results</div>`,
   };

   const optionsStandby = {
      debugInvalidOptions: true,
      movableRows: false,
      resizableRows: false,
      height: '270px',
      layout: "fitColumns",
      rowHeight: 41,
      selectableRows: true,
      footerElement: `<div id="footer-bottom" style="padding: 0 20px 0 0; text-align: right;">Total ${ users?.length || 0} Results</div>`,
    };
    
      useEffect(() => {
        setUsers(userAuthenticated); 
      }, [userAuthenticated]);
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
    const optionsRadioFilterPosition = commonListData?.["021"]
    ? [
        { value: "All", label: "All", code: "All" }, 
        ...commonListData["021"].code.map((code, index) => ({
          value: code,
          label: commonListData["021"].name[index],
          code: code,
        })),
      ]
    : [];

    const handleOnChangeInputSelect = useCallback(({ target }) => {
      const { value } = target;
      setSelectedIsCodeGroup(value);
    }, []);

    const handleSearchInit = useCallback(
     (inputVal = null) => {
          const resultInput = inputVal ? `input=${inputVal}` : "";
          const resultSelectCode =
            selectedIsCodeGroup && selectedIsCodeGroup !== "All"
              ? `&is_used=${selectedIsCodeGroup}`
              : "";
          const result = resultInput + resultSelectCode;
          setQueryParams(result); 
        },
        [selectedIsCodeGroup]
      );
    const handleResetInit = () => {
        setSelectedIsCodeGroup('All')
    };
    const handleRowInitSelected = useCallback((row) => {
      const rowData = row.getData(); 
      const groupCode = rowData.group_code;
      const groupName = rowData.group_name;
      setSelectedCode({group_code:groupCode})
      
      const updateGroupData = () => {
        setDisabled(false);
        enableUPDATEButtons();
        setGroupName(groupName);
        setSelectedCode({ group_code: groupCode });
        setButtonState((prevState) => ({ ...prevState, arrow: false, confirm:true, restore:false}));
        setDisabledLog(false);
        // setSelectedRowAssign([]);
        // setSelectedRowStandby([]);
      };
    
      if (hasChangedRef.current) {
        const message = new NoticeMessage(
          "Changes you made may not be saved, would you like to continue?",
          {
            mode: "confirm",
          }
        );
        
        message.confirmClicked().then(() => {
          updateGroupData(); 
          setHasChanged(false);
        });
      } else {
        updateGroupData(); 
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
    const handleOnChangeInputSelectPosition = useCallback(({ target }) => {
      const { value } = target;
      setSelectedPosition(value);
    }, []);

    const handleSearchStandby = useCallback(
      (inputVal = null) => {
        const resultInput = inputVal ? `input=${inputVal}` : "";
        const resultSelectCode = selectedPosition && selectedPosition !== "All"
          ? `&position=${selectedPosition}`
          : ""; 
        const result = resultInput + resultSelectCode;
        setQueryParamsUser(result); 
      },
      [selectedPosition]
    );
    
  const handleResetStandby = () => {
      setSelectedPosition('All')
  };

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
                setDisabled(true);
                enableInitialButtons();
                setHasChangesCreate(false);
              });
            }
            else{
              emptyDetail();
              setIsNewClicked(false);
              setDisabled(true);
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
              tbRefInit.current.deselectRow();
              emptyDetail();
              setHasChangesUpdate(false);
              enableRegisterButtons();
              setIsNewClicked(true);
            } else { 
              tbRefInit.current.deselectRow();
              emptyDetail();
              setDisabled(false);
              setIsNewClicked(true);
              enableRegisterButtons();
              setHasChangesUpdate(false);
            }
  };
    
  const handleRegistButtonClick = () => {
    
  }
  const handleConfirmButtonClick = () => {
       
  }
  const handleDeleteButtonClick = () => {
        
    const message = new NoticeMessage(
          "Are you sure you want to delete this data?",
          {
            mode: "confirm",
          }
        );
        message.confirmClicked().then(() => {
          // deleteProgram(selectedProgram?.id); 
        });
        
  };
      
   useEffect(() => {
    if (authorityUserInfo) {
      setFormValues((prevValues) => ({
        ...prevValues, 
        group_name: authorityUserInfo[0]?.group_name,
        is_used: authorityUserInfo[0]?.is_used,
        description: authorityUserInfo[0]?.description
      }));
    }
  }, [authorityUserInfo]);

  const logs = authorityUserInfo && Array.isArray(authorityUserInfo) 
  ? [
      { label: "Registered By", value: authorityUserInfo[0]?.registered_by },
      { label: "Registered Time", value: authorityUserInfo[0]?.registered_time },
      { label: "Updated By", value: authorityUserInfo[0]?.updated_by },
      { label: "Updated Time", value: authorityUserInfo[0]?.updated_time },
    ]
  : [];


  return (
    <>
        <section className='wrap'>
          <div className='header-title'>
            <h3>SYSTEM</h3>
            <h3>&gt;</h3>
            <h3>Group Management</h3>
          </div>

          <ContainerCard>
            <Filtering 
            placeholder="Group Name / Description"
            onSearch={handleSearchInit}
            onReset={handleResetInit}
            labelSelect={'Usage'}
            disableFiltering={true}
            >
                <Select 
                value={selectedIsCodeGroup}
                onChange={handleOnChangeInputSelect}
                options={optionsRadioFilterUsage}
                className={'custom-select'} />
            </Filtering>
          </ContainerCard>
        </section>
        <ContainerCard>
        <ReactTabulator
            data={initialAuthority || []}
            columns={columnsHistory}
            layout={"fitColumns"}
            options={optionsInit}
            onRef={(r) => {
              tbRefInit.current = r.current;
            }}
            events={{
              rowSelected: handleRowInitSelected,
              tableBuilt: () => {
                if (selectedCode?.code_id) {
                  const row = tbRefInit.current.getRow(selectedCode?.code_id);
                  row && row.select();
                }
              },
            }}
          />
        </ContainerCard>
        <div className="flex gap-4 items-center ">
      <div className="flex-1 min-w-0">
        <ContainerCard >
        <div className="mb-5"> 
            <BoxLeft
                disableConfirmButton={true}
                onReset={'test'}
                restoreButtonState={buttonState.restore}
            >
            </BoxLeft>
            </div>
            <ReactTabulator
                className="container-tabullator"
                data={[]}
                columns={columnsHistory}
                layout={"fitColumns"}
                options={optionsAssign}
                onRef={(r) => {
                  tbRefAssign.current = r.current;
                }}
                events={{
                // rowSelected: handleRowSelected,
                tableBuilt: () => {
                    if (selectedCode?.code_id) {
                    const row = tbRefAssign.current.getRow(selectedCode?.code_id);
                    row && row.select();
                    }
                },
                }}
            />

        </ContainerCard>
      </div>
      <div className="flex-shrink-0 min-w-0">
        <ContainerSlide buttonState={buttonState.arrow}/>
      </div>
      <div className="flex-1 min-w-0">
        <ContainerCard>
            <div className="mb-5"> 
            <Filtering
                placeholder="Group Name"
                onSearch={handleSearchStandby}
                onReset={handleResetStandby}
                labelSelect={'Position'}
                disableFiltering={true}
            >
                <Select 
                  options={optionsRadioFilterPosition}      
                  className={'custom-select'}
                  value={selectedPosition}
                  onChange={handleOnChangeInputSelectPosition}></Select>
            </Filtering>
            </div>
            <ReactTabulator
                className="container-tabullator"
                data={users || []}
                columns={columnStandby}
                layout={"fitColumns"}
                options={optionsStandby}
                onRef={(r) => {
                  tbRefStandby.current = r.current;
                }}
                events={{
                // rowSelected: handleRowSelected,
                tableBuilt: () => {
                    if (selectedCode?.code_id) {
                    const row = tbRefStandby.current.getRow(selectedCode?.code_id);
                    row && row.select();
                    }
                },
                }}
            />
        </ContainerCard>
      </div>
    </div>
    <ContainerCard>
        <div className="flex w-full flex-col gap-[10px] ">
            <div className="grid grid-cols-3 gap-x-[40px] gap-y-[10px] h-[85px]">
            <DetailForm
            label={"Group Name"}
            value={formValues.group_name}
            onChange={handleInputChange}
            name={"group_name"}
            inputType={'text'}
            required={true}
            disabled={disabled}
        />
            <DetailForm
              label={"Usage"}
              name="is_used"
              value={formValues.is_used} 
              inputType={'select'}
              onChange={handleInputChange}
              required={true} 
              disabled={disabled} 
              optionSelect={commonListData?.["002"] ? [
                  { value: " ", label: " " },
                  ...commonListData["002"].code.map((code, index) => ({
                    value: code, 
                    label: commonListData["002"].name[index]
                  }))
              ] : []} />
         <DetailForm
            label={"Description"}
            value={formValues.description}
            onChange={handleInputChange}
            name={"description"}
            inputType={'textarea'}
            disabled={disabled}
            className={'flex-grow'}
        />
            </div>
        <hr className="border-t border-gray-300 mt-3" />
        <div className="flex items-center justify-between gap-4 w-full">
        <div className="flex-1">
        {disabledLog ? null : <LogList logs={logs} />}
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

export default GroupManagement;