import React from "react";

const TextArea = ({
  value = "",
  placeholder,
  className,
  onChange,
  id,
  name,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
    <textarea
      id={id}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      disabled={disabled}
      className={className}
    />
    </div>
  );
};

export default TextArea;
