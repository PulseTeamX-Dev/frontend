import TeamsPage from "./TeamsPage";
import ProfileForm from "../components/profile/ProfileForm";
import AvatarUploader from "../components/profile/AvatarUploader";
import { Title } from "../shared/Title";
import { useAppSelector } from "../hooks/useReduxTypes";
import { PageLoader } from "../shared/Loader";

export const SettingsPage = () => {
  const role = useAppSelector((state) => state.auth.role);
  const isLoading = useAppSelector((state) => state.profile.isLoading);
  const isHR = role === "hr";

  if (isLoading) return <PageLoader />;

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] p-4 md:p-8">
      {/* Контейнер сітки з великим проміжком */}
      <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {isHR && (
          <div className="lg:col-span-7 flex flex-col gap-6">
            <TeamsPage />
          </div>
        )}

        {/* 🛠️ ФІКС: Робимо класи динамічними за допомогою шаблонних рядків */}
        <div
          className={`bg-white rounded-[32px] shadow-[0_4px_30px_rgba(0,0,0,0.04)] p-8 md:p-10 border border-gray-100 sticky top-8 transition-all duration-300 ${
            isHR
              ? "lg:col-span-5" // Ідеальний вигляд для HR (як на скріні 2)
              : "lg:col-span-12 max-w-3xl mx-auto w-full" // Розтягнутий та відцентрований вигляд для Тімліда
          }`}
        >
          <Title
            tag="h2"
            variant="bold"
            className="text-2xl font-bold mb-8 text-left text-slate-900"
          >
            Особистий кабінет
          </Title>

          <div className="flex flex-col items-center mb-10">
            <AvatarUploader />
          </div>

          <ProfileForm />
        </div>
      </div>
    </div>
  );
};
