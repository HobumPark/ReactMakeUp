import React, { useCallback, useEffect, useRef, useState } from 'react';
import ContainerCard from '../../components/ContainerCard/ContainerCard';
import Filtering from '../../components/Filtering/Filtering';
import { ReactTabulator } from 'react-tabulator';
import Select from '../../components/Select/Select';
import ContainerSlide from '../../components/ContainerSlide/ContainerSlide';
import BoxLeft from '../../components/BoxLeft/BoxLeft';
import useAuthorityMgt from '../../hooks/useAuthorityMgt';
import useCommonCodes from '../../hooks/useCommonCodes';
import useProgram from '../../hooks/useProgram';
import { fetchGroupPrograms } from '../../api/program';
import NoticeMessage from '../../plugin/noticemessage/noticemessage';


// tabulator top

const columnInit = [
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
    title: "Group Name",
    field: "group_name",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "Group ID",
    field: "group_code",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "Team",
    field: "description",
    widthGrow: 2,
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

const columnAssign = [
  {
    formatter: "rowSelection",
    titleFormatter: "rowSelection",
    width: 60,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
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
    title: "id",
    field: "id",
    width: "100",
    resizable: false,
    hozAlign: "center",
    headerHozAlign: "center",
    visible: false,
  },
  {
    title: "Program Name (ENG)",
    field: "program_name",
    widthGrow: 1,
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
    width: 60,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
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
    title: "id",
    field: "id",
    width: "100",
    resizable: false,
    hozAlign: "center",
    headerHozAlign: "center",
    visible: false,
  },
  {
    title: "Program Name (ENG)",
    field: "program_name",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
];


const AuthorityManagement = () => {
    const tbRefInit = useRef(null);
    const tbRefStandby = useRef(null);
    const tbRefAssign = useRef(null);

    const [groupName, setGroupName] = useState('');
    const [hasChanged, setHasChanged] = useState('');
    const [programs, setPrograms] = useState([]);
    const [programsAssign, setProgramsAssign] = useState([]);
    const [selectedRowAssign, setSelectedRowAssign] = useState(null);
    const [selectedRowStandby, setSelectedRowStandby] = useState(null);
    const [queryParams, setQueryParams] = useState("");
    const [queryParamsProgram, setQueryParamsProgram] = useState("");
    const [selectedIsCodeGroup, setSelectedIsCodeGroup]  = useState("")
    const [selectedUpperProgram, setSelectedUpperProgram]  = useState("")
    const [initialProgramsAssign, setInitialProgramsAssign] = useState([]);
    const [optionParams] = useState("upper-code=002");
    const [selectedCode, setSelectedCode] = useState({
        group_code: '',
    });
    
    const hasChangedRef = useRef(hasChanged);
    useEffect(() => {
      hasChangedRef.current = hasChanged;
    }, [hasChanged]);

    //Button 
    const [buttonState, setButtonState] = useState({
      confirm: true,
      restore: true,
      arrow: true
    });

    const { initialAuthority } = useAuthorityMgt({
      id: selectedCode?.id,
      queryParams: queryParams,
    })

    const { programAuthenticated, upperProgram, groupProgramsData, assignAuthority } = useProgram({
      id: selectedCode?.group_code,
      queryParams: queryParamsProgram || 'usage=002001&deletion=001002',
      onCreateSuccess: () => {
        setHasChanged(false);
        setButtonState((prevState) => ({
          ...prevState,
          confirm:true,
          restore:true,
        }));
      },
  
    })
    const { commonListData } = useCommonCodes({ optionParams });

    const optionsInit = {
      debugInvalidOptions: true,
      pagination: true,
      movableRows: false,
      resizableRows: false,
      paginationSize: 10,
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
      footerElement: `<div id="footer-bottom" style="padding: 0 20px 0 0; text-align: right;">Total ${ 0} Results</div>`,
    };

          
    const handleRowInitSelected = useCallback((row) => {
      const rowData = row.getData(); 
      const groupCode = rowData.group_code;
      const groupName = rowData.group_name;
      
      const updateGroupData = () => {
        setGroupName(groupName);
        setSelectedCode({ group_code: groupCode });
        setButtonState((prevState) => ({ ...prevState, arrow: false, confirm:true, restore:true}));
        setSelectedRowAssign([]);
        setSelectedRowStandby([]);
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
    

    const handleRowSelectedAssign = useCallback((row) => {
      setSelectedRowAssign(row)
    }, []);

    const handleRowSelectedStandBy = useCallback((row) => {
      setSelectedRowStandby(row)
    }, []);
    


    const handleOnChangeInputSelect = useCallback(({ target }) => {
      const { value } = target;
      setSelectedIsCodeGroup(value);
    }, []);

    const handleSearchInit = useCallback(
     (inputVal = null) => {
          const resultInput = inputVal ? `input=${inputVal}` : "";
          const resultSelectCode = selectedIsCodeGroup
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
    const handleOnChangeInputSelectProgram = useCallback(({ target }) => {
      const { value } = target;
      setSelectedUpperProgram(value);
    }, []);

    const handleSearchStandby = useCallback(
      (inputVal = null) => {
        const resultInput = inputVal ? `input=${inputVal}` : "";
        const resultSelectCode = selectedUpperProgram && selectedUpperProgram !== "All"
          ? `&upper_program=${selectedUpperProgram}`
          : ""; 
        const result = resultInput + resultSelectCode + '&usage=002001&deletion=001002';
        setQueryParamsProgram(result); 
      },
      [selectedUpperProgram]
    );
    
  const handleResetStandby = () => {
      setSelectedUpperProgram('All')
  };

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
    
    useEffect(() => {console.log("ASSIGN",selectedRowAssign)}, [selectedRowAssign])
    useEffect(() => {console.log("STANDBY",selectedRowStandby)}, [selectedRowStandby])

    useEffect(() => {
      setProgramsAssign(groupProgramsData)
      setInitialProgramsAssign(groupProgramsData)
    }, [selectedCode, groupProgramsData]); 

    useEffect(() => {
      setPrograms(programAuthenticated); 
    }, [programAuthenticated]);


    useEffect(() => {
      if (Array.isArray(programAuthenticated) && Array.isArray(programsAssign)) {
        const filteredPrograms = programAuthenticated.filter((program) => {
          return !programsAssign.some((assignedProgram) => assignedProgram.id === program.id);
        });
    
        if (filteredPrograms?.length !== programs?.length) {
          setPrograms(filteredPrograms);
        }
      }
    }, [programsAssign, programAuthenticated]);  
    
    

    const handleLeftButton = () => {
      if (selectedRowAssign && selectedRowAssign.length > 0) {
        setHasChanged(true);
        setButtonState((prevState) => ({
          ...prevState,
          confirm:false,
          restore:false,
          arrow: false,
        }));
    
        const selectedIds = selectedRowAssign.map((program) => program.id);
    
        setProgramsAssign((prev) => {
          const updatedAssign = prev.filter((program) => !selectedIds.includes(program.id));
          return updatedAssign;
        });
    
        setPrograms((prev) => {
          const existingIds = new Set(prev.map((program) => program.id));
          const newPrograms = (Array.isArray(selectedRowAssign) ? selectedRowAssign : [selectedRowAssign])
            .filter((program) => !existingIds.has(program.id));
        
          const updatedPrograms = [...prev, ...newPrograms];
          return updatedPrograms;
        });
        setSelectedRowStandby((prev) => {
          const prevStandby = Array.isArray(prev) ? prev : [];
          return [...prevStandby, ...selectedRowAssign]; 
        });
        
        setSelectedRowAssign([]);
        
      } else {
        new NoticeMessage("There is no data selected. Please make selection.")
      }
    };
 

    const handleRightButton = () => {
      if (selectedRowStandby && selectedRowStandby.length > 0) {
        setHasChanged(true);
        setButtonState((prevState) => ({
          ...prevState,
          confirm:false,
          restore:false,
          arrow: false,
        }));
        const selectedIds = selectedRowStandby.map((program) => program.id);
    
        setPrograms((prev) => {
          const updatedPrograms = prev.filter((program) => !selectedIds.includes(program.id));
          return updatedPrograms;
        });
    
        setProgramsAssign((prev) => {
          const existingIds = new Set(prev.map((program) => program.id));
          const newProgramsAssign = (Array.isArray(selectedRowStandby) ? selectedRowStandby : [selectedRowStandby])
            .filter((program) => !existingIds.has(program.id));
          const updatedAssign = [...prev, ...newProgramsAssign];
          return updatedAssign;
        });

        setSelectedRowAssign((prev) => {
          const prevAssign = Array.isArray(prev) ? prev : [];
          return [...prevAssign, ...selectedRowStandby]; 
        });
        
        setSelectedRowStandby([]);
      }
      else {
        new NoticeMessage("There is no data selected. Please make selection.")
      }
    };

    const handleDblStandbyClick = (e, row) => {
      if (row) {
        const rowData = row.getData();
        if (selectedCode && selectedCode.group_code) {
          setPrograms((prevPrograms) => prevPrograms.filter((program) => program.id !== rowData.id));
          setProgramsAssign((prevProgramsAssign) => {
            return [...(prevProgramsAssign || []), rowData];  
          });
          setSelectedRowAssign(rowData); 
          setButtonState((prevState) => ({
            ...prevState,
            confirm:false,
            restore:false,
            arrow: false,
          }));
        } else {
          new NoticeMessage('No group selected. Please select a group.')
        }
      }
    };
    
    const handleDblAssignClick = (e, row) => {
      if (row) {
        const rowData = row.getData();
        setProgramsAssign((prevProgramsAssign) => 
          prevProgramsAssign.filter((program) => program.id !== rowData.id)
        );

        setPrograms((prevPrograms) => {
          return [...(prevPrograms || []), rowData];  
        });
        setSelectedRowAssign(rowData); 
        setButtonState((prevState) => ({
          ...prevState,
          confirm:false,
          restore:false,
          arrow: false,
        }));
      }
    };
    
    const handleRestore = () => {
      setProgramsAssign(initialProgramsAssign);
      setButtonState((prevState) => ({
        ...prevState,
        confirm:true,
        restore:true,
        arrow: true,
      }));
    }

    const handleConfirm = () => {
      const ids = programsAssign.map((program) => program.id);
      const dataToSend = {
        id: ids
      };
      assignAuthority(dataToSend);
    };
    
  return (
    <>
        <section className='wrap'>
          <div className='header-title'>
            <h3>System Management</h3>
            <h3>&gt;</h3>
            <h3>Authority Management</h3>
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
            className="container-tabullator"
            data={initialAuthority || []}
            columns={columnInit}
            layout={"fitColumns"}
            options={optionsInit}
            onRef={(r) => {
              tbRefInit.current = r.current;
            }}
            events={{
              rowSelected: handleRowInitSelected,
              tableBuilt: () => {
                if (selectedCode?.group_code) {
                  const row = tbRefInit.current.getRow(selectedCode?.group_code);
                  row && row.select();
                }
              },
            }}
          />
        </ContainerCard>
        <div className="flex gap-4 items-center ">
      <div className="flex-1 min-w-0">
        <ContainerCard  >
        <div className="mb-5"> 
            <BoxLeft
                onSearch={'test'}
                onReset={'test'}
                labelSelect={groupName || 'Tim'}
                confirmButtonState={buttonState.confirm}
                restoreButtonState={buttonState.restore}
                onClickRestore={handleRestore}
                onClickConfirm={handleConfirm}
            >
            </BoxLeft>
            </div>
            <ReactTabulator
                className="container-tabullator"
                data={programsAssign || []}
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
                    if (selectedCode?.group_code) {
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
        onClickRight={handleRightButton} />
      </div>
      <div className="flex-1 min-w-0">
        <ContainerCard>
            <div className="mb-5"> 
            <Filtering
                placeholder="Group Name / Description"
                onSearch={handleSearchStandby}
                onReset={handleResetStandby}
                labelSelect={'Upper Program'}
                disableFiltering={true}
            >
                <Select
                  className={'custom-select'}
                  value={selectedUpperProgram}
                  onChange={handleOnChangeInputSelectProgram}
                  options={[
                        { label: "All", value: "" }, 
                        ...(upperProgram ? upperProgram.map(item => ({ label: item.upper, value: item.upper })) : [])
                    ]}
                />
            </Filtering>
            </div>
            <ReactTabulator
                key={programs?.length}
                className="container-tabullator"
                data={programs}
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
                    console.log(selectedCode, selectedRowAssign, selectedRowStandby)
                    if (selectedCode?.group_code) {
                      tbRefStandby.current.selectRow(selectedRowStandby.map(p => p.id))
                    }
                },
                }}
            />
        </ContainerCard>
      </div>
    </div>
        </>
  );
};

export default AuthorityManagement;