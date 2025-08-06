import { Route, Routes, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./App.css";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import TestPage from "./pages/TestPage";
import MainLayout from "./components/MainLayout";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#083c70ff",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Navigate to="/landing" />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/landing"
          element={
            <MainLayout>
              <Landing />
            </MainLayout>
          }
        />
        <Route
          path="/test"
          element={
            <MainLayout>
              <TestPage />
            </MainLayout>
          }
        />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
