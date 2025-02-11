import { useEffect, useState } from "react";
import DetailModal from "../../../DetailModal/DetailModal";
import Button from "../../../Button/Button";
import useAuth from "../../../../hooks/useAuth";
import NoticeMessage from "../../../../plugin/noticemessage/noticemessage";
import useUserMgt from "../../../../hooks/useUserMgt";
import { useTranslation } from "react-i18next";

const UpdateProfile = ({isActive = true, userInfo, commonData}) => {
  const { t } = useTranslation();
  const [isDisabled, setIsDisabled] = useState(true);
  const [formData, setFormData] = useState({
    account_id: "",
    name: "",
    organization: "",
    email: "",
    position: "",
    phone_no: "",
  });

  const { updateUserProfile } = useUserMgt({
    onUpdateSuccess: () => {
      setIsDisabled(true);
    },
    onResetFail: (err) => {
      new NoticeMessage(err?.message)
    }
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsDisabled(false);
    };
 
  useEffect(() => {
    if (userInfo) {
      setFormData((prev) => ({
        ...prev,
        account_id: userInfo?.account_id,
        name: userInfo?.name,
        organization: userInfo?.organization,
        email: userInfo?.email,
        position: userInfo?.position,
        phone_no: userInfo?.phone_no,
  
      }));
    }
  }, [userInfo]);

  const handleSubmit = async () => {
    console.log("Form Data to Send:", formData);
    updateUserProfile(formData)
}

    const tabClass = isActive
  ? "flex flex-col pt-[20px] bg-transparent rounded-[4px] bg-[#135a78]"
  : "pt-[20px";

  return (
    <div className={tabClass}>
        <div className="w-full flex flex-col gap-[15px]">
                <span className="text-[20px] font-[700] text-[#6b7280]">
                   {t('cmn > user profile')}
                </span>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col gap-4">
            <DetailModal
              label={t('user > name')}
              inputType="text"
              name={"name"}
              modalType={'profile'}
              value={formData.name}
              onChange={handleChange}
            />
            <DetailModal
              label={t('user > account id')}
              inputType="text"
              name={"account_id"}
              modalType={'profile'}
              value={formData.account_id}
              onChange={handleChange}
            />
            <DetailModal
              label={t('user > organization')}
              inputType="select"
              name={"organization"}
              modalType={'profile'}
              value={formData.organization}
              onChange={handleChange}
              optionSelect={
                commonData?.["ORG"]
                  ? [
                      { value: "", label: ""}, 
                      ...commonData["ORG"].code.map((code, index) => ({
                        value: code,
                        label: commonData["ORG"].name[index],
                      })),
                    ]
                  : []
              }
            />
          </div>

          <div className="flex flex-col gap-4">
            <DetailModal
              label={t('021')}
              inputType="select"
              name={"position"}
              modalType={'profile'}
              value={formData.position}
              onChange={handleChange}
              optionSelect={
                commonData?.["021"]
                  ? [
                      { value: "", label: ""}, 
                      ...commonData["021"].code.map((code, index) => ({
                        value: code,
                        label: commonData["021"].name[index],
                      })),
                    ]
                  : []
              }

            />
            <DetailModal
              label={t('user > phone no')}
              inputType="number"
              name={"phone_no"}
              modalType={'profile'}
              value={formData.phone_no}
              onChange={handleChange}
            />

            <DetailModal
              label={t('profile > email')}
              inputType="text"
              name={"email"}
              modalType={'profile'}
              value={formData.email}
              onChange={handleChange}
            />

          </div>
        </div>

        <div className="flex justify-end mt-12">
          <Button
            label={t('cmn > save')}
            customButton="btn-search"
            disabled={isDisabled}
            onClick={handleSubmit}
          />
        </div>



    </div>
  );
};

export default UpdateProfile;
