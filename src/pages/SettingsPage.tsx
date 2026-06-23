import TeamsPage from "./TeamsPage";
import ProfileForm from "../components/profile/ProfileForm";
import AvatarUploader from "../components/profile/AvatarUploader";
import { Title } from "../shared/Title";
import { useAppSelector } from "../hooks/useReduxTypes";
import { PageHeader } from "../shared/PageHeader";

export const SettingsPage = () => {
  const role = useAppSelector((state) => state.auth.role);
  const isHR = role === "hr";

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] p-4 md:p-6 text-slate-800">
      <div className="max-w-[1320px] mx-auto flex flex-col">
        <PageHeader title="Налаштування" showLogo={true} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          {isHR && (
            <div className="lg:col-span-7 xl:col-span-7 space-y-6">
              <TeamsPage />
            </div>
          )}

          <div
            className={`bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 md:p-10 border border-gray-100/80 mx-auto w-full ${
              isHR
                ? "lg:col-span-5 xl:col-span-5"
                : "lg:col-span-12 xl:col-span-12 max-w-[600px]"
            }`}
          >
            <Title
              tag="h2"
              variant="bold"
              className="text-2xl font-bold mb-8 text-left text-slate-900"
            >
              Особистий кабінет
            </Title>

            <div className="flex flex-col items-center mb-8">
              <AvatarUploader />
            </div>

            <ProfileForm />
          </div>
        </div>
      </div>
    </div>
  );
};
