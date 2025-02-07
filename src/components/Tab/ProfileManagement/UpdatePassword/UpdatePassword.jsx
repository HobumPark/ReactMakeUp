import { useEffect, useState } from "react";
import DetailModal from "../../../DetailModal/DetailModal";
import Button from "../../../Button/Button";
import useAuth from "../../../../hooks/useAuth";
import Common from '../../../../utils/standard';
import NoticeMessage from "../../../../plugin/noticemessage/noticemessage";

const UpdatePassword = ({isActive =true , userInfo}) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const [isRequired, setIsRequired] = useState(false);
  
  const [formData, setFormData] = useState(
    {
      account_id: userInfo,
      current_password:"",
      no_hash_password_update: "",
      no_hash_confirm_password_update: "",
    }
  );

  const { handleUpdatePassword } = useAuth({
    onSuccessUpdate: () => {
      setIsDisabled(true);
      setIsRequired(false);
      setFormData({
        account_id: userInfo,
        current_password:"",
        no_hash_password_update: "",
        no_hash_confirm_password_update: "",
        current_password_sha256: "",
        confirm_password_update_sha256: "",
      }); 
      
    },
    onResetFail:(err) =>{
      new NoticeMessage(err?.message)
    }
  });

  useEffect(() => {
  }, [formData]);
  

const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev = {}) => {
    const updatedFormData = {
      ...prev, // Jika prev tidak null, gunakan datanya
      [name]: value,
    };

    const isFormEmpty = Object.values(updatedFormData).every((val) => !val);
    
    setIsDisabled(isFormEmpty);
    setIsRequired(!isFormEmpty);

    return updatedFormData;
  });
};

  
  
  const handleSubmit = async () => {
    const updatedFormData = {
      ...formData,
      current_password_sha256: Common.SHA256(formData.current_password.trim()),
      confirm_password_update_sha256: Common.SHA256(formData.no_hash_confirm_password_update.trim()),
    };
    console.log("Form Data to Send:", updatedFormData);
    handleUpdatePassword(updatedFormData)
}
  
console.log(formData);

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
              name={"current_password"}
              modalType={'profile'}
              required={isRequired}
              value={formData.current_password || ""}
              onChange={handleChange}

            />
            <DetailModal
              label="New Password"
              inputType="password"
              name={"no_hash_password_update"}
              modalType={'profile'}
              required={isRequired}
              value={formData.no_hash_password_update || ""}
              onChange={handleChange}
            />
            <DetailModal
              label="Confirm Password"
              inputType="password"
              name={"no_hash_confirm_password_update"}
              modalType={'profile'}
              required={isRequired}
              value={formData.no_hash_confirm_password_update || ""} 
              onChange={handleChange}
            />
            </div>
            <div className="flex justify-end mt-12">
          <Button
            label="Save"
            customButton="btn-search"
            disabled={isDisabled}
            onClick={handleSubmit}
          />
        </div>

    </div>
  );
};

export default UpdatePassword;
