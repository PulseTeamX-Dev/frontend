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

function App() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* === Public Routes === */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/surveys/:survey_token" element={<SurveyPage />} />

            {/* === Protected Routes === */}
            <Route path="/dashboard" element={<DashboardPage />} />

            <Route
              path="*"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Navigate to="/login" />
                )
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
