import React, {
    useRef,
    forwardRef,
    useState,
    useImperativeHandle,
  } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const PasswordInput =  forwardRef(({ 
  customInput, 
  inputFormStyle,
  type = "text", 
  placeholder, 
  value,
  id,
  name,
  maxLength,
  onChange = () => {},
  onKeyUp = () => {},
  state ='default',
  pattern = "",
  disabled,
  ...props
}, ref) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const inputRef = useRef(null); 
  const [inputValue, setInputValue] = useState(value);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
    inputRef.current.type = isPasswordVisible ? 'password' : 'text';
  };
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

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    empty: () => setInputValue(""),
  }));  

  return (
    <div className={`relative ${customInput}`}>
      <input
        ref={inputRef} 
        type="password"
        placeholder={placeholder}
        className={`input pr-10 ${inputFormStyle}`}
        value={inputValue}
        id={id}
        maxLength={maxLength}
        disabled={disabled}
        onKeyUp={onKeyUp}
        onChange={handleInputChange}
      />
      
      {!disabled && (
    <FontAwesomeIcon
      icon={isPasswordVisible ? faEye : faEyeSlash}
      onClick={togglePasswordVisibility}
      style={{ cursor: 'pointer' }}
      className="absolute top-1/2 right-3 transform -translate-y-1/2 text-neutral-600 hover:text-neutral-800"
    />)}
    </div>
  );
});

export default PasswordInput;