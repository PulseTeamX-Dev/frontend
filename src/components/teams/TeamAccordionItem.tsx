import { useState, useMemo, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";

import type {
  TeamInfo,
  TeamMember,
  FormValues,
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

// 1. Константи
const DEFAULT_FIELDS_COUNT = 3;
const ROLE_LEAD = "Тім лід";
const ROLE_MEMBER = "Учасник";

export interface TeamAccordionItemProps {
  team: TeamInfo;
}

const getInitialMembers = () =>
  Array.from({ length: DEFAULT_FIELDS_COUNT }, () => ({ email: "" }));

export const TeamAccordionItem = ({ team }: TeamAccordionItemProps) => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Логіка злиття серверних та локальних користувачів із маскуванням для анонімності
  const combinedUsers = useMemo<TeamMemberWithOptionalId[]>(() => {
    console.log(`Team ${team.name} users from props:`, team.users);

    const serverUsers: TeamMember[] =
      team.users && Array.isArray(team.users)
        ? team.is_active
          ? team.users.filter((user) => user.is_active !== false)
          : team.users
        : [];

    // Функція для безпечного маскування пошти
    const maskEmail = (emailStr: string) => {
      if (!emailStr || !emailStr.includes("@")) return emailStr;
      const [name, domain] = emailStr.split("@");
      const starCount = Math.min(name.length, 5);
      const maskedName = "*".repeat(starCount);
      return `${maskedName}@${domain}`;
    };

    // 1. Якщо сервер повернув юзерів, мапимо їх і підставляємо маски/локальні дані
    if (serverUsers.length > 0) {
      return serverUsers.map((sUser, index) => {
        const localMatch = locallyAddedUsers[index];

        const displayEmail = sUser.email
          ? maskEmail(sUser.email)
          : localMatch?.email
            ? maskEmail(localMatch.email)
            : `Анонімний учасник (ID: ${sUser.user_id})`;

        return {
          ...sUser,
          email: displayEmail,
        };
      });
    }

    // 2. Якщо сервер ще порожній, але в локальному стейті вже є додані юзери
    // (тобто щойно натиснули "Додати", іде запит), показуємо МИТТЄВІ заглушки
    if (locallyAddedUsers.length > 0) {
      return locallyAddedUsers.map((lUser) => ({
        ...lUser,
        email: maskEmail(lUser.email) || "Створення учасника...",
      }));
    }
    return [];
  }, [team.users, team.is_active, locallyAddedUsers]);

  const { register, handleSubmit, reset, control } = useForm<FormValues>({
    defaultValues: {
      newMembers: getInitialMembers(),
    },
  });

  const { fields, remove } = useFieldArray({
    control,
    name: "newMembers",
  });

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
    try {
      await dispatch(archiveTeam(team.team_id)).unwrap();
      toast.success("Команду успішно архівовано");
      await dispatch(fetchTeams()).unwrap();
    } catch (err) {
      toast.error((err as string) || "Помилка архівації команди");
    }
  };

  const handleRemoveExistingMember = async (userId: number) => {
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

  const onSubmitEmails = async (data: FormValues) => {
    const emailsToImport = data.newMembers
      .map((m) => m.email.trim())
      .filter((email) => email.length > 0);

    if (emailsToImport.length === 0) {
      toast.warn("Будь ласка, заповніть хоча б один email");
      return;
    }

    try {
      setIsSubmitting(true);

      await dispatch(
        importTeamEmails({ teamId: team.team_id, emails: emailsToImport }),
      ).unwrap();

      toast.success("Учасників успішно додано");
      await dispatch(fetchTeams()).unwrap();

      const newVirtualUsers: TeamMember[] = emailsToImport.map((email, idx) => {
        const uniqueId = -(Date.now() + idx + Math.floor(Math.random() * 1000));

        return {
          user_id: uniqueId,
          team_id: team.team_id,
          is_active: true,
          created_at: new Date().toISOString(),
          email: email,
        };
      });

      setLocallyAddedUsers((prev) => {
        const existingEmails = new Set(prev.map((u) => u.email.toLowerCase()));
        const filteredNew = newVirtualUsers.filter(
          (u) => !existingEmails.has(u.email.toLowerCase()),
        );
        return [...prev, ...filteredNew];
      });

      reset({ newMembers: getInitialMembers() });
    } catch (err) {
      toast.error((err as string) || "Помилка при додаванні");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`border rounded-2xl overflow-hidden bg-white shadow-sm mb-4 transition-all ${!team.is_active ? "border-gray-100 opacity-60 bg-gray-50/50" : "border-gray-200"}`}
    >
      {/* Шапка акордеону */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50 transition-colors select-none"
      >
        <span
          className={`font-semibold text-lg ${!team.is_active ? "text-gray-400 line-through" : "text-gray-800"}`}
        >
          {team.name}
        </span>
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${team.is_active ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-400 border border-gray-200"}`}
          >
            {team.is_active ? "Активна" : "Архівна"}
          </span>
          <span className="text-gray-400">{isOpen ? "▲" : "▼"}</span>
        </div>
      </div>

      {isOpen && (
        <div className="p-6 border-t border-gray-100 bg-white space-y-6">
          {/* Посилання розсилки */}
          {team.is_active && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 block">
                Посилання розсилки
              </label>
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-3">
                <span className="text-gray-400 text-lg">🔗</span>
                <input
                  type="text"
                  readOnly
                  value={
                    team.team_token
                      ? `${window.location.origin}/join/${team.team_token}`
                      : "Токен відсутній"
                  }
                  className="bg-transparent flex-1 text-sm text-gray-700 outline-none"
                />
                <button
                  onClick={handleRotateToken}
                  className="text-gray-400 hover:text-gray-600 p-1"
                  type="button"
                >
                  🔄
                </button>
              </div>
            </div>
          )}

          {/* Форма введення */}
          <form onSubmit={handleSubmit(onSubmitEmails)} className="space-y-4">
            <label className="text-sm font-medium text-gray-400 block">
              Пошти учасників команди
            </label>

            <div className="space-y-3">
              {fields.map((field, index) => {
                const currentRole = index === 0 ? ROLE_LEAD : ROLE_MEMBER;
                return (
                  <div key={field.id} className="relative flex items-center">
                    <div className="flex-1 relative">
                      <Input
                        id={`newMembers.${index}.email`}
                        type="email"
                        placeholder="email@gmail.com"
                        leftIcon="mail"
                        disabled={!team.is_active || isSubmitting}
                        {...register(`newMembers.${index}.email` as const, {
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Некоректний формат email",
                          },
                        })}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full border font-medium ${currentRole === ROLE_LEAD ? "bg-green-50 text-green-600 border-green-200" : "bg-gray-50 text-gray-600 border-gray-200"}`}
                        >
                          {currentRole}
                        </span>
                        {index > 0 && team.is_active && !isSubmitting && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-gray-300 hover:text-red-500 transition-colors"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-gray-50">
              {team.is_active ? (
                <>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleArchiveTeam}
                    className="border border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors mr-3"
                  >
                    Архівувати команду
                  </button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                  >
                    Додати учасника
                  </Button>
                </>
              ) : (
                <span className="text-sm text-gray-400 italic w-full text-right py-2">
                  Команда перенесена в архів
                </span>
              )}
            </div>
          </form>

          {/* НИЖНЯ СЕКЦІЯ: Збережені учасники */}
          {combinedUsers.length > 0 && (
            <div className="pt-6 border-t border-gray-100 space-y-4">
              <label className="text-sm font-medium text-gray-400 block">
                Збережені учасники команди
              </label>

              <div className="space-y-3">
                {combinedUsers.map((user, index) => {
                  const displayedRole = index === 0 ? ROLE_LEAD : ROLE_MEMBER;
                  const currentUserId = user.id ?? user.user_id;
                  console.log("ARCHIVE USER", user);
                  console.log("ARCHIVE USER ID", currentUserId);

                  return (
                    <div
                      key={`saved-member-${currentUserId}`}
                      className="relative flex items-center w-full"
                    >
                      <div className="w-full relative opacity-80">
                        <Input
                          id={`saved-user-${currentUserId}`}
                          type="text"
                          value={user.email}
                          leftIcon="mail"
                          disabled={true}
                          className="bg-gray-50/50 text-gray-400 select-none border-gray-200"
                        />

                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-4 z-10">
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
                              displayedRole === ROLE_LEAD
                                ? "bg-green-50 text-green-600 border-green-200"
                                : "bg-gray-50 text-gray-600 border-gray-200"
                            }`}
                          >
                            {displayedRole}
                          </span>

                          {team.is_active && (
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveExistingMember(currentUserId)
                              }
                              className="text-gray-400 hover:text-red-500 transition-colors p-1"
                              title="Видалити учасника"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
