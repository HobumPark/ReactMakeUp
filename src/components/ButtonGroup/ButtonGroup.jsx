import React from "react";
import Button from "../Button/Button";

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
  return (
    <div className="w-full flex flex-row items-center pt-[5px]">
      <div className="flex flex-row gap-[10px]">
        <Button label={"Confirm"} customButton="btn-search" disabled={confirmButtonState} onClick={onClickConfirm} />
        <Button label={"Cancel"} customButton="btn-danger"  disabled={cancelButtonState} onClick={onClickCancel} />
        <Button label={"Delete"} customButton="btn-danger" disabled={deleteButtonState} onClick={onClickDelete} />
        {/* <Button label={"New"} customButton="btn-search" disabled={newButtonState} onClick={onClickNew} /> */}

        {!isNewClicked && (
      <Button
        label="New"
        customButton="btn-search"
        disabled={newButtonState}
        onClick={onClickNew}
      />
    )}
    
    {isNewClicked && (
      <Button
        label="Register"
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
