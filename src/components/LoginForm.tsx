import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useReduxTypes";
import { useState } from "react";
import { selectAuthLoading } from "../redux/auth/selectors";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { LoginCredentials } from "../redux/auth/types";
import { loginUser } from "../redux/auth/operation";
import { toast } from "react-toastify";
import Icon from "../shared/Icon";
import { Input } from "../shared/Input";

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  const isLoading = useAppSelector(selectAuthLoading);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  const onSubmit: SubmitHandler<LoginCredentials> = async (data) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      navigate("/dashboard");
    } catch (err: unknown) {
      toast.error("Помилка входу:", err || "Невідома помилка");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        id="email"
        type="email"
        label="Електронна пошта"
        placeholder="name@company.com"
        leftIcon="mail"
        error={errors.email?.message}
        helperText="Будь ласка, використовуйте вашу робочу електронну адресу."
        {...register("email", {
          required: "Пошта є обов'язковою",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Невірний формат пошти",
          },
        })}
      />

      {/* Блок з Паролем */}
      <div className="relative">
        <Input
          id="password"
          type={isVisible ? "text" : "password"}
          label="Пароль"
          placeholder="••••••••"
          leftIcon="lock"
          error={errors.password?.message}
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
          {...register("password", {
            required: "Пароль є обов'язковим",
            minLength: { value: 6, message: "Мінімум 6 символів" },
          })}
        />

        {/* Окрема кнопка "Забули пароль?", яка не залежить від помилок */}
        <div className="flex justify-end mt-2">
          <button
            type="button"
            className="text-sm font-medium text-grayscale-700 hover:text-yellow-500 transition-colors"
          >
            Забули пароль?
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2 pl-1">
        <div className="relative flex items-center justify-center w-6 h-6 shrink-0">
          <input
            type="checkbox"
            id="remember"
            className="peer appearance-none w-full h-full border-2 border-light-txt rounded-[6px] bg-transparent cursor-pointer checked:border-grayscale-700 hover:border-yellow-500 transition-colors focus:outline-none"
          />
          <Icon
            id="check"
            className="absolute fill-current w-4 h-4 text-grayscale-700 opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
          />
        </div>
        <label
          htmlFor="remember"
          className="text-[15px] text-light-txt cursor-pointer select-none font-medium hover:text-yellow-500 transition-colors"
        >
          Запам'ятати цей пристрій
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3.5 mt-2 rounded-2xl font-semibold text-white transition-all shadow-sm ${
          isLoading
            ? "bg-slate-300 cursor-not-allowed"
            : "bg-primary hover:bg-primary-hover active:scale-[0.98]"
        }`}
      >
        {isLoading ? "Завантаження..." : "Увійти"}
      </button>
    </form>
  );
};

export default LoginForm;
