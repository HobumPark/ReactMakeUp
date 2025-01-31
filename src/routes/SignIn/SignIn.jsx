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


function SignIn() {
  const navigate = useNavigate();
  const idInputRef = useRef(null);
  const pwInputRef = useRef(null);
  const [accountInfo, setAccountInfo] = useState({
    identifier: "",
    password: "",
    remember_me: true,
  });
  const { handleLogin, getIsLogin } = useAuth({
    onLoginFail: (err) => {
      new NoticeMessage(err?.message);
    },
  });
  

  useEffect(() => {
    const isLogin = getIsLogin();
    console.log(isLogin);
    
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
    console.log(hashedPassword);
    

    handleLogin(loginPayload); 
  };
  
  return (
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
          <span className="_modalForgot" id="modalForgot">
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
    </div>
  );
}

export default SignIn;
