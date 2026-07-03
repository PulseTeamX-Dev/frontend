import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/useReduxTypes";
import { fetchTeams } from "../redux/teams/operation";
import { selectTeams, selectTeamLoading } from "../redux/teams/selectors";

import { TeamsAddForm } from "../components/teams/TeamsAddForm";
import { TeamAccordionItem } from "../components/teams/TeamAccordionItem";
import { Title } from "../shared/Title";
import { PageLoader } from "@/shared/ui/Loader";

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
    <div className="w-full bg-white rounded-[32px] shadow-[0_4px_30px_rgba(0,0,0,0.04)] p-8 md:p-10 border border-gray-100">
      <div>
        <Title
          tag="h2"
          variant="bold"
          className="text-2xl font-bold mb-8 text-left text-slate-900"
        >
          Команди
        </Title>
      </div>
      {/* Форма */}
      <TeamsAddForm />

      {/* Список команд */}
      <div className="space-y-4">
        {/* Стан завантаження */}
        {isLoading && teams.length === 0 ? (
          <PageLoader />
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
              <TeamAccordionItem
                key={team.team_id}
                team={team}
                allTeams={teams}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamsPage;
