import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

export default function ThemeConfig({ children }) {
  const themeOptions = {
    palette: {
      primary: {
        main: "#5792c9",
      },
      secondary: {
        main: "#5792c9",
      },
      text: {
        primary: "#000",
      },
    },
    // components: {
    //   MuiCard: {
    //     styleOverrides: {
    //       root: {
    //         boxShadow: `rgba(0, 0, 0, 0.09) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px`,
    //         "&:hover": {
    //           boxShadow: `rgba(0, 0, 0, 0.09) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px`,
    //         },
    //       },
    //     },
    //   },
    // },
    typography: {
      fontFamily: "Manrope, Arial, sans-serif",
    },
  };

  const theme = createTheme(themeOptions);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
