import React from "react";
import Button from "../Button/Button";
import { useTranslation } from "react-i18next";

const ButtonGroup = ({
  onClickDelete,  
  onClickNew,
  onClickCancel,
  onClickRegist,
  onClickConfirm,
  isNewClicked, 
  cancelButtonState, 
  confirmButtonState, 
  deleteButtonState, 
  newButtonState}) => {
    const {t} = useTranslation();
  return (
    <div className="w-full flex flex-row items-center pt-[5px]">
      <div className="flex flex-row gap-[10px]">
        <Button label={t('cmn > confirm')} customButton="btn-search" disabled={confirmButtonState} onClick={onClickConfirm} />
        <Button label={t('cmn > cancel')} customButton="btn-danger"  disabled={cancelButtonState} onClick={onClickCancel} />
        <Button label={t('cmn > delete')} customButton="btn-danger" disabled={deleteButtonState} onClick={onClickDelete} />
        {/* <Button label={"New"} customButton="btn-search" disabled={newButtonState} onClick={onClickNew} /> */}

        {!isNewClicked && (
      <Button
        label={t('cmn > new')}
        customButton="btn-search"
        disabled={newButtonState}
        onClick={onClickNew}
      />
    )}
    
    {isNewClicked && (
      <Button
        label={t('cmn > register')}
        customButton="btn-search"
        disabled={newButtonState} 
        onClick={onClickRegist}
      />
    )}
        
      </div>
    </div>
  );
};

export default ButtonGroup;
