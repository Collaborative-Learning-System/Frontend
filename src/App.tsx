import { Route, Routes, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./App.css";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import MainLayout from "./components/MainLayout";
import Groups from "./pages/Groups";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#163b60ff",
    },
    secondary: {
      main: "#c85662ff",
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
          path="/groups"
          element={
            <MainLayout>
              <Groups />
            </MainLayout>
          }
        />
        
      </Routes>
    </ThemeProvider>
  );
};

export default App;
