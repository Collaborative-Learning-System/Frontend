import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { AppContextProvider } from "./context/AppContext.tsx";


const theme = createTheme({
  palette: {
    mode: "light",
  },
});

import { ThemeContextProvider } from "./context/ThemeContext";


createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StrictMode>
<<<<<<< HEAD
      <ThemeContextProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ToastContainer />
          <App />
        </ThemeProvider>
      </ThemeContextProvider>
=======
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastContainer />
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </ThemeProvider>
>>>>>>> 4d17007b1843f5b52cf82eef3f52feb62d0c69d3
    </StrictMode>
  </BrowserRouter>
);
