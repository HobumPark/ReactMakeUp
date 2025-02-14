import React, { useCallback, useEffect, useRef, useState } from 'react';
import ContainerCard from '../../components/ContainerCard/ContainerCard';
import Filtering from '../../components/Filtering/Filtering';
import { ReactTabulator } from 'react-tabulator';
import DetailForm from '../../components/DetailForm/DetailForm';
import LogList from '../../components/LogList/LogList';
import ButtonGroup from '../../components/ButtonGroup/ButtonGroup';
import Select from '../../components/Select/Select';
import ContainerSlide from '../../components/ContainerSlide/ContainerSlide';
import BoxLeft from '../../components/BoxLeft/BoxLeft';
import useAuthorityMgt from '../../hooks/useAuthorityMgt';
import useCommonCodes from '../../hooks/useCommonCodes';
import NoticeMessage from '../../plugin/noticemessage/noticemessage';
import useUserAuthority from '../../hooks/useUserAuthority';
import { useTranslation } from 'react-i18next';


const GroupManagement = () => {
   const { t } = useTranslation();
   const totalText = t('cmn > total');
   const resultText = t('cmn > results');

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
      title: t('user > group name'),
      field: "group_name",
      widthGrow: 1,
      hozAlign: "center",
      headerHozAlign: "center",
      headerSort: false,
      resizable: false,
    },
    {
      title: t('002'),
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
      title: t('user > account id'),
      field: "account_id",
      width: "120",
      hozAlign: "center",
      headerHozAlign: "center",
      headerSort: false,
      resizable: false,
    },
    {
      title: t('user > name'),
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

  const columnAssign = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      width: "60",
      hozAlign: "center",
      headerHozAlign: "center",
      headerSort: false,
    },
    {
      title: t('user > account id'),
      field: "account_id",
      width: "120",
      hozAlign: "center",
      headerHozAlign: "center",
      headerSort: false,
      resizable: false,
    },
    {
      title: t('user > name'),
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
    const tbRefInit = useRef(null);
    const searchRef = useRef(null);
    const groupRef = useRef(null);
    const tbRefStandby = useRef(null);
    const tbRefAssign = useRef(null);
    const [queryParams, setQueryParams] = useState("");
    const [disabled, setDisabled] = useState(true);
    const [hasChanged, setHasChanged] = useState('');
    const [disabledLog, setDisabledLog] = useState(true);
    const [selectedIsCodeGroup, setSelectedIsCodeGroup]  = useState("")
    const [users, setUsers] = useState([]);
    const [usersAssign, setUsersAssign] = useState([]);
    const [initialUsersAssign, setInitialUsersAssign] = useState([]);
    const [selectedPosition, setSelectedPosition]  = useState("")
    const [selectedRowAssign, setSelectedRowAssign] = useState(null);
    const [selectedRowStandby, setSelectedRowStandby] = useState(null);
    const [optionParams] = useState("upper-code=002&upper-code=021");
    const [groupName, setGroupName] = useState('');
    const [queryParamsUser, setQueryParamsUser] = useState("");
    const [selectedCode, setSelectedCode] = useState({
        group_code: '',
        id:''
    });
    //Change state
    const [hasChangesUpdate, setHasChangesUpdate] = useState(false);
    const [hasChangesCreate, setHasChangesCreate] = useState(false);
    const [isNewClicked, setIsNewClicked] = useState(false);
    const [newId, setNewId] = useState('');

    const hasChangedRef = useRef(hasChanged);
    const newClickedRef = useRef(isNewClicked);

    useEffect(() => {
      hasChangedRef.current = hasChanged;
      newClickedRef.current = isNewClicked;
    }, [hasChanged,isNewClicked]);

    useEffect(() => {
      if (searchRef.current) {
        searchRef.current.focus();
      }
    }, []);

    useEffect(() => {
      if (isNewClicked && groupRef.current) {
        groupRef.current.focus();
      }
    }, [isNewClicked]);


     //Button 
     const [buttonState, setButtonState] = useState({
       confirm: true,
       cancel: true,
       delete: true,
       create: false,
       restore: true,
       arrow:true
     });

 
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
         arrow: false,
         restore: false
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
      setSelectedCode({ group_code: null });
      setIsNewClicked(false);
      setHasChangesCreate(false);
      setHasChangesUpdate(false);
      setHasChanged(false);
      setSelectedRowAssign([]);
      setSelectedRowStandby([]);
      setUsers(userAuthenticated)
    };

    const createCallback = () => {
      enableInitialButtons();
      emptyDetail();
      setDisabled(true);
      setHasChangesCreate(false);
      setHasChanged(false);
      setIsNewClicked(false);
      setSelectedCode({group_code:null})
    }
    const updateCallback = () => {
      enableUPDATEButtons();
      setHasChangesUpdate(false);
      setHasChanged(false);
    };

    const { userAuthenticated, authorityUserInfo, authorityUserAssign, deleteAuthorityUser, UpdateAuthorityUser, createAuthority} = useUserAuthority({
      id: selectedCode?.group_code,
      queryParams: queryParamsUser,
      onDeleteSuccess: reloadCallback,
      onCreateSuccess: (responseData) => {
        createCallback();
        const newUserId = responseData.group_id;
        setNewId(newUserId); 
      },
      onUpdateSuccess: (responseData) =>{
        updateCallback();
        const newUserId = responseData[0]?.group_id || responseData?.group_id;
        setSelectedCode({ group_code: newUserId });
        // const row = tbRefInit.current.getRow(selectedCode.group_code);
        // row && row.select();
      } 
    });
    const { initialAuthority } = useAuthorityMgt({
      id: selectedCode?.group_code,
      queryParams: queryParams,
    })



    const { commonListData } = useCommonCodes({ optionParams });

    const [formValues, setFormValues] = useState({
      group_name:'',
      usage:'',
      description:''
      });  

    const emptyDetail = () => {
      setFormValues({
        group_name:'',
        usage:'',
        description:''
      });
    };

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

    const optionsInit = {
      debugInvalidOptions: true,
      pagination: true,
      movableRows: false,
      resizableRows: false,
      paginationSize: 5,
      rowHeight: 41,
      locale: "ko",
      langs: {
        ko: languageTabulator(),
      },
      selectableRows: 1,
      selectableRowsCheck: (row) => {
        return !row.getElement().classList.contains("tabulator-selected");
      },
      footerElement: `<div id="footer-bottom" style="padding: 0 20px 0 0; text-align: right;">${totalText} ${initialAuthority?.length || 0} ${resultText}</div>`,
      };
    const optionsAssign = {
      height: '270px',
      placeholder:t('msg > no data'),
      debugInvalidOptions: true,
      movableRows: false,
      resizableRows: false,
      layout: "fitColumns",
      rowHeight: 41,
      selectableRows: true,
      footerElement: `<div id="footer-bottom" style="padding: 0 20px 0 0; text-align: right;">${totalText} ${ usersAssign?.length || 0} ${resultText}</div>`,
   };

   const optionsStandby = {
      debugInvalidOptions: true,
      movableRows: false,
      resizableRows: false,
      height: '270px',
      layout: "fitColumns",
      rowHeight: 41,
      selectableRows: true,
      footerElement: `<div id="footer-bottom" style="padding: 0 20px 0 0; text-align: right;">${totalText} ${ users?.length || 0} ${resultText}</div>`,
    };

  useEffect(() => {
      setUsersAssign(authorityUserAssign)
      setInitialUsersAssign(authorityUserAssign)
  }, [selectedCode, authorityUserAssign]); 

  useEffect(() => {
        setUsers(userAuthenticated); 
  }, [userAuthenticated]);

  useEffect(() => {
      if (Array.isArray(userAuthenticated) && Array.isArray(usersAssign)) {
        const filteredUsers = userAuthenticated.filter((user) => {
          return !usersAssign.some((assignedUser) => assignedUser.id === user.id);
        });
    
        if (filteredUsers?.length !== users?.length) {
          setUsers(filteredUsers);
        }
      }
  }, [usersAssign, userAuthenticated]);  
  
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
    const optionsRadioFilterPosition = commonListData?.["021"]
    ? [
        { value: "All", label: t('cmn > all'), code: "All" }, 
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

    const handleRestore = () => {
      setUsersAssign(initialUsersAssign);
      setHasChanged(false);
      setSelectedRowAssign(selectedRowStandby);
      setSelectedRowStandby(selectedRowAssign);
      if (isNewClicked){
        setUsers(userAuthenticated)
        setSelectedRowStandby([]);
      }
    }
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

      const updateGroupData = () => {
        setDisabled(false);
        enableUPDATEButtons();
        setGroupName(groupName);
        setSelectedCode({ group_code: groupCode });
        setButtonState((prevState) => ({ ...prevState, arrow: false, confirm:true, restore:false, create: false}));
        setIsNewClicked(false);
        setDisabledLog(false);
        setSelectedRowAssign([]);
        setSelectedRowStandby([]);
      };
    
      if (hasChangedRef.current) {
        const message = new NoticeMessage(
          t('msg > delete confirm'),
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

        // useEffect(() => {console.log("ASSIGN",selectedRowAssign)}, [selectedRowAssign])
        // useEffect(() => {console.log("STANDBY",selectedRowStandby)}, [selectedRowStandby])
     
        const handleRowSelectedAssign = useCallback((row) => {
        setSelectedRowAssign(row)
      }, []);
  
      const handleRowSelectedStandBy = useCallback((row) => {
        setSelectedRowStandby(row)
      }, []);  

    const handleLeftButton = () => {
      if (selectedRowAssign && selectedRowAssign.length > 0) {
        setHasChanged(true);
        if (isNewClicked){
          setButtonState((prevState) => ({
            ...prevState,
            confirm:true,
            restore:false,
            arrow: false,
            create: false
          }));
        }else{
          setButtonState((prevState) => ({
            ...prevState,
            confirm:false,
            restore:false,
            arrow: false,
            create:true
          }));
        }
    
        const selectedIds = selectedRowAssign.map((user) => user.id);
    
        setUsersAssign((prev) => {
          const updatedAssign = prev.filter((user) => !selectedIds.includes(user.id));
          return updatedAssign;
        });
    
        setUsers((prev) => {
          const existingIds = new Set(prev?.map((user) => user.id));
          const newUsers = (Array.isArray(selectedRowAssign) ? selectedRowAssign : [selectedRowAssign])
            .filter((user) => !existingIds.has(user.id));
        
          const updatedUsers = [...prev, ...newUsers];
          return updatedUsers;
        });
        setSelectedRowStandby((prev) => {
          const prevStandby = Array.isArray(prev) ? prev : [];
          return [...prevStandby, ...selectedRowAssign]; 
        });
        
        setSelectedRowAssign([]);
        
      } else {
        new NoticeMessage(t('msg > group not selected'))
      }
    };
 

    const handleRightButton = () => {
      if (selectedRowStandby && selectedRowStandby.length > 0) {
        setHasChanged(true);
        if (isNewClicked){
          setButtonState((prevState) => ({
            ...prevState,
            confirm:true,
            restore:false,
            arrow: false,
            create: false
          }));
        }else{
          setButtonState((prevState) => ({
            ...prevState,
            confirm:false,
            restore:false,
            arrow: false,
            create:true
          }));
        }

        const selectedIds = selectedRowStandby.map((user) => user.id);
    
        setUsers((prev) => {
          const updatedUsers = prev.filter((user) => !selectedIds.includes(user.id));
          return updatedUsers;
        });
    
        setUsersAssign((prev = []) => {
          const existingIds = new Set(prev.map((user) => user.id)); 
          const newUsersAssign = (Array.isArray(selectedRowStandby) ? selectedRowStandby : [selectedRowStandby])
            .filter((user) => !existingIds.has(user.id));
          
          const updatedAssign = [...prev, ...newUsersAssign];
        
          return updatedAssign;
        });
        
        

        setSelectedRowAssign((prev) => {
          const prevAssign = Array.isArray(prev) ? prev : [];
          return [...prevAssign, ...selectedRowStandby];
        });
        
        setSelectedRowStandby([]);
      }
      else {
        new NoticeMessage(t('msg > group not selected'))
      }
    };

    const handleDblStandbyClick = (e, row) => {
      if (row) {
        setHasChanged(true);
        const rowData = row.getData();
        console.log(selectedCode);
        
        if ( selectedCode?.group_code || newClickedRef.current) {
          setUsers((prevUsers) => prevUsers.filter((user) => user.id !== rowData.id));
          setUsersAssign((prevUsersAssign) => {
            return [...(prevUsersAssign || []), rowData];  
          });
          setSelectedRowAssign([rowData]); 
          if (newClickedRef.current){
            setButtonState((prevState) => ({
              ...prevState,
              confirm:true,
              restore:false,
              arrow: false,
              create: false
            }));
          }else if(selectedCode.group_code){
            setButtonState((prevState) => ({
              ...prevState,
              confirm:false,
              restore:false,
              arrow: false,
              create:false
            }));
          }
            else{
            setButtonState((prevState) => ({
              ...prevState,
              confirm:true,
              restore:true,
              arrow: true,
              create:false
            }));
          }
        } else {
          setHasChanged(false);
          new NoticeMessage(t('msg > group not selected'))
        }
      }
    };
    
    const handleDblAssignClick = (e, row) => {
      if (row) {
        setHasChanged(true);
        const rowData = row.getData();
        setUsersAssign((prevUsersAssign) => 
          prevUsersAssign.filter((user) => user.id !== rowData.id)
        );

        setUsers((prevUsers) => {
          return [...(prevUsers || []), rowData];  
        });
        setSelectedRowStandby([rowData]); 
        if (isNewClicked){
          setButtonState((prevState) => ({
            ...prevState,
            confirm:true,
            restore:false,
            arrow: false,
            create: false
          }));
        }else{
          setButtonState((prevState) => ({
            ...prevState,
            confirm:false,
            restore:false,
            arrow: false,
            create:false
          }));
        }
      }
    };
    
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

      if (selectedCode?.group_code){
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
    if(selectedCode.group_code){
      if (hasChangesUpdate || hasChanged){
        const message = new NoticeMessage(
          t('msg > flush confirm'),
              {
                mode: "confirm",
              }
          );
          message.confirmClicked().then(() => {
              setDisabled(false);
              setHasChanged(false);
              handleRestore();
              setSelectedRowAssign([]);
              setSelectedRowStandby([]);
              setHasChangesUpdate(false);
              setUsersAssign([]);
              setUsers(userAuthenticated);
              setFormValues((prevValues) => ({
                ...prevValues, 
                group_name: authorityUserInfo[0]?.group_name,
                usage: authorityUserInfo[0]?.is_used,
                description: authorityUserInfo[0]?.description
              }));
            });
        } 
       else {
          reloadCallback()
        }
    }        else if(isNewClicked){
      if(hasChangesCreate || hasChanged){
      const message = new NoticeMessage(
        t('msg > flush confirm'),
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
        setHasChanged(false);
        setSelectedRowAssign([]);
        setSelectedRowStandby([]);
        setUsers(userAuthenticated);
        setUsersAssign([]);
        tbRefAssign.current.deselectRow();
        tbRefStandby.current.deselectRow();
      });
    }
    else{
      emptyDetail();
      setHasChanged(false);
      setIsNewClicked(false);
      setDisabled(true);
      enableInitialButtons();
      setHasChangesCreate(false);
      setSelectedCode({group_code:null})
    }
  }else {
      reloadCallback()
      setHasChanged(false);
    }

   };

  const handleNewButtonClick = () => {
            if (selectedCode?.group_code){
              if (hasChanged || hasChangesUpdate){
                const message = new NoticeMessage(
                  t('msg > flush confirm'),
                  {
                    mode: "confirm",
                  }
                );
                message.confirmClicked().then(() => {
                  tbRefInit.current.deselectRow();
                  emptyDetail();
                  setHasChangesUpdate(false);
                  enableRegisterButtons();
                  setIsNewClicked(true);
                  setSelectedCode({group_code:null})
                  setUsersAssign(initialUsersAssign)
                  setUsers(userAuthenticated)
                });
              }else{
                tbRefInit.current.deselectRow();
                emptyDetail();
                setHasChangesUpdate(false);
                enableRegisterButtons();
                setIsNewClicked(true);
                setSelectedCode({group_code:null})
                setUsersAssign(initialUsersAssign)
                setUsers(userAuthenticated)
              }

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
    console.log(formValues);
    
    createAuthority(formValues);
  }
  const handleConfirmButtonClick = () => {
    const assignDataAssign = {
      group_name: formValues.group_name,      
      description: formValues.description,    
      usage: formValues.usage,              
      user_id: Array.isArray(usersAssign) ? usersAssign.map(item => item.id) : []  
    };
    const assignDataInfo = formValues;
    console.log(assignDataAssign);
    console.log(assignDataInfo)
    
    UpdateAuthorityUser({assignDataAssign, assignDataInfo} )
  }
  const handleDeleteButtonClick = () => {
        
    const message = new NoticeMessage(
      t('msg > delete confirm'),
          {
            mode: "confirm",
          }
        );
        message.confirmClicked().then(() => {
          deleteAuthorityUser(selectedCode?.group_code); 
        });
        
  };
      
   useEffect(() => {
    if (authorityUserInfo) {
      setFormValues((prevValues) => ({
        ...prevValues, 
        group_name: authorityUserInfo[0]?.group_name,
        usage: authorityUserInfo[0]?.is_used,
        description: authorityUserInfo[0]?.description
      }));
    }
  }, [authorityUserInfo]);

  const logs = authorityUserInfo && Array.isArray(authorityUserInfo) 
  ? [
      { label: t('cmn > registered by'), value: authorityUserInfo[0]?.registered_by },
      { label: t('cmn > registered time'), value: authorityUserInfo[0]?.registered_time },
      { label: t('cmn > updated by'), value: authorityUserInfo[0]?.updated_by },
      { label: t('cmn > updated time'), value: authorityUserInfo[0]?.updated_time },
    ]
  : [];


  return (
    <>
        <section className='wrap'>
          <div className='header-title'>
            <h3>{t('SYSTEM')}</h3>
            <h3>&gt;</h3>
            <h3>{t('SYSTEM-GROUP')}</h3>
          </div>

          <ContainerCard>
            <Filtering 
            searchRef={searchRef}
            placeholder={t('authority > name') + ' / ' + t('code > description')}
            onSearch={handleSearchInit}
            onReset={handleResetInit}
            labelSelect={t('002')}
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
                console.log(selectedCode.group_code)
                if (selectedCode?.group_code) {
                  const row = tbRefInit.current.getRow(selectedCode?.group_code);
                  row && row.select();
                }else if (newId){
                    const row = tbRefInit.current.getRow(newId);
                    tbRefInit.current.scrollToRow(row, "bottom", true);
                    tbRefInit.current.selectRow(newId);
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
                onClickRestore={handleRestore}
                restoreButtonState={buttonState.restore}
                labelSelect={groupName || ''}
            />
            </div>
            <ReactTabulator
                key={usersAssign?.length}
                className="container-tabullator"
                data={usersAssign || []}
                columns={columnAssign}
                layout={"fitColumns"}
                options={optionsAssign}
                onRef={(r) => {
                  tbRefAssign.current = r.current;
                }}
                events={{
                rowSelectionChanged: handleRowSelectedAssign,
                rowDblClick: handleDblAssignClick,
                tableBuilt: () => {
                   if(selectedRowAssign){
                    tbRefAssign.current.selectRow(selectedRowAssign.map(p => p.id))
                   }
                     
                  
                },
                }}
            />

        </ContainerCard>
      </div>
      <div className="flex-shrink-0 min-w-0">
        <ContainerSlide 
        buttonState={buttonState.arrow}
        onClickLeft={handleLeftButton}
        onClickRight={handleRightButton} 
        />
      </div>
      <div className="flex-1 min-w-0">
        <ContainerCard>
            <div className="mb-5"> 
            <Filtering
                placeholder={t('authority > name')}
                onSearch={handleSearchStandby}
                onReset={handleResetStandby}
                labelSelect={t('021')}
                disableFiltering={true}
                customWidthInput={'w-[220px]'}
                customWidthSelect={'w-[200px]'}
            >
                <Select 
                  options={optionsRadioFilterPosition}      
                  className={'custom-select'}
                  value={selectedPosition}
                  onChange={handleOnChangeInputSelectPosition}></Select>
            </Filtering>
            </div>
            <ReactTabulator
                key={users?.length}
                className="container-tabullator"
                data={users || []}
                columns={columnStandby}
                layout={"fitColumns"}
                options={optionsStandby}
                onRef={(r) => {
                  tbRefStandby.current = r.current;
                }}
                events={{
                rowSelectionChanged: handleRowSelectedStandBy,
                rowDblClick: handleDblStandbyClick,
                tableBuilt: () => {
                   if(selectedRowStandby){
                    tbRefStandby.current.selectRow(selectedRowStandby.map(p => p.id))
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
            formRef={groupRef}
            label={t('user > group name')}
            value={formValues.group_name}
            onChange={handleInputChange}
            name={"group_name"}
            inputType={'text'}
            required={true}
            disabled={disabled}
        />
            <DetailForm
              label={t('code > usage')}
              name="usage"
              value={formValues.usage} 
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
            label={t('code > description')}
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