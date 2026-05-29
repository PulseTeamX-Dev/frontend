import { useForm, type SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../redux/auth/operation";
import type { LoginCredentials } from "../redux/auth/types";
import type { RootState, AppDispatch } from "../redux/store";

export const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

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
      <div className="p-8 bg-white shadow-lg rounded-2xl w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-slate-800">
          PulseTeamX Login
        </h1>

        {/* Блок для відображення помилки від бекенду */}
        {authError && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Електронна пошта
            </label>
            <input
              id="email"
              type="email"
              placeholder="hr@pulseteamx.com"
              {...register("email", {
                required: "Пошта є обов'язковою",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Невірний формат пошти",
                },
              })}
              className={`w-full px-4 py-2 border rounded-xl outline-none transition-colors ${
                errors.email
                  ? "border-red-500 focus:ring-red-200"
                  : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              }`}
            />
            {errors.email && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Пароль
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password", {
                required: "Пароль є обов'язковим",
                minLength: {
                  value: 6,
                  message: "Мінімум 6 символів",
                },
              })}
              className={`w-full px-4 py-2 border rounded-xl outline-none transition-colors ${
                errors.password
                  ? "border-red-500 focus:ring-red-200"
                  : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              }`}
            />
            {errors.password && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 mt-4 rounded-xl font-semibold text-white transition-all ${
              isLoading
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-black hover:bg-slate-800 active:scale-[0.98]"
            }`}
          >
            {isLoading ? "Завантаження..." : "Увійти"}
          </button>
        </form>
      </div>
    </div>
  );
};
