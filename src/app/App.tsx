import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PageLoader } from "../shared/Loader";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../hooks/useReduxTypes";
import { selectIsAuthenticated } from "../redux/auth/selectors";
import { ProtectedRoute } from "../utils/ProtectedRoute";
import { MainLayout } from "../components/layout/MainLayout";
import { fetchCurrentUser } from "../redux/auth/operation";

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
  const isAuthLoading = useAppSelector((state) => state.auth.isLoading);

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  if (isAuthLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* === 1. ПУБЛІЧНІ РОУТИ (Тут Сайдбара НЕ БУДЕ) === */}
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

            {/* === 2. ПРИВАТНИЙ ПРОСТІР (Тут Сайдбар БУДЕ) === */}
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
          </Routes>
        </Suspense>
      </BrowserRouter>
      <ToastContainer position="bottom-right" theme="dark" />
    </>
  );
}

export default App;
