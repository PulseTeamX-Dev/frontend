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

  const sortedTeams = useMemo(() => {
    return [...teams].sort((a, b) => Number(b.is_active) - Number(a.is_active));
  }, [teams]);

  return (
    <div className="w-full bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 md:p-8 border border-gray-100/80 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-950">Команди</h1>
      </div>

      {/* Форма */}
      <TeamsAddForm />

      {/* Список команд */}
      <div className="space-y-4">
        {/* Стан завантаження */}
        {isLoading && teams.length === 0 ? (
          <div className="text-center py-10 text-gray-500 rounded-2xl">
            Завантаження команд...
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center py-10 text-gray-400 border border-dashed border-gray-200 rounded-2xl">
            Команд ще не створено. Скористайтеся формою вище.
          </div>
        ) : (
          <div
            className={`flex flex-col gap-4 ${isLoading ? "opacity-70" : "opacity-100"}`}
          >
            {/* Індикатор оновлення при активному завантаженні */}
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
