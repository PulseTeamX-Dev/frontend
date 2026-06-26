import { Title } from "../../shared/Title";
import { Button } from "../../shared/Button";
import Icon from "../../shared/Icon";

interface SurveyStartProps {
  onStart: () => void;
}

export const SurveyStart = ({ onStart }: SurveyStartProps) => {
  return (
    <div className="w-full max-w-4xl h-auto md:h-[560px] bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100/50 p-6 py-8 md:p-16 md:py-20 flex flex-col items-center justify-center text-center animate-fade-in transition-all">
      <Title tag="h2" variant="bold" className="text-[#191219]  mb-3 md:mb-6 ">
        Опитування
      </Title>

      <div className="w-full max-w-[950px] flex flex-col gap-3 mb-2 md:mb-8 text-base md:text-lg font-light font-sans">
        <p className="text-[16px] md:text-[20px] leading-6 text-grayscale-900">
          Мета цього опитування — виявити фактори стресу та покращити
          комунікацію в командах.
        </p>
        <p className="text-[14px] md:text-[16px]leading-6 text-grayscale-600">
          Анкетування повністю анонімне. HR-департамент використовує лише
          узагальнені дані для покращення корпоративної культури та умов праці.
        </p>
      </div>

      {/* Блок метаданих */}
      <div className="flex items-center gap-10 mb-4 md:mb-10 text-sm md:text-base font-medium font-sans">
        <div className="flex items-center gap-2.5">
          <Icon id="icon-clock" className="text-gray-700" />
          <span className="text-grayscale-600">
            <strong>2</strong> хвилини
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <Icon id="icon-help" className="text-gray-700" />
          <span className="text-grayscale-600">
            <strong>4</strong> питання
          </span>
        </div>
      </div>

      <div className="mt-2">
        <Button
          type="button"
          variant="primary"
          onClick={onStart}
          className="px-[12px] py-[10px] text-[14px] w-[224px]"
        >
          Почати опитування
        </Button>
      </div>
    </div>
  );
};
