import { useEffect } from "react";
import { useAppDispatch } from "../hooks/useReduxTypes";
import { fetchProfile } from "../redux/profile/operation";

import ProfileForm from "../components/auth/ProfileForm";
import AvatarUploader from "../components/ui/AvatarUploader";

import { Title } from "../shared/Title";

export const SettingsPage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  return (
    <div className="max-w-[900px] mx-auto p-8">
      <div className="bg-white rounded-3xl shadow-sm p-8">
        <Title tag="h1" variant="bold" className="mb-8">
          Особистий кабінет
        </Title>

        <div className="flex flex-col items-center mb-8">
          <AvatarUploader />
        </div>

        <ProfileForm />
      </div>
    </div>
  );
};
