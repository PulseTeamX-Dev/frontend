import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Title } from "../../shared/Title";
import checkImg from "../../assets/img/check.png";
import AppLink from "@/shared/ui/AppLink";

export const InviteSuccess = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    if (countdown === 0) {
      clearInterval(intervalId);
      navigate("/dashboard", { replace: true });
    }

    return () => clearInterval(intervalId);
  }, [countdown, navigate]);

  return (
    <div className="p-8 md:p-10 bg-white shadow-sm rounded-3xl w-75 md:w-90 lg:w-105 flex flex-col items-center text-center animate-fade-in">
      <div className="mb-6">
        <img
          src={checkImg}
          alt="Запрошення успішно використано"
          className="w-20 h-20 object-contain"
        />
      </div>

      <Title tag="h2" variant="bold">
        Обліковий запис створено!
      </Title>

      <div className="w-full flex items-center justify-center my-6">
        <span className="text-[12px] text-light-txt max-w-[280px]">
          Тепер ви можете користуватися платформою та налаштувати свій робочий
          простір.
        </span>
      </div>

      <AppLink path="/dashboard" className="w-full">
        Налаштувати простір
      </AppLink>

      <div className="mt-6">
        <p className="text-[12px] text-grayscale-500 animate-pulse">
          Перенаправлення через {countdown} секунд...
        </p>
      </div>
    </div>
  );
};
