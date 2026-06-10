import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useReduxTypes";
import { validateInvite } from "../redux/auth/operation";
import { selectInviteStatus } from "../redux/auth/selectors";
import { resetInviteStatus } from "../redux/auth/slice";
import { InviteExpired } from "../components/ui/InviteExpired";
import { InviteUsed } from "../components/ui/InviteUsed";
import { InviteSuccess } from "../components/ui/InviteSuccess";
import { InviteForm } from "../components/auth/InviteForm";

export const InvitePage = () => {
  const { token } = useParams<{ token: string }>();
  const dispatch = useAppDispatch();
  const inviteStatus = useAppSelector(selectInviteStatus);

  useEffect(() => {
    if (token) {
      dispatch(validateInvite(token));
    }

    return () => {
      dispatch(resetInviteStatus());
    };
  }, [token, dispatch]);

  const renderScreen = () => {
    switch (inviteStatus) {
      case "loading":
      case "idle":
        return (
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F26E3B]"></div>
        );
      case "form":
        return <InviteForm token={token!} />;
      case "expired":
        return <InviteExpired />;
      case "used":
        return <InviteUsed />;
      case "success":
        return <InviteSuccess />;
      case "invalid":
      default:
        return (
          <div className="text-center text-red-500 font-medium">
            Недійсне посилання або системна помилка.
          </div>
        );
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      {renderScreen()}
    </div>
  );
};
