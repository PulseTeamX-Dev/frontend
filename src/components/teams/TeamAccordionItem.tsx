import { useState, useMemo, useEffect, useRef } from "react";
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
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import Icon from "@/shared/ui/Icon";
import rotateIcon from "../../assets/icons/rotate.svg";
import { AddTeamMemberModal } from "./AddTeamMemberModal";
import { ConfirmModal } from "./ConfirmModal";

export interface TeamAccordionItemProps {
  team: TeamInfo;
  allTeams: TeamInfo[];
}

export const TeamAccordionItem = ({
  team,
  allTeams,
}: TeamAccordionItemProps) => {
  const dispatch = useAppDispatch();
  const isProcessingRef = useRef(false);

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [confirmConfig, setConfirmConfig] = useState<{
    type: "delete_member" | "archive_team";
    title: string;
    confirmText: string;
    payload?: { userId: number; email: string };
  } | null>(null);

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

    const uniqueLocalUsers: TeamMember[] = [];

    locallyAddedUsers.forEach((local) => {
      if (!local || !local.email) return;

      const localEmailLower = local.email.trim().toLowerCase();

      const isInServer = serverUsers.some(
        (server) =>
          server.email && server.email.trim().toLowerCase() === localEmailLower,
      );
      const isAlreadyInUniqueLocal = uniqueLocalUsers.some(
        (added) =>
          added.email && added.email.trim().toLowerCase() === localEmailLower,
      );

      if (!isInServer && !isAlreadyInUniqueLocal) {
        uniqueLocalUsers.push(local);
      }
    });

    return [...serverUsers, ...uniqueLocalUsers].sort((a, b) =>
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

  const handleArchiveTeam = () => {
    setConfirmConfig({
      type: "archive_team",
      title: `Ви впевнені, що хочете архівувати команду "${team.name}"?`,
      confirmText: "Архівувати",
    });
  };

  const handleRemoveExistingMember = (userId: number, email: string) => {
    setConfirmConfig({
      type: "delete_member",
      title: `Ви певні, що хочете вилучити учасника?`,
      confirmText: "Вилучити",
      payload: { userId, email },
    });
  };
  const handleConfirmAction = async () => {
    if (!confirmConfig) return;

    try {
      setIsSubmitting(true);
      if (confirmConfig.type === "delete_member" && confirmConfig.payload) {
        const { userId } = confirmConfig.payload;
        if (userId < 0) {
          setLocallyAddedUsers((prev) =>
            prev.filter((u) => u.user_id !== userId),
          );
          toast.success("Учасника видалено зі списку");
        } else {
          await dispatch(
            archiveMember({ teamId: team.team_id, userId }),
          ).unwrap();
          toast.success("Учасника видалено з команди");
          await dispatch(fetchTeams()).unwrap();
        }
      } else if (confirmConfig.type === "archive_team") {
        await dispatch(archiveTeam(team.team_id)).unwrap();
        toast.success("Команду архівовано");
      }

      setConfirmConfig(null);
    } catch (err) {
      toast.error((err as string) || "Помилка виконання дії");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onAddMember = async (data: { email: string }) => {
    const email = data.email.trim().toLowerCase();
    if (isProcessingRef.current) return;

    // 1. Перевірка на дублікат всередині поточної команди (серверні + локальні)
    const isDuplicate = combinedUsers.some(
      (user) => user.email && user.email.trim().toLowerCase() === email,
    );
    if (isDuplicate) {
      toast.error("Цей учасник вже є в цій команді");
      return;
    }

    // 2. Перевірка в інших активних командах
    const existingTeam = allTeams.find(
      (t) =>
        t.team_id !== team.team_id &&
        t.is_active &&
        t.users?.some(
          (u) => u.is_active && u.email?.trim().toLowerCase() === email,
        ),
    );
    if (existingTeam) {
      toast.error(`Цей учасник вже є в команді "${existingTeam.name}"`);
      return;
    }

    const temporaryId = -Date.now() - Math.random();

    try {
      isProcessingRef.current = true;
      setIsSubmitting(true);

      setLocallyAddedUsers((prev) => {
        const alreadyExists = prev.some(
          (u) => u.email.trim().toLowerCase() === email,
        );
        if (alreadyExists) return prev;
        return [
          ...prev,
          {
            user_id: temporaryId,
            team_id: team.team_id,
            is_active: true,
            created_at: new Date().toISOString(),
            email,
          },
        ];
      });

      setIsModalOpen(false);

      // Запит на сервер
      await dispatch(
        importTeamEmails({ teamId: team.team_id, emails: [email] }),
      ).unwrap();

      // Оновлюємо глобальний стейт з сервера
      await dispatch(fetchTeams()).unwrap();

      setLocallyAddedUsers((prev) =>
        prev.filter((u) => u.user_id !== temporaryId),
      );

      toast.success("Учасника додано");
    } catch (err) {
      setLocallyAddedUsers((prev) =>
        prev.filter((u) => u.user_id !== temporaryId),
      );
      toast.error((err as string) || "Помилка при додаванні");
    } finally {
      isProcessingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden bg-white mb-4 transition-all border border-light-txt">
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
            {team.is_active ? "Активна" : "Неактивна"}
          </span>

          <Icon
            id="chevron-button"
            className={`w-4 h-4 text-grayscale-600 transition-transform duration-300 ${
              isOpen ? "rotate-0" : "rotate-180"
            }`}
          />
        </div>
      </div>
      {isOpen &&
        (team.is_active ? (
          <div className="border-gray-100 bg-white p-6 space-y-6">
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
                            handleRemoveExistingMember(
                              user.user_id!,
                              user.email!,
                            )
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

      {/* Модалка*/}
      <ConfirmModal
        isOpen={confirmConfig !== null}
        title={confirmConfig?.title || ""}
        confirmText={confirmConfig?.confirmText}
        isSubmitting={isSubmitting}
        onClose={() => setConfirmConfig(null)}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
};
