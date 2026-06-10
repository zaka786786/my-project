import { TextField, IconButton, InputAdornment } from "@mui/material";
import { useState } from "react";
import Iconify from "./Iconify";
// ----------------------------------------------------------------------

export default function CustomPasswordField({
  passwordVariable,
  setPasswordVariable,
  passwordLabel,
  Required,
  show,
}) {
  const [showPassword, setShowPassword] = useState(show ? show : false);

  const handleChange = (e) => {
    const { value } = e.target;
    setPasswordVariable(value);
  };

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <>
      <TextField
        fullWidth
        label={passwordLabel}
        value={passwordVariable}
        onChange={handleChange}
        name="passwordVariable"
        required={Required}
        autoComplete="new-password"
        type={showPassword ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleShowPassword} edge="end">
                <Iconify
                  icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </>
  );
}
