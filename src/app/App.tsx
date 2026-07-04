import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PageLoader } from "@/shared/ui/Loader";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/app/useReduxTypes";
import { selectIsAuthenticated } from "../redux/auth/selectors";
import { ProtectedRoute } from "./ProtectedRoute";
import { MainLayout } from "../components/layout/MainLayout";
import { fetchCurrentUser } from "@/features/auth/model/operation";
import { fetchProfile } from "../redux/profile/operation";
import { PrivacyPolicyPage } from "../pages/PrivacyPolicyPage";
import { TermsOfUsePage } from "../pages/TermsOfUsePage";

const LoginPage = lazy(() =>
  import("../pages/LoginPage").then((m) => ({ default: m.LoginPage })),
);
const DashboardPage = lazy(() =>
  import("../pages/DashboardPage").then((m) => ({ default: m.DashboardPage })),
);
const SurveyPage = lazy(() =>
  import("../pages/SurveyPage").then((m) => ({ default: m.SurveyPage })),
);
const InvitePage = lazy(() =>
  import("../pages/InvitePage").then((m) => ({ default: m.InvitePage })),
);
const UpdatePasswordPage = lazy(() =>
  import("../pages/UpdatePasswordPage").then((m) => ({
    default: m.UpdatePasswordPage,
  })),
);
const CreatePulsePage = lazy(() =>
  import("../pages/CreatePulsePage").then((m) => ({
    default: m.CreatePulsePage,
  })),
);
const CommentsPage = lazy(() =>
  import("../pages/CommentsPage").then((m) => ({ default: m.CommentsPage })),
);
const SignalsPage = lazy(() =>
  import("../pages/SignalsPage").then((m) => ({ default: m.SignalsPage })),
);
const SettingsPage = lazy(() =>
  import("../pages/SettingsPage").then((m) => ({ default: m.SettingsPage })),
);

function App() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [isAppReady, setIsAppReady] = useState(
    !localStorage.getItem("access_token"),
  );

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      dispatch(fetchCurrentUser()).finally(() => setIsAppReady(true));
    }
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProfile());
    }
  }, [isAuthenticated, dispatch]);

  if (!isAppReady) {
    return <PageLoader />;
  }

  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* === 1. ПУБЛІЧНІ РОУТИ === */}
            <Route path="/surveys/:survey_token" element={<SurveyPage />} />
            <Route path="/invite/:token" element={<InvitePage />} />
            <Route path="/update-password" element={<UpdatePasswordPage />} />

            <Route
              path="/login"
              element={
                !isAuthenticated ? (
                  <LoginPage />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              }
            />

            {/* === 2. ПРИВАТНИЙ ПРОСТІР === */}
            {/* Якщо авторизований - показуємо Layout із Сайдбаром, інакше на Логін */}
            <Route
              element={
                isAuthenticated ? (
                  <MainLayout />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            >
              {/* Спільні для HR та Team Lead */}
              <Route
                element={<ProtectedRoute allowedRoles={["hr", "team_lead"]} />}
              >
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/signals" element={<SignalsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>

              {/* Тільки для HR */}
              <Route element={<ProtectedRoute allowedRoles={["hr"]} />}>
                <Route path="/create-pulse" element={<CreatePulsePage />} />
                <Route path="/comments" element={<CommentsPage />} />
              </Route>
            </Route>

            {/* FALLBACK */}
            <Route
              path="*"
              element={
                <Navigate
                  to={isAuthenticated ? "/dashboard" : "/login"}
                  replace
                />
              }
            />

            <Route path="/privacy" element={<PrivacyPolicyPage />} />

            <Route path="/terms" element={<TermsOfUsePage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <ToastContainer position="bottom-right" />
    </>
  );
}

export default App;
