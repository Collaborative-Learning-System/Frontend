import { Route, Routes } from "react-router-dom";
import { ThemeContextProvider } from "./context/ThemeContext";
import "./App.css";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import MainLayout from "./components/MainLayout";
<<<<<<< HEAD
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
=======
import Groups from "./pages/Groups";
import Home from "./pages/Home"
import StudyPlanGenerator from "./pages/study-plan-generator";
>>>>>>> 4d17007b1843f5b52cf82eef3f52feb62d0c69d3

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
<<<<<<< HEAD
          path="/workspace"
=======
          path="/study-plans-generator"
          element={
            <MainLayout>
              <StudyPlanGenerator />
            </MainLayout>
          }
        />
        <Route
          path="/groups"
>>>>>>> 4d17007b1843f5b52cf82eef3f52feb62d0c69d3
          element={
            <MainLayout>
              <Workspace />
            </MainLayout>
          }
        />
      </Routes>
    </ThemeContextProvider>
  );
};

export default App;
