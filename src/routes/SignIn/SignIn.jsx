import React, { useEffect, useRef, useState } from "react";
import GeneralInput from "../../components/GeneralInput/GeneralInput";
import Button from "../../components/Button/Button";
import logo from '../../assets/img/logo-signIn.png';
import classes from './SignIn.module.css'; 
import PasswordInput from "../../components/PasswordInput/PasswordInput";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Common from "../../utils/standard";
import NoticeMessage from "../../plugin/noticemessage/noticemessage";
import ModalForgotPassword from "../../components/Modal/ModalForgotPassword/ModalForgotPassword";
import useCommonCodes from "../../hooks/useCommonCodes";


function SignIn() {
  const navigate = useNavigate();
  const idInputRef = useRef(null);
  const [optionParams] = useState("upper-code=ORG");
  const pwInputRef = useRef(null);
  const [accountInfo, setAccountInfo] = useState({
    identifier: "",
    password: "",
    remember_me: true,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { handleLogin, getIsLogin } = useAuth({
    onLoginFail: (err) => {
      new NoticeMessage(err?.message);
    },
  });

  const handleOnKeyID = (event) => {
    const keyInput = event.key;
    const target = event.target;
    const idValue = target.value;
    if (keyInput === "Enter") {
      if (idValue === "") {
        return;
      }

      
      if (!pwInputRef.current.value) {
        pwInputRef.current.focus();
        return;
      }
      onLogin();
    }
  };
  

  const handleOnKeyPW = (event) => {
    const keyInput = event.key;
    const target = event.target;
    const pwValue = target.value;
    if (keyInput === "Enter") {
      if (!idInputRef.current.value) {
        idInputRef.current.focus();
      }

      if (pwValue === "") {
        return;
      }

      onLogin();
    }
  };
  

  useEffect(() => {
    if (idInputRef.current) {
      idInputRef.current.focus();
    }
    const isLogin = getIsLogin();

    if (isLogin) {
        navigate("/system-management/user");
    }
  }, [navigate]);

  const onLogin = () => {
    const hashedPassword = Common.SHA256(accountInfo.password.trim());
    const loginPayload = {
      ...accountInfo,
      password: hashedPassword, 
    };
    console.log(loginPayload);
    
    handleLogin(loginPayload); 
  };

  const { commonListData } = useCommonCodes({ optionParams });
  console.log(commonListData)
  const optionORG = commonListData?.["ORG"]
  ? [
      { value: "", label: "All", code: "All" }, 
      ...commonListData["ORG"].code.map((code, index) => ({
        value: code,
        label: commonListData["ORG"].name[index],
        code: code,
      })),
    ]
  : [];

  
  return (
    <>
    <div className={classes.wrapperSignIn}>
      <section className={classes._containerLogIn}>
        <img
          src={logo}
          alt="Logo"
          className={classes.logo}
        />

        <div className={classes._boxInput}>
          <GeneralInput
            ref={idInputRef}
            customInput={classes._inputUser}
            placeholder="User ID"
            value={accountInfo.identifier.trim()}
            type={'text'}
            onKeyUp={handleOnKeyID}
            maxLength={20}
            onChange={({ target }) =>
              setAccountInfo((curInfo) => ({
                ...curInfo,
                identifier: target.value.trim(),
              }))
            }
          />

            <PasswordInput
              ref={pwInputRef}
              customInput={classes._inputPassword}
              placeholder="Password"
              onKeyUp={handleOnKeyPW}
              maxLength={20}
              value={accountInfo.password.trim()}
              onChange={({ target }) =>
              setAccountInfo((curInfo) => ({
                ...curInfo,
                password: target.value.trim(),
              }))
            }
            />
          
        </div>

        <div className={classes._btnSend}>
          <span className="_modalForgot" id="modalForgot" onClick={() => setIsModalOpen(true)}>
            Forgot Password?
          </span>
          <Button
            label="Sign in"
            customButton={classes.btnlogin}
            onClick={onLogin}
          />
        </div>
      </section>
      
      <div className={classes._boxTitle}>
        <h1 className="h-1">“Empowering Smart Mobility, Enforcing Safer Roads”</h1>
      </div>
      <ModalForgotPassword
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      optionsSelect = {optionORG}/>
    </div>


    </>
  );
}

export default SignIn;
