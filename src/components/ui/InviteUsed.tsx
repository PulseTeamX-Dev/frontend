import { Title } from "../../shared/Title";
import blockImg from "../../assets/img/block.png";

export const InviteUsed = () => {
  return (
    <div className="p-8 md:p-10 bg-white shadow-sm rounded-3xl w-full max-w-[420px] flex flex-col items-center text-center animate-fade-in">
      <div className="mb-6">
        <img
          src={blockImg}
          alt="Запрошення вже використано"
          className="w-16 h-16 object-contain"
        />
      </div>
      <Title
        tag="h2"
        variant="bold"
        className="text-xl text-grayscale-900 mb-2"
      >
        Запрошення вже використано
      </Title>
      <div className="w-full flex items-center gap-4 my-6">
        <div className="h-px bg-gray-200 flex-1"></div>
        <span className="text-[12px] text-light-txt">
          Ви можете увійти, використовуючи свій існуючий обліковий запис.
        </span>
        <div className="h-px bg-gray-200 flex-1"></div>
      </div>
    </div>
  );
};
