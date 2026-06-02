import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { setAnswer, clearSurveyForm } from "../redux/surveys/slice";
import type { RootState } from "../redux/store";

interface ConditionalRule {
  field: string;
  value: number;
  operator: string;
}

interface SurveyQuestion {
  question_id: number;
  field_key: string;
  text_ua: string;
  question_type: "scale" | "text" | "boolean";
  sort_order: number;
  conditional: ConditionalRule | null;
  is_active: boolean;
  created_at: string;
}

interface SurveyResponse {
  survey_id: number;
  questions: SurveyQuestion[];
}

export const SurveyPage = () => {
  const dispatch = useDispatch();

  // Очікуємо UUID токен з URL
  const { survey_token } = useParams<{ survey_token: string }>();

  const answers = useSelector((state: RootState) => state.surveys.answers);

  const [survey, setSurvey] = useState<SurveyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadSurvey = async () => {
      if (!survey_token) {
        setErrorMessage("Токен опитування відсутній у посиланні.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://pulseteamx-api.onrender.com/api/surveys/${survey_token}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || data.message || "Не вдалося завантажити опитування",
          );
        }

        const surveyData = data as SurveyResponse;

        // Сортуємо питання за sort_order
        if (surveyData.questions && Array.isArray(surveyData.questions)) {
          surveyData.questions.sort((a, b) => a.sort_order - b.sort_order);
        }

        setSurvey(surveyData);
      } catch (error) {
        console.error("Помилка завантаження опитування:", error);

        const message =
          error instanceof Error
            ? error.message
            : "Щось пішло не так під час завантаження.";
        setErrorMessage(message);
      } finally {
        setLoading(false);
      }
    };

    loadSurvey();
  }, [survey_token]);

  const getAnswerValue = (questionId: number) => {
    return answers.find((answer) => answer.questionId === questionId)?.value;
  };

  const handleAnswerChange = (questionId: number, value: number | string) => {
    dispatch(
      setAnswer({
        questionId,
        value,
      }),
    );
  };

  //  (SUBMIT)
  const handleSubmit = async () => {
    if (!survey_token) return;

    const payload = {
      surveyToken: survey_token,
      fingerprint: "browser-fingerprint-default",
      answers: answers.map((answer) => ({
        questionId: answer.questionId,
        value: answer.value,
      })),
    };

    console.log("SUBMIT PAYLOAD", payload);

    try {
      const response = await fetch(
        "https://pulseteamx-api.onrender.com/api/surveys/submit",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Не вдалося надіслати відповіді",
        );
      }

      console.log("SUBMIT RESPONSE SUCCESS:", data);

      dispatch(clearSurveyForm());
      alert("Дякуємо! Ваші відповіді успішно збережено.");
    } catch (error) {
      console.error("Помилка відправки:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Помилка під час відправки форми.";
      alert(message);
    }
  };

  //  (UI)

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Завантаження опитування...
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 border border-red-200 bg-red-50 text-red-700 rounded-2xl text-center shadow-sm">
        <h2 className="text-xl font-bold mb-2">Увага</h2>
        <p>{errorMessage}</p>
      </div>
    );
  }

  if (!survey || !survey.questions || survey.questions.length === 0) {
    return (
      <div className="p-10 text-center text-gray-500">
        Опитування не містить активних запитань.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-8">Опитування команди</h1>

      <div className="space-y-6">
        {survey.questions.map((question) => {
          const currentValue = getAnswerValue(question.question_id);

          return (
            <div
              key={question.question_id}
              className="border rounded-2xl p-5 shadow-sm bg-white"
            >
              <h2 className="text-lg font-semibold mb-4">{question.text_ua}</h2>

              {question.question_type === "boolean" && (
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => handleAnswerChange(question.question_id, 1)}
                    className={`px-6 py-2.5 rounded-xl font-semibold border transition ${
                      currentValue === 1
                        ? "bg-green-600 border-green-600 text-white"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    Так
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAnswerChange(question.question_id, 0)}
                    className={`px-6 py-2.5 rounded-xl font-semibold border transition ${
                      currentValue === 0
                        ? "bg-red-600 border-red-600 text-white"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    Ні
                  </button>
                </div>
              )}

              {question.question_type === "scale" && (
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 10 }, (_, index) => {
                    const value = index + 1;

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          handleAnswerChange(question.question_id, value)
                        }
                        className={`w-10 h-10 rounded-lg font-semibold transition ${
                          currentValue === value
                            ? "bg-blue-600 text-white"
                            : "bg-slate-200 hover:bg-slate-300"
                        }`}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              )}

              {question.question_type === "text" && (
                <textarea
                  placeholder="Ваша відповідь..."
                  value={typeof currentValue === "string" ? currentValue : ""}
                  onChange={(event) =>
                    handleAnswerChange(question.question_id, event.target.value)
                  }
                  className="w-full min-h-[120px] border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-400"
                />
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="mt-8 bg-black text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
      >
        Надіслати відповіді
      </button>
    </div>
  );
};
