import { useEffect, useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const CustomTextFieldTypePassword = ({
  name,
  placeholder,
  value,
  onChange,
}) => {
  const [showSecretField, setShowSecretField] = useState(false);
  return (
    <TextField
      fullWidth
      size="small"
      required
      variant="outlined"
      type={showSecretField ? "text" : "password"}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={() => setShowSecretField(false)}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowSecretField(!showSecretField)}
              edge="end"
            >
              {showSecretField ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default CustomTextFieldTypePassword;
