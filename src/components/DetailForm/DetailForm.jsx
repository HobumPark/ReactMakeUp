import React, { useState } from "react";
import GeneralInput from "../GeneralInput/GeneralInput";
import PasswordInput from "../PasswordInput/PasswordInput";
import Select from "../Select/Select";
import TextArea from "../TextArea/TextArea";

const DetailForm = ({ label, inputType, value, className, disabled, onChange, optionSelect = [], required,name, maxLength, readonly  }) => {
  const [selectedOption, setSelectedOption] = useState("");

  return (
    <div className={`flex items-center gap-x-4 ${className}`} >
      <span className="text-body-2 text-au-neutral-4 py-[9px] w-70 lg:w-50 text-[14px]">
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
            className={'resize-y w-full'} 
            disabled={disabled}
            value={value}
            name={name}
            onChange={onChange} />
        ) : (
        <GeneralInput
            type={inputType}
            name={name}
            value={value}
            required={required}
            customInput={'flex flex-col gap-2 w-full'}
            disabled={disabled}
            onChange={onChange}  
            maxLength={maxLength} 
            readonly={readonly}
        />
        )}

    </div>
  );
};

export default DetailForm;

