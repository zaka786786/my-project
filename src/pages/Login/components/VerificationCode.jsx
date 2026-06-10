import React, { useState, useEffect, useRef } from "react";
import PinField from "react-pin-field";
import { useSnackbar } from "notistack";
import { Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useAdminContext } from "../../../Hooks/AdminContext";
import { useNavigate } from "react-router-dom";
import {
  _admin_login_api,
  _change_password_user_admin,
} from "../../../DAL/Login/login";
import {
  _set_password_in_localStorage,
  _set_token_in_localStorage,
  _set_user_email_in_localStorage,
  _set_user_in_localStorage,
  htmlDecode,
} from "../../../utils/constant_new";

export default function VerificationCode({
  onHandlePinCodeSubmit,
  setIsLoading,
  isLoading,
  data,
  setVerificationResponse,
  changePassword = false,
  // handleGetPinAgain,
}) {
  const navigate = useNavigate();
  const { setUserInfo } = useAdminContext();
  const { enqueueSnackbar } = useSnackbar();
  const [pinCode, setPinCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(10);
  const [isTimerExpired, setIsTimerExpired] = useState(false);
  const [loading, setLoading] = useState(false);
  const email = localStorage.getItem("email");
  const password = localStorage.getItem("password");

  const pinRef = useRef(null); // <-- ref for PinField

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsTimerExpired(true);
      enqueueSnackbar("Verification code expired. Please request a new code.", {
        variant: "warning",
      });
    }
  }, [timeLeft, enqueueSnackbar]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleGetPinAgain = async () => {
    console.log(data, "datadatadatadatadatadatadata");

    const payload = {
      old_password: data?.oldPassword?.trim(),
      new_password: data?.newPassword?.trim(),
      confirm_password: data?.confirmPassword?.trim(),
      logout_from: data?.logout_from,
      call_type: "change_password",
    };
    setIsLoading(true);
    setLoading(true);
    const response = await _change_password_user_admin(payload);
    if (response.code === 200) {
      setIsTimerExpired(false);
      setPinCode("");
      setTimeLeft(response.expiresIn);
      _set_password_in_localStorage(data?.newPassword?.trim());
      setVerificationResponse({
        ...response,
        newPassword: data?.newPassword?.trim(),
        oldPassword: data?.oldPassword?.trim(),
        confirmPassword: data?.confirmPassword?.trim(),
        logout_from: data?.logout_from,
      });
      _set_user_email_in_localStorage(response.email);
      enqueueSnackbar(response.message, { variant: "success" });
    } else {
      enqueueSnackbar(response.message, { variant: "error" });
    }
    setIsLoading(false);
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isTimerExpired) {
      enqueueSnackbar("Verification code expired. Please request a new code.", {
        variant: "error",
      });
      return;
    }
    setIsLoading(true);
    if (pinCode.length > 5) {
      if (changePassword) {
        onHandlePinCodeSubmit(pinCode, data?.sessionId);
      } else {
        handleVerifyOtpCode(pinCode);
      }
    } else {
      enqueueSnackbar("Please enter the 6-digit verification code", {
        variant: "error",
      });
      setIsLoading(false);
    }
  };
  const handleVerifyOtpCode = async (pinCode) => {
    setLoading(true);

    let postData = {
      type: 0,
      email: data?.user?.email ?? email,
      password: data?.password ?? password,
      call_type: pinCode ? "otp" : "login",
      sessionId: data?.sessionId,
      otp: pinCode,
    };
    if (!pinCode) {
      delete postData.otp;
      delete postData.sessionId;
    }
    const result = await _admin_login_api(postData);
    if (result.code === 200) {
      setVerificationResponse(result);
      setTimeLeft(result?.expiresIn);
      setIsTimerExpired(false);
      setPinCode("");
      if (pinCode) {
        setUserInfo(result.user);
        _set_token_in_localStorage(result.token);
        _set_user_in_localStorage(result.user);
        navigate(`/dashboard`, { replace: true });
      }
      setLoading(false);
      enqueueSnackbar(result.message, { variant: "success" });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
    setIsLoading(false);
    setLoading(false);
  };
  const handleResend = async () => {
    await handleVerifyOtpCode(null);
  };

  useEffect(() => {
    if (data?.expiresIn) {
      setTimeLeft(Number(data?.expiresIn));
    }
  }, [data]);

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3} className={changePassword ? "" : "text-center mt-3"}>
        <Typography
          variant="h6"
          gutterBottom
          className="verification-code-title"
        >
          {htmlDecode("Verify Your Account")}
        </Typography>
        <p className="text-muted mt-1" style={{ fontSize: "14px" }}>
          We have sent a 6-digit verification code to{" "}
          <span style={{ color: "#5792c9" }}>
            {" "}
            {data?.user?.email ?? email}{" "}
          </span>{" "}
          <br />
          Please check your inbox and enter the verification code below to
          confirm your email address.
        </p>
        <div className="d-flex justify-content-between">
          <PinField
            ref={pinRef}
            onChange={isTimerExpired ? () => {} : setPinCode}
            type="numeric"
            inputMode="number"
            validate={/^[0-9]$/}
            length={6}
            style={{
              caretColor: "black",
              width: 50,
              height: 50,
              outline: "none",
              textAlign: "center",
              backgroundColor: "white",
              borderColor: "#5792c9",
              opacity: isTimerExpired ? 0.5 : 1,
            }}
            inputStyle={{ borderColor: isTimerExpired ? "#ccc" : "#e4c073" }}
            inputFocusStyle={{ borderColor: isTimerExpired ? "#ccc" : "blue" }}
          />
        </div>

        <Typography
          variant="body2"
          color={
            isTimerExpired ? "#5792c9" : timeLeft <= 30 ? "error" : "#5792c9"
          }
          sx={{ textAlign: "end" }}
        >
          {isTimerExpired ? (
            <span
              style={{ textDecoration: "underline", cursor: "pointer" }}
              onClick={() => {
                changePassword ? handleGetPinAgain() : handleResend();
              }}
              disabled={loading}
            >
              {loading ? "Please wait..." : "Resend Code"}
            </span>
          ) : (
            <>
              <span className="text-muted">Resend Code in: </span>
              {formatTime(timeLeft)}
            </>
          )}
        </Typography>
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ my: 2 }}
      >
        <LoadingButton
          fullWidth
          size="large"
          onClick={handleSubmit}
          variant="contained"
          disabled={isTimerExpired || isLoading}
        >
          {isLoading
            ? "Submitting..."
            : isTimerExpired
            ? "Code Expired"
            : "Submit"}
        </LoadingButton>
      </Stack>
    </form>
  );
}
