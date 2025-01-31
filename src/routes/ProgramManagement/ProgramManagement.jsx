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
    title: "Program Group",
    field: "programGroup",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "Program",
    field: "program",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "Program Name (ENG)",
    field: "programNameENG",
    widthGrow: 2,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "Program Name (IND)",
    field: "programNameIND",
    widthGrow: 2,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "Sort Order",
    field: "sortOrder",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
];

const dataHistory = [
  {
    program_id:'1',
    programGroup: "Dashboard",
    program: "Dashboard-Box",
    programNameENG: "Dashboard-Box 1",
    programNameIND: "Kotak Dashboard 1",
    sortOrder: 1,
  },
  {
    program_id:'2',
    programGroup: "Dashboard",
    program: "Dashboard-Box",
    programNameENG: "Dashboard-Box 2",
    programNameIND: "Kotak Dashboard 2",
    sortOrder: 2,
  },
  {
    program_id:'3',
    programGroup: "Dashboard",
    program: "Dashboard-Box",
    programNameENG: "Dashboard-Box 3",
    programNameIND: "Kotak Dashboard 3",
    sortOrder: 3,
  },
  {
    program_id:'4',
    programGroup: "Dashboard",
    program: "Dashboard-Box",
    programNameENG: "Dashboard-Box 4",
    programNameIND: "Kotak Dashboard 4",
    sortOrder: 4,
  },
  {
    program_id:'5',
    programGroup: "Dashboard",
    program: "Dashboard-Box",
    programNameENG: "Dashboard-Box 5",
    programNameIND: "Kotak Dashboard 5",
    sortOrder: 5,
  },
];


const ProgramManagement = () => {
  const tbRef = useRef(null);
  const [disabled, setDisabled] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState({
      program_id: null,
  });
  const [formValues, setFormValues] = useState({
    programNameENG: "",
    programNameIND: "",
    programGroup: "",
    program: "",
    programType: "",
    urlLink:"",
    usage:"",
    description:"",
    sortOrder:""
    });

    const optionsHistory = {
      debugInvalidOptions: true,
      pagination: true,
      movableRows: false,
      resizableRows: false,
      index: "program_id",
      paginationSize: 15,
      rowHeight: 41,
      selectableRows: 1,
      footerElement: `<div id="footer-bottom" style="padding: 0 20px 0 0; text-align: right;">Total ${dataHistory.length || 0} Results</div>`,
    };



    const handleRowSelected = useCallback((row) => {
      console.log("Row Selected", row);
      const rowData = row.getData(); 
      setSelectedProgram((cur) => ({ ...cur, program_id: rowData.program_id }));
      setFormValues({
        programNameENG: rowData.programNameENG || "",
        programNameIND: rowData.programNameIND || "",
        programGroup: rowData.programGroup || "",
        program: rowData.program || "",
        programType: rowData.programType || "",
        urlLink: rowData.urlLink || "",
        usage: rowData.usage || "",
        description: rowData.description || "",
        sortOrder: rowData.sortOrder || "",
      });
      setDisabled(false); 
    }, []);
    
    const handleRowDeselected = useCallback((row) => {
      console.log("Deselected", row);
      setFormValues({
        programNameENG: "",
        programNameIND: "",
        programGroup: "",
        program: "",
        programType: "",
        urlLink: "",
        usage: "",
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
    const [selectedOption, setSelectedOption] = useState("");
    
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
            <h3>Program Management</h3>
          </div>

          <ContainerCard justifyContent='flex-end'>
            <Filtering 
            placeholder="Program / Program Name / URL"
            onSearch={'test'}
            onReset={'test'}
            labelSelect={'Program Group'}
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
                if (selectedProgram?.program_id) {
                  const row = tbRef.current.getRow(selectedProgram?.program_id);
                  row && row.select();
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
                disabled={disabled}/>
              <DetailForm
                label={"Program Name (ENG)"}
                value={formValues.programNameENG}
                inputType={'text'}
                onChange={handleInputChange}
                required={true}
                name={"programNameENG"}
                disabled={disabled}/>
              <DetailForm
                label={"Usage"}
                value={'121212'}
                inputType={'select'}
                onChange={handleInputChange}
                disabled={disabled}/>
               <DetailForm
                label={"Program Group"}
                value={formValues.programGroup}
                inputType={'text'}
                onChange={handleInputChange}
                required={true}
                name={"programGroup"}
                disabled={disabled}/>
              <DetailForm
                label={"Program Name (IND)"}
                value={formValues.programNameIND}
                inputType={'text'}
                onChange={handleInputChange}
                name={"prpgramNameIND"}
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
                label={"Program"}
                value={formValues.program}
                inputType={'text'}
                onChange={handleInputChange}
                name={"program"}
                disabled={disabled}
                />
              <DetailForm
                label={"URL Link"}
                value={formValues.urlLink}
                inputType={'text'}
                onChange={handleInputChange}
                name={"urlLink"}
                disabled={disabled}/>
              <DetailForm
                label={"Description"}
                value={formValues.description}
                onChange={handleInputChange}
                name={"description"}
                inputType={'text'}
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

export default ProgramManagement;