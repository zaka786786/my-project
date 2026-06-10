import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PinCodeForm from "./PinCodeForm";
import ConfirmPassword from "./ConfirmPassword";
import EmailForm from "./EmailForm";
import { useSnackbar } from "notistack";
import { _reset_password_api } from "../../../DAL/Login/login";
import { encryptPassword } from "../../../utils/constant_new";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleMove = () => {
    const handle_move = document.getElementById("handle_move");
    if (handle_move) {
      handle_move.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleAlertClose = () => {
    setErrorMessage("");
  };

  const handleSubmitEmail = async (_email) => {
    setEmail(_email);
    setFormState(1);
  };

  const handleSubmitPinCode = async (pinCode) => {
    setFormState(2);
  };

  const handleSubmitNewPassword = async (e, newPassword, confirmPassword) => {
    e.preventDefault();
    setIsLoading(true);
    if (newPassword !== confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "error" });
      setIsLoading(false);
      return;
    }

    const EncryptedPassword = encryptPassword(newPassword?.trim());

    const postData = {
      email,
      password: EncryptedPassword,
      confirm_password: EncryptedPassword,
      type: 0,
    };

    const result = await _reset_password_api(postData);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      navigate(`/dashboard`, { replace: true });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  return (
    <>
      {formState === 0 ? (
        <EmailForm
          handleSubmitEmail={handleSubmitEmail}
          errorMessage={errorMessage}
          handleAlertClose={handleAlertClose}
          setErrorMessage={setErrorMessage}
          handleMove={handleMove}
          isLoading={isLoading}
        />
      ) : formState === 1 ? (
        <PinCodeForm
          handleSubmitPinCode={handleSubmitPinCode}
          isLoading={isLoading}
          errorMessage={errorMessage}
          handleAlertClose={handleAlertClose}
          setErrorMessage={setErrorMessage}
          handleMove={handleMove}
        />
      ) : (
        <ConfirmPassword
          handleSubmitNewPassword={handleSubmitNewPassword}
          isLoading={isLoading}
          errorMessage={errorMessage}
          handleAlertClose={handleAlertClose}
          setErrorMessage={setErrorMessage}
          handleMove={handleMove}
        />
      )}
    </>
  );
};

export default ForgotPassword;
