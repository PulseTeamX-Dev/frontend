import { FrequencySelector } from "../components/createPulse/FrequencySelector";
import { Dropdown } from "../components/createPulse/Dropdown";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/useReduxTypes";
import { fetchQuestions } from "../redux/surveys/operation";
import {
  selectQuestions,
  selectSurveyLoading,
} from "../redux/surveys/selectors";
import { toast } from "react-toastify";

interface PulseConfig {
  id: string;
  title: string;
  questionIds: (number | string)[];
  frequency: "weekly" | "biweekly" | "monthly";
  sendDay: string;
  sendTime: string;
  deadlineDay: string;
  deadlineTime: string;
}

export const CreatePulsePage = () => {
  const dispatch = useAppDispatch();
  const questions = useAppSelector(selectQuestions);
  const isLoading = useAppSelector(selectSurveyLoading);
  const [title, setTitle] = useState("");
  const [savedPulses, setSavedPulses] = useState<PulseConfig[]>(() => {
    const stored = localStorage.getItem("pulseConfigs");

    if (!stored) return [];

    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  });

  const [selectedPulseId, setSelectedPulseId] = useState<string | null>(null);

  const loadPulse = (pulse: PulseConfig) => {
    setSelectedPulseId(pulse.id);
    setTitle(pulse.title);

    setFrequency(pulse.frequency);

    setSendDay(pulse.sendDay);
    setSendTime(pulse.sendTime);

    setDeadlineDay(pulse.deadlineDay);
    setDeadlineTime(pulse.deadlineTime);
  };

  const deletePulse = (id: string) => {
    const updated = savedPulses.filter((pulse) => pulse.id !== id);

    setSavedPulses(updated);

    localStorage.setItem("pulseConfigs", JSON.stringify(updated));

    // Якщо видаляємо відкритий зараз Pulse
    if (selectedPulseId === id) {
      resetForm();
    }

    toast.success("Опитування видалено");
  };

  const resetForm = () => {
    setSelectedPulseId(null);

    setTitle("");

    setFrequency("weekly");

    setSendDay("Понеділок");
    setSendTime("10:00");

    setDeadlineDay("П'ятниця");
    setDeadlineTime("14:00");
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("Вкажіть назву опитування");
      return;
    }
    const dto: PulseConfig = {
      id: crypto.randomUUID(),
      title,
      questionIds: questions
        .filter((q) => q.is_active)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((q) => q.question_id),

      frequency,
      sendDay,
      sendTime,
      deadlineDay,
      deadlineTime,
    };

    if (selectedPulseId) {
      const updated = savedPulses.map((pulse) =>
        pulse.id === selectedPulseId
          ? {
              ...dto,
              id: selectedPulseId,
            }
          : pulse,
      );

      setSavedPulses(updated);

      localStorage.setItem("pulseConfigs", JSON.stringify(updated));

      toast.success("Опитування оновлено");

      return;
    }

    const updated = [...savedPulses, dto];
    setSavedPulses(updated);
    localStorage.setItem("pulseConfigs", JSON.stringify(updated));
    toast.success("Опитування створено");
  };

  useEffect(() => {
    dispatch(fetchQuestions());
  }, [dispatch]);

  const [frequency, setFrequency] = useState<"weekly" | "biweekly" | "monthly">(
    "weekly",
  );

  const [sendDay, setSendDay] = useState("Понеділок");
  const [sendTime, setSendTime] = useState("10:00");
  const [deadlineDay, setDeadlineDay] = useState("П'ятниця");
  const [deadlineTime, setDeadlineTime] = useState("14:00");

  const days = ["Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця"];

  const times = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"];

  return (
    <div className="max-w-[708px] mx-auto py-8 flex flex-col gap-4">
      <button onClick={() => resetForm()} className="...">
        + Нове опитування
      </button>

      {savedPulses.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-bold mb-3">
            Мої Pulse ({savedPulses.length})
          </h2>

          <div className="flex flex-wrap gap-2">
            {savedPulses.map((pulse) => (
              <div key={pulse.id} className="flex items-center gap-1">
                <button
                  onClick={() => loadPulse(pulse)}
                  className={`
                px-4
                py-2
                rounded-full
                border
              transition
              ${
                selectedPulseId === pulse.id
                  ? "bg-[#F26E3B] text-white border-[#F26E3B]"
                  : "border-gray-300 hover:bg-gray-100"
              }
            `}
                >
                  {pulse.title}
                </button>
                <button
                  onClick={() => deletePulse(pulse.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* КАРТКА 1 */}

      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-xl font-bold mb-6">Створити опитування</h2>
        <div>
          <label className="block text-xs text-gray-400 mb-2">
            Назва опитування
          </label>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Weekly HR Pulse"
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
                    readOnly
                    value={question.text_ua}
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
              ))
          )}
        </div>
      </div>

      {/* КАРТКА 2 */}

      <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col gap-4">
        <h2 className="text-[20px] font-bold mb-4">Періодичність опитувань</h2>

        {/* Частота */}

        <div className="border rounded-xl p-3 flex justify-between items-center ">
          <span className="text-gray-500">Частота опитування</span>

          <FrequencySelector value={frequency} onChange={setFrequency} />
        </div>

        {/* Надсилання */}

        <div className="border rounded-xl p-3 flex justify-between items-center">
          <span className="text-gray-500">День та час надсилання</span>
          <div className="flex gap-3">
            <Dropdown value={sendDay} options={days} onChange={setSendDay} />

            <Dropdown
              value={sendTime}
              options={times}
              onChange={setSendTime}
              width="82px"
            />
          </div>
        </div>

        <div className="border rounded-xl p-3 flex justify-between items-center">
          <span className="text-gray-500">Кінцевий термін</span>

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
          onClick={handleSubmit}
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
          {selectedPulseId ? "Оновити опитування" : "Створити опитування"}
        </button>
      </div>
    </div>
  );
};
