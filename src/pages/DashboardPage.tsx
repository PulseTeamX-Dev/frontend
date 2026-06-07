import { useAppDispatch } from "../hooks/useReduxTypes";
import { logoutUser } from "../redux/auth/operation";

export const DashboardPage = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">HR Dashboard</h1>
      <button onClick={() => dispatch(logoutUser())}>Logout</button>
    </div>
  );
};
