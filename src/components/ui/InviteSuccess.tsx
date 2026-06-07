import { Title } from "../../shared/Title";
import checkImg from "../../assets/img/check.png";
import AppLink from "../../shared/AppLink";

export const InviteSuccess = () => {
  return (
    <div className="p-8 md:p-10 bg-white shadow-sm rounded-3xl w-75 md:w-90 lg:w-105 flex flex-col items-center text-center animate-fade-in">
      <div className="mb-6">
        <img
          src={checkImg}
          alt="Запрошення успішно використано"
          className="w-20 h-20 object-contain"
        />
      </div>
      <Title tag="h2" variant="bold">
        Обліковий запис створено!
      </Title>
      <div className="w-full flex items-center gap-4 my-6">
        <span className="text-[12px] text-light-txt">
          Тепер ви можете користуватися платформою та налаштувати свій робочий
          простір.
        </span>
      </div>
      <AppLink path="/dashboard">Налаштувати простір</AppLink>
    </div>
  );
};
