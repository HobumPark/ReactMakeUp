import React, { useState } from "react";
import GeneralInput from "../GeneralInput/GeneralInput";
import Button from "../Button/Button";
import Magnifier from "../../assets/icon/icon-search.svg";
import Frame from "../../assets/icon/Frame.png";
import RadioFilter from "../RadioFilter/RadioFilter"; // Import komponen RadioFilter

const Filtering = ({
  labelSelect,
  children,
  disableSearchInput = false,
  placeholder,
  disableSearchButton = false,
  disableFiltering = false,
  searchButtonLabel = "Search",
  filteringButtonLabel = "Filtering",
  disableResetButton = false,
  resetButtonLabel = "Reset",
  isSearchOnInput = false,
  optionsRadioFilter ,
  onSearch = () => {},
  onReset = () => {},
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [selectedRadio, setSelectedRadio] = useState("All"); 
  const [isRadioFilterVisible, setIsRadioFilterVisible] = useState(false);

  const handleSearchInput = (event) => {
    const keyInput = event.key;
    const target = event.target;
    if (keyInput === "Enter") {
      onSearch(target.value, selectedRadio); 
    }
  };

  const handleRadioChange = (event) => {
    if (event.target && event.target.value) {
      const selectedValue = event.target.value;
      setSelectedRadio(selectedValue);
      if (selectedValue === "All") {
        setSelectedRadio(null);
      }
    } 
  };

  const handleReset = (e) => {
    setSearchInput("");
    setSelectedRadio("All");
    onReset();
  };
  const handleSearchButtonClick = () => {
    onSearch(searchInput, selectedRadio);
  };
  

  const toggleRadioFilter = () => {
    setIsRadioFilterVisible((prevState) => !prevState); 
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 justify-between items-center">
        <div className="w-32 flex items-center gap-2">
          <span className="text-body-2 text-au-neutral-4 py-[9px] flex-grow whitespace-nowrap">
            {labelSelect}
          </span>
          {children}
        </div>

        <div className="flex gap-4 ml-auto items-center">
          {!disableSearchInput && (
            <GeneralInput
              customInput={"wrapper-icon"}
              inputFormStyle={"input-search"}
              placeholder={placeholder}
              rightIcon={Magnifier}
              rightIconStyle={"icon"}
              value={searchInput}
              onKeyDown={handleSearchInput} 
              onChange={(e) => setSearchInput(e.target.value)}
            />
          )}
          {!disableSearchButton && <Button label={searchButtonLabel} customButton="btn-search" onClick={handleSearchButtonClick}/>}
          {!disableResetButton && <Button label={resetButtonLabel} customButton="btn-reset" onClick={handleReset} />}
          {!disableFiltering && (
            <Button label={filteringButtonLabel} customButton="flex btn-reset " isImage={Frame} onClick={toggleRadioFilter} />
          )}
        </div>
      </div>

      {isRadioFilterVisible && (
        <div className="mt-4">
        
          <RadioFilter
            name="Deleted"
            label="Deleted"
            options={optionsRadioFilter}
            defaultValue="001002"
            onRadioChange={handleRadioChange}
          />
        </div>
      )}
    </div>
  );
};

export default Filtering;
