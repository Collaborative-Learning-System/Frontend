import { Route, Routes, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./App.css";
import Auth from "./pages/Auth";

import Landing from "./pages/Landing";
import MainLayout from "./components/MainLayout";
import Workspace from "./pages/Workspace";


const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
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
          path="/workspace"
          element={
            <MainLayout>
              <Workspace />
            </MainLayout>
          }

        />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
