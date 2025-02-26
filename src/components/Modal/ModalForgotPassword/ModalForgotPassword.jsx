import { useEffect, useState } from "react";
import closeIcon from "../../../assets/icon/close-icon.svg";
import DetailModal from "../../DetailModal/DetailModal";
import Button from "../../Button/Button";
import 'air-datepicker/air-datepicker.css';
import localeKo from 'air-datepicker/locale/ko.js'; 
import AirDatepicker from "air-datepicker";
import Common from '../../../utils/standard';
import { formatDateToYYYYMMDD } from "../../../utils/date";
import useAuth from "../../../hooks/useAuth";
import NoticeMessage from "../../../plugin/noticemessage/noticemessage";


const ModalForgotPassword = ({ isOpen, onClose, optionsSelect }) => {
  const [formData, setFormData] = useState({
    user_id: "",
    name: "",
    birth: "",
    org: "",
    email: "",
    phone: "",
    new_pass: "", 
    co_pass: "",
    // e_password: "", //Hash 
    // eco_password:"" //Hash
  });
  const optionsDate = {
    autoClose: true,
    locale: localeKo,
    position: 'top center',
    onSelect: (date) => {
      setFormData((prevValues) => ({
        ...prevValues,
        birth: date.formattedDate, 
      }));
    },
  };
  useEffect(() => {
    if (isOpen) {
      const inputElement = document.querySelector('[name="birth"]');
      if (inputElement && !inputElement._airDatepicker) {
        new AirDatepicker(inputElement, optionsDate);
      }
    }
  }, [isOpen]);
  
  const { handleForgotPassword } = useAuth({
    onResetFail: (err) => {
      new NoticeMessage(err?.message);
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {

    const dataToSend = {
      user_id: formData.user_id,
      name: formData.name,
      birth: formatDateToYYYYMMDD(formData.birth),
      org: formData.org,
      email: formData.email,
      phone: formData.phone,
      new_pass: formData.new_pass, 
      co_pass: formData.co_pass,
      epassword: Common.SHA256(formData.new_pass.trim()), //Hash 
      eco_password:Common.SHA256(formData.co_pass.trim()) //Hash 
    };

    console.log("Form Data to Send:", dataToSend);
    handleForgotPassword(dataToSend)
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
          <span className="font-semibold text-[29px]">비밀번호를 잊으셨나요?</span>
          <div className="modal-close cursor-pointer" onClick={onClose}>
            <img src={closeIcon} alt="Close" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col gap-4">
            <DetailModal
              label="아이디"
              inputType="text"
              name={"user_id"}
              value={formData.user_id}
              onChange={handleChange}
              modalType={'forgot'}
            />
            <DetailModal
              label="이름"
              inputType="text"
              name={"name"}
              value={formData.name}
              onChange={handleChange}
              modalType={'forgot'}
            />
            <DetailModal
              label="생일"
              inputType="text"
              name={"birth"}
              value={formData.birth}
              isDob={true}
              onChange={handleChange}
              modalType={'forgot'}
            />
            <DetailModal
              label="전화번호"
              inputType="text"
              pattern={/^[0-9]*$/} 
              name={"phone"}
              value={formData.phone}
              onChange={handleChange}
              modalType={'forgot'}
            />
          </div>

          <div className="flex flex-col gap-4">
            
            <DetailModal
              label="조직"
              inputType="select"
              optionSelect={optionsSelect}
              name={"org"}
              value={formData.org}
              onChange={handleChange}
              modalType={'forgot'}
            />

            <DetailModal
              label="이메일"
              inputType="text"
              name={"email"}
              value={formData.email}
              onChange={handleChange}
              modalType={'forgot'}
            />

            <DetailModal
              label="새 비밀번호"
              inputType="password"
              name={"new_pass"}
              value={formData.new_pass}
              onChange={handleChange}
              maxLength={20}
              modalType={'forgot'}
            />

            <DetailModal
              label="비밀번호 확인"
              inputType="password"
              name={"co_pass"}
              value={formData.co_pass}
              onChange={handleChange}
              maxLength={20}
              modalType={'forgot'}
            />
            
          </div>
        </div>


        <div className="_boxBtnForgot">
          <Button
            label="새로운 비밀번호 생성"
            customButton="button-forgot"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default ModalForgotPassword;
