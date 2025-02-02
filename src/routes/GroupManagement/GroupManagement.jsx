import React, { useCallback, useRef, useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import ContainerCard from '../../components/ContainerCard/ContainerCard';
import Filtering from '../../components/Filtering/filtering';
import { ReactTabulator } from 'react-tabulator';
import DetailForm from '../../components/DetailForm/DetailForm';
import Button from '../../components/Button/Button';
import LogList from '../../components/LogList/LogList';
import ButtonGroup from '../../components/ButtonGroup/ButtonGroup';
import Select from '../../components/Select/Select';
import ContainerSlide from '../../components/ContainerSlide/ContainerSlide';
import BoxLeft from '../../components/BoxLeft/BoxLeft';


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
    field: "codeGroup",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "Code",
    field: "code",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "Code Name (ENG)",
    field: "codeNameENG",
    widthGrow: 2,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "Code Name (IND)",
    field: "codeNameIND",
    widthGrow: 2,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
];

const dataHistory = [
  {
    code_id:"1",
    codeGroup: "Dashboard",
    code: "Code-001",
    codeNameENG: "Dashboard Box 1",
    codeNameIND: "Kotak Dashboard 1",
  },
  {
    code_id:"2",
    codeGroup: "Dashboard",
    code: "Code-002",
    codeNameENG: "Dashboard Box 2",
    codeNameIND: "Kotak Dashboard 2",
  },
  {
    code_id:"3",
    codeGroup: "Dashboard",
    code: "Code-003",
    codeNameENG: "Dashboard Box 3",
    codeNameIND: "Kotak Dashboard 3",
  },
  {
    code_id:"4",
    codeGroup: "Dashboard",
    code: "Code-004",
    codeNameENG: "Dashboard Box 4",
    codeNameIND: "Kotak Dashboard 4",
  },
  {
    code_id:"5",
    codeGroup: "Dashboard",
    code: "Code-005",
    codeNameENG: "Dashboard Box 5",
    codeNameIND: "Kotak Dashboard 5",
  },
];



const GroupManagement = () => {
    const [selectedOption, setSelectedOption] = useState("");
    const tbRef = useRef(null);
    const [disabled, setDisabled] = useState(true);
    const [selectedCode, setSelectedCode] = useState({
        code_id: null,
    });
    const [formValues, setFormValues] = useState({
      codeNameENG: "",
      codeNameIND: "",
      codeGroup: "",
      code: "",
      codeType: "",
      usage:"",
      description:"",
      sortOrder:""
      });  

    const optionsHistory = {
      debugInvalidOptions: true,
      pagination: true,
      movableRows: false,
      resizableRows: false,
      index: "code_id",
      paginationSize: 15,
      rowHeight: 41,
      selectableRows: 1,
      footerElement: `<div id="footer-bottom" style="padding: 0 20px 0 0; text-align: right;">Total ${dataHistory.length || 0} Results</div>`,
    };

    const optionsAssign = {
        debugInvalidOptions: true,
        movableRows: false,
        resizableRows: false,
        index: "code_id",
        rowHeight: 41,
        selectableRows: 1,
        footerElement: `<div id="footer-bottom" style="padding: 0 20px 0 0; text-align: right;">Total ${dataHistory.length || 0} Results</div>`,
      };
      

    const handleRowSelected = useCallback((row) => {
      console.log("Row Selected", row);
      const rowData = row.getData(); 
      setSelectedCode((cur) => ({ ...cur, code_id: rowData.code_id }));
      setFormValues({
        codeNameENG: rowData.codeNameENG || "",
        codeNameIND: rowData.codeNameIND || "",
        codeGroup: rowData.codeGroup || "",
        code: rowData.code || "",
        codeType: rowData.codeType || "",
        usage: rowData.usage || "",
        description: rowData.description || "",
        sortOrder: rowData.sortOrder || "",
      });
      setDisabled(false); 
    }, []);
    
    const handleRowDeselected = useCallback((row) => {
      console.log("Deselected", row);
      setFormValues({
        codeNameENG: "",
        codeNameIND: "",
        codeGroup: "",
        code: "",
        codeType: "",
        usage:"",
        description:"",
        sortOrder:""
      });
      setDisabled(true);
    }, []);
    
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    };    
    const options = [
      { label: "Option 1", value: "option1" },
      { label: "Option 2", value: "option2" },
      { label: "Option 3", value: "option3" },
    ];
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
            onSearch={'test'}
            onReset={'test'}
            labelSelect={'Usage'}
            disableFiltering={true}
            >
                <Select options={options}>

                </Select>
            </Filtering>
          </ContainerCard>
        </section>
        <ContainerCard>
        <ReactTabulator
            data={dataHistory || []}
            columns={columnsHistory}
            layout={"fitColumns"}
            options={optionsHistory}
            onRef={(r) => {
              tbRef.current = r.current;
            }}
            events={{
              rowSelected: handleRowSelected,
              rowDeselected: handleRowDeselected,
              tableBuilt: () => {
                if (selectedCode?.code_id) {
                  const row = tbRef.current.getRow(selectedCode?.code_id);
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
            >
            </BoxLeft>
            </div>
            <ReactTabulator
                className="container-tabullator"
                data={dataHistory || []}
                columns={columnsHistory}
                layout={"fitColumns"}
                options={optionsAssign}
                onRef={(r) => {
                tbRef.current = r.current;
                }}
                events={{
                rowSelected: handleRowSelected,
                rowDeselected: handleRowDeselected,
                tableBuilt: () => {
                    if (selectedCode?.code_id) {
                    const row = tbRef.current.getRow(selectedCode?.code_id);
                    row && row.select();
                    }
                },
                }}
            />

        </ContainerCard>
      </div>
      <div className="flex-shrink-0 min-w-0">
        <ContainerSlide />
      </div>
      <div className="flex-1 min-w-0">
        <ContainerCard>
            <div className="mb-5"> 
            <Filtering
                placeholder="Group Name / Description"
                onSearch={'test'}
                onReset={'test'}
                labelSelect={'Position'}
                disableFiltering={true}
            >
                <Select options={options}></Select>
            </Filtering>
            </div>
            <ReactTabulator
                className="container-tabullator"
                data={dataHistory || []}
                columns={columnsHistory}
                layout={"fitColumns"}
                options={optionsAssign}
                onRef={(r) => {
                tbRef.current = r.current;
                }}
                events={{
                rowSelected: handleRowSelected,
                rowDeselected: handleRowDeselected,
                tableBuilt: () => {
                    if (selectedCode?.code_id) {
                    const row = tbRef.current.getRow(selectedCode?.code_id);
                    row && row.select();
                    }
                },
                }}
            />
        </ContainerCard>
      </div>
    </div>
    <ContainerCard>
    <div className="flex gap-4">
        <DetailForm
            label={"Code group"}
            value={formValues.description}
            onChange={handleInputChange}
            name={"description"}
            inputType={'text'}
            required={true}
            disabled={disabled}
        />
        <DetailForm
            label={"Usage"}
            value={formValues.description}
            onChange={handleInputChange}
            name={"usage"}
            inputType={'text'}
            required={true}
            disabled={disabled}
        />
        <DetailForm
            label={"Description"}
            value={formValues.description}
            onChange={handleInputChange}
            name={"description"}
            inputType={'text'}
            disabled={disabled}
        />
</div>
  
    </ContainerCard>
        </>
  );
};

export default GroupManagement;