import { Title } from "../../shared/Title";
import { Button } from "../../shared/Button";

interface SurveyStartProps {
  onStart: () => void;
}

export const SurveyStart = ({ onStart }: SurveyStartProps) => {
  return (
    <div className="w-full max-w-4xl bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100/50 p-6 py-12 md:p-16 md:py-20 flex flex-col items-center text-center animate-fade-in transition-all">
      {/* Заголовок сторінки */}
      <Title tag="h2" variant="bold" className="text-grayscale-900 mb-6">
        Опитування
      </Title>

      {/* Текстовий блок опису */}
      <div className="w-full max-w-2xl flex flex-col gap-3 mb-8 text-base md:text-lg font-light font-sans">
        <p className="text-gray-500 leading-relaxed font-medium">
          Мета цього опитування — виявити фактори стресу та покращити
          комунікацію в командах.
        </p>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed">
          Анкетування повністю анонімне. HR-департамент використовує лише
          узагальнені дані для покращення корпоративної культури та умов праці.
        </p>
      </div>

      {/* Блок метаданих: Час та Питання (з іконками) */}
      <div className="flex items-center gap-8 mb-10 text-sm md:text-base font-medium text-gray-400 font-sans">
        {/* Годинник */}
        <div className="flex items-center gap-2.5">
          <svg
            className="w-5 h-5 text-gray-400 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6l4 2M22 12a10 10 0 11-20 0 10 10 0 0120 0z"
            />
          </svg>
          <span>
            <strong className="text-grayscale-900 font-bold">2</strong> хвилини
          </span>
        </div>

        {/* Кількість питань */}
        <div className="flex items-center gap-2.5">
          <svg
            className="w-5 h-5 text-gray-400 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            <strong className="text-grayscale-900 font-bold">4</strong> питання
          </span>
        </div>
      </div>

      {/* Центральна помаранчева кнопка дії */}
      <div className="mt-2">
        <Button
          type="button"
          variant="survey"
          onClick={onStart}
          className="!bg-[#f17837] hover:!opacity-90 active:scale-[0.98] min-w-[200px] !text-white rounded-xl py-3 font-semibold text-base transition-all"
        >
          Почати опитування
        </Button>
      </div>
    </div>
  );
};
