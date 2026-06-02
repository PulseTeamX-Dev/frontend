import { useForm, type SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../redux/auth/operation";
import type { LoginCredentials } from "../redux/auth/types";
import type { RootState, AppDispatch } from "../redux/store";
import Icon from "../shared/Icon";
import { useState } from "react";

export const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  const { isLoading, error: authError } = useSelector(
    (state: RootState) => state.auth,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  const onSubmit: SubmitHandler<LoginCredentials> = async (data) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      navigate("/dashboard");
    } catch (err) {
      console.error("Помилка входу:", err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="p-8 md:p-10 bg-white shadow-sm rounded-3xl w-full max-w-[420px]">
        <div className="flex justify-center mb-6">
          <Icon id="logo" className="w-16 h-16" />
        </div>

        <h1 className="text-2xl font-bold mb-2 text-center text-slate-800 tracking-tight">
          Вхід до робочого простору
        </h1>
        <p className="text-sm text-center text-slate-400 mb-8">
          З поверненням! Будь ласка, введіть свої дані.
        </p>

        {authError && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-2xl border border-red-100 text-center">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-400 mb-2"
            >
              Робоча електронна пошта
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-slate-400">
                <Icon id="mail" className="w-5 h-5" />
              </span>
              <input
                id="email"
                type="email"
                placeholder="name@company.com"
                {...register("email", {
                  required: "Пошта є обов'язковою",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Невірний формат пошти",
                  },
                })}
                className={`w-full pl-12 pr-4 py-3 border rounded-2xl outline-none transition-all text-slate-700 placeholder-slate-400 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-200"
                    : "border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                }`}
              />
            </div>

            {/* Helper text or Error */}
            {errors.email ? (
              <span className="text-red-500 text-xs mt-2 block pl-1">
                {errors.email.message}
              </span>
            ) : (
              <div className="flex items-start gap-1.5 mt-2 text-xs text-slate-400 pl-1">
                <Icon id="alert-circle" />
                <span>
                  Будь ласка, використовуйте вашу робочу електронну адресу.
                </span>
              </div>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-400 mb-2"
            >
              Пароль
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-slate-400">
                <Icon id="lock" className="w-5 h-5" />
              </span>
              <input
                id="password"
                type={isVisible ? "text" : "password"}
                placeholder="••••••••"
                {...register("password", {
                  required: "Пароль є обов'язковим",
                  minLength: {
                    value: 6,
                    message: "Мінімум 6 символів",
                  },
                })}
                className={`w-full pl-12 pr-12 py-3 border rounded-2xl outline-none transition-all text-slate-700 placeholder-slate-400 tracking-widest ${
                  errors.password
                    ? "border-red-500 focus:ring-red-200"
                    : "border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                }`}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Toggle password visibility"
              >
                <Icon id={isVisible ? "eye" : "eye-off"} className="w-5 h-5" />
              </button>
            </div>

            {/* Forgot password link or Error */}
            {errors.password ? (
              <span className="text-red-500 text-xs mt-2 block pl-1">
                {errors.password.message}
              </span>
            ) : (
              <button
                type="button"
                className="flex items-center gap-1.5 mt-2 text-xs text-slate-500 hover:text-slate-700 transition-colors font-medium pl-1"
              >
                <Icon id="alert-circle" />
                <span>Забули пароль?</span>
              </button>
            )}
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center gap-2 pt-2 pl-1">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 border-slate-300 rounded text-orange-500 focus:ring-orange-500 accent-orange-500 cursor-pointer"
            />
            <label
              htmlFor="remember"
              className="text-sm text-slate-400 cursor-pointer select-none"
            >
              Запам'ятати цей пристрій
            </label>
          </div>

          {/* Submit Button */}
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
      </div>
    </div>
  );
};
