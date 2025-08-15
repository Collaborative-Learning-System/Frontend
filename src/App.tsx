import { Route, Routes } from "react-router-dom";
import { ThemeContextProvider } from "./context/ThemeContext";
import "./App.css";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import MainLayout from "./components/MainLayout";
import Groups from "./pages/Groups";
import Home from "./pages/Home"
import StudyPlanGenerator from "./pages/study-plan-generator";

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
      </Routes>
    </ThemeContextProvider>
  );
};

export default App;
