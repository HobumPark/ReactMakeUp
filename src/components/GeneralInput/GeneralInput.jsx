import React, {
  useRef,
  forwardRef,
  useState,
  useEffect,
  useImperativeHandle,
} from "react";
import calendar from "../../assets/icon/calendar.png";
import searchIcon from "../../assets/icon/icon-search.svg"; // Pastikan pathnya benar

const GeneralInput = forwardRef(
  (
    { 
      customInput, 
      inputFormStyle,
      type, 
      placeholder, 
      readonly,
      value,
      id,
      name,
      maxLength,
      pattern = "",
      rightIconStyle,
      rightIcon, 
      disabled,
      isDob,
      isSearch,
      onKeyUp = () => {},
      onChange = () => {},
    }, ref) => {
  const inputRef = useRef();
  
  const [inputValue, setInputValue] = useState(value);
  const handleInputChange = (event) => {
    const { value } = event.target;
  
    if (pattern) {
      const regex = new RegExp(pattern); 
      if (regex.test(value)) {
        setInputValue(value);  
      }else{
        return;
      }
    } else {
      setInputValue(value);  
    }
    
    onChange(event);  
  };
  

  useEffect(() => {
    const val = value || "";
    setInputValue(val);
  }, [value]);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    empty: () => setInputValue(""),
  }));

  return (
    <>
      {isDob ? (
        <div className="relative w-full">
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            className={`input pl-4 pr-10 w-full ${inputFormStyle}`}
            value={inputValue}
            id={id}
            maxLength={maxLength}
            disabled={disabled}
            onKeyUp={onKeyUp}
            name={name}
            onChange={handleInputChange}
          />
          <img
            src={calendar}
            alt="icon"
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          />
        </div>
      ) : isSearch ? ( 
        <div className={`relative ${customInput}`}>
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            className={`input pl-4 pr-10 w-full ${inputFormStyle}`}
            value={inputValue}
            id={id}
            maxLength={maxLength}
            disabled={disabled}
            onKeyUp={onKeyUp}
            name={name}
            onChange={handleInputChange}
          />
          <img
            src={searchIcon} 
            alt="search icon"
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          />
        </div>
      ) : (
        <div className={customInput}>
          <input
            ref={inputRef}
            type={type}
            placeholder={placeholder}
            value={inputValue}
            onKeyUp={onKeyUp}
            onChange={handleInputChange}
            className={`input ${inputFormStyle}`}
            maxLength={maxLength}
            id={id}
            pattern={pattern}
            name={name}
            readOnly={readonly}
            disabled={disabled}
          />
          {rightIcon && (
            <img
              src={rightIcon}
              alt="icon"
              className={rightIconStyle}
            />
          )}
        </div>
      )}
    </>
  );
});

export default GeneralInput;
