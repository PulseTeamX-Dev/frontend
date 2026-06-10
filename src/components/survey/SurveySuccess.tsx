import { Title } from "../../shared/Title";

interface SurveySuccessProps {
  onClose?: () => void;
  isAlreadySubmitted?: boolean;
}

export const SurveySuccess = ({
  onClose,
  isAlreadySubmitted = false,
}: SurveySuccessProps) => {
  return (
    <div className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100/50 p-6 py-12 md:p-16 md:py-20 flex flex-col items-center text-center animate-fade-in relative transition-all">
      <button
        onClick={onClose}
        type="button"
        className="absolute top-6 right-6 md:top-8 md:right-12 text-gray-300 hover:text-gray-500 transition-colors"
        aria-label="Закрити"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div className="mb-6 flex items-center justify-center min-h-[120px] md:min-h-[160px]">
        <div className="w-24 h-24 md:w-28 md:h-28 bg-[#f17837] rounded-full flex items-center justify-center text-white shadow-sm shadow-orange-100 animate-scale-up">
          <svg
            className="w-12 h-12 md:w-14 md:h-14"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      {isAlreadySubmitted ? (
        <>
          <Title tag="h2" variant="bold" className="text-grayscale-900 mb-4">
            Опитування вже завершено
          </Title>
          <p className="text-gray-400 text-sm md:text-base font-light font-sans max-w-md leading-relaxed">
            Ви вже пройшли це опитування. Повторне проходження недоступне.
          </p>
        </>
      ) : (
        <>
          <Title tag="h2" variant="bold" className="text-grayscale-900 mb-5">
            Дякуємо!
          </Title>
          <div className="text-gray-400 text-sm md:text-base font-light font-sans max-w-2xl leading-relaxed space-y-1">
            <p className="font-medium text-gray-700">
              Ваш зворотній зв’язок успішно збережено.
            </p>
            <p className="px-4">
              Дякуємо, що поділилися своїми думками.
              <br />
              Ви допомагаєте нам створювати комфортне та безпечне робоче
              середовище для всієї команди.
            </p>
          </div>
        </>
      )}
    </div>
  );
};
