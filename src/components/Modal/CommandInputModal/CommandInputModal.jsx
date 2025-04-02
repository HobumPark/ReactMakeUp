import React, { useEffect, useState } from "react";
import 'air-datepicker/air-datepicker.css';
import closeIcon from "../../../assets/icon/close-icon.svg";

const CommandInputModal = ({ isOpen, onClose, confirmClick, cancelClick, handleInputCommand,inputCommand }) => {
  
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center transition-all duration-300 ${
        isOpen ? "visible opacity-100" : "invisible opacity-0"
      }`}
      style={{ top: "-40%" }}
    >
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}></div>

      <div className="bg-white rounded-xl w-[48%] shadow-lg relative z-10 transition-transform duration-300 transform scale-95" 
          style={{ height:"300px", padding: "0px" }}>
        <div className="flex items-center justify-between w-full mb-6 rounded-t-xl bg-[#135a78]" 
          style={{ color: "#ffffff", padding: "16px" }}>
          <span className="font-semibold text-[29px]">시험 이름 입력</span>
          <div className="modal-close cursor-pointer" onClick={onClose} 
            style={{ backgroundColor: "#135a78", width: "40px", height: "40px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <img src={closeIcon} alt="Close" style={{ width: "30px", height: "30px" }} />
          </div>
          
        </div>
        <div class="flex justify-center">
          <input type="text" class="border border-gray-300 rounded mt-5" value={inputCommand}
          style={{ width: "95%", height: "60px" }} onChange={handleInputCommand}/>
        </div>
        <div className="h-[700px] p-[30px] box-border flex justify-end gap-4">
          <button
            className="bg-[#135a78] text-white rounded hover:bg-[#1e5a74] cursor-pointer hover:opacity-90"
            style={{ width: "120px", height: "60px" }}
            onClick={() => confirmClick()}
          >
            완료
          </button>

          <button
            className="bg-gray-300 text-black rounded hover:bg-gray-500 cursor-pointer hover:opacity-90"
            style={{ width: "120px", height: "60px" }}
            onClick={() => cancelClick()}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommandInputModal;

