import React, {
  useRef,
  forwardRef,
  useState,
  useEffect,
  useImperativeHandle,
} from "react";
import calendar from "../../assets/icon/icon_calendar.svg"

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
      onKeyUp = () => {},
      onChange = () => {},
    }, ref) => {
  const inputRef = useRef();
  
  const [inputValue, setInputValue] = useState(value);
  const handleInputChange = (event) => {
    if (pattern) {
      if (pattern.test(event.target.value)) {
        setInputValue(event.target.value);
      }
    } else {
      setInputValue(event.target.value);
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

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          className="input pl-4 pr-10 w-full" 
          value={inputValue}
          id={id}
          maxLength={maxLength}
          disabled={disabled}
          onKeyUp={onKeyUp}
          onChange={handleInputChange}
        />
        <img
          src={calendar}
          alt="icon"
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
          style={{ filter: 'brightness(0.6)' }}
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
