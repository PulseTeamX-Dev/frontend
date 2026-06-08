import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "../../hooks/useReduxTypes";

import { selectProfile } from "../../redux/profile/selectors";
import { updateProfile } from "../../redux/profile/operation";
import { logoutUser } from "../../redux/auth/operation";

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
    // <div className="bg-white rounded-3xl p-6 shadow-sm">
    //   <h2 className="font-semibold mb-6">Особисті дані</h2>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm text-gray-500 mb-2">Посада</label>

        <input
          disabled
          value={profile?.dashboard_role ?? ""}
          className="w-full h-12 px-4 rounded-xl bg-gray-100"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-500 mb-2">
          Ім'я та прізвище
        </label>

        <input
          {...register("full_name")}
          className="w-full h-12 px-4 rounded-xl border"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-500 mb-2">Email</label>

        <input
          disabled
          value={profile?.email ?? ""}
          className="w-full h-12 px-4 rounded-xl bg-gray-100"
        />
      </div>

      <div className="flex justify-center gap-4 pt-4">
        <button
          type="button"
          onClick={handleLogout}
          className="px-6 py-3 border rounded-2xl"
        >
          Вийти з акаунту
        </button>

        <button
          type="submit"
          className="px-6 py-3 bg-primary-active text-white rounded-2xl"
        >
          Зберегти зміни
        </button>
      </div>
    </form>
    // </div>
  );
};

export default ProfileForm;
