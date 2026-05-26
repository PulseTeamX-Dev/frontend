// export const SurveyPage = () => {
//   return (
//     <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
//       <h1 className="text-xl font-bold mb-4">Weekly Survey</h1>
//       {/* Тут буде форма з питаннями (напруження, довіра, навантаження) (згідно EPIC 9) */}
//     </div>
//   );
// };
import { useState } from "react";

const questions = [
  {
    id: "tension",
    label: "How high was your tension level this week?",
  },
  {
    id: "trust",
    label: "How much trust do you feel in your team?",
  },
  {
    id: "workload",
    label: "How manageable was your workload?",
  },
];

export const SurveyPage = () => {
  const [answers, setAnswers] = useState<
    Record<
      string,
      {
        rating: number | null;
        comment: string;
      }
    >
  >({
    tension: {
      rating: null,
      comment: "",
    },
    trust: {
      rating: null,
      comment: "",
    },
    workload: {
      rating: null,
      comment: "",
    },
  });

  const handleRatingChange = (questionId: string, rating: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        rating,
      },
    }));
  };

  const handleCommentChange = (questionId: string, comment: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        comment,
      },
    }));
  };

  const handleSubmit = () => {
    const payload = Object.entries(answers).map(([questionId, value]) => ({
      questionId,
      rating: value.rating,
      comment: value.comment,
    }));

    console.log(payload);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-8">Weekly Survey</h1>

      <div className="space-y-6">
        {questions.map((question) => {
          const currentAnswer = answers[question.id];

          return (
            <div
              key={question.id}
              className="border rounded-2xl p-5 shadow-sm bg-white"
            >
              <h2 className="text-lg font-semibold mb-4">{question.label}</h2>

              <div className="flex flex-wrap gap-2 mb-4">
                {Array.from({ length: 10 }, (_, index) => {
                  const value = index + 1;

                  const isActive = currentAnswer.rating === value;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleRatingChange(question.id, value)}
                      className={`w-10 h-10 rounded-lg font-semibold transition ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "bg-slate-200 hover:bg-slate-300"
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>

              <textarea
                placeholder="Add comment..."
                value={currentAnswer.comment}
                onChange={(event) =>
                  handleCommentChange(question.id, event.target.value)
                }
                className="w-full min-h-[100px] border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="mt-8 bg-black text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90"
      >
        Submit Survey
      </button>
    </div>
  );
};
