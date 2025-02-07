import React, {
  useRef,
  forwardRef,
  useState,
  useImperativeHandle,
  useEffect,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const PasswordInput = forwardRef(
  (
    {
      customInput,
      inputFormStyle,
      placeholder,
      value = "", // Default value untuk menghindari undefined
      id,
      name,
      maxLength,
      onChange = () => {},
      onKeyUp = () => {},
      state = "default",
      pattern = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const inputRef = useRef(null);
    const [inputValue, setInputValue] = useState(value);

    // Sinkronisasi value dari luar jika berubah
    useEffect(() => {
      setInputValue(value);
    }, [value]);

    const togglePasswordVisibility = () => {
      setIsPasswordVisible((prev) => !prev);
    };

    const handleInputChange = (event) => {
      let newValue = event.target.value;

      if (pattern) {
        const regex = new RegExp(pattern);
        if (!regex.test(newValue)) return; // Hanya set value jika sesuai pola
      }

      setInputValue(newValue);
      onChange(event);
    };

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      empty: () => setInputValue(""),
    }));

    return (
      <div className={`relative ${customInput}`}>
        <input
          ref={inputRef}
          type={isPasswordVisible ? "text" : "password"} // Gunakan state untuk tipe
          name={name}
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
            style={{ cursor: "pointer" }}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-neutral-600 hover:text-neutral-800"
          />
        )}
      </div>
    );
  }
);

export default PasswordInput;
