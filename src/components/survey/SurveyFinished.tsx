import { useMemo, useState } from "react";
import { Title } from "@/shared/ui/Title";

import anim1 from "../../assets/animation/animation1.gif";
import anim2 from "../../assets/animation/animation2.gif";
import anim3 from "../../assets/animation/animation3.gif";
import anim4 from "../../assets/animation/animation4.gif";
import anim5 from "../../assets/animation/animation5.gif";

export const SurveyFinished = () => {
  // Збираємо анімації в стабільний масив. Індекс 0 залишаємо для кастомної галочки.
  const animations = useMemo(
    () => [null, anim1, anim2, anim3, anim4, anim5],
    [],
  );

  const [variant] = useState<number>(() => Math.floor(Math.random() * 6));

  const handleClose = () => {
    window.close();
    setTimeout(() => {
      window.location.href = "/";
    }, 100);
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

      {/* Візуальна частина (Рандом від 0 до 5) */}
      <div className="mb-6 flex items-center justify-center min-h-[120px] md:min-h-[160px]">
        {variant === 0 ? (
          /* Варіант 0: Стандартна помаранчева галочка */
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
        ) : (
          <div className="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
            <img
              src={animations[variant] || undefined}
              alt="Успішно завершено"
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </div>

      {/* Заголовок */}
      <Title tag="h2" variant="bold" className="text-grayscale-900 mb-3">
        Дякуємо!
      </Title>

      <div className="text-grayscale-900 text-sm md:text-base font-light font-sans max-w-[950px] leading-relaxed space-y-2">
        <h2 className="text-xl font-medium text-gray-700 mb-2">
          Ваш зворотній зв’язок успішно збережено.
        </h2>
        <p className="text-[16px] text-gray-500 mb-0">
          Ми вдячні, що поділилися своїми думками.
        </p>
        <p className="text-[16px] text-gray-500">
          Ви допомагаєте нам створювати комфортне та безпечне робоче середовище
          для всієї команди.
        </p>
      </div>
    </div>
  );
};
