import { useAppSelector } from "../../hooks/useReduxTypes";
import { selectAuthRole } from "../../redux/auth/selectors";
import {
  selectProfileAvatar,
  selectProfileName,
} from "../../redux/profile/selectors";

export const UserProfileMin = () => {
  const role = useAppSelector(selectAuthRole);
  const name = useAppSelector(selectProfileName);
  const avatar = useAppSelector(selectProfileAvatar);

  const displayName = name ? name : "Користувач";
  const displayRole = role?.toUpperCase() || "USER";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    // На мобілці ховаємо. На планшеті (md) - центруємо. На десктопі (lg) - вирівнюємо по лівому краю.
    <div className="hidden md:flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-3 mb-8 w-full px-2">
      {avatar ? (
        <div className="w-[54px] h-[54px] rounded-full p-[3px] bg-gradient-to-tr from-primary-active to-primary-hover flex items-center justify-center shrink-0">
          <div className="w-full h-full rounded-full bg-white p-[2px] flex items-center justify-center">
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
        <p className="text-[10px] text-grayscale-600 font-semibold tracking-wider">
          {displayRole}
        </p>
        <p className="text-[12px] font-bold text-grayscale-900 truncate">
          {displayName}
        </p>
      </div>
    </div>
  );
};
