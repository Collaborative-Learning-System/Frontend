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
import { ProtectedRoute } from "./Routes/ProtectedRoutes";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <ThemeContextProvider>
      <GroupProvider>
        <Routes>
          {/* Public routes - no authentication required */}
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset-password/:userId" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected routes - authentication required */}
          <Route
            path="/landing"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Landing />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/study-plans-generator"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <StudyPlanGenerator />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/groups"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Groups />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/workspace/:workspaceId"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Workspace />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz-creator"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <QuizCreator />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Profile />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact-us"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ContactForm />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/document-summary"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <DocumentSummary />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents/:docId"
            element={
              <ProtectedRoute>
                <CollaborativeDocumentEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-all"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ViewAll />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch-all route for 404 - must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </GroupProvider>
    </ThemeContextProvider>
  );
};

export default App;
