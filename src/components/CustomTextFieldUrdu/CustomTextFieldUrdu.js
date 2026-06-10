import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Consuming the outer theme is only required with coexisting themes, like in this documentation.
// If your app/website doesn't deal with this, you can have just:
// const theme = createTheme({ direction: 'rtl' })
const theme = (outerTheme) =>
  createTheme({
    direction: "rtl",
    palette: {
      mode: outerTheme.palette.mode,
    },
  });

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});
const cacheLtr = createCache({
  key: "muiltr",
});

export default function CustomTextFieldUrdu({
  label,
  value,
  onChange,
  name,
  placeholder,
  required = false,
  direction = "rtl",
  labelDirection = "right",
  disabled = false,
  multiline = false,
  rows = 0,
}) {
  return (
    <CacheProvider value={labelDirection == "right" ? cacheRtl : cacheLtr}>
      <ThemeProvider theme={theme}>
        <div
          dir={direction}
          className="w-100 font-family-urdu custom-urdu-text-field mb-2"
        >
          <TextField
            fullWidth
            value={value}
            onChange={onChange}
            name={name}
            label={label}
            placeholder={placeholder}
            // helperText=""
            variant="outlined"
            required={required}
            className="custom-urdu-text-field"
            disabled={disabled}
            multiline={multiline}
            rows={rows}
          />
        </div>
      </ThemeProvider>
    </CacheProvider>
  );
}
