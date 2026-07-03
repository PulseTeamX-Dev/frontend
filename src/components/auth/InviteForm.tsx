import { useState } from "react";
import Icon from "@/shared/ui/Icon";
import { Input } from "@/shared/ui/Input";
import { Title } from "@/shared/ui/Title";
import { useAppDispatch, useAppSelector } from "../../hooks/useReduxTypes";
import { acceptInvite, loginUser } from "../../redux/auth/operation";
import { selectAuthLoading } from "../../redux/auth/selectors";
import { Link } from "react-router-dom";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  inviteSchema,
  type InviteFormData,
} from "../../validation/authSchemas";
import { toast } from "react-toastify";
import { Button } from "@/shared/ui/Button";

export const InviteForm = ({ token }: { token: string }) => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);
  const [isVisible, setIsVisible] = useState(false);

  const togglePasswordVisibility = () => setIsVisible((prev) => !prev);

  // Підключаємо ресолвер
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      isAgreed: false,
    },
  });

  const onSubmit: SubmitHandler<InviteFormData> = async (data) => {
    try {
      const response = await dispatch(
        acceptInvite({ token, password: data.password }),
      ).unwrap();

      const email = response.user.email;
      await dispatch(loginUser({ email, password: data.password })).unwrap();
    } catch (error: unknown) {
      toast.error((error as string) || "Сталася помилка. Спробуйте пізніше.");
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

      {/* noValidate ОБОВ'ЯЗКОВО */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        <Input
          type={isVisible ? "text" : "password"}
          label="Створіть пароль"
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
          error={errors.password?.message}
          {...register("password")}
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
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        {/* Блок з Чекбоксом та Помилкою лінку користування */}
        <div className="flex flex-col gap-1 pt-2 pl-1">
          <div className="flex items-start gap-3">
            <div className="relative flex items-center justify-center w-6 h-6 shrink-0 mt-0.5">
              <input
                type="checkbox"
                id="remember"
                className="peer appearance-none w-full h-full border-2 border-light-txt rounded-[6px] bg-transparent cursor-pointer checked:border-grayscale-700 hover:border-yellow-500 transition-colors focus:outline-none"
                {...register("isAgreed")}
              />
              <Icon
                id="check"
                className="absolute fill-current w-4 h-4 text-grayscale-700 opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
              />
            </div>
            <label
              htmlFor="remember"
              className="text-[14px] leading-[1.4] text-light-txt cursor-pointer select-none font-medium transition-colors"
            >
              Я погоджуюся з{" "}
              <Link
                className="text-grayscale-900 hover:underline underline-offset-2"
                to="/terms"
              >
                Умовами користування
              </Link>{" "}
              та{" "}
              <Link
                className="text-grayscale-900 hover:underline underline-offset-2"
                to="/privacy"
              >
                Політикою конфіденційності
              </Link>
            </label>
          </div>

          {errors.isAgreed?.message && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-error font-medium">
              <Icon id="circle-warning-filled" className="w-4 h-4 shrink-0" />
              <span>{errors.isAgreed.message}</span>
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 mt-4 rounded-2xl transition-colors disabled:opacity-50 flex justify-center items-center h-[52px]"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            "Продовжити"
          )}
        </Button>
      </form>
    </div>
  );
};
