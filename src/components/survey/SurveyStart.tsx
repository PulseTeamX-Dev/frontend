import { Title } from "../../shared/Title";
import { Button } from "../../shared/Button";

// Імпортуємо як звичайні URL-шляхи до картинок
import clockSrc from "../../assets/icons/clock.svg";
import questionSrc from "../../assets/icons/question.svg";

interface SurveyStartProps {
  onStart: () => void;
}

export const SurveyStart = ({ onStart }: SurveyStartProps) => {
  return (
    <div className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100/50 p-6 py-12 md:p-16 md:py-20 flex flex-col items-center text-center animate-fade-in transition-all">
      <Title tag="h2" variant="bold" className="text-grayscale-900 mb-6">
        Опитування
      </Title>

      <div className="w-full max-w-[950px] flex flex-col gap-3 mb-8 text-base md:text-lg font-light font-sans">
        <p className="text-[16px] leading-6 font-bold text-grayscale-600">
          Мета цього опитування — виявити фактори стресу та покращити
          комунікацію в командах.
        </p>
        <p className="mt-2 text-[16px] leading-6 text-grayscale-600">
          Анкетування повністю анонімне. HR-департамент використовує лише
          узагальнені дані для покращення корпоративної культури та умов праці.
        </p>
      </div>

      {/* Блок метаданих */}
      <div className="flex items-center gap-8 mb-10 text-sm md:text-base font-medium text-gray-500 font-sans">
        {/* Годинник */}
        <div className="flex items-center gap-2.5">
          <img src={clockSrc} alt="Час" className="w-6 h-6 shrink-0" />
          <span>
            <strong className="text-grayscale-900 font-bold">2</strong> хвилини
          </span>
        </div>

        {/* Кількість питань */}
        <div className="flex items-center gap-2.5">
          <img src={questionSrc} alt="Запитання" className="w-6 h-6 shrink-0" />
          <span>
            <strong className="text-grayscale-900 font-bold">4</strong> питання
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
