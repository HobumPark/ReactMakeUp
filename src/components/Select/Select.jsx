import React from "react";

const Select = ({customWidthSelect, options, label, name, value, onChange, disabled, className, disableEmptyOption }) => {
  return (
    <div className= {`${customWidthSelect} flex flex-col gap-2 w-full`}>
      {/* Select Dropdown */}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`select ${className}`}
        disabled={disabled}
      >
        {options.map((option, index) => (
          <option
            key={index}
            value={option.value}
            disabled={(option.value === "" && disableEmptyOption)  || option.disabled } 
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
