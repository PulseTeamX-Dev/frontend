import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PageLoader } from "../shared/Loader";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useAppSelector } from "../hooks/useReduxTypes";
import { selectIsAuthenticated } from "../redux/auth/selectors";

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

function App() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
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

            <Route
              path="/dashboard"
              element={
                isAuthenticated ? (
                  <DashboardPage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

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
