import { Route, Routes, Navigate } from "react-router-dom";
import { ThemeContextProvider } from "./context/ThemeContext";
import "./App.css";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import MainLayout from "./components/MainLayout";
import Groups from "./pages/Groups";
import Quiz from "./pages/Quiz";
//import QuizCreation from "./pages/QuizCreation";

const App = () => {
  return (
    <ThemeContextProvider>
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
        <Route
          path="/quiz"
          element={
            <MainLayout>
              <Quiz />
            </MainLayout>
          }
        />
        {/* <Route
          path="/quiz-creation"
          element={
            <MainLayout>
              <QuizCreation />
            </MainLayout>
          }
        /> */}
      </Routes>
    </ThemeContextProvider>
  );
};

export default App;
