import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Title } from "../shared/Title";
import { Input } from "../shared/Input";
import Icon from "../shared/Icon";

export const InvitePage = () => {
  //   const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Базова фронтова валідація
    if (password !== confirmPassword) {
      return setError("Паролі не співпадають!");
    }
    if (password.length < 6) {
      return setError("Пароль має містити мінімум 6 символів.");
    }

    setIsLoading(true);
    try {
      // 🚀 ТУТ БУДЕ ТВІЙ ВИКЛИК API:
      // await apiClient.post('/api/auth/accept-invite', { token, password });

      // Поки що симулюємо успішну відповідь:
      await new Promise((res) => setTimeout(res, 1000));
      setIsSuccess(true);
    } catch (err) {
      setError(
        `Помилка активації. Можливо, посилання застаріло. ${err instanceof Error ? err.message : ""}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="p-8 md:p-10 bg-white shadow-sm rounded-3xl w-full max-w-[420px] flex flex-col items-center text-center animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-[#22C55E] flex items-center justify-center mb-6 shadow-sm shadow-green-200">
            <Icon id="check" className="w-10 h-10 text-white" />
          </div>
          <Title
            tag="h2"
            variant="bold"
            className="text-2xl text-grayscale-900 mb-2"
          >
            Пароль встановлено!
          </Title>
          <p className="text-[14px] text-light-txt mb-8">
            Ваш обліковий запис успішно активовано.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3.5 bg-[#F26E3B] hover:bg-[#e05d2c] text-white font-medium rounded-2xl transition-colors"
          >
            Перейти до входу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="p-8 md:p-10 bg-white shadow-sm rounded-3xl w-full max-w-[420px]">
        <div className="flex justify-center mb-6">
          <Icon id="logo" className="w-16 h-16" />
        </div>

        <Title tag="h2" variant="bold" className="text-title mb-2 text-center">
          Завершення реєстрації
        </Title>
        <p className="text-[12px] text-center text-light-txt mb-8">
          Придумайте надійний пароль для вашого облікового запису.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="password"
            label="Новий пароль"
            placeholder="Введіть пароль"
            leftIcon="lock"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            label="Підтвердження пароля"
            placeholder="Повторіть пароль"
            leftIcon="lock"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={error}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 mt-4 bg-[#F26E3B] hover:bg-[#e05d2c] text-white font-medium rounded-2xl transition-colors disabled:opacity-50"
          >
            {isLoading ? "Збереження..." : "Зберегти та увійти"}
          </button>
        </form>
      </div>
    </div>
  );
};
