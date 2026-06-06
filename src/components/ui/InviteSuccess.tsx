import { Title } from "../../shared/Title";
import checkImg from "../../assets/img/check.png";

export const InviteSuccess = () => {
  return (
    <div className="p-8 md:p-10 bg-white shadow-sm rounded-3xl w-full max-w-[420px] flex flex-col items-center text-center animate-fade-in">
      <div className="mb-6">
        <img
          src={checkImg}
          alt="Запрошення успішно використано"
          className="w-16 h-16 object-contain"
        />
      </div>
      <Title
        tag="h2"
        variant="bold"
        className="text-xl text-grayscale-900 mb-2"
      >
        Обліковий запис створено!
      </Title>
      <div className="w-full flex items-center gap-4 my-6">
        <div className="h-px bg-gray-200 flex-1"></div>
        <span className="text-[12px] text-light-txt">
          Тепер ви можете користуватися платформою та налаштувати свій робочий
          простір.
        </span>
        <div className="h-px bg-gray-200 flex-1"></div>
      </div>
    </div>
  );
};
