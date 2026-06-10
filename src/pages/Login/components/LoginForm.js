import React, { useState } from "react";
import Visibility from "@mui/icons-material/VisibilityOutlined";
import VisibilityOff from "@mui/icons-material/VisibilityOffOutlined";
import { useNavigate } from "react-router-dom";
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";

import { useSnackbar } from "notistack";
import {
  _set_token_in_localStorage,
  _set_user_in_localStorage,
} from "../../../local_storage/local_storage";
import { useAdminContext } from "../../../Hooks/AdminContext";
import { _admin_login_api } from "../../../DAL/Login/login";
import {
  _set_password_in_localStorage,
  _set_user_email_in_localStorage,
  decryptToken,
  encryptPassword,
} from "../../../utils/constant_new";
import { ConnectingAirportsOutlined } from "@mui/icons-material";
const LoginForm = ({ setFormState, setVerificationResponse }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setUserInfo } = useAdminContext();

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  //  logn api hitting  function
  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    if (inputs.password.length < 8) {
      enqueueSnackbar("Password must be at least 8 characters long", {
        variant: "error",
      });
      return;
    }
    setIsLoading(true);

    const password = encryptPassword(inputs.password?.trim());
    let postData = {
      email: inputs.email?.trim(),
      password: password,
      call_type: "login",
      type: 0,
    };

    // console.log("postData  __postData", postData);
    // console.log("inputs.password  __postData", inputs.password);
    // console.log("password  __postData", password);
    // console.log("decryptToken(password)  __postData", decryptToken(password));
    const result = await _admin_login_api(postData);
    if (result.code === 200) {
      if (result?.two_factor_auth) {
        setFormState(4);
        _set_user_email_in_localStorage(result.email);
        _set_password_in_localStorage(inputs.password?.trim());
        setVerificationResponse({
          ...result,
          password: inputs.password?.trim(),
        });
        setFormState(4);
      } else {
        setUserInfo(result.user);
        _set_token_in_localStorage(result.token);
        _set_user_in_localStorage(result.user);
        enqueueSnackbar(result.message, { variant: "success" });
        navigate(`/dashboard`, { replace: true });
      }
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="col-12 text-center mt-3">
        <h3 className="login-text">Login</h3>
      </div>
      <form onSubmit={handleSubmitLogin}>
        <div className="col-12 mt-4">
          <TextField
            id="outlined-basic"
            label="Email"
            name="email"
            type=""
            variant="outlined"
            fullWidth
            required
            placeholder="Email"
            value={inputs.email}
            onChange={handleChange}
          />
        </div>
        <div className="col-12 mt-3 mb-1">
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Password *
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              placeholder="Password *"
              fullWidth
              required
              name="password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {!showPassword ? (
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
              value={inputs.password}
              onChange={handleChange}
            />
          </FormControl>
        </div>

        <div className="mt-3">
          <Button
            type="submit"
            variant="contained"
            className="w-100 login-page-button"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Login"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
