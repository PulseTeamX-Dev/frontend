import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "../../hooks/useReduxTypes";

import { selectProfile } from "../../redux/profile/selectors";
import { updateProfile } from "../../redux/profile/operation";
import { logoutUser } from "../../redux/auth/operation";

import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";

type FormValues = {
  full_name: string;
};

const ProfileForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const profile = useAppSelector(selectProfile);

  const { register, handleSubmit, reset } = useForm<FormValues>();

  useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name ?? "",
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      await dispatch(
        updateProfile({
          full_name: data.full_name,
        }),
      ).unwrap();

      toast.success("Зміни збережено");
    } catch {
      toast.error("Помилка оновлення профілю");
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());

    navigate("/login");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        id="job_title"
        type="text"
        label="Посада"
        leftIcon="portfolio"
        value={profile?.dashboard_role ?? ""}
        disabled
      />

      <Input
        id="full_name"
        type="text"
        label="Ім'я та прізвище"
        leftIcon="user"
        placeholder="Введіть ім'я та прізвище"
        {...register("full_name")}
      />

      <Input
        id="email"
        type="email"
        label="Email"
        leftIcon="mail"
        value={profile?.email ?? ""}
        disabled
      />

      <div className="flex justify-center gap-4 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={handleLogout}
          className="min-w-[120px] focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 py-[10px] px-[12px]"
        >
          Вийти з акаунту
        </Button>

        <Button
          type="submit"
          variant="primary"
          className="min-w-[117px] py-[10px] px-[12px]"
        >
          Зберегти зміни
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
