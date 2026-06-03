import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/storeHooks";
import {
  fetchInviteContext,
  activateAccount,
} from "../redux/auth/operation";



export const ActivateAccountPage = () => {
  const [params] = useSearchParams();
  const token = params.get("token");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { invite, isLoading } = useAppSelector((s) => s.auth);

  const [password, setPassword] = useState("");

  useEffect(() => {
    if (token) {
      dispatch(fetchInviteContext(token));
    }
  }, [token]);

  const onSubmit = async () => {
    if (!token) return;

    await dispatch(
      activateAccount({
        token,
        password,
      }),
    );

    navigate("/login");
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1>Activate Account</h1>

      {invite && (
        <div>
          <p>Email: {invite.email}</p>
          <p>Role: {invite.dashboard_role}</p>
          <p>Team: {invite.team?.name}</p>
        </div>
      )}

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={onSubmit}>Activate</button>
    </div>
  );
};