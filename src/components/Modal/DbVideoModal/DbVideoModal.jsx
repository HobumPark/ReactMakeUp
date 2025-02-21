import React, { useState } from "react";
import IconClose from "../../../assets/icon/icon-close-white.svg";
import ImgDummy from "../../../assets/img/img-dummy.png";

const DbVideoModal = ({onClose}) => {
  return (
    <>
      <section className="_dbVideoModalContainer w-[286px] flex flex-col h-[200px] bg-center bg-blue-800 overflow-hidden absolute z-10 top-[30%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="title3medium text-[#FEFEFE] bg-[#3E464F] py-[5px] px-2.5 justify-between flex-row flex items-center">
          <span className="">traffic Light Alun-alun</span>
          <img src={IconClose} alt="" srcset="" 
            onClick={onClose}/>
        </div>
        <div className="container-video flex w-full h-full bg-[#000] overflow-hidden">
          <img
            src={ImgDummy}
            alt=""
            srcset=""
            className="w-full h-full bg-cover bg-no-repeat object-cover"
          />
        </div>
      </section>
    </>
  );
};

export default DbVideoModal;
