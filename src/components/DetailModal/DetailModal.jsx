import React, { useState } from "react";
import GeneralInput from "../GeneralInput/GeneralInput";
import PasswordInput from "../PasswordInput/PasswordInput";
import Select from "../Select/Select";

const DetailModal = ({ label, inputType, value, className, disabled, onChange, optionSelect = [], required,name, maxLength, readonly, isDob }) => {
  const [selectedOption, setSelectedOption] = useState("");

  return (
<div className={`flex flex-col gap-2 m-1 ${className}` }>
  <span className="text-base font-bold text-[#6b7280]">
    {label}
    {required && <span className="text-[#e31616]">*</span>}
  </span>

  {inputType === "select" ? (
    <Select
      options={optionSelect}
      value={value}
      name={name}
      disabled={disabled}
      onChange={onChange}
      disableEmptyOption={true}
      className="w-full input-modal-forgot"
    />
  ) : inputType === "password" ? (
    <PasswordInput
      name={name}
      value={value}
      required={required}
      customInput="flex flex-col gap-2 w-full"
      disabled={disabled}
      onChange={onChange}
      maxLength={maxLength}
      readonly={readonly}
      inputFormStyle='input-modal-forgot'
    />
  ) : (
    <GeneralInput
      type={inputType}
      name={name}
      value={value}
      required={required}
      customInput="flex flex-col gap-2 w-full " 
      disabled={disabled}
      onChange={onChange}
      maxLength={maxLength}
      readonly={readonly}
      isDob={isDob}
      inputFormStyle={'input-modal-forgot'}
    />
  )}
</div>

  );
};

export default DetailModal;

