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
    const serverUsers: TeamMember[] = (team.users || []).filter(
      (user) => user && user.is_active === true && user.email,
    );
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
      className={`rounded-2xl overflow-hidden bg-white mb-4 transition-all border border-light-txt `}
    >
      {/* Шапка акордеону */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-5 cursor-pointer transition-colors select-none"
      >
        <span
          className={`font-normal text-base sm:text-lg break-all ${
            !team.is_active ? "text-gray-400" : "text-gray-900"
          }`}
        >
          {team.name}
        </span>

        <div className="flex items-center gap-3">
          <span
            className={`text-base font-semibold ${
              team.is_active ? "text-success" : "text-grayscale-700"
            }`}
          >
            {team.is_active ? "Активна" : "Не активна"}
          </span>
        </div>
      </div>
      {isOpen &&
        (team.is_active ? (
          <div className=" border-gray-100 bg-white p-6 space-y-6">
            <Input
              label="Посилання розсилки"
              leftIcon="link"
              readOnly
              value={
                team.team_token
                  ? `${window.location.origin}/surveys/${team.team_token}`
                  : "Токен відсутній"
              }
              rightIcon={
                <button onClick={handleRotateToken} type="button">
                  <img
                    src={rotateIcon}
                    alt="rotate"
                    className="w-5 h-5 text-grayscale-600 hover:text-grayscale-900"
                  />
                </button>
              }
            />
            {combinedUsers.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-light-txt">
                  Пошти учасників команди
                </label>
                <div className="space-y-2">
                  {combinedUsers.map((user) => (
                    <Input
                      key={`${user.user_id}-${user.email}`}
                      leftIcon="mail"
                      rightIcon={
                        <button
                          onClick={() =>
                            handleRemoveExistingMember(user.user_id, user.email)
                          }
                          type="button"
                        >
                          <Icon id="trash" />
                        </button>
                      }
                      value={user.email}
                      readOnly
                    />
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-end gap-3 pt-2">
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
          </div>
        ) : null)}
      <AddTeamMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={onAddMember}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
