import { Route, Routes, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./App.css";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import UserProfile from "./pages/Userprofile";
import Contact from "./pages/contact-us";
import StudyPlanGenerator from "./pages/study-plan-generator";

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
        
        <Route path="/auth" element={<Auth />} />
        {/* <Route
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
        /> */}
        <Route path="/" element={<Home />} />
        <Route path="/userprof" element={<UserProfile />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/study-plan-generator" element={<StudyPlanGenerator />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
