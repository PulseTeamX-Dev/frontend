import { useEffect, useMemo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { setAnswer, clearSurveyForm } from "@/features/survey/model/slice";
import type { AppDispatch, RootState } from "@/app/store";
import { getScaleButtonColors } from "@/shared/lib/surveyButtonColors";
import { Button } from "@/shared/ui/Button";

import {
  fetchSurveyByToken,
  submitSurvey,
} from "@/features/survey/model/operation";
import {
  selectCurrentSurvey,
  selectSurveyError,
  selectSurveyLoading,
} from "@/features/survey/model/selectors";

import { SurveyStart } from "@/features/survey/ui/SurveyStart";
import { SurveyFinished } from "@/features/survey/ui/SurveyFinished";
import { SurveySuccess } from "@/features/survey/ui/SurveySuccess";
import { PageLoader } from "@/shared/ui/Loader";
const SCALE_VALUES = Array.from({ length: 10 }, (_, i) => i + 1);

export const SurveyPage = () => {
  const [wasLoaded, setWasLoaded] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const { survey_token } = useParams<{ survey_token: string }>();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const answers = useSelector((state: RootState) => state.surveys.answers);
  const survey = useSelector(selectCurrentSurvey);
  const loading = useSelector(selectSurveyLoading);
  const errorMessage = useSelector(selectSurveyError);

  const answersMap = useMemo(() => {
    return answers.reduce<Record<number, number | string>>((acc, answer) => {
      acc[answer.questionId] = answer.value;
      return acc;
    }, {});
  }, [answers]);

  useEffect(() => {
    if (!survey_token) return;

    dispatch(
      fetchSurveyByToken({ surveyToken: survey_token, page: currentPage }),
    )
      .unwrap()
      .finally(() => {
        setWasLoaded(true);
      });
  }, [dispatch, survey_token, currentPage]);

  const handleAnswerChange = useCallback(
    (questionId: number, value: number | string) => {
      dispatch(setAnswer({ questionId, value }));
    },
    [dispatch],
  );

  const handleNextPage = () => {
    if (survey?.pagination?.has_next_page) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (survey?.pagination?.has_prev_page) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!survey_token) return;

    const payload = {
      surveyToken: survey_token,
      answers: answers.map((answer) => ({
        questionId: answer.questionId,
        value: answer.value,
      })),
    };

    dispatch(submitSurvey(payload))
      .unwrap()
      .then(() => {
        dispatch(clearSurveyForm());
        setCurrentPage(1);
        setIsSubmitted(true);
      })
      .catch((err) => {
        alert(err || "Помилка під час відправки форми.");
      });
  };

  const isAlreadyDoneByError =
    errorMessage === "Опитування вже пройдено" ||
    errorMessage?.toLowerCase().includes("submitted") ||
    errorMessage?.toLowerCase().includes("already");

  const isAlreadyDoneByData =
    wasLoaded &&
    !loading &&
    (!survey || !survey.questions || survey.questions.length === 0);

  if (loading || !wasLoaded) {
    return <PageLoader />;
  }

  // СЦЕНАРІЙ 1: Користувач щойно самостійно натиснув "Надіслати" -> Подяка
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] py-12 px-4 flex items-center justify-center font-sans">
        <SurveyFinished />
      </div>
    );
  }

  // СЦЕНАРІЙ 2: Повторний клік по лінку -> Заглушка "Тест пройдено"
  if (isAlreadyDoneByError || isAlreadyDoneByData) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] py-12 px-4 flex items-center justify-center font-sans">
        <SurveySuccess isAlreadySubmitted={true} />
      </div>
    );
  }

  // Цей блок loading ми залишаємо, але код до нього навіть не дійде завдяки верхньому фіксу
  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500 font-sans">
        Завантаження опитування...
      </div>
    );
  }

  if (errorMessage && !isAlreadyDoneByError) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 border border-red-200 bg-red-50 text-red-700 rounded-2xl text-center shadow-sm font-sans">
        <h2 className="text-xl font-bold mb-2">Увага</h2>
        <p>{errorMessage}</p>
      </div>
    );
  }
  if (!isStarted) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] py-12 px-4 flex items-center justify-center font-sans">
        <SurveyStart onStart={() => setIsStarted(true)} />
      </div>
    );
  }
  if (!survey || !survey.questions || survey.questions.length === 0) {
    return (
      <div className="p-10 text-center text-gray-500 font-sans">
        Опитування не містить активних запитань.
      </div>
    );
  }

  const question = survey.questions[0];
  const pagination = survey.pagination;
  const currentValue = answersMap[question.question_id];

  const isButtonDisabled =
    question.question_type === "scale" &&
    (currentValue === undefined || currentValue === "");

  const isLastPage = pagination
    ? pagination.current_page === pagination.total_pages
    : true;

  return (
    <div className="min-h-screen bg-[#f7f8fa] py-12 px-2 sm:px-4 font-sans text-grayscale-900 flex items-center justify-center">
      <div className="relative w-full max-w-4xl h-auto md:h-[560px] bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100/50 p-6 py-8 md:p-16 md:py-20 flex flex-col items-center justify-center animate-fade-in transition-all">
        {pagination?.has_prev_page && (
          <button
            type="button"
            onClick={handlePrevPage}
            className="absolute top-4 left-4 md:top-8 md:left-12 flex items-center gap-1 md:gap-2 text-xs md:text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors"
          >
            <span>←</span> Назад
          </button>
        )}

        <div className="flex flex-col items-center w-full">
          <h3 className=" text-center font-bold text-[16px] md:text-[20px] text-grayscale-900 mb-0 md:mb-5 block">
            {question.question_type === "scale"
              ? `Питання ${pagination?.current_page || 1}/${pagination?.total_pages || 1}`
              : "Анонімний Коментар"}
          </h3>

          <p className="w-full text-left lg:text-center text-grayscale-900 text-[16px] md:text-[20px] mb-2 md:mb-4">
            {question.text_ua}
          </p>

          {/* Шкала */}
          {question.question_type === "scale" && (
            <div className="w-full max-w-2xl mb-2 md:mb-8">
              <div className="grid grid-cols-10 justify-items-center gap-1 sm:gap-2 md:gap-3 mb:3 md:mb-5 py-2">
                {SCALE_VALUES.map((value) => {
                  const isSelected = currentValue === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        handleAnswerChange(question.question_id, value)
                      }
                      className={`
                          w-7 h-7
                          sm:w-9 sm:h-9
                          md:w-12 md:h-12
                          rounded-full
                          font-bold
                          text-[10px]
                          sm:text-sm
                          md:text-lg
                          border-2
                          transition-all
                          flex items-center justify-center
                          ${getScaleButtonColors(value, isSelected, question.scale?.color_direction)}
                        `}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between text-[#AAAAAA] text-[11px] sm:text-xs md:text-sm px-1 font-normal gap-2">
                <span className="text-left w-1/3">
                  {question.scale?.min_label_ua || ""}
                </span>
                <span className="text-center w-1/3">
                  {question.scale?.mid_label_ua || ""}
                </span>
                <span className="text-right w-1/3">
                  {question.scale?.max_label_ua || ""}
                </span>
              </div>
            </div>
          )}

          {/* Текстове поле */}
          {question.question_type === "text" && (
            <textarea
              placeholder="Поділіться деталями ситуації..."
              value={typeof currentValue === "string" ? currentValue : ""}
              onChange={(event) =>
                handleAnswerChange(question.question_id, event.target.value)
              }
              className="w-full max-w-2xl min-h-[140px] border border-light-txt bg-transparent rounded-xl p-4 outline-none  focus:border-yellow-500 caret-yellow-700 group-hover:border-yellow-500 placeholder:text-[#AAA5A9] text-base transition mb-2 md:mb-8 resize-none"
            />
          )}

          {/* Кнопка дії */}
          <div className="mt-2">
            {!isLastPage ? (
              <Button
                type="button"
                variant="primary"
                disabled={isButtonDisabled}
                onClick={handleNextPage}
                className="min-w-45 rounded-xl px-[10px] py-[12px]"
              >
                Продовжити
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                disabled={isButtonDisabled}
                onClick={handleSubmit}
                className="min-w-45 rounded-xl"
              >
                Надіслати
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
