import React, { useEffect, useState } from "react";
import ImgDummy from "../../../assets/img/img-dummy.png"
import useTrafficEvent from "../../../hooks/useTrafficEvent";
import { useLocation } from "react-router-dom";


const VideoModal = () => {
  const location = useLocation();
  const host = window.location.origin;
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id'); 
  const { trafficEvent } = useTrafficEvent({
    id: id, 
  });
  
  const trafficEventData = trafficEvent?.data;
  
  return (
    <>
      <section className="w-full flex flex-col h-screen bg-center bg-blue-800 overflow-hidden">
        <div className="title3medium text-[#FEFEFE] bg-[#8EB6C8] py-[5px] px-2.5 justify-between flex-row flex items-center">
          <span className="">{trafficEventData?.site_name} / {trafficEventData?.road_name} / {trafficEventData?.timestamp}</span>
          {/* <img src={IconClose} alt="" srcset="" /> */}
        </div>
        <div className="container-video flex w-full h-full bg-[#000]">
            <img src={`${host}/api/dsh/common/image${trafficEventData?.image_path}`}  alt="" srcSet="" className="w-full h-full bg-cover bg-no-repeat object-cover"/>
        </div>
      </section>
    </>
  );
};

export default VideoModal;
