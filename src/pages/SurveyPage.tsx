import { useEffect, useMemo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { setAnswer, clearSurveyForm } from "../redux/surveys/slice";
import type { AppDispatch, RootState } from "../redux/store";
import { getScaleButtonColors } from "../utils/surveyButtonColors";
import { Button } from "../shared/Button";

import { fetchSurveyByToken, submitSurvey } from "../redux/surveys/operation";
import {
  selectCurrentSurvey,
  selectSurveyError,
  selectSurveyLoading,
} from "../redux/surveys/selectors";

import { SurveyStart } from "../components/survey/SurveyStart";
import { SurveyFinished } from "../components/survey/SurveyFinished";
import { SurveySuccess } from "../components/survey/SurveySuccess";

const SCALE_VALUES = Array.from({ length: 10 }, (_, i) => i + 1);

export const SurveyPage = () => {
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
    );
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

  // Відправка форми (SUBMIT)
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

  // Перевірка помилки від бекенду: чи проходив користувач тест раніше
  const isAlreadyDoneByError =
    errorMessage === "Опитування вже пройдено" ||
    errorMessage?.toLowerCase().includes("submitted") ||
    errorMessage?.toLowerCase().includes("already");

  const isAlreadyDoneByData =
    !loading && (!survey || !survey.questions || survey.questions.length === 0);

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
  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500 font-sans">
        Завантаження опитування...
      </div>
    );
  }
  // Звичайна критична помилка (невалідний токен, 404, впав сервер тощо)
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
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100/50 p-3 px-4 pt-14 xs:p-6 md:p-16 md:pt-20 relative transition-all">
        {pagination?.has_prev_page && (
          <button
            type="button"
            onClick={handlePrevPage}
            className="absolute top-6 left-6 md:top-8 md:left-12 flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors"
          >
            <span>←</span> Назад
          </button>
        )}

        <div className="flex flex-col items-center text-center">
          <span className="text-2xl font-bold font-heading text-grayscale-900 mb-5 block">
            {question.question_type === "scale"
              ? `Питання ${pagination?.current_page || 1}/${pagination?.total_pages || 1}`
              : "Анонімний Коментар"}
          </span>

          <h3 className="text-base md:text-lg font-light text-gray-500 leading-6 mb-8 max-w-2xl font-sans">
            {question.text_ua}
          </h3>

          {/* Шкала */}
          {question.question_type === "scale" && (
            <div className="w-full max-w-2xl mb-8">
              <div className="grid grid-cols-10 justify-items-center gap-1 sm:gap-2 md:gap-3 mb-5 py-2">
                {SCALE_VALUES.map((value) => {
                  const isSelected = currentValue === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        handleAnswerChange(question.question_id, value)
                      }
                      className={`w-full max-w-[44px] md:max-w-[48px] aspect-square rounded-full font-bold text-[11px] xs:text-[13px] sm:text-base md:text-lg border-2 transition-all flex items-center justify-center ${getScaleButtonColors(value, isSelected, question.scale?.color_direction)}`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between text-gray-300 text-[11px] sm:text-xs md:text-sm px-1 font-normal gap-2">
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
              className="w-full max-w-2xl min-h-[140px] border border-gray-200 bg-transparent rounded-xl p-4 outline-none focus:border-orange-400 placeholder:text-gray-300 text-base transition mb-8 resize-none"
            />
          )}

          {/* Кнопка дії */}
          <div className="mt-2">
            {!isLastPage ? (
              <Button
                type="button"
                variant="survey"
                disabled={isButtonDisabled}
                onClick={handleNextPage}
                className="!bg-[#f17837] hover:!opacity-90 active:scale-[0.98] min-w-[180px] !text-white rounded-xl"
              >
                Продовжити
              </Button>
            ) : (
              <Button
                type="button"
                variant="survey"
                disabled={isButtonDisabled}
                onClick={handleSubmit}
                className="!bg-[#f17837] hover:!opacity-90 active:scale-[0.98] min-w-[180px] !text-white rounded-xl"
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
