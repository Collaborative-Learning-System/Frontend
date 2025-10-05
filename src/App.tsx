import { Route, Routes } from "react-router-dom";
import { ThemeContextProvider } from "./context/ThemeContext";
import { GroupProvider } from "./context/GroupContext";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import MainLayout from "./layouts/MainLayout";
import Groups from "./pages/Groups";
import Home from "./pages/Home";
import StudyPlanGenerator from "./pages/study-plan-generator";
import Workspace from "./pages/Workspace";
import Profile from "./pages/Userprofile";
import QuizCreator from "./pages/quiz-creator";
import ContactForm from "./components/ContactForm";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import DocumentSummary from "./pages/DocumentSummary";
import Dashboard from "./pages/Dashboard";
import ViewAll from "./pages/ViewAll";
import CollaborativeDocumentEditor from "./components/RealTimeCollaboration/CollaborativeDocumentEditor";
import { PrivateRoute } from "./Routes/ProtectedRoutes";

const App = () => {
  return (
    <ThemeContextProvider>
      <GroupProvider>
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
          path="/quiz-creator"
          element={
            <MainLayout>
              <QuizCreator />
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
          path="/documents/:docId"
          element={
            <PrivateRoute>
              <CollaborativeDocumentEditor />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />
        <Route
          path="/view-all"
          element={
            <MainLayout>
              <ViewAll />
            </MainLayout>
          }
        />
        <Route path="/reset-password/:userId" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        </Routes>
      </GroupProvider>
    </ThemeContextProvider>
  );
};

export default App;
