import React, { useState, useEffect } from "react";
import ContainerCard from "../../components/ContainerCard/ContainerCard";
import Filtering from "../../components/Filtering/Filtering";
import { ReactTabulator } from "react-tabulator";
import DetailForm from "../../components/DetailForm/DetailForm";
import LogList from "../../components/LogList/LogList";
import ButtonGroup from "../../components/ButtonGroup/ButtonGroup";
import Select from "../../components/Select/Select";
import GeneralInput from "../../components/GeneralInput/GeneralInput";
import { useTranslation } from 'react-i18next';
import localeEn from 'air-datepicker/locale/en.js'; 
import localeKo from 'air-datepicker/locale/ko.js'; 
import localeId from 'air-datepicker/locale/id.js'; 
import AirDatepicker from 'air-datepicker';


import Button from "../../components/Button/Button";


const CommunicationStatistic = () => {
  const [activeButton, setActiveButton] = useState("5분");

  const handleButtonClick = (label) => {
    setActiveButton(label);
  };

  const { t, i18n } = useTranslation();
  
    useEffect(() => {
      let locale;
      if (i18n.language === "eng") {
        locale = localeEn;
      } else if (i18n.language === "ind") {
        locale = localeId;
      } else {
        locale = localeKo; 
      }
  
      const optionsDate = {
        autoClose: true,
        locale: locale,
        position: "bottom center",
        onSelect: (date) => {
          setFormValues((prevValues) => ({
            ...prevValues,
            birth: date.formattedDate,
          }));
        },
      };
  
      const optionsDateSecond = {
        autoClose: true,
        locale: locale,
        position: "bottom center",
        onSelect: (date) => {
          setFormValues((prevValues) => ({
            ...prevValues,
            birth: date.formattedDate,
          }));
        },
      };
  
      const datepicker1 = new AirDatepicker('[name="first-date"]', optionsDate);
      const datepicker2 = new AirDatepicker('[name="second-date"]', optionsDateSecond);
  
      return () => {
        datepicker1.destroy();
        datepicker2.destroy();
      };
    }, [i18n.language]);



  return (
    <>
      <section>
        <ContainerCard>
          <Filtering placeholder="사이트 / 접근로" disableFiltering={true} customWidthSelect= "w-full">
            <div className="flex w-fit gap-4 flex-row">
              <Button
                customButton={`button filtering ${
                  activeButton === "5분" ? "active" : ""
                }`}
                label="5분"
                onClick={() => handleButtonClick("5분")}
              />
              <Button
                customButton={`button filtering ${
                  activeButton === "15분" ? "active" : ""
                }`}
                label="15분"
                onClick={() => handleButtonClick("15분")}
              />
              <Button
                customButton={`button filtering ${
                  activeButton === "30분" ? "active" : ""
                }`}
                label="30분"
                onClick={() => handleButtonClick("30분")}
              />
              <Button
                customButton={`button filtering ${
                  activeButton === "60분" ? "active" : ""
                }`}
                label="60분"
                onClick={() => handleButtonClick("60분")}
              />
            </div>
            <div className="flex flex-row gap-2 items-center w-full">
              <DetailForm
                showTitle = {false}
                inputType={"text"}
                name={"first-date"}
                isDob={true} 
              />
              <span>-</span>
              <DetailForm
                showTitle = {false}
                inputType={"text"}
                name={"second-date"}
                isDob={true} 
              />
            </div>
          </Filtering>
        </ContainerCard>
        
      </section>
    </>
  );
};

export default CommunicationStatistic;
