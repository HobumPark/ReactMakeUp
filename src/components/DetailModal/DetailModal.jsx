import React, { useEffect, useState } from "react";
import GeneralInput from "../GeneralInput/GeneralInput";
import PasswordInput from "../PasswordInput/PasswordInput";
import Select from "../Select/Select";
import 'air-datepicker/air-datepicker.css';
import localeEn from 'air-datepicker/locale/en.js'; 
import AirDatepicker from "air-datepicker";

const DetailModal = ({ label, inputType, value, className, disabled, onChange, optionSelect = [], required,name, maxLength, readonly, isDob, modalType, pattern }) => {

  const [selectedOption, setSelectedOption] = useState("");


  return (
    <div className={`flex flex-col gap-2 m-1 ${className}` }>
    <span className={`text-base ${modalType === "forgot" ? "font-bold" : ""} text-[#6b7280]`}>
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
          className= {modalType === 'forgot' ? 'w-full input-modal-forgot' : 'w-full'}
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
          inputFormStyle={modalType === 'forgot' ? 'input-modal-forgot' : ''}
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
          pattern={pattern}
          inputFormStyle= {modalType === 'forgot' ? 'input-modal-forgot' : ''}
        />
      )}
    </div>

  );
};

export default DetailModal;

