import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/useReduxTypes";
import { fetchTeams } from "../redux/teams/operation";
import { selectTeams, selectTeamLoading } from "../redux/teams/selectors";

import { TeamsAddForm } from "../components/teams/TeamsAddForm";
import { TeamAccordionItem } from "../components/teams/TeamAccordionItem";

const TeamsPage = () => {
  const dispatch = useAppDispatch();
  const teams = useAppSelector(selectTeams);
  const isLoading = useAppSelector(selectTeamLoading);

  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);

  // Оптимальне сортування
  const sortedTeams = useMemo(() => {
    return [...teams].sort((a, b) => Number(b.is_active) - Number(a.is_active));
  }, [teams]);

  return (
    <div className="w-full bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 md:p-8 border border-gray-100/80 space-y-8">
      {/* Заголовок сторінки */}
      <div>
        <h1 className="text-3xl font-bold text-gray-950 tracking-tight">
          Команди
        </h1>
      </div>

      {/* Форма створення команди */}
      <TeamsAddForm />

      {/* Нижня частина: Списки існуючих команд */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            Список створених команд
          </h2>
          {isLoading && teams.length > 0 && (
            <span className="text-xs text-orange-500 animate-pulse">
              Оновлення...
            </span>
          )}
        </div>

        {isLoading && teams.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-2xl">
            Завантаження команд...
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center py-10 text-gray-400 border border-dashed border-gray-200 rounded-2xl bg-gray-50">
            Команд ще не створено. Скористайтеся формою вище.
          </div>
        ) : (
          /* Список акордеонів команд */
          <div
            className={`flex flex-col gap-4 transition-opacity ${isLoading ? "opacity-70" : "opacity-100"}`}
          >
            {sortedTeams.map((team) => (
              <TeamAccordionItem key={team.team_id} team={team} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamsPage;
