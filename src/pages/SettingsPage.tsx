import TeamsPage from "./TeamsPage";
import ProfileForm from "../components/profile/ProfileForm";
import AvatarUploader from "../components/profile/AvatarUploader";
import { Title } from "../shared/Title";
import { useAppSelector } from "../hooks/useReduxTypes";

export const SettingsPage = () => {
  const role = useAppSelector((state) => state.auth.role);
  const isHR = role === "hr";

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] p-4 md:p-8">
      {/* Контейнер сітки з великим проміжком */}
      <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {isHR && (
          <div className="lg:col-span-7 flex flex-col gap-6">
            <TeamsPage />
          </div>
        )}

        {/* Права колонка: Особистий кабінет (займає 5 колонок з 12) */}
        {/* Додаємо sticky, щоб він був зафіксований при прокрутці */}
        <div className="lg:col-span-5 bg-white rounded-[32px] shadow-[0_4px_30px_rgba(0,0,0,0.04)] p-8 md:p-10 border border-gray-100 sticky top-8">
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
