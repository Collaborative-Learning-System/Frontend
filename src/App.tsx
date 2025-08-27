import { Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles"; // Added ThemeProvider and createTheme import
import { ThemeContextProvider } from "./context/ThemeContext";
import "./App.css";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import MainLayout from "./components/MainLayout";
import Workspace from "./pages/Workspace";
import Home from "./pages/Home"; // Added missing Home import

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
    <ThemeProvider theme={theme}> {/* Wrap with ThemeProvider */}
      <ThemeContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
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
      </ThemeContextProvider>
    </ThemeProvider>
  );
};

export default App;
