import { useState } from "react";
import { Title } from "../../shared/Title";
import { Input } from "../../shared/Input";
import { useAppDispatch, useAppSelector } from "../../hooks/useReduxTypes";
import { recoverPassword } from "../../redux/auth/operation";
import { selectAuthLoading } from "../../redux/auth/selectors";
import { resetRecoverStatus } from "../../redux/auth/slice";
import lockImg from "../../assets/img/lock.png";

interface Props {
  onBack: () => void;
}

export const ForgotPasswordForm = ({ onBack }: Props) => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);

  const globalError = useAppSelector((state) => state.auth.error);

  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState("");

  // Хендлер зміни тексту в інпуті
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (localError) setLocalError("");
    if (globalError) dispatch(resetRecoverStatus());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      return setLocalError("Будь ласка, введіть електронну пошту.");
    }
    dispatch(recoverPassword(email));
  };

  const displayError = localError || globalError;

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
        Введіть вашу電子 електронну пошту, і ми надішлемо посилання для скидання
        пароля.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          type="email"
          autoComplete="email"
          label="Електронна пошта"
          placeholder="name@company.com"
          leftIcon="user"
          value={email}
          onChange={handleEmailChange}
          error={displayError as string}
          helperText={
            !displayError
              ? "На вказану адресу електронної пошти ми надішлемо інструкцію відновлення пароля."
              : ""
          }
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
            "Надіслати посилання"
          )}
        </button>
      </form>
    </div>
  );
};
