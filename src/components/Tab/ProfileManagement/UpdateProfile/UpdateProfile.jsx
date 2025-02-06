import { useEffect, useState } from "react";
import DetailModal from "../../../DetailModal/DetailModal";

const UpdateProfile = ({isActive = true, userInfo, commonData}) => {
  const [formData, setFormData] = useState({
    account_id: "",
    name: "",
    birth: "",
    organization: "",
    email: "",
    position: "",
    phone_no: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (userInfo) {
      setFormData((prev) => ({
        ...prev,
        account_id: userInfo?.account_id,
        name: userInfo?.name,
        birth: userInfo?.birth,
        organization: userInfo?.organization,
        email: userInfo?.email,
        position: userInfo?.position,
        phone_no: userInfo?.phone_no,
  
      }));
    }
  }, [userInfo]);

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
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col gap-4">
            <DetailModal
              label="Name"
              inputType="text"
              name={"name"}
              modalType={'profile'}
              value={formData.name}
              onChange={handleChange}
            />
            <DetailModal
              label="User ID"
              inputType="text"
              name={"account_id"}
              modalType={'profile'}
              value={formData.account_id}
              onChange={handleChange}
            />
            <DetailModal
              label="Organization"
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
              label="Position"
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
              label="Phone No."
              inputType="number"
              name={"phone_no"}
              modalType={'profile'}
              value={formData.phone_no}
              onChange={handleChange}
            />

            <DetailModal
              label="Email"
              inputType="text"
              name={"no_hash_password"}
              modalType={'profile'}
              value={formData.email}
              onChange={handleChange}
            />

          </div>
        </div>

    </div>
  );
};

export default UpdateProfile;
