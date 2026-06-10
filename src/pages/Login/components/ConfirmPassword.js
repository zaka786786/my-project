import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import Visibility from "@mui/icons-material/VisibilityOutlined";
import VisibilityOff from "@mui/icons-material/VisibilityOffOutlined";

const ConfrimPassword = ({
  handleSubmitNewPassword,
  isLoading,
  handleMove,
  handleFormState,
}) => {
  handleFormState(2);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newPassword) {
      enqueueSnackbar("Please enter your password", { variant: "error" });
      handleMove();
      return;
    }
    if (!confirmPassword) {
      handleMove();

      enqueueSnackbar("Please enter your confirm password", {
        variant: "error",
      });

      return;
    }
    if (newPassword !== confirmPassword) {
      enqueueSnackbar("Password and Confirm Password does not match", {
        variant: "error",
      });
      return;
    }
    handleSubmitNewPassword(newPassword, confirmPassword);
  };

  return (
    <>
      {" "}
      <div className="col-12 text-center ">
        <h3 className="login-text">Reset Password</h3>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="col-12 mt-4">
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Password *
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              placeholder="Password *"
              fullWidth
              onChange={(e) => setNewPassword(e.target.value)}
              name="password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? (
                      <VisibilityOff
                        style={{
                          fontSize: "18px",
                        }}
                      />
                    ) : (
                      <Visibility
                        style={{
                          fontSize: "18px",
                        }}
                      />
                    )}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
        </div>
        <div className="col-12 mt-4">
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Confirm Password *
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password *"
              fullWidth
              onChange={(e) => setConfirmPassword(e.target.value)}
              name="confirm_password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? (
                      <VisibilityOff
                        style={{
                          fontSize: "18px",
                        }}
                      />
                    ) : (
                      <Visibility
                        style={{
                          fontSize: "18px",
                        }}
                      />
                    )}
                  </IconButton>
                </InputAdornment>
              }
              label="Confirm Password"
            />
          </FormControl>
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
    </>
  );
};

export default ConfrimPassword;
