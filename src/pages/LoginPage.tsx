import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/useReduxTypes";
import { selectIsAuthenticated } from "../redux/auth/selectors";
import { resetRecoverStatus } from "../redux/auth/slice";
import AuthSuccess from "../components/ui/AuthSuccess";
import { CheckEmailView } from "../components/ui/CheckEmailView";
import Icon from "@/shared/ui/Icon";
import { Title } from "@/shared/ui/Title";
import { ForgotPasswordForm } from "../components/auth/ForgotPasswordForm";
import LoginForm from "../components/auth/LoginForm";

export const LoginPage = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const dispatch = useAppDispatch();
  const [view, setView] = useState("login");

  const isEmailSent = useAppSelector(
    (state) => state.auth.isPasswordRecoverEmailSent,
  );

  // Клінап при виході зі сторінки
  useEffect(() => {
    return () => {
      dispatch(resetRecoverStatus());
    };
  }, [dispatch]);

  // Функція, яка вирішує, ЩО САМЕ рендерити всередині білої картки
  const renderCardContent = () => {
    // 1. Якщо юзер успішно залогінився
    if (isAuthenticated) {
      return <AuthSuccess />;
    }

    // 2. Якщо відкрили екран "Забули пароль"
    if (view === "forgot") {
      if (isEmailSent) {
        return <CheckEmailView onBack={() => setView("login")} />;
      }
      return <ForgotPasswordForm onBack={() => setView("login")} />;
    }

    return (
      <div className="w-full">
        <div className="flex justify-center mb-6">
          <Icon id="logo" className="w-16 h-16" />
        </div>

        <Title tag="h2" variant="bold" className="text-title mb-2 text-center">
          Вхід до робочого простору
        </Title>

        <p className="text-[12px] text-center text-light-txt mb-8">
          З поверненням! Будь ласка, введіть свої дані.
        </p>

        <LoginForm onForgotPasswordClick={() => setView("forgot")} />
      </div>
    );
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50 p-4">
      <div className="p-8 md:p-10 bg-white shadow-sm rounded-3xl w-full max-w-[420px] flex flex-col items-center animate-fade-in">
        {renderCardContent()}
      </div>
    </div>
  );
};
