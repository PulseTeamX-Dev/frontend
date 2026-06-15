import type { SurveyQuestion } from "../../redux/surveys/types";

interface SurveyCardProps {
  questions: SurveyQuestion[];
}

export const SurveyCard = ({ questions }: SurveyCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col gap-4">
      <h2 className="text-[20px] font-bold text-[#444]">
        Створити опитування
      </h2>

      {questions.slice(0, 4).map((question, index) => (
        <div
          key={question.question_id}
          className="flex flex-col gap-1"
        >
          <label className="text-[12px] text-gray-400">
            Питання {index + 1}
          </label>

          <input
            type="text"
            value={question.text_ua}
            readOnly
            className="
              w-full
              h-[44px]
              px-4
              rounded-xl
              border
              border-gray-300
              bg-white
              text-sm
              outline-none
            "
          />
        </div>
      ))}
    </div>
  );
};