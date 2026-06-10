import React, { useRef } from "react";
import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "../../hooks/useReduxTypes";

import { selectProfileAvatar } from "../../redux/profile/selectors";
import { updateProfile } from "../../redux/profile/operation";
import { supabase } from "../../utils/supabase";
import { SUPABASE_URL } from "../../constants";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const AvatarUploader = () => {
  const dispatch = useAppDispatch();
  const avatar = useAppSelector(selectProfileAvatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Дозволені JPG, PNG та WEBP");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Максимальний розмір файлу — 2 MB");
      return;
    }

    try {
      const fileExt = file.name.split(".").pop();

      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

      if (error) {
        throw error;
      }

      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/avatars/${fileName}`;

      await dispatch(updateProfile({ avatar_url: publicUrl })).unwrap();

      toast.success("Аватар успішно оновлено");
    } catch (error) {
      toast.error("Помилка завантаження аватара");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="
        group
        relative
        rounded-full
        focus:outline-none
        focus:ring-2
        focus:ring-orange-400
        focus:ring-offset-4
      "
      >
        <img
          src={avatar || "https://placehold.co/200"}
          alt="Avatar"
          className="
          w-[120px]
          h-[120px]
          rounded-full
          object-cover
          border-2
          border-orange-400
          transition-all
          duration-200
          group-hover:scale-[1.03]
          group-hover:border-orange-500
          group-hover:shadow-lg
        "
        />

        <div
          className="
          absolute
          inset-0
          rounded-full
          bg-black/0
          group-hover:bg-black/10
          transition-colors
          duration-200
        "
        />
      </button>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="
        text-orange-500
        transition-colors
        hover:text-orange-700
        focus:outline-none
        focus:text-orange-600
      "
      >
        Редагувати фото
      </button>

      <input
        ref={fileInputRef}
        hidden
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default AvatarUploader;
