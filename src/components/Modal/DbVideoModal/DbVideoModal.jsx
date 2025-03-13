import React, { useEffect, useRef, useState } from "react";
import IconClose from "../../../assets/icon/icon-close-white.svg";
import ImgDummy from "../../../assets/img/img-dummy.png";
import Draggable from "react-draggable";

const DbVideoModal = ({onClose, data, currentPage}) => {
  console.log(data);
  
  const modalRef = useRef(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: 1543,
    height: 800,
  });


  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };


  return (
    <>
    <Draggable>
   <section
        ref={modalRef}
        className={`_dbVideoModalContainer flex flex-col bg-center bg-blue-800 overflow-hidden absolute z-10 ${
                !isFullScreen 
                    ? "w-[286px] h-[200px] top-[30%] left-1/2 transform -translate-x-1/2 -translate-y-1/2" // Not fullscreen
                    : currentPage === "equipment" 
                    ? "top-30 left-50" // Fullscreen and page is "equipment"
                    : "top-10 left-50" // Fullscreen only
            }`}
        style={{
          width: isFullScreen ? `${windowSize.width}px` : "286px", // Adjust width when in full-screen
          height: isFullScreen ? `${windowSize.height}px` : "200px", // Adjust height when in full-screen
        }}
        onDoubleClick={toggleFullScreen}
      >
        <div className="title3medium text-[#FEFEFE] bg-[#3E464F] py-[5px] px-2.5 justify-between flex-row flex items-center">
          <span className="">{data.road_name}</span>
          <img src={IconClose} alt="" srcSet="" 
            onClick={onClose}/>
        </div>
        <div className="container-video flex w-full h-full bg-[#000] overflow-hidden">
        <video
            src={ data.stream_url} 
            className="w-full h-full bg-cover bg-no-repeat object-cover"
            autoPlay 
          />
          {/* <img
            src={ImgDummy}
            alt=""
            srcset=""
            className="w-full h-full bg-cover bg-no-repeat object-cover"
          /> */}
        </div>
      </section>
      </Draggable>
    </>
  );
};

export default DbVideoModal;
