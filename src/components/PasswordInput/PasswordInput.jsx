import React, {
    useRef,
    forwardRef,
    useState,
  } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const PasswordInput =  forwardRef(({ 
  customInput, 
  type = "text", 
  placeholder, 
  value,
  id,
  name,
  onChange = () => {},
  state ='default',
  pattern = "",
  disabled,
  ...props
}, ref) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const inputRef = useRef(null); 

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
    inputRef.current.type = isPasswordVisible ? 'password' : 'text';
  };

  return (
    <div className={customInput}>
      <input
        ref={inputRef} 
        type="password"
        placeholder={placeholder}
        className='input'
        id={id}
        disabled={disabled}
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