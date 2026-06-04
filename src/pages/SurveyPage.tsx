import { useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { setAnswer, clearSurveyForm } from "../redux/surveys/slice";
import type { AppDispatch, RootState } from "../redux/store";
import { getScaleButtonColors } from "../utils/surveyButtonColors";

import { fetchSurveyByToken, submitSurvey } from "../redux/surveys/operation";
import {
  selectCurrentSurvey,
  selectSurveyError,
  selectSurveyLoading,
} from "../redux/surveys/selectors";

const SCALE_VALUES = Array.from({ length: 10 }, (_, i) => i + 1);

export const SurveyPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Очікуємо UUID токен з URL
  const { survey_token } = useParams<{ survey_token: string }>();

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
    dispatch(fetchSurveyByToken(survey_token));
  }, [dispatch, survey_token]);

  // Мемоізуємо хендлер, щоб кнопки шкал без потреби не перемальовувалися
  const handleAnswerChange = useCallback(
    (questionId: number, value: number | string) => {
      dispatch(setAnswer({ questionId, value }));
    },
    [dispatch],
  );

  // (SUBMIT)
  const handleSubmit = async () => {
    if (!survey_token) return;

    const payload = {
      surveyToken: survey_token,
      answers: answers.map((answer) => ({
        questionId: answer.questionId,
        value: answer.value,
      })),
    };

    // Диспатчим санку отправки
    dispatch(submitSurvey(payload))
      .unwrap()
      .then(() => {
        dispatch(clearSurveyForm());
        alert("Дякуємо! Ваші відповіді успішно збережено.");
      })
      .catch((err) => {
        alert(err || "Помилка під час відправки форми.");
      });
  };

  //  (UI)

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500 font-sans">
        Завантаження опитування...
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 border border-red-200 bg-red-50 text-red-700 rounded-2xl text-center shadow-sm font-sans">
        <h2 className="text-xl font-bold mb-2">Увага</h2>
        <p>{errorMessage}</p>
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

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 font-sans text-[#333333]">
      <h1 className="text-3xl font-bold mb-8 text-center md:text-left">
        Опитування команди
      </h1>

      <div className="space-y-16">
        {survey.questions.map((question, index) => {
          const currentValue = answersMap[question.question_id];

          const hasValue = currentValue !== undefined && currentValue !== "";

          return (
            <div
              key={question.question_id}
              className="border-b border-gray-100 pb-12 last:border-none flex flex-col items-center text-center"
            >
              {/* Номер питання */}
              <span className="text-lg font-bold text-gray-800 mb-3 block">
                Питання {index + 1}/{survey.questions.length}
              </span>

              {/* Текст питання */}
              <h2 className="text-xl md:text-2xl font-normal text-gray-700 leading-snug mb-8 max-w-2xl">
                {question.text_ua}
              </h2>

              {/* 1. ШКАЛА (SCALE) */}
              {question.question_type === "scale" && (
                <div className="w-full max-w-2xl mb-6">
                  {/* Ряд круглих кнопок */}
                  <div className="flex justify-between items-center gap-2 md:gap-3 mb-3 overflow-x-auto py-2 px-1">
                    {SCALE_VALUES.map((value) => {
                      const isSelected = currentValue === value;

                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() =>
                            handleAnswerChange(question.question_id, value)
                          }
                          className={`w-11 h-11 md:w-12 md:h-12 rounded-full font-bold text-base md:text-lg border-2 transition-all flex items-center justify-center shrink-0 ${getScaleButtonColors(value, isSelected)}`}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>

                  {/* Підписи меж */}
                  <div className="flex justify-between text-gray-400 text-sm px-1">
                    <span>Дуже низький</span>
                    <span>Чудовий</span>
                  </div>
                </div>
              )}

              {/* 2. TEXT */}
              {question.question_type === "text" && (
                <textarea
                  placeholder="Ваша відповідь..."
                  value={typeof currentValue === "string" ? currentValue : ""}
                  onChange={(event) =>
                    handleAnswerChange(question.question_id, event.target.value)
                  }
                  className="w-full max-w-xl min-h-[120px] border-2 border-gray-200 rounded-xl p-3 outline-none focus:border-gray-400 text-base transition mb-6"
                />
              )}

              {/* Кнопка "Продовжити"*/}
              <button
                type="button"
                disabled={!hasValue}
                className={`px-12 py-3.5 rounded-xl font-medium text-white text-base shadow-sm transition-all duration-200 min-w-[200px] ${
                  hasValue
                    ? "bg-[#F37E44] hover:bg-[#e26f35] active:scale-[0.98] cursor-pointer"
                    : "bg-gray-300 cursor-not-allowed opacity-60"
                }`}
              >
                Продовжити
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center md:justify-start mt-12">
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-black text-white px-8 py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity text-base"
        >
          Надіслати відповіді
        </button>
      </div>
    </div>
  );
};
