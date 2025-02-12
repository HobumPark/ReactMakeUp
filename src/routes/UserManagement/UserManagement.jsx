import React, { useCallback, useEffect, useRef, useState } from 'react';
import ContainerCard from '../../components/ContainerCard/ContainerCard';
import Filtering from '../../components/Filtering/Filtering';
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
import localeKo from 'air-datepicker/locale/ko.js'; 
import localeId from 'air-datepicker/locale/id.js'; 
import { faL } from '@fortawesome/free-solid-svg-icons';
import Common from '../../utils/standard';
import { formatDateToDDMMYYYY, formatDateToMMDDYYYY } from '../../utils/date';
import { useTranslation } from 'react-i18next';


const UserManagement = () => {
  const { t, i18n } = useTranslation();
  const storedTranslations = JSON.parse(localStorage.getItem('translations'));

// tabulator top
const columnsHistory = [
  {
    title: t('211002'),
    formatter: "rownum",
    width: 65,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: t('user > id'),
    field: "account_id",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title:t('user > name'),
    field: "name",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title:t('user > email'),
    field: "email",
    widthGrow: 2,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title:t('user > phone no'),
    field: "phone_no",
    widthGrow: 1,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
  {
    title: t('021'),
    field: "position",
    widthGrow: 2,
    hozAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    resizable: false,
  },
];


  const tbRef = useRef(null);
  const [disabledForm, setDisabledForm] = useState(true);
  const [disabledId, setDisabledId] = useState(true);
  const [hasChangesUpdate, setHasChangesUpdate] = useState(false);
  const [hasChangesCreate, setHasChangesCreate] = useState(false);
  const [isRequired, setIsRequired] = useState(false);
  const hasChangesUpdateRef = useRef(hasChangesUpdate);
  const hasChangesCreateRef = useRef(hasChangesCreate);
  const [newId, setNewId] = useState('');

  useEffect(() => {
    let locale;
    if (i18n.language === "eng") {
      locale = localeEn;
    } else if (i18n.language === "ind") {
      locale = localeId;
    } else {
      locale = localeKo; 
    }

    const optionsDate = {
      autoClose: true,
      locale: locale,
      position: "top center",
      onSelect: (date) => {
        setFormValues((prevValues) => ({
          ...prevValues,
          birth: date.formattedDate,
        }));
      },
    };

    const datepicker = new AirDatepicker('[name="birth"]', optionsDate);

    return () => {
      datepicker.destroy();
    };
  }, [i18n.language]);

  useEffect(() => {
    hasChangesUpdateRef.current = hasChangesUpdate;
    hasChangesCreateRef.current = hasChangesCreate;
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
  enableUPDATEButtons();
  setIsRequired(false);
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
    onUpdateSuccess: (responseData) =>{
      updateCallback(); 
    } ,
    onDeleteSuccess: () => {
      enableInitialButtons();
      tbRef.current.deselectRow();
      setIsRequired(false);
      emptyDetail();
      setDisabledForm(true);
      setDisabledId(true);
      setHasChangesUpdate(false);
      setSelectedUser({ id: null });
    },
    onCreateSuccess: (responseData) => {
      createCallback();
      const newUserId = responseData.id;
      setNewId(newUserId); 
    },

  });

  useEffect(() => {
    if (detailUserError) {
      new NoticeMessage(t('msg > load data fail'))
    }
  }, [detailUserError]);
  
  const { commonListData } = useCommonCodes({ optionParams });
  const optionsRadioFilter = commonListData?.["001"]
  ? [
      { value: "All", label: t('cmn > all'), code: "All" }, 
      ...commonListData["001"].code.map((code, index) => ({
        value: code,
        label: commonListData["001"].name[index],
        code: code,
      })),
    ]
  : [];
  const languageTabulator = () => {
    let datalanguage = {
      pagination: {
        first: t('cmn > first page'), //text for the first page button
        first_title:t('cmn > first page'), //tooltip text for the first page button
        last:t('cmn > last page'),
        last_title: t('cmn > last page'),
        prev: t('cmn > page before'),
        prev_title: t('cmn > page before'),
        next: t('cmn > next page'),
        next_title: t('cmn > next page'),
      },
    }
    return datalanguage
  }
  
  const optionsTabulator = {
    debugInvalidOptions: true,
    pagination: true,
    movableRows: false,
    resizableRows: false,
    index: "id",
    locale: "ko",
    langs: {
      ko: languageTabulator(),
    },
    paginationSize: 10,
    selectableRows: 1,
    rowHeight: 41,
    footerElement: `<div id="footer-bottom" style="padding: 0 20px 0 0; text-align: right;">${storedTranslations?.['cmn > total']} ${usersListData?.length || 0} ${storedTranslations?.['cmn > results']}</div>`,
    selectableRowsCheck: (row) => {
      return !row.getElement().classList.contains("tabulator-selected");
    },
  };
  
  const handleRowSelected = useCallback((row) => {
    if(hasChangesCreateRef.current || hasChangesUpdateRef.current){
      const message = new NoticeMessage(
        t('msg > flush confirm'),
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
        t('msg > flush confirm'),
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
        t('msg > flush confirm'),
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
        t('msg > flush confirm'),
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
      t('msg > delete confirm'),
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
      { label: t('cmn > registered by'), value: detailUserData.registered_by },
      { label: t('cmn > registered time'), value: detailUserData.registered_time },
      { label: t('cmn > updated by'), value: detailUserData.updated_by },
      { label: t('cmn > updated time'), value: detailUserData.updated_time },
    ]
  : [];
  
  return (
    <>
        <section className='wrap'>
          <div className='header-title'>
            <h3>{t('SYSTEM')}</h3>
            <h3>&gt;</h3>
            <h3>{t('SYSTEM-USER')}</h3>
          </div>

          <ContainerCard justifyContent='flex-end'>
            <Filtering 
            placeholder={t('cmn > id') + ' / ' + t('user > name') + ' / ' + t('user > email') + ' / ' + t('user > phone no')}
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
                } else if (newId){
                    const row = tbRef.current.getRow(newId);
                    tbRef.current.scrollToRow(row, "bottom", true);
                    tbRef.current.selectRow(newId);
              }
              }
            }}
          />
        </ContainerCard>
        <ContainerCard>
        <div className="flex w-full flex-col gap-[10px]">
            <div className="grid grid-cols-3 gap-x-[40px] gap-y-[10px]">
              <DetailForm
                label={t('profile > id')}
                value={formValues.account_id || ''}
                inputType={"text"}
                onChange={handleInputChange}
                name={"account_id"}
                disabled={disabledId}
                required={true}
              />
              <DetailForm
                label={t('profile > email')}
                value={formValues.email || ''}
                inputType={"text"}
                onChange={handleInputChange}
                name={"email"}
                disabled={disabledForm}
              />
              <DetailForm
                label={t('profile > phone')}
                value={formValues.phone_no || ''}
                inputType={"text"}
                pattern={/^[0-9]*$/} 
                onChange={handleInputChange}
                name={"phone_no"}
                disabled={disabledForm}
              />
              <DetailForm
                label={t('profile > name')}
                value={formValues.name || ''}
                inputType={"text"}
                onChange={handleInputChange}
                name={"name"}
                disabled={disabledForm}
                required={true}
              />
              <DetailForm
                label={t('profile > new password')}
                value={formValues.password || ''} 
                inputType={"password"}
                onChange={handleInputChange}
                name={"password"}
                maxLength={20}
                disabled={disabledForm}
                required={isRequired}
              />
              <DetailForm
                label={t('user > organization')}
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
                label={t('profile > birth')}
                value={formValues.birth || ''}
                inputType={"text"}
                onChange={handleInputChange}
                name={"birth"}
                disabled={disabledForm}
                required={true}
              />
              <DetailForm
                label={t('profile > confirm password')}
                value={formValues.confirmation}
                inputType={"password"}
                onChange={handleInputChange}
                name={"confirmation"}
                disabled={disabledForm}
                required={isRequired}
                maxLength={20}
              />
              <DetailForm
                label={t('021')}
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