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
    title: "Code Group",
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



const CodeManagement = () => {
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
    <div className='wrapper'>
      <Sidebar />
        <div className='article-content-right'>
        <section className='wrap'>
          <div className='header-title'>
            <h3>SYSTEM</h3>
            <h3>&gt;</h3>
            <h3>Code Management</h3>
          </div>

          <ContainerCard>
            <Filtering 
            placeholder="Group Code / Code Name / Description"
            onSearch={'test'}
            onReset={'test'}
            labelSelect={'Code Group'}
            >
                <Select options={options}>

                </Select>
            </Filtering>
          </ContainerCard>
        </section>
        <ContainerCard>
        <ReactTabulator
            className="container-tabullator"
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
        <ContainerCard>
        <div className="flex w-full flex-col gap-[10px]">
        <div className="grid grid-cols-3 grid-rows-3 gap-x-[40px] gap-y-[10px] auto-cols-fr">
             <DetailForm
                label={"Code Type"}
                value={formValues.codeType}
                inputType={'select'}
                onChange={handleInputChange}
                name={"codeType"}
                disabled={disabled}/>
              <DetailForm
                label={"Code Name (ENG)"}
                value={formValues.codeNameENG}
                inputType={'text'}
                onChange={handleInputChange}
                name={"codeNameENG"}
                required={true}
                disabled={disabled}/>
              <DetailForm
                label={"Sort Order"}
                value={formValues.sortOrder}
                inputType={'text'}
                onChange={handleInputChange}
                name={"sortOrder"}
                disabled={disabled}/>
               <DetailForm
                label={"Code Group"}
                value={formValues.codeGroup}
                inputType={'text'}
                onChange={handleInputChange}
                name={"codeGroup"}
                disabled={disabled}/>
              <DetailForm
                label={"Code Name (IND)"}
                value={formValues.codeNameIND}
                inputType={'text'}
                required={true}
                onChange={handleInputChange}
                name={"codeNameIND"}
                disabled={disabled}/>
              <DetailForm
                label={"Description"}
                value={formValues.description}
                onChange={handleInputChange}
                name={"description"}
                inputType={'textarea'}
                disabled={disabled}/>
              <DetailForm
                label={"Code"}
                value={formValues.code}
                onChange={handleInputChange}
                name={"code"}
                required={true}
                inputType={'text'}
                disabled={disabled}/>
              <DetailForm
                label={"Usage"}
                value={'121212'}
                inputType={'select'}
                onChange={handleInputChange}
                disabled={disabled}/>
            </div>
        <hr className="border-t border-gray-300" />
        <div className="flex items-center justify-between gap-4 w-full">
        <div className="flex-1">
        {disabled ? null : <LogList />}
        </div>

        <div className="flex-none">
          <ButtonGroup />
        </div>
      </div>

        </div>
        
        </ContainerCard>

      
        </div>
    </div>
  );
};

export default CodeManagement;