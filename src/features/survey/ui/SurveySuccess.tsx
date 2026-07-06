import { Title } from "@/shared/ui/Title";

interface SurveySuccessProps {
  isAlreadySubmitted?: boolean;
  onClose?: () => void;
}

export const SurveySuccess = ({
  isAlreadySubmitted = false,
  onClose,
}: SurveySuccessProps) => {
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      window.close();

      setTimeout(() => {
        window.location.href = "/";
      }, 100);
    }
  };

  return (
    <div className="relative w-full max-w-4xl h-auto md:h-[560px] bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100/50 p-6 py-8 md:p-16 md:py-20 flex flex-col items-center justify-center text-center animate-fade-in transition-all">
      <button
        type="button"
        onClick={handleClose}
        className="absolute top-6 right-6 md:top-8 md:right-12 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-50 transition-colors"
        aria-label="Закрити сторінку"
      >
        <svg
          className="w-6 h-6 md:w-7 md:h-7"
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
          <Title
            tag="h2"
            variant="bold"
            className="text-grayscale-900 mb-2 md:mb-4"
          >
            Опитування вже завершено
          </Title>
          <p className="text-gray-600 text-sm md:text-base font-light font-sans max-w-md leading-relaxed">
            Ви вже пройшли це опитування. Повторне проходження недоступне.
          </p>
        </>
      ) : (
        <>
          <Title tag="h2" variant="bold" className="text-grayscale-900 mb-5">
            Дякуємо!
          </Title>
          <div className="text-gray-400 text-sm md:text-base font-light font-sans max-w-2xl leading-relaxed space-y-2">
            <p className="font-medium text-gray-700">
              Ваш зворотній зв’язок успішно збережено.
            </p>
            <p className="px-4 text-gray-500">
              Ми вдячні, що Ви поділилися своїми думками.
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
