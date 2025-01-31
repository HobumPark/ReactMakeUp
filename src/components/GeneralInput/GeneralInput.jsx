import React, {
  useRef,
  forwardRef,
  useState,
  useEffect,
  useImperativeHandle,
} from "react";

const GeneralInput = forwardRef(({ 
  customInput, 
  inputFormStyle,
  type, 
  placeholder, 
  value,
  id,
  name,
  onChange = () => {},
  maxLength,
  state = 'default',
  pattern = "",
  rightIconStyle,
  rightIcon, 
  disabled,
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
    <div className={customInput}>
      <input
        ref={inputRef}
        type={type}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        className={`input ${inputFormStyle} `}
        maxLength={maxLength}
        id={id}
        name={name}
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
  );
});


export default GeneralInput;
