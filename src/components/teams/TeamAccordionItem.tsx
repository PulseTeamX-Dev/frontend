import { useState, useMemo, useEffect } from "react";
import { toast } from "react-toastify";
import type {
  TeamInfo,
  TeamMember,
  TeamMemberWithOptionalId,
} from "../../redux/teams/types";
import { useAppDispatch } from "../../hooks/useReduxTypes";
import {
  rotateTeamToken,
  archiveTeam,
  importTeamEmails,
  archiveMember,
  fetchTeams,
} from "../../redux/teams/operation";
import { Input } from "../../shared/Input";
import { Button } from "../../shared/Button";
import Icon from "../../shared/Icon";
import rotateIcon from "../../assets/icons/rotate.svg";
import { AddTeamMemberModal } from "./AddTeamMemberModal";

export interface TeamAccordionItemProps {
  team: TeamInfo;
}

export const TeamAccordionItem = ({ team }: TeamAccordionItemProps) => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [locallyAddedUsers, setLocallyAddedUsers] = useState<TeamMember[]>(
    () => {
      const saved = localStorage.getItem(`saved_users_team_${team.team_id}`);
      return saved ? JSON.parse(saved) : [];
    },
  );

  useEffect(() => {
    if (locallyAddedUsers.length > 0) {
      localStorage.setItem(
        `saved_users_team_${team.team_id}`,
        JSON.stringify(locallyAddedUsers),
      );
    } else {
      localStorage.removeItem(`saved_users_team_${team.team_id}`);
    }
  }, [locallyAddedUsers, team.team_id]);

  const combinedUsers = useMemo<TeamMemberWithOptionalId[]>(() => {
    const serverUsers: TeamMember[] = team.users || [];
    return [...serverUsers, ...locallyAddedUsers].sort((a, b) =>
      (a.email || "").localeCompare(b.email || ""),
    );
  }, [team.users, locallyAddedUsers]);

  const handleRotateToken = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await dispatch(rotateTeamToken(team.team_id)).unwrap();
      toast.success("Токен успішно оновлено");
    } catch (err) {
      toast.error((err as string) || "Помилка оновлення токена");
    }
  };

  const handleArchiveTeam = async () => {
    const confirmed = window.confirm(
      `Ви впевнені, що хочете архівувати команду "${team.name}"?`,
    );
    if (!confirmed) return;
    try {
      await dispatch(archiveTeam(team.team_id)).unwrap();
      toast.success("Команду архівовано");
    } catch {
      toast.error("Помилка архівації");
    }
  };

  const handleRemoveExistingMember = async (userId: number, email: string) => {
    const isConfirmed = window.confirm(
      `Ви впевнені, що хочете видалити учасника "${email}"?`,
    );
    if (!isConfirmed) return;
    if (userId < 0) {
      setLocallyAddedUsers((prev) => prev.filter((u) => u.user_id !== userId));
      toast.success("Учасника видалено зі списку");
      return;
    }
    try {
      await dispatch(archiveMember({ teamId: team.team_id, userId })).unwrap();
      toast.success("Учасника видалено з команди");
      await dispatch(fetchTeams()).unwrap();
    } catch (err) {
      toast.error((err as string) || "Не вдалося видалити учасника");
    }
  };

  const onAddMember = async (data: { email: string }) => {
    const email = data.email.trim().toLowerCase();

    // Перевірка на дублікати (як ми робили раніше)
    const isDuplicate = combinedUsers.some(
      (user) => user.email.toLowerCase() === email,
    );
    if (isDuplicate) {
      toast.error("Цей учасник вже є в команді");
      return;
    }

    try {
      setIsSubmitting(true);
      await dispatch(
        importTeamEmails({ teamId: team.team_id, emails: [email] }),
      ).unwrap();
      await dispatch(fetchTeams()).unwrap();

      setLocallyAddedUsers((prev) => [
        ...prev,
        {
          user_id: -Date.now(),
          team_id: team.team_id,
          is_active: true,
          created_at: new Date().toISOString(),
          email,
        },
      ]);

      setIsModalOpen(false);
      toast.success("Учасника додано");
    } catch (err) {
      toast.error((err as string) || "Помилка при додаванні");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={` rounded-2xl overflow-hidden bg-white shadow-sm mb-4 transition-all ${!team.is_active ? "border-gray-100 opacity-60 bg-gray-50/50" : "border-gray-200"}`}
    >
      {/* Шапка акордеону */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50 transition-colors select-none"
      >
        <span
          className={`font-semibold text-base sm:text-lg break-all ${
            !team.is_active ? "text-gray-400" : "text-gray-800"
          }`}
        >
          {team.name}
        </span>

        <div className="flex items-center gap-3">
          <span
            className={`text-xs font-semibold ${
              team.is_active ? "text-green-600" : "text-gray-500"
            }`}
          >
            {team.is_active ? "Активна" : "Не активна"}
          </span>
        </div>
      </div>
      {isOpen && (
        <div className="p-6 border-gray-100 bg-white space-y-6">
          {team.is_active && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-light-txt">
                Посилання розсилки
              </label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-3">
                <Icon
                  id="link"
                  className="w-5 h-5 text-gray-500 hover:text-gray-700"
                />
                <input
                  type="text"
                  readOnly
                  value={
                    team.team_token
                      ? `${window.location.origin}/surveys/${team.team_token}`
                      : "Токен відсутній"
                  }
                  className="bg-transparent flex-1 text-sm text-gray-600 outline-none truncate"
                />
                <button onClick={handleRotateToken} type="button">
                  <img src={rotateIcon} alt="link" className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {team.is_active && (
            <div className="flex justify-end gap-3">
              <Button
                onClick={handleArchiveTeam}
                variant="secondary"
                className="px-5"
              >
                Архівувати команду
              </Button>
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="primary"
                className="px-5"
              >
                Додати учасника
              </Button>
            </div>
          )}

          {combinedUsers.map((user) => (
            <Input
              key={`${user.user_id}-${user.email}`}
              leftIcon="mail"
              rightIcon={
                team.is_active ? (
                  <button
                    onClick={() =>
                      handleRemoveExistingMember(user.user_id, user.email)
                    }
                    type="button"
                  >
                    <Icon id="trash" />
                  </button>
                ) : null
              }
              value={user.email}
              readOnly
            />
          ))}
        </div>
      )}
      <AddTeamMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={onAddMember}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
