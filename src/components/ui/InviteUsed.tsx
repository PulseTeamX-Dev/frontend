import { Title } from "../../shared/Title";
import blockImg from "../../assets/img/block.png";
import AppLink from "../../shared/AppLink";

export const InviteUsed = () => {
  return (
    <div className="p-8 md:p-10 bg-white shadow-sm rounded-3xl w-75 md:w-90 lg:w-105 flex flex-col items-center text-center animate-fade-in">
      <div className="mb-6">
        <img
          src={blockImg}
          alt="Запрошення вже використано"
          className="w-20 h-20 object-contain"
        />
      </div>
      <Title tag="h2" variant="bold">
        Запрошення вже використано
      </Title>
      <div className="w-full flex items-center gap-4 my-6">
        <span className="text-[14px] text-light-txt">
          Ви можете увійти, використовуючи свій існуючий обліковий запис.
        </span>
      </div>
      <AppLink path="/login">Увійти</AppLink>
    </div>
  );
};
