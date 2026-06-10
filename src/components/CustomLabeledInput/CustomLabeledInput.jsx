import React, { useState } from "react"; // <-- Add useState
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Icon } from "@iconify/react";

const CustomLabeledInput = ({
  label,
  icon,
  name,
  value,
  onChange,
  placeholder,
  onBlur,
  error,
  helperText,
  InputProps,
  type = "text", // Accept type
  disabled,
  autoComplete,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = name === "password";

  return (
    <div className="mb-0">
      <label className="form-label mb-2 label-text d-flex align-items-center">
        {icon && (
          <Icon
            icon={icon}
            width={22}
            height={22}
            className="me-1 tabs-icon-color"
          />
        )}
        {label}
      </label>
      <TextField
        fullWidth
        size="small"
        variant="outlined"
        disabled={disabled}
        name={name}
        type={isPassword && showPassword ? "text" : type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        error={error}
        helperText={helperText}
        autoComplete={autoComplete}
        InputProps={{
          ...InputProps,
          endAdornment: (
            <>
              {/* Render any parent-passed adornment like loader */}
              {InputProps?.endAdornment}

              {/* Render eye icon only for password field */}
              {isPassword && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    <Icon
                      icon={
                        showPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"
                      }
                    />
                  </IconButton>
                </InputAdornment>
              )}
            </>
          ),
        }}
      />
    </div>
  );
};

export default CustomLabeledInput;
