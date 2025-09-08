import { Route, Routes } from "react-router-dom";
import { ThemeContextProvider } from "./context/ThemeContext";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import MainLayout from "./layouts/MainLayout";
import Groups from "./pages/Groups";
import Home from "./pages/Home";
import StudyPlanGenerator from "./pages/study-plan-generator";
import Workspace from "./pages/Workspace";
import Profile from "./pages/Userprofile"
import ContactForm from "./components/ContactForm";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import DocumentSummary from "./pages/DocumentSummary";
import RealTimeCollaboration from "./pages/RealTimeCollaboration";

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
          path="/workspace/:workspaceId"
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
        <Route
          path="/contact-us"
          element={
            <MainLayout>
              <ContactForm />
            </MainLayout>
          }
        />
        <Route
          path="/document-summary"
          element={
            <MainLayout>
              <DocumentSummary />
            </MainLayout>
          }
        />
        <Route
          path="/real-time-collaboration"
          element={
            <MainLayout>
              <RealTimeCollaboration />
            </MainLayout>
          }
        />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </ThemeContextProvider>
  );
};

export default App;
