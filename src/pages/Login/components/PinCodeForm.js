import { Button } from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import PinInput from "react-pin-input";

const PinCodeForm = ({
  handleSubmitPinCode,
  isLoading,
  handleMove,
  handleFormState
}) => {
  handleFormState(1)
  const [pinCode, setPinCode] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pinCode) {
      enqueueSnackbar("Please enter your pin code", { variant: "error" });
      handleMove();
      return;
    }
    handleSubmitPinCode(pinCode);
  };

  return (
    <>
      <div id="handle_move">
        <div>
          <form onSubmit={handleSubmit}>
            <div className="col-12 pt-4">
              <div className="mb-3">
                <label className="form-label">Enter PIN Code here. *</label>
                <PinInput
                  length={6}
                  secret={false}
                  onChange={(value, index) => setPinCode(value)}
                  type="numeric"
                  inputMode="number"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                  inputStyle={{ borderColor: "#5792c9" }}
                  inputFocusStyle={{ borderColor: "green" }}
                  onComplete={(value, index) => {
                    setPinCode(value);
                  }}
                  autoSelect={true}
                  regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
                />
              </div>
              <div className="col-12 mt-2">
                <div className="position-relative">
                  <div
                    className="float-end pb-2 pointer"
                    onClick={() => handleFormState(-1)}
                  >
                    <a className="text-muted">Back to Login </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <Button
                type="submit"
                variant="contained"
                className="w-100 login-page-button"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PinCodeForm;
