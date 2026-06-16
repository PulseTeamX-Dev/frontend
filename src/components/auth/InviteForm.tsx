import { useState } from "react";
import Icon from "../../shared/Icon";
import { Input } from "../../shared/Input";
import { Title } from "../../shared/Title";
import { useAppDispatch, useAppSelector } from "../../hooks/useReduxTypes";
import { acceptInvite, loginUser } from "../../redux/auth/operation";
import { selectAuthLoading } from "../../redux/auth/selectors";
import { Link } from "react-router-dom";
export const InviteForm = ({ token }: { token: string }) => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

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
    if (!isAgreed) {
      return setLocalError("Необхідно погодитися з умовами користування.");
    }

    try {
      const response = await dispatch(
        acceptInvite({ token, password }),
      ).unwrap();

      const email = response.user.email;

      await dispatch(loginUser({ email, password })).unwrap();
    } catch (error: unknown) {
      setLocalError((error as string) || "Сталася помилка. Спробуйте пізніше.");
    }
  };

  return (
    <div className="p-8 md:p-10 bg-white shadow-sm rounded-3xl w-full max-w-[420px]">
      <div className="flex justify-center mb-6">
        <Icon id="logo" className="w-16 h-16" />
      </div>

      <Title tag="h2" variant="bold" className="text-title mb-2 text-center">
        Вітаємо!
      </Title>
      <p className="text-[12px] text-center text-light-txt mb-8">
        Давайте розпочнемо
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          type={isVisible ? "text" : "password"}
          label="Cтворіть пароль"
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
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={localError}
          required
        />

        <div className="flex items-start gap-3 pt-2 pl-1">
          <div className="relative flex items-center justify-center w-6 h-6 shrink-0 mt-0.5">
            <input
              type="checkbox"
              id="remember"
              checked={isAgreed}
              onChange={(e) => setIsAgreed(e.target.checked)}
              className="peer appearance-none w-full h-full border-2 border-light-txt rounded-[6px] bg-transparent cursor-pointer checked:border-grayscale-700 hover:border-yellow-500 transition-colors focus:outline-none"
            />
            <Icon
              id="check"
              className="absolute fill-current w-4 h-4 text-grayscale-700 opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
            />
          </div>
          <label
            htmlFor="remember"
            className="
                        text-[14px]
                        leading-[1.4]
                        text-light-txt
                        cursor-pointer
                        select-none
                        font-medium
                        transition-colors
                      "
          >
            Я погоджуюся з{" "}
            <Link
              to="/terms"
              className="text-grayscale-900 hover:underline underline-offset-2"
            >
              Умовами користування
            </Link>{" "}
            та{" "}
            <Link
              to="/privacy"
              className="text-grayscale-900 hover:underline underline-offset-2"
            >
              Політикою конфіденційності
            </Link>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 mt-4 bg-[#F26E3B] hover:bg-[#e05d2c] text-white font-medium rounded-2xl transition-colors disabled:opacity-50 flex justify-center items-center h-[52px]"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            "Продовжити"
          )}
        </button>
      </form>
    </div>
  );
};
