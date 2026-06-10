import { useState } from "react";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import CustomPopover from "./CustomPopover";
import CustomPasswordField from "./CustomPasswordField";

import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { _change_password_user_admin } from "../DAL/Login/login";
import {
  _set_password_in_localStorage,
  encryptPassword,
} from "../utils/constant_new";
import VerificationCode from "../pages/Login/components/VerificationCode";
import { _change_password_by_admin } from "../DAL/BusinessCustomers/business_customers";

const ChangePassword = ({ modalState, setModalState }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [submitButtonLoader, setSubmitButtonLoader] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [selectedValue, setSelectedValue] = useState("other");
  const [formState, setFormState] = useState(0);
  const [verificationResponse, setVerificationResponse] = useState(null);
  const [verificationLoader, setVerificationLoader] = useState(false);

  const handleRefresh = () => {
    setModalState(false);
    localStorage.removeItem("password");
    setFormState(0);
    setPassword("");
    setconfirmPassword("");
    setOldPassword("");
    setSelectedValue("other");
  };

  const handleVerifyOtpCode = async (otp, sessionId) => {
    if (password !== confirmPassword) {
      enqueueSnackbar("Password and Confirm Password do not match", {
        variant: "error",
      });
      return;
    }

    if (oldPassword.length < 8) {
      enqueueSnackbar("Old Password must be at least 8 characters", {
        variant: "error",
      });
      return;
    }

    if (password.length < 8) {
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

    const OldEncryptedPassword = encryptPassword(oldPassword?.trim());
    const NewEncryptedPassword = encryptPassword(password?.trim());

    const payload = {
      old_password: OldEncryptedPassword,
      new_password: NewEncryptedPassword,
      confirm_password: NewEncryptedPassword,
      logout_from: selectedValue,
      otp: otp,
      sessionId: sessionId,
      call_type: formState === 0 ? "change_password" : "otp",
    };
    setVerificationLoader(true);
    const response = await _change_password_user_admin(payload);
    if (response.code === 200) {
      handleRefresh();
      if (selectedValue == "all") {
        navigate("/login");
      }
      enqueueSnackbar(response.message, { variant: "success" });
    } else {
      enqueueSnackbar(response.message, { variant: "error" });
    }
    setVerificationLoader(false);
  };

  const handleChangeRadio = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();
    // handleSubmit(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "error" });
      return;
    }

    if (oldPassword.length < 8) {
      enqueueSnackbar("Old Password must be at least 8 characters", {
        variant: "error",
      });
      return;
    }

    if (password.length < 8) {
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

    const OldEncryptedPassword = encryptPassword(oldPassword?.trim());
    const NewEncryptedPassword = encryptPassword(password?.trim());
    setSubmitButtonLoader(true);
    const data = {
      old_password: OldEncryptedPassword,
      new_password: NewEncryptedPassword,
      confirm_password: NewEncryptedPassword,
      logout_from: selectedValue,
      call_type: formState === 0 ? "change_password" : "otp",
    };

    const response = await _change_password_user_admin(data);
    if (response.code === 200) {
      if (response.two_factor_auth) {
        setFormState(1);
        _set_password_in_localStorage(oldPassword?.trim());
        setVerificationResponse({
          ...response,
          newPassword: password?.trim(),
          oldPassword: oldPassword?.trim(),
          confirmPassword: confirmPassword?.trim(),
          logout_from: selectedValue,
        });
      } else {
        if (selectedValue == "all") {
          navigate("/login");
        }
        handleRefresh();
        enqueueSnackbar(response.message, { variant: "success" });
        setSubmitButtonLoader(false);
        setModalState(false);
        if (selectedValue == "all") {
          localStorage.clear();
          navigate("/login");
        }
      }
    } else {
      enqueueSnackbar(response.message, { variant: "error" });
    }
    setSubmitButtonLoader(false);
  };

  useEffect(() => {
    if (!modalState) {
      handleRefresh();
    }
  }, [modalState]);

  return (
    <CustomPopover
      isOpenPop={modalState}
      isClosePop={() => {
        handleRefresh();
      }}
      title="Change Password"
      submitButtonText="Update"
      width={"500px"}
      showStatus={false}
      handleSubmit={formState === 0 ? handleSubmit : handleResendOtp}
      showAllButtons={formState === 0}
      submitButtonLoader={submitButtonLoader}
      componentToPassDown={
        <>
          {formState == 0 && (
            <div className="popover-mid-container pt-2">
              <div className="spacing">
                <div className="row-spacing">
                  <CustomPasswordField
                    passwordVariable={oldPassword}
                    setPasswordVariable={setOldPassword}
                    passwordLabel="Old Password"
                    Required={true}
                    show={false}
                  />
                </div>
                <div className="row-spacing">
                  <CustomPasswordField
                    passwordVariable={password}
                    setPasswordVariable={setPassword}
                    passwordLabel="Password"
                    Required={true}
                    show={false}
                  />
                  <CustomPasswordField
                    passwordVariable={confirmPassword}
                    setPasswordVariable={setconfirmPassword}
                    passwordLabel="Confirm Password"
                    Required={true}
                    show={false}
                  />
                </div>

                <div className="col-12 mt-3 radio_button">
                  <p>For security reasons, would you like to:</p>
                  <FormControl>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      defaultValue="other"
                      onChange={handleChangeRadio}
                      value={selectedValue}
                    >
                      <FormControlLabel
                        control={<Radio />}
                        value="other"
                        label="Logout from other devices"
                      />
                      <FormControlLabel
                        value="all"
                        control={<Radio />}
                        label="Logout from all devices"
                      />
                    </RadioGroup>
                  </FormControl>
                </div>
              </div>
            </div>
          )}
          {formState == 1 && (
            <VerificationCode
              changePassword={true}
              setVerificationResponse={setVerificationResponse}
              data={verificationResponse}
              isLoading={verificationLoader}
              setIsLoading={setVerificationLoader}
              onHandlePinCodeSubmit={handleVerifyOtpCode}
              // handleGetPinAgain={handleGetPinAgain}
            />
          )}
        </>
      }
    />
  );
};

export default ChangePassword;
