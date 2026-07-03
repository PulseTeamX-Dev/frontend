import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useReduxTypes";
import { updatePassword } from "../redux/auth/operation";
import { selectAuthLoading } from "../redux/auth/selectors";
import { Title } from "@/shared/ui/Title";
import { Input } from "@/shared/ui/Input";
import Icon from "@/shared/ui/Icon";
import lockImg from "../assets/img/lock.png";
import { toast } from "react-toastify";

export const UpdatePasswordPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectAuthLoading);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const togglePasswordVisibility = () => setIsVisible((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (password !== confirmPassword) {
      return setLocalError("Паролі не співпадають!");
    }
    if (password.length < 6) {
      return setLocalError("Пароль має містити мінімум 6 символів.");
    }

    try {
      // Відправляємо новий пароль на бекенд Supabase
      await dispatch(updatePassword(password)).unwrap();

      toast.success("Пароль успішно оновлено!");
      // Після успішного оновлення перекидаємо юзера в систему
      navigate("/dashboard");
    } catch (err: unknown) {
      setLocalError(typeof err === "string" ? err : "Помилка оновлення пароля");
      toast.error("Не вдалося оновити пароль");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50 p-4">
      <div className="p-8 md:p-10 bg-white shadow-sm rounded-3xl w-full max-w-[420px] flex flex-col animate-fade-in">
        <div className="flex justify-center mb-6">
          <img src={lockImg} alt="Забули пароль" className="w-20 h-20" />
        </div>

        <Title tag="h2" variant="bold" className="text-xl text-center mb-2">
          Створення нового пароля
        </Title>
        <p className="text-[14px] text-center text-light-txt mb-8">
          Будь ласка, введіть новий надійний пароль для вашого облікового
          запису.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type={isVisible ? "text" : "password"}
            label="Новий пароль"
            placeholder="••••••••"
            leftIcon="lock"
            rightIcon={
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-grayscale-700 hover:text-yellow-500 transition-colors"
              >
                <Icon
                  id={isVisible ? "show" : "hide"}
                  className="fill-current w-5 h-5"
                />
              </button>
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Input
            type={isVisible ? "text" : "password"}
            label="Підтвердіть пароль"
            placeholder="••••••••"
            leftIcon="lock"
            error={localError}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 mt-4 bg-[#F26E3B] hover:bg-[#e05d2c] text-white font-medium rounded-2xl transition-colors disabled:opacity-50 h-[52px] flex justify-center items-center"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              "Зберегти пароль"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
