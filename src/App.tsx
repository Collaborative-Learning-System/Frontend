import { Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles"; // Added ThemeProvider and createTheme import
import { ThemeContextProvider } from "./context/ThemeContext";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import MainLayout from "./layouts/MainLayout";
import Groups from "./pages/Groups";
import Home from "./pages/Home";
import StudyPlanGenerator from "./pages/study-plan-generator";
import Workspace from "./pages/Workspace";
import Profile from "./pages/Userprofile"

const App = () => {
  return (
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
          path="/study-plans-generator"
          element={
            <MainLayout>
              <StudyPlanGenerator />
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
        <Route
          path="/workspace"
          element={
            <MainLayout>
              <Workspace />
            </MainLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <MainLayout>
              <Profile />
            </MainLayout>
          }
        />
      </Routes>
    </ThemeContextProvider>
  );
};

export default App;
