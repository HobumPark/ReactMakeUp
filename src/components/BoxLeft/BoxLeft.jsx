import React, { useCallback, useState } from "react";
import GeneralInput from "../GeneralInput/GeneralInput";
import Button from "../Button/Button";
import Magnifier from "../../assets/icon/icon-search.svg"
import Select from "../Select/Select";

const BoxLeft = ({
  labelSelect,
  children,
  disableConfirmButton = false,
  confirmButtonLabel = "Confirm",
  disableResetButton = false,
  resetButtonLabel = "Restore Default",
  onReset = () => {},
}) => {
  const [searchInput, setSearchInput] = useState("");

  const handleSearchInput = (event) => {
    const keyInput = event.key;
    const target = event.target;
    if (keyInput === "Enter") {
      onSearch(target.value);
    }
  };

  const handleReset = (e) => {
    setSearchInput(``);
    onReset();
  };
  return (
    <div className="flex gap-4 justify-between">
      <div className="w-32 flex items-center gap-2">
        <span className="text-body-2 text-au-neutral-4 py-[9px] flex-grow whitespace-nowrap">
          {labelSelect}
        </span>
        {children}
      </div>

      <div className="flex gap-4 ml-auto">
        {!disableConfirmButton && <Button label={confirmButtonLabel} customButton="btn-search" />}
        {!disableResetButton && <Button label={resetButtonLabel} customButton="btn-reset" />}
      </div>
    </div>

  );
};

export default BoxLeft;
