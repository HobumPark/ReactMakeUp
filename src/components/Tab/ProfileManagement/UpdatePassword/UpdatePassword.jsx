import { useState } from "react";
import DetailModal from "../../../DetailModal/DetailModal";

const UpdatePassword = (isActive =true) => {

    const tabClass = isActive
  ? "flex flex-col pt-[20px] bg-transparent rounded-[4px] bg-[#135a78]"
  : "pt-[20px";

  return (
    <div className={tabClass}>
        <div className="w-full flex flex-col gap-[15px]">
                <span className="text-[20px] font-[700] text-[#6b7280]">
                    Reset Password
                </span>
        </div>
        <div className="flex flex-col gap-4">
        <DetailModal
              label="Current Password"
              inputType="password"
              name={"account_id"}
              modalType={'profile'}
            />
            <DetailModal
              label="New Password"
              inputType="password"
              name={"name"}
              modalType={'profile'}
            />
            <DetailModal
              label="Confirm Password"
              inputType="password"
              name={"birth"}
              modalType={'profile'}
            />
            </div>

    </div>
  );
};

export default UpdatePassword;
