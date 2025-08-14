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

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastContainer />
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </ThemeProvider>
    </StrictMode>
  </BrowserRouter>
);
