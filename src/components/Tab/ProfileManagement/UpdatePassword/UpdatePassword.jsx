import { useEffect, useState } from "react";
import DetailModal from "../../../DetailModal/DetailModal";
import Button from "../../../Button/Button";
import Common from '../../../../utils/standard';
import NoticeMessage from "../../../../plugin/noticemessage/noticemessage";
import useUserMgt from "../../../../hooks/useUserMgt";
import { useTranslation } from "react-i18next";

const UpdatePassword = ({isActive =true , userInfo}) => {
  const { t } = useTranslation();
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

  const { updateProfilePassword } = useUserMgt({
    onUpdateSuccess: () => {
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
      new NoticeMessage(t(err?.message))
    }
  });

  useEffect(() => {

  }, [formData]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: value };
  
      const fieldsToCheck = [
        updatedFormData.current_password,
        updatedFormData.no_hash_password_update,
        updatedFormData.no_hash_confirm_password_update
      ];
  
      const isFormEmpty = fieldsToCheck.every((val) => !val?.trim()); 
  
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
    updateProfilePassword(updatedFormData)
}
  

    const tabClass = isActive
  ? "flex flex-col pt-[20px] bg-transparent rounded-[4px] bg-[#135a78]"
  : "pt-[20px";

  return (
    <div className={tabClass}>
        <div className="w-full flex flex-col gap-[15px]">
                <span className="text-[20px] font-[700] text-[#6b7280]">
                    {t('cmn > user password')}
                </span>
        </div>
        <div className="flex flex-col gap-4 mt-4">
        <DetailModal
              label={t('user > current password')}
              inputType="password"
              name={"current_password"}
              modalType={'profile'}
              required={isRequired}
              value={formData.current_password || ""}
              onChange={handleChange}

            />
            <DetailModal
              label={t('profile > new password')}
              inputType="password"
              name={"no_hash_password_update"}
              modalType={'profile'}
              required={isRequired}
              value={formData.no_hash_password_update || ""}
              onChange={handleChange}
            />
            <DetailModal
              label={t('profile > confirm password')}
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
            label={t('cmn > confirm')}
            customButton="btn-search"
            disabled={isDisabled}
            onClick={handleSubmit}
          />
        </div>

    </div>
  );
};

export default UpdatePassword;
