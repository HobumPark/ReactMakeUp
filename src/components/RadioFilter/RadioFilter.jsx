import React from "react";

const RadioFilter = ({ name, label, options, defaultValue, onRadioChange }) => {
  const handleRadioChange = (event) => {
    if (onRadioChange) {
      onRadioChange(event);  
    }
  };

  return (
    <div className="types" data-type="radio" data-name={name} data-value={label}>
      <span className="type_name">{label}</span>
      <span className="filter_elements">
        {options.map((option, index) => (
          <label key={index} className="custom-radio">
            <input
              className="el_contents radio-costum"
              type="radio"
              name={name}
              value={option.value}
              data-code={option.code}
              defaultChecked={option.value === defaultValue} 
              onChange={handleRadioChange} 
            />
            <span className="radio-mark"></span>
            <span className="filtering_text">{option.label}</span>
          </label>
        ))}
      </span>
    </div>
  );
};

export default RadioFilter;
