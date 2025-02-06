import { useState } from "react";
import closeIcon from "../../../assets/icon/close-icon.svg";
import DetailModal from "../../DetailModal/DetailModal";
import Button from "../../Button/Button";


const ModalForgotPassword = ({ isOpen, onClose, optionsSelect }) => {
  const [formData, setFormData] = useState({
    account_id: "",
    name: "",
    birth: "",
    organization: "",
    email: "",
    position: "",
    phone_no: "",
    password: "",
    no_hash_password: "",
    confirmPassword: "", 
  });


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {

    if (formData.no_hash_password !== formData.confirmPassword) {
      console.log('error ');
      
    }

    const hashedPassword = Common.SHA256(formValues.password);

    const dataToSend = {
      account_id: formData.account_id,
      name: formData.name,
      birth: formData.birth,
      organization: formData.organization,
      email: formData.email,
      position: formData.position,
      phone_no: formData.phone_no,
      password: hashedPassword,
      no_hash_password: formData.no_hash_password, 
    };

    console.log("Form Data to Send:", dataToSend);

}

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center transition-all duration-300 ${
        isOpen ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}></div>
      <div className="bg-white rounded-xl w-[48%] shadow-lg relative z-10 transition-transform duration-300 transform scale-95" style={{ padding: "48px" }}>
        <div className="flex items-center justify-between w-full">
          <span className="font-semibold text-[29px]">Forgot Password?</span>
          <div className="modal-close cursor-pointer" onClick={onClose}>
            <img src={closeIcon} alt="Close" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col gap-4">
            <DetailModal
              label="User ID"
              inputType="text"
              name="account_id"
              value={formData.account_id}
              onChange={handleChange}
            />
            <DetailModal
              label="Name"
              inputType="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <DetailModal
              label="Date Of Birth"
              inputType="text"
              name="birth"
              value={formData.birth}
              isDob={true}
              onChange={handleChange}
            />
            <DetailModal
              label="Phone Number"
              inputType="number"
              name="phone_no"
              value={formData.phone_no}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-4">
            <DetailModal
              label="Organization"
              inputType="select"
              optionSelect={optionsSelect}
              name="organization"
              value={formData.organization}
              onChange={handleChange}
            />
            <DetailModal
              label="Email"
              inputType="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {/* <DetailModal
              label="Position"
              inputType="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
            /> */}
            <DetailModal
              label="New Password"
              inputType="password"
              name="no_hash_password"
              value={formData.no_hash_password}
              onChange={handleChange}
            />
            <DetailModal
              label="Confirm Password"
              inputType="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </div>


        <div className="_boxBtnForgot">
          <Button
            label="Create New Password"
            customButton="button-forgot"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default ModalForgotPassword;
