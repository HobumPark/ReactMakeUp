import React from "react";

const Button = ({
  customButton,
  type = "button",
  onClick,
  label,
  disabled,
  isImage,
}) => {
  return (
    <button 
      className={` items-center ${customButton}`}  
      type={type} 
      onClick={onClick} 
      disabled={disabled}
    >
      {label}
      {isImage && <img src={isImage} alt="Button Icon" className="ml-2" />} 
    </button>
  );
};

export default Button;
