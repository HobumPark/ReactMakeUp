import { useState } from "react";

const UpdateProfile = (isActive =true) => {

    const tabClass = isActive
  ? "flex flex-col pt-[20px] bg-transparent rounded-[4px] bg-[#135a78]"
  : "pt-[20px";

  return (
    <div className={tabClass}>
        <div className="w-full flex flex-col gap-[15px]">
                <span className="text-[20px] font-[700] text-[#6b7280]">
                    User Profile
                </span>
        </div>

    </div>
  );
};

export default UpdateProfile;
