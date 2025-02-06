import { useState } from "react";
import closeIcon from "../../../assets/icon/close-icon.svg"
import UpdatePassword from "../../Tab/ProfileManagement/UpdatePassword/UpdatePassword";
import UpdateProfile from "../../Tab/ProfileManagement/UpdateProfile/UpdateProfile";


const ModalProfileManagement = ({isModalOpen , setIsModalOpen, userInfo, commonData }) => {
  
    const [activeTab, setActiveTab] = useState("profile");
    const tabClass = 'flex flex-col items-center justify-center w-full h-[40px] relative text-center text-[#f1f2f4] border-b border-[#6b7280]'
    const activeTabClass = 'font-bold'
    const devider = 'w-full h-[4px] bg-[#135A78] top-[5px] rounded-[10px] relative'
    
  return (
    <div className={`modal modal-background ${isModalOpen ? "modal-open" : ""}`}>
    <div className="modal-box ">
    <div className="bg-[#d0dee4] rounded-lg p-2.5">
    <div className="h-[37px] bg-[#135A78] flex items-center px-4 w-full justify-between rounded-t-md">
     <span className="text-[16px] text-[#ffffff] font-bold">Profile Management</span>
     <div className="w-6 h-6 cursor-pointer"  onClick={() => setIsModalOpen(false)}>
     <img
        src={closeIcon}
        style={{ filter: 'invert(1)' }}
        alt="close"
        />
     </div>
    </div>
    <div className="w-full p-5 bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] rounded-b-lg">
        <div id="tab">
        <nav className="flex flex-row cursor-pointer">
        <div className={`${tabClass}`}
           onClick={() => setActiveTab("profile")}>
            <span>
            <li className={`text-[#6b7280] text-[20px] list-none ${activeTab === "profile" ? activeTabClass : "font-medium"}`}>
                Profile
            </li>
            </span>
            <div className={`${activeTab === "profile" ? devider : ""}`}/>
        </div>
        <div className={`${tabClass}`}
        onClick={() => setActiveTab("password")}>
            <span>
            <li className={`text-[#6b7280] text-[20px] list-none ${activeTab === "password" ? activeTabClass : "font-medium"}`}>
                Password
            </li>
            </span>
            <div className={`${activeTab === "password" ? devider : ""}`}/>
        </div>
        </nav>

        {/* Tab Content */}
        <div className="tab-content">
        <div className={`fade ${activeTab === "profile" ? "fade-enter-active" : "fade-exit-active"}`}>
          {activeTab === "profile" && <UpdateProfile userInfo={userInfo} commonData={commonData} />}
        </div>
        <div className={`fade ${activeTab === "password" ? "fade-enter-active" : "fade-exit-active"}`}>
          {activeTab === "password" && <UpdatePassword />}
        </div>
      </div>
      </div>

        {/* Tab Content */}
        </div>
    </div>

    </div>

    </div>

  );
};

export default ModalProfileManagement;
