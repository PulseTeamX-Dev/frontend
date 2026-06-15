import { FrequencySelector } from "../components/createPulse/FrequencySelector";
import { Dropdown } from "../components/createPulse/Dropdown";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/useReduxTypes";
import { fetchQuestions } from "../redux/surveys/operation";
import { selectQuestions, selectSurveyLoading,} from "../redux/surveys/selectors";


export const CreatePulsePage = () => {
  const dispatch = useAppDispatch();
  const questions = useAppSelector(selectQuestions);
  const isLoading = useAppSelector(selectSurveyLoading);

  useEffect(() => {
  dispatch(fetchQuestions());
}, [dispatch]);

  const [frequency, setFrequency] = useState<
    "weekly" | "biweekly" | "monthly"
  >("weekly");

  const [sendDay, setSendDay] = useState("Понеділок");
  const [sendTime, setSendTime] = useState("10:00");

  const [deadlineDay, setDeadlineDay] = useState("П'ятниця");
  const [deadlineTime, setDeadlineTime] = useState("14:00");

  const days = [
  "Понеділок",
  "Вівторок",
  "Середа",
  "Четвер",
  "П'ятниця",
];

const times = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
];

  return (
    <div className="max-w-[708px] mx-auto py-8 flex flex-col gap-4">
      {/* КАРТКА 1 */}

      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-xl font-bold mb-6">
          Створити опитування
        </h2>

        <div className="flex flex-col gap-4">
          {isLoading ? (
    <div className="text-center py-6">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F26E3B]" />
    </div>
  ) : (
    questions
      .filter((q) => q.is_active)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((question, index) => (
            <div key={question.question_id}>
              <label className="block text-xs text-gray-400 mb-2">
                Питання {index + 1}
              </label>

              <input
                value={question.text_ua}
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
          )))}
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
  <Dropdown
      value={sendDay}
      options={days}
      onChange={setSendDay}
    />

    <Dropdown
      value={sendTime}
      options={times}
      onChange={setSendTime}
      width="82px"
    />
</div>
</div>

       

        <div className="border rounded-xl p-3 flex justify-between items-center">
          <span className="text-gray-500">
            Кінцевий термін
          </span>

          <div className="flex gap-3">
            <Dropdown
      value={deadlineDay}
      options={days}
      onChange={setDeadlineDay}
    />

    <Dropdown
      value={deadlineTime}
      options={times}
      onChange={setDeadlineTime}
      width="82px"
    />
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