import LoginForm from "../components/LoginForm";
import Icon from "../shared/Icon";
import { Title } from "../shared/Title";

export const LoginPage = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="p-8 md:p-10 bg-white shadow-sm rounded-3xl w-full max-w-[420px]">
        <div className="flex justify-center mb-6">
          <Icon id="logo" className="w-16 h-16" />
        </div>

        <Title tag="h2" variant="bold" className="text-title mb-2 text-center">
          Вхід до робочого простору
        </Title>
        <p className="text-[12px] text-center text-light-txt mb-8">
          З поверненням! Будь ласка, введіть свої дані.
        </p>
        <LoginForm />
      </div>
    </div>
  );
};
