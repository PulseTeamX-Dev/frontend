import { useAppDispatch } from "../hooks/useReduxTypes";
import { logoutUser } from "../redux/auth/operation";

export const SignalsPage = () => {
  const dispatch = useAppDispatch();
  return (
    <div>
      <p>SignalsPage</p>
      <button onClick={() => dispatch(logoutUser())}>Logout</button>
    </div>
  );
};
