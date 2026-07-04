import { useAppSelector } from "@/app/useReduxTypes";
import { selectAuthRole } from "../../redux/auth/selectors";
import {
  selectProfileAvatar,
  selectProfileName,
} from "../../redux/profile/selectors";

// 🛠️ ФІКС: Словник для охайного відображення ролей у верхньому регістрі
const roleLabels: Record<string, string> = {
  hr: "HR",
  team_lead: "TEAM LEAD", // або "ТІМЛІД" — вибирай, як краще за дизайном
  admin: "ADMIN",
};

export const UserProfileMin = () => {
  const role = useAppSelector(selectAuthRole);
  const name = useAppSelector(selectProfileName);
  const avatar = useAppSelector(selectProfileAvatar);

  const displayName = name ? name : "Користувач";

  const displayRole = role
    ? roleLabels[role.toLowerCase()] || role.toUpperCase().replace("_", " ")
    : "Користувач";

  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div
      className="hidden md:flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-3 pb-4 mb-2 w-full px-2"
      style={{
        borderBottom: "1px solid transparent",
        borderImage:
          "radial-gradient(50% 50% at 50% 50%, rgba(67, 44, 44, 0.2) 0%, rgba(67, 44, 44, 0) 100%) 1",
      }}
    >
      {avatar ? (
        <div className="w-[54px] h-[54px] rounded-full p-[3px] bg-gradient-to-br from-[#FF8A00] to-[#FFE6D1] flex items-center justify-center shrink-0">
          <div className="w-full h-full rounded-full bg-[#fbfbfb] p-[2px] flex items-center justify-center">
            <img
              src={avatar}
              className="w-full h-full rounded-full object-cover"
              alt="avatar"
            />
          </div>
        </div>
      ) : (
        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold shrink-0 overflow-hidden">
          {initial}
        </div>
      )}

      <div className="hidden lg:block overflow-hidden text-left">
        <p className="text-[10px] text-[rgba(36,34,32,0.4)] font-medium tracking-wider">
          {displayRole}
        </p>
        <p className="text-[12px] font-bold text-[#191219] truncate">
          {displayName}
        </p>
      </div>
    </div>
  );
};
