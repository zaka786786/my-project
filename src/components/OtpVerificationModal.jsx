import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Close as CloseIcon } from "@mui/icons-material";
import PinField from "react-pin-field";

const OtpVerificationModal = ({
  open,
  onClose,
  onSubmit,
  onResend,
  title = "OTP Verification",
  description = "Please enter the verification code sent to your email.",
  email = "",
  length = 6,
  expirySeconds,
  loading = false,
  submitText = "Verify",
  showTimer = false,
  canResend = true,
  setExpiresIn = () => {},
}) => {
  const [otpCode, setOtpCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(expirySeconds);
  const [isTimerExpired, setIsTimerExpired] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [pinKey, setPinKey] = useState(0); // Key to force re-render of PinField
  const pinRef = useRef([]);
  const hasStartedCounting = useRef(false);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setOtpCode("");
      setTimeLeft(expirySeconds);
      setIsTimerExpired(false);
      hasStartedCounting.current = false; // Reset the ref
    }
  }, [open, expirySeconds]);

  // Timer countdown
  useEffect(() => {
    if (!open) return;
    if (timeLeft > 0) {
      hasStartedCounting.current = true; // Mark that counting has started
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (hasStartedCounting.current) {
      // Only expire if we actually counted down
      setIsTimerExpired(true);
    }
  }, [timeLeft, open]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (isTimerExpired) return;
    if (otpCode.length === length) {
      onSubmit(otpCode);
    }
  };

  const handleResend = async () => {
    if (onResend) {
      setResendLoading(true);
      await onResend();
      setResendLoading(false);
      setOtpCode("");
      setTimeLeft(expirySeconds);
      setIsTimerExpired(false);
      setPinKey((prev) => prev + 1);
    }
  };

  const handleClose = () => {
    setOtpCode("");
    setTimeLeft(expirySeconds);
    setIsTimerExpired(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        style: {
          borderRadius: "20px",
          width: 450,
          maxWidth: "95vw",
        },
      }}
    >
      <DialogTitle>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">{title}</h5>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <div className="text-center mb-4">
            <Typography variant="body2" color="text.secondary">
              {description}
              {email && (
                <>
                  <br />
                  <span style={{ color: "#5792c9", fontWeight: 500 }}>
                    {email}
                  </span>
                </>
              )}
            </Typography>
          </div>

          {/* OTP Input Fields */}
          <div className="d-flex justify-content-center gap-2 mb-3">
            <PinField
              key={pinKey}
              ref={pinRef}
              onChange={isTimerExpired ? () => {} : setOtpCode}
              type="number"
              inputMode="number"
              validate={/^[0-9]$/}
              length={length}
              style={{
                caretColor: "black",
                width: 45,
                height: 50,
                outline: "none",
                textAlign: "center",
                backgroundColor: "white",
                border: "2px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "20px",
                fontWeight: "600",
                opacity: isTimerExpired ? 0.5 : 1,
              }}
              inputStyle={{
                borderColor: isTimerExpired ? "#ccc" : "#5792c9",
              }}
              inputFocusStyle={{
                borderColor: isTimerExpired ? "#ccc" : "#5792c9",
                boxShadow: isTimerExpired
                  ? "none"
                  : "0 0 0 2px rgba(87, 146, 201, 0.2)",
              }}
            />
          </div>

          {/* Timer / Resend */}
          <div className="text-center mb-2">
            {isTimerExpired && !loading ? (
              <Typography variant="body2">
                <span
                  style={{
                    color: "#5792c9",
                    textDecoration: "underline",
                    cursor: resendLoading ? "not-allowed" : "pointer",
                  }}
                  onClick={!resendLoading ? handleResend : undefined}
                >
                  {resendLoading ? "Sending..." : "Resend Code"}
                </span>
              </Typography>
            ) : (
              <>
                {showTimer && (
                  <Typography variant="body2">
                    <span className="text-muted">Code expires in: </span>
                    <span style={{ fontWeight: 600 }}>
                      {formatTime(timeLeft || 0)}
                    </span>
                  </Typography>
                )}
              </>
            )}
          </div>
        </form>
      </DialogContent>

      <DialogActions className="p-3 pt-1">
        <Button variant="outlined" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <LoadingButton
          variant="contained"
          color="primary"
          loading={loading}
          onClick={handleSubmit}
          disabled={otpCode.length !== length || isTimerExpired}
        >
          {isTimerExpired ? "Code Expired" : submitText}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default OtpVerificationModal;
