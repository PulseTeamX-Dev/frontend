import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/app/useReduxTypes";
import { PageLoader } from "@/shared/ui/Loader";

interface Props {
  allowedRoles: string[];
}

export const ProtectedRoute = ({ allowedRoles }: Props) => {
  const { isAuthenticated, role, isLoading } = useAppSelector(
    (state) => state.auth,
  );

  if (isLoading) return <PageLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
