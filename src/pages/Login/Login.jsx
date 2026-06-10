import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginImage2, LogoNew } from "../../assets";
import LoginForm from "./components/LoginForm";
import EmailForm from "./components/EmailForm";
import PinCodeForm from "./components/PinCodeForm";
import ConfirmPassword from "./components/ConfirmPassword";
import { useSnackbar } from "notistack";
import {
  _code_verification_api,
  _email_verification_api,
  _reset_password_api,
} from "../../DAL/Login/login";
import VerificationCode from "./components/VerificationCode";
import { Typography } from "@mui/material";
import { encryptPassword } from "../../utils/constant_new";

const Login = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [formState, setFormState] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [verificationLoader, setVerificationLoader] = useState(false);
  const [verificationResponse, setVerificationResponse] = useState(null);

  const handleVerifyOtpCode = async (otpCode) => {};
  const handleMove = () => {
    const handle_move = document.getElementById("handle_move");
    if (handle_move) {
      handle_move.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleAlertClose = () => {
    setErrorMessage("");
  };

  const handleSubmitEmail = async (email) => {
    setAdminEmail(email);
    let postData = {
      email: email,
      type: 0,
    };

    const result = await _email_verification_api(postData);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      setFormState(1);
      sessionStorage.setItem("formState", 1);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleSubmitPinCode = async (pinCode) => {
    let postData = {
      email: adminEmail,
      verification_code: pinCode,
      type: 0,
    };

    const result = await _code_verification_api(postData);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      setFormState(2);
      sessionStorage.setItem("formState", 2);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleSubmitNewPassword = async (newPassword, confirmPassword) => {
    if (newPassword !== confirmPassword) {
      enqueueSnackbar("Password and Confirm Password do not match", {
        variant: "error",
      });
      return;
    }
    if (newPassword.length < 8) {
      enqueueSnackbar("Password must be at least 8 characters", {
        variant: "error",
      });
      return;
    }
    if (confirmPassword.length < 8) {
      enqueueSnackbar("Confirm Password must be at least 8 characters", {
        variant: "error",
      });
      return;
    }

    const encryptedPassword = encryptPassword(confirmPassword.trim());

    let postData = {
      email: adminEmail,
      password: encryptedPassword,
      confirm_password: encryptedPassword,
      type: 0,
    };

    const result = await _reset_password_api(postData);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      setFormState(-1);
      sessionStorage.setItem("formState", -1);
      navigate("/login");
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleFormState = (state) => {
    sessionStorage.setItem("formState", state);
    setFormState(state);
  };

  useEffect(() => {
    const formStatefromStorage = sessionStorage.getItem("formState");
    if (formStatefromStorage !== null) {
      setFormState(parseInt(formStatefromStorage));
    }
  }, []);

  return (
    <>
      <div className="full-height-container">
        <div className="row g-0 align-items-center">
          <div className="col-md-6 col-lg-4" id="handle_move">
            <div className="p-5 pt-4 card-body">
              <div
                className="d-flex flex-column justify-content-center align-items-center "
                style={{ height: "100%" }}
              >
                <div className="text-center">
                  <img
                    src={LogoNew}
                    className="img-fluid login-img-min-max"
                    alt="Login Logo"
                  />
                </div>
              </div>

              <LoginForm
                setFormState={setFormState}
                setVerificationResponse={setVerificationResponse}
              />
            </div>
          </div>
          <div
            className="col-md-6 col-lg-8 overlay-container d-none d-md-block"
            style={{
              backgroundImage: `url(${loginImage2})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center center",
            }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default Login;
