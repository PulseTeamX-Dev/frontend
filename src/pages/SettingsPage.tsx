import ProfileForm from "../components/profile/ProfileForm";
import AvatarUploader from "../components/profile/AvatarUploader";

import { Title } from "../shared/Title";

export const SettingsPage = () => {
  return (
    <div className="max-w-225 mx-auto p-8">
      <div className="bg-white rounded-3xl shadow-sm p-8">
        <Title tag="h1" variant="bold" className="mb-2">
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
