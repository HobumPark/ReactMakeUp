import React from "react";
import IconClose from "../../../assets/icon/icon-close-white.svg";
import ImgDummy from "../../../assets/img/img-dummy.png"


const VideoModal = ({videoUrl}) => {
  return (
    <>
      <section className="w-full flex flex-col h-screen bg-center bg-blue-800 overflow-hidden">
        <div className="title3medium text-[#FEFEFE] bg-[#8EB6C8] py-[5px] px-2.5 justify-between flex-row flex items-center">
          <span className="">삼성역 사거리 교차로 / 시청방면 / 2025-01-20 12:30:00</span>
          {/* <img src={IconClose} alt="" srcset="" /> */}
        </div>
        <div className="container-video flex w-full h-full bg-[#000]">
            <img src={ImgDummy} alt="" srcset="" className="w-full h-full bg-cover bg-no-repeat object-cover"/>
        </div>
      </section>
    </>
  );
};

export default VideoModal;
