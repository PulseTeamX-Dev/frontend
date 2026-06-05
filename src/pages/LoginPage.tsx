import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { useAppSelector } from "../hooks/useReduxTypes";
import { selectIsAuthenticated } from "../redux/auth/selectors";
import Icon from "../shared/Icon";
import { Title } from "../shared/Title";
import checkImg from "../assets/img/check.png";

export const LoginPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="p-8 md:p-10 bg-white shadow-sm rounded-3xl w-full max-w-[420px] flex flex-col items-center">
        {isAuthenticated ? (
          <div className="w-full flex flex-col items-center text-center animate-fade-in">
            <div className="flex justify-center mb-6">
              <img src={checkImg} alt="Успіх" className="w-[80px] h-[80px]" />
            </div>

            <Title
              tag="h2"
              variant="bold"
              className="text-2xl text-grayscale-900 mb-2"
            >
              Обліковий запис створено!
            </Title>

            <p className="text-[14px] text-light-txt mb-8 max-w-[280px]">
              Ви авторизовані в PulseTeamX.
            </p>

            {/* Твоя фірмова помаранчева кнопка */}
            <button
              onClick={handleGoToDashboard}
              className="w-full py-3.5 bg-[#F26E3B] hover:bg-[#e05d2c] text-white font-medium rounded-2xl transition-colors shadow-md shadow-orange-100"
            >
              Перейти до дашборду
            </button>
          </div>
        ) : (
          // === ЕКРАН 2: Форма входу ===
          <div className="w-full">
            <div className="flex justify-center mb-6">
              <Icon id="logo" className="w-16 h-16" />
            </div>

            <Title
              tag="h2"
              variant="bold"
              className="text-title mb-2 text-center"
            >
              Вхід до робочого простору
            </Title>

            <p className="text-[12px] text-center text-light-txt mb-8">
              З поверненням! Будь ласка, введіть свої дані.
            </p>

            <LoginForm />
          </div>
        )}
      </div>
    </div>
  );
};
