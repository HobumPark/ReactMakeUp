import React, { useCallback, useEffect, useRef, useState } from 'react';
import ContainerCard from '../../components/ContainerCard/ContainerCard';
import Filtering from '../../components/Filtering/filtering';
import { ReactTabulator } from 'react-tabulator';
import DetailForm from '../../components/DetailForm/DetailForm';
import LogList from '../../components/LogList/LogList';
import ButtonGroup from '../../components/ButtonGroup/ButtonGroup';
import NoticeMessage from "../../plugin/noticemessage/noticemessage"
import useUserMgt from '../../hooks/useUserMgt';
import useCommonCodes from '../../hooks/useCommonCodes';
import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';
import localeEn from 'air-datepicker/locale/en.js'; 
import { faL } from '@fortawesome/free-solid-svg-icons';
import Common from '../../utils/standard';
import { formatDateToDDMMYYYY, formatDateToMMDDYYYY } from '../../utils/date';

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
    title: "User ID",
    field: "account_id",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "Name",
    field: "name",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "Email",
    field: "email",
    widthGrow: 2,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "Phone No.",
    field: "phone_no",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: "Position",
    field: "position",
    widthGrow: 2,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
];

const UserManagement = () => {
  const tbRef = useRef(null);
  const [disabledForm, setDisabledForm] = useState(true);
  const [disabledId, setDisabledId] = useState(true);
  const [hasChangesUpdate, setHasChangesUpdate] = useState(false);
  const [hasChangesCreate, setHasChangesCreate] = useState(false);
  const [isRequired, setIsRequired] = useState(false);
  const hasChangesUpdateRef = useRef(hasChangesUpdate);
  const hasChangesCreateRef = useRef(hasChangesCreate);

  useEffect(() => {
    hasChangesUpdateRef.current = hasChangesUpdate;
    hasChangesCreateRef.current = hasChangesCreate;
    const optionsDate = {
      autoClose: true,
      locale: localeEn,
      position: 'top center',
      onSelect: (date) => {
        setFormValues((prevValues) => ({
          ...prevValues,
          birth: date.formattedDate , // Set the selected date
        }));
      },
    };
    new AirDatepicker('[name="birth"]', optionsDate);
  }, [hasChangesUpdate, hasChangesCreate]);

  const [formValues, setFormValues] = useState({
    account_id: '',
    email: '',
    phone_no: '',
    name: '',
    password: '',
    organization: '',
    birth: '',
    position: '',
    confirmation:'',
  });

  const emptyDetail = () => {
    setFormValues((prevValues) => ({
      ...prevValues,
      account_id: '',
      email: '',
      phone_no: '',
      name: '',
      password: '',
      confirmation:'',
      organization: '',
      birth: '',
      position: '',
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
  setIsRequired(false);
  emptyDetail();
  setDisabledForm(true);
  setDisabledId(true);
  setHasChangesUpdate(false);
  setSelectedUser({ id: null });
};

const createCallback = () => {
  enableInitialButtons();
  emptyDetail();
  setIsRequired(false);
  setDisabledForm(true);
  setDisabledId(true);
  setHasChangesCreate(false);
  setSelectedUser({ id: null });
};

const updateCallback = () => {
  enableInitialButtons();
  emptyDetail();
  setIsRequired(false);
  setDisabledForm(true);
  setDisabledId(true);
  setHasChangesUpdate(false);
};

  const [queryParams, setQueryParams] = useState("");
  const [selectedUser, setSelectedUser] = useState({
    id: null,
  });
  const [optionParams, setOptionParams] = useState("upper-code=021&upper-code=001&upper-code=ORG");
  const { usersListData, detailUserData, deleteUser, detailUserError, createUser, updateUser} = useUserMgt({
    userID: selectedUser?.id,
    queryParams: queryParams  || "deletion=001002",
    onUpdateSuccess: updateCallback,
    onDeleteSuccess: reloadCallback,
    onCreateSuccess: (responseData) => {
      createCallback();
      const newUserId = responseData.id;
      tbRef.current.getRow(newUserId);   
    },

  });

  useEffect(() => {
    if (detailUserError) {
      new NoticeMessage('Failed to load data. Please reload the page.')
    }
  }, [detailUserError]);
  
  const { commonListData } = useCommonCodes({ optionParams });
  const optionsRadioFilter = commonListData?.["001"]
  ? [
      { value: "All", label: "All", code: "All" }, 
      ...commonListData["001"].code.map((code, index) => ({
        value: code,
        label: commonListData["001"].name[index],
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
    footerElement: `<div id="footer-bottom" style="padding: 0 20px 0 0; text-align: right;">Total ${usersListData?.length || 0} Results</div>`,
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
        setSelectedUser({
          id: rowData.id,  
        });
        setDisabledForm(false);
        setDisabledId(true);
        setHasChangesUpdate(false);
        setIsNewClicked(false);
      });
    } else {
      const rowData = row.getData();
      setSelectedUser({
        id: rowData.id,  
      });
      setDisabledForm(false);
      setDisabledId(true);
      enableUPDATEButtons();
      setIsNewClicked(false);
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

    if (selectedUser?.account_id){
      setHasChangesUpdate(true);
    }
  };

  const handleSearch = useCallback(
    (inputVal = null, radioVal = null) => {
      const resultInput = inputVal ? `input=${inputVal}` : "";
      const resultRadio = radioVal && radioVal !== "All" ? `&deletion=${radioVal}` : `&deletion=001002`;
      const result = resultInput + resultRadio;
      setQueryParams(result); 
    },
    []
  );


  const handleNewButtonClick = () => {
    if(hasChangesCreate || hasChangesUpdate){
      const message = new NoticeMessage(
        "Changes you made may not be saved, would you like to continue?",
        {
          mode: "confirm",
        }
      );
      message.confirmClicked().then(() => {
        setIsRequired(true);
        tbRef.current.deselectRow();
        emptyDetail();
        setIsNewClicked(true);
        setDisabledId(false);
        enableRegisterButtons();
        setSelectedUser({ id: null });
        setDisabledForm(false);
        setHasChangesUpdate(false);
      });
    } else{
      tbRef.current.deselectRow();
      setIsRequired(true)
      emptyDetail();
      setIsNewClicked(true);
      setDisabledId(false);
      enableRegisterButtons();
      setSelectedUser({ id: null });
      setDisabledForm(false); 
      setHasChangesUpdate(false);
    }
  };
  const handleRegistButtonClick = () => {

    const updatedFormValues = {
      ...formValues,
      no_hash_password: formValues.password, 
      password: Common.SHA256(formValues.password), 
      birth: formatDateToDDMMYYYY(formValues.birth)
    };
      createUser(updatedFormValues);
  }

  const handleConfirmButtonClick = () => {
    const updatedFormValues = {
      ...formValues,
      no_hash_password: formValues?.password, 
      password: Common.SHA256(formValues.password), 
      birth: formatDateToMMDDYYYY(formValues.birth)
    };
    
    updateUser(updatedFormValues);

  }
  
  const handleCancelButtonClick = () => {
    if (hasChangesUpdate){
      const message = new NoticeMessage(
        "Changes you made may not be saved, would you like to continue?",
        {
          mode: "confirm",
        }
      );
      message.confirmClicked().then(() => {
        setDisabledForm(false);
        setDisabledId(true);
        setFormValues({
          id: detailUserData.id,
          account_id: detailUserData.account_id,
          email: detailUserData.email,
          phone_no: detailUserData.phone_no,
          name: detailUserData.name,
          password: '', 
          organization: detailUserData.organization,
          birth: detailUserData.dob,
          position: detailUserData.position,
        });
        setHasChangesUpdate(false);
      });
    }
    
    else if(isNewClicked){
      if(hasChangesCreate){
      const message = new NoticeMessage(
        "Changes you made may not be saved, would you like to continue?",
        {
          mode: "confirm",
        }
      );
      message.confirmClicked().then(() => {
        setIsRequired(false);
        emptyDetail();
        setIsNewClicked(false);
        setDisabledForm(true);
        setDisabledId(true);
        enableInitialButtons();
        setHasChangesCreate(false);
      });
    }
    else{
      setIsRequired(false);
      emptyDetail();
      setIsNewClicked(false);
      setDisabledForm(true);
      setDisabledId(true);
      enableInitialButtons();
      setHasChangesCreate(false);
    }
  }   else {
    reloadCallback()
  }
  };

  const handleDeleteButtonClick = () => {
    
    const message = new NoticeMessage(
      "Are you sure you want to delete this data?",
      {
        mode: "confirm",
      }
    );
    message.confirmClicked().then(() => {
      deleteUser(selectedUser?.id); 
    });
    
  };


  useEffect(() => {
  }, [selectedUser, formValues]);

  useEffect(() => {
    if (detailUserData) {
      setFormValues({
        id: detailUserData.id,
        account_id: detailUserData.account_id,
        email: detailUserData.email,
        phone_no: detailUserData.phone_no,
        name: detailUserData.name,
        organization: detailUserData.organization,
        birth: formatDateToDDMMYYYY(detailUserData.birth),
        position: detailUserData.position,
      });
    }
  }, [detailUserData]); 

  const logs = detailUserData
  ? [
      { label: "Registered By", value: detailUserData.registered_by },
      { label: "Registered Time", value: detailUserData.registered_time },
      { label: "Updated By", value: detailUserData.updated_by },
      { label: "Updated Time", value: detailUserData.updated_time },
    ]
  : [];
  return (
    <>
        <section className='wrap'>
          <div className='header-title'>
            <h3>System Management</h3>
            <h3>&gt;</h3>
            <h3>User Management</h3>
          </div>

          <ContainerCard justifyContent='flex-end'>
            <Filtering 
            placeholder="ID / Name / Email / Phone No."
            onSearch={handleSearch}
            optionsRadioFilter={optionsRadioFilter}
            />
 
          </ContainerCard>
        </section>
        <ContainerCard>
        <ReactTabulator
            className="container-tabullator"
            data={usersListData  || []}
            columns={columnsHistory}
            layout={"fitColumns"}
            options={optionsTabulator}
            onRef={(r) => {
              tbRef.current = r.current;
            }}
            events={{
              rowSelected: handleRowSelected,
              tableBuilt: () => {
                if (selectedUser?.id) {
                  const row = tbRef.current.getRow(selectedUser?.id);
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
                label={"ID"}
                value={formValues.account_id || ''}
                inputType={"text"}
                onChange={handleInputChange}
                name={"account_id"}
                disabled={disabledId}
                required={true}
              />
              <DetailForm
                label={"E-mail"}
                value={formValues.email || ''}
                inputType={"text"}
                onChange={handleInputChange}
                name={"email"}
                disabled={disabledForm}
              />
              <DetailForm
                label={"Phone No."}
                value={formValues.phone_no || ''}
                inputType={"number"}
                onChange={handleInputChange}
                name={"phone_no"}
                disabled={disabledForm}
              />
              <DetailForm
                label={"Name"}
                value={formValues.name || ''}
                inputType={"text"}
                onChange={handleInputChange}
                name={"name"}
                disabled={disabledForm}
                required={true}
              />
              <DetailForm
                label={"New Password"}
                value={formValues.password || ''} 
                inputType={"password"}
                onChange={handleInputChange}
                name={"password"}
                disabled={disabledForm}
                required={isRequired}
              />
              <DetailForm
                label={"Organization"}
                value={formValues.organization || ''}
                inputType={"select"}
                onChange={handleInputChange}
                name={"organization"}
                disabled={disabledForm}
                required={true}
                optionSelect={
                      commonListData?.["ORG"]
                        ? [
                            { value: "", label: ""}, 
                            ...commonListData["ORG"].code.map((code, index) => ({
                              value: code,
                              label: commonListData["ORG"].name[index],
                            })),
                          ]
                        : []
                    }
              />
              <DetailForm
                label={"Date of Birth"}
                value={formValues.birth || ''}
                inputType={"text"}
                onChange={handleInputChange}
                name={"birth"}
                disabled={disabledForm}
                required={true}
              />
              <DetailForm
                label={"Confirm Password"}
                value={formValues.confirmation}
                inputType={"password"}
                onChange={handleInputChange}
                name={"confirmation"}
                disabled={disabledForm}
                required={isRequired}
              />
              <DetailForm
                label={"Position"}
                value={formValues.position || ''}
                inputType={"select"}
                onChange={handleInputChange}
                name={"position"}
                disabled={disabledForm}
                optionSelect={
                      commonListData?.["021"]
                        ? [
                            { value: "", label: ""}, 
                            ...commonListData["021"].code.map((code, index) => ({
                              value: code,
                              label: commonListData["021"].name[index],
                            })),
                          ]
                        : []
                    }
              />
            </div>
        <hr className="border-t border-gray-300" />
        <div className="flex items-center justify-between gap-4 w-full">
        <div className="flex-1">
        {disabledForm ? null : <LogList  logs={logs}/>}
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

export default UserManagement;