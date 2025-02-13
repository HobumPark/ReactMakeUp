import React, { useState } from "react";
import GeneralInput from "../GeneralInput/GeneralInput";
import PasswordInput from "../PasswordInput/PasswordInput";
import Select from "../Select/Select";
import TextArea from "../TextArea/TextArea";

const DetailForm = ({ label, inputType, value, className, disabled, onChange, optionSelect = [], required,name, maxLength, readonly, pattern, formRef }) => {
  const [selectedOption, setSelectedOption] = useState("");
  return (
    <div className={`flex items-start gap-x-4 ${className}`} >
      <span className="text-body-2 text-au-neutral-4  w-70 lg:w-50 text-[14px]">
        {label}
        {required && <span className="text-[#e31616]">*</span>}
      </span>
      
      { inputType === "select" ? (
        <Select
            options={optionSelect}
            value={value}
            name={name}
            disabled={disabled}
            onChange={onChange}
            disableEmptyOption={true}
        />
        ) : inputType === "textarea"?(
            <TextArea 
            rows={10} 
            className={'w-full h-full'} 
            disabled={disabled}
            value={value}
            name={name}
            onChange={onChange} />
        ) : (
        <GeneralInput
            ref={formRef}
            type={inputType}
            name={name}
            value={value}
            required={required}
            customInput={'flex flex-col gap-2 w-full'}
            disabled={disabled}
            onChange={onChange}  
            maxLength={maxLength} 
            readonly={readonly}
            pattern={pattern}
        />
        )}
    </div>
  );
};

export default DetailForm;

