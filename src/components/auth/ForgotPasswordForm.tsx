import { Title } from "../../shared/Title";
import { Input } from "../../shared/Input";
import { useAppDispatch, useAppSelector } from "../../hooks/useReduxTypes";
import { recoverPassword } from "../../redux/auth/operation";
import { selectAuthLoading } from "../../redux/auth/selectors";
import { resetRecoverStatus } from "../../redux/auth/slice";
import lockImg from "../../assets/img/lock.png";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../../validation/authSchemas";
import { Button } from "../../shared/Button";

interface Props {
  onBack: () => void;
}

export const ForgotPasswordForm = ({ onBack }: Props) => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);
  const globalError = useAppSelector((state) => state.auth.error);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormData> = (data) => {
    dispatch(recoverPassword(data.email));
  };

  // Очищаємо помилку бекенду при введенні нових символів
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("email", e.target.value, { shouldValidate: true });
    if (globalError) dispatch(resetRecoverStatus());
  };

  // Пріоритет віддаємо локальній помилці Zod, якщо її немає — беремо помилку з сервера
  const displayError = errors.email?.message || globalError;

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex justify-start mb-2 -mt-2">
        <button
          type="button"
          onClick={onBack}
          className="text-[14px] text-light-txt hover:text-grayscale-900 transition-colors flex items-center gap-2"
        >
          <span>&larr;</span> Назад
        </button>
      </div>

      <div className="flex justify-center mb-6 mt-2">
        <img src={lockImg} alt="Забули пароль" className="w-20 h-20" />
      </div>

      <Title tag="h2" variant="bold" className="text-xl text-center mb-2">
        Забули пароль?
      </Title>
      <p className="text-[14px] text-center text-light-txt mb-8">
        Введіть вашу електронну пошту, і ми надішлемо посилання для скидання
        пароля.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        <Input
          type="email"
          id="email"
          label="Електронна пошта"
          placeholder="name@company.com"
          leftIcon="user"
          error={displayError as string}
          helperText={
            !displayError
              ? "На вказану адресу електронної пошти ми надішлемо інструкцію відновлення пароля."
              : ""
          }
          {...register("email", { onChange: handleInputChange })}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 mt-4 rounded-2xl transition-colors disabled:opacity-50 h-[52px] flex justify-center items-center"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            "Надіслати посилання"
          )}
        </Button>
      </form>
    </div>
  );
};
