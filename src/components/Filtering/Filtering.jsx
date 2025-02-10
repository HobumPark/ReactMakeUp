import React, { useState } from "react";
import GeneralInput from "../GeneralInput/GeneralInput";
import Button from "../Button/Button";
import Magnifier from "../../assets/icon/icon-search.svg";
import Frame from "../../assets/icon/Frame.png";
import RadioFilter from "../RadioFilter/RadioFilter"; 
import { useTranslation } from "react-i18next";

const Filtering = ({
  labelSelect,
  children,
  disableSearchInput = false,
  placeholder,
  disableSearchButton = false,
  disableFiltering = false,
  disableResetButton = false,
  isSearchOnInput = false,
  optionsRadioFilter,
  optionsRadioFilterUsage,
  isUsage,
  onSearch = () => {},
  onReset = () => {},
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [selectedRadio, setSelectedRadio] = useState("001002"); 
  const [selectedRadioUsage, setSelectedRadioUsage] = useState("All"); 
  const [isRadioFilterVisible, setIsRadioFilterVisible] = useState(false);
  const {t} = useTranslation();

  const handleSearchInput = (event) => {
    const keyInput = event.key;
    const target = event.target;
    if (keyInput === "Enter") {
      onSearch(target.value, selectedRadio,selectedRadioUsage); 
    }
  };

  const handleRadioChange = (event) => {
    if (event.target && event.target.value) {
      const selectedValue = event.target.value;
      setSelectedRadio(selectedValue);
      if (selectedValue === t('cmn > all')) {
        setSelectedRadio(null);
      }
    } 
  };
  const handleRadioUsageChange = (event) => {
    if (event.target && event.target.value) {
      const selectedValue = event.target.value;
      setSelectedRadioUsage(selectedValue);
      if (selectedValue === t('cmn > all')) {
        setSelectedRadioUsage(null);
      }
    } 
  };

  const handleReset = (e) => {
    setSearchInput("");
    setSelectedRadio("001002");
    setSelectedRadioUsage("All")
    onReset();
  };
  const handleSearchButtonClick = () => {
    onSearch(searchInput, selectedRadio,);
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

        <div className="flex gap-[12px] ml-auto items-center">
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
          {!disableSearchButton && <Button label={t('cmn > search')} customButton="btn-search" onClick={handleSearchButtonClick}/>}
          {!disableResetButton && <Button label={t('cmn > reset')} customButton="btn-reset" onClick={handleReset} />}
          {!disableFiltering && (
            <Button label={t('cmn > filtering')} customButton={`flex ${isRadioFilterVisible ? "btn-filter-active" : "btn-reset"}`} isImage={Frame} onClick={toggleRadioFilter} />
          )}
        </div>
      </div>
      {isRadioFilterVisible && (
        <div>
        {isUsage && (
          <RadioFilter
            name="Usage"
            label={t('002')}
            options={optionsRadioFilterUsage}
            value={selectedRadioUsage}
            onRadioChange={handleRadioUsageChange}
          />
      )}
          <RadioFilter
            name="Deleted"
            label={t('001')}
            options={optionsRadioFilter}
            value={selectedRadio}
            onRadioChange={handleRadioChange}
          />

        </div>
      )}
    </div>
  );
};

export default Filtering;
