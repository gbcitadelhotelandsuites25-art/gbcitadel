import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",

    background: {
      default: "#0b0f14",
      paper: "#121821",
    },

    primary: {
      main: "#c9a227", // hotel gold
    },

    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
    },
  },
});