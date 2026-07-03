import { Title } from "@/shared/ui/Title";
import { useAppDispatch } from "../../hooks/useReduxTypes";
import { resetRecoverStatus } from "../../redux/auth/slice";
import mailImg from "../../assets/img/email.png";
import { Button } from "@/shared/ui/Button";

interface Props {
  onBack: () => void;
}

export const CheckEmailView = ({ onBack }: Props) => {
  const dispatch = useAppDispatch();

  const handleBack = () => {
    dispatch(resetRecoverStatus()); // Скидаємо стейт відправки листа
    onBack(); // Повертаємося на форму логіну
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex justify-start mb-2 -mt-2">
        <button
          onClick={handleBack}
          className="text-[14px] text-light-txt hover:text-grayscale-900 transition-colors flex items-center gap-2"
        >
          <span>&larr;</span> Назад
        </button>
      </div>

      <div className="flex justify-center mb-6 mt-2">
        <img
          src={mailImg}
          alt="Перевірте електронну пошту"
          className="w-20 h-20"
        />
      </div>

      <Title tag="h2" variant="bold" className="text-xl mb-4 text-center">
        Перевірте вашу електронну пошту
      </Title>
      <p className="text-[14px] text-light-txt mb-8 leading-[1.5] text-center">
        Ми надіслали посилання для відновлення пароля.
        <br />
        Перевірте вкладку "Вхідні" та "Спам".
      </p>

      <div className="w-full flex flex-col gap-3">
        <span className="text-[10px] uppercase font-bold text-light-txt tracking-wider text-center">
          Не отримали листа?
        </span>
        <Button
          onClick={() => {
            /* Тут можна прив'язати повторну відправку, якщо треба */
          }}
          variant="primary"
          className="w-full py-3.5 transition-colors"
        >
          Надіслати повторно
        </Button>
      </div>
    </div>
  );
};
