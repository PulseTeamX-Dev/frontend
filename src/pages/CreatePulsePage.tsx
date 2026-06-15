import { useState } from "react";
import { FrequencySelector } from "../components/createPulse/FrequencySelector";

const SelectButton = ({ text }: { text: string }) => (
  <button
    className="
      h-11
      px-5
      bg-[#F26E3B]
      text-white
      rounded-full
      flex
      items-center
      gap-2
      text-sm
    "
  >
    {text}
    <span>⌄</span>
  </button>
);

export const CreatePulsePage = () => {
  const [questions, setQuestions] = useState([
    "Чи відчували ви напруження у спілкуванні цього тижня?",
    "Чи відчували ви надмірне робоче навантаження?",
    "Чи зрозумілі вам пріоритети та очікування від роботи?",
    "Чи комфортно вам висловлювати свою думку в команді?",
  ]);

  const [frequency, setFrequency] = useState<
    "weekly" | "biweekly" | "monthly"
  >("weekly");

  const [sendDay] = useState("Понеділок");
  const [sendTime] = useState("10:00");

  const [deadlineDay] = useState("П'ятниця");
  const [deadlineTime] = useState("14:00");

  

  return (
    <div className="max-w-[708px] mx-auto py-8 flex flex-col gap-4">
      {/* КАРТКА 1 */}

      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-xl font-bold mb-6">
          Створити опитування
        </h2>

        <div className="flex flex-col gap-4">
          {questions.map((question, index) => (
            <div key={index}>
              <label className="block text-xs text-gray-400 mb-2">
                Питання {index + 1}
              </label>

              <input
                value={question}
                readOnly
                className="
                w-full
                h-11
                px-4
                rounded-xl
                border
                border-gray-300
                outline-none
                "
              />
            </div>
          ))}
        </div>
      </div>

      {/* КАРТКА 2 */}

      <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col gap-4">
        <h2 className="text-[20px] font-bold mb-4">
          Періодичність опитувань
        </h2>

        {/* Частота */}

        

  <div className="border rounded-xl p-3 flex justify-between items-center ">
  <span className="text-gray-500">
    Частота опитування
  </span>

  <FrequencySelector
    value={frequency}
    onChange={setFrequency}
  />
</div>
        

        {/* Надсилання */}

  <div className="border rounded-xl p-3 flex justify-between items-center">
  <span className="text-gray-500">
    День та час надсилання
  </span>

  <div className="flex gap-3">
    <SelectButton text="Понеділок" />
    <SelectButton text="10:00" />
  </div>
</div>

        {/* Deadline */}

        <div className="border rounded-xl p-3 flex justify-between items-center">
          <span className="text-gray-500">
            Кінцевий термін
          </span>

          <div className="flex gap-3">
            <SelectButton text="П'ятниця" />
            <SelectButton text="14:00" />
          </div>
        </div>

        {/* Кнопка */}

        <button
          className="
          mt-4
          w-fit
          px-6
          h-11
          rounded-xl
          bg-[#F26E3B]
          text-white
          font-medium
          hover:opacity-90
          transition
          "
        >
          Запланувати опитування
        </button>
      </div>
    </div>
  );
}