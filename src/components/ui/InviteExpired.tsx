import { Title } from "../../shared/Title";
import timerImg from "../../assets/img/timer.png";

export const InviteExpired = () => {
  return (
    <div className="p-8 md:p-10 bg-white shadow-sm rounded-3xl w-full max-w-[420px] flex flex-col items-center text-center animate-fade-in">
      <div className="mb-6">
        <img
          src={timerImg}
          alt="Час вичерпано"
          className="w-16 h-16 object-contain"
        />
      </div>
      <Title
        tag="h2"
        variant="bold"
        className="text-xl text-grayscale-900 mb-2"
      >
        Термін дії запрошення закінчився
      </Title>
      <div className="w-full flex items-center gap-4 my-6">
        <div className="h-px bg-gray-200 flex-1"></div>
        <span className="text-[12px] text-light-txt">
          Посилання дійсне протягом 48 годин
        </span>
        <div className="h-px bg-gray-200 flex-1"></div>
      </div>
      <p className="text-[14px] text-light-txt">
        Зверніться до Вашого менеджера, щоб отримати повторне запрошення
      </p>
    </div>
  );
};
