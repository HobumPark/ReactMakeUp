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
import useCodeMgt from '../../hooks/useCodeMgt';


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
    formatter: function (cell, formatterParams, onRendered) {
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
    formatter: function (cell, formatterParams, onRendered) {
      const data = cell.getRow().getData();
      return data.lower_code
        ? "　└　" + cell.getValue()
        : cell.getValue();
    },
  },
];



const CodeManagement = () => {
    const tbRef = useRef(null);
    const [disabled, setDisabled] = useState(true);
    const [queryParams, setQueryParams] = useState("");
    const [selectedCode, setSelectedCode] = useState({
        id: null,
    });

    const { codeListData } = useCodeMgt({
      codeID: selectedCode?.id,
      queryParams: queryParams  || "deletion=001002"
  
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
      console.log("Row Selected", row);
      const rowData = row.getData(); 
      setSelectedCode((cur) => ({ ...cur, id: rowData.id }));
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
        <div className="grid grid-cols-3 gap-4 items-center">
        <DetailForm label="Code Type" value={formValues.codeType} inputType="select" onChange={handleInputChange} name="codeType" disabled={disabled} />
        <DetailForm label="Code Name (ENG)" value={formValues.codeNameENG} inputType="text" onChange={handleInputChange} name="codeNameENG" disabled={disabled} />
        <DetailForm label="Sort Order" value={formValues.sortOrder} inputType="text" onChange={handleInputChange} name="sortOrder" disabled={disabled} />
        <DetailForm label="Group Code" value={formValues.codeGroup} inputType="text" onChange={handleInputChange} name="codeGroup" disabled={disabled} />
        <DetailForm label="Code Name (IND)" value={formValues.codeNameIND} inputType="text" onChange={handleInputChange} name="codeNameIND" disabled={disabled} />
        <DetailForm label="Description" value={formValues.description} inputType="textarea" onChange={handleInputChange} name="description" disabled={disabled} className="row-span-2" />
        <DetailForm label="Code" value={formValues.code} inputType="text" onChange={handleInputChange} name="code" required={true} disabled={disabled} />
        <DetailForm label="Usage" value={formValues.usage} inputType="select" onChange={handleInputChange} name="usage" disabled={disabled} />
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
        </>
  );
};

export default CodeManagement;