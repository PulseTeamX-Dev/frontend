import { NavLink } from "react-router-dom";
import { useAppSelector } from "@/app/useReduxTypes";
import Icon from "@/shared/ui/Icon";
import { selectAuthRole } from "../../redux/auth/selectors";
import { UserProfileMin } from "./UserProfileMin";

const NAV_CONFIG = [
  {
    path: "/dashboard",
    label: "Огляд",
    icon: "grid",
    roles: ["hr", "team_lead"],
    mobileOrder: "order-1",
  },
  {
    path: "/comments",
    label: "Коментарі",
    icon: "chat-blank",
    roles: ["hr"],
    mobileOrder: "order-2",
  },
  {
    path: "/signals",
    label: "Сигнали",
    icon: "bell",
    roles: ["hr", "team_lead"],
    mobileOrder: "order-4",
  },
  {
    path: "/settings",
    label: "Налаштування",
    icon: "settings",
    roles: ["hr", "team_lead"],
    mobileOrder: "order-5",
  },
];

export const Sidebar = () => {
  const role = useAppSelector(selectAuthRole);

  const allowedLinks = NAV_CONFIG.filter(
    (link) => role && link.roles.includes(role.toLowerCase()),
  );

  return (
    <aside
      className="
        z-50 shrink-0 bg-white border-gray-200
        fixed bottom-0 left-0 w-full h-[65px] border-t shadow-[0_-4px_10px_rgba(0,0,0,0.05)]
        md:sticky md:h-[calc(100vh-24px)] md:w-[80px] md:flex md:flex-col md:border-none md:p-4 md:rounded-3xl  md:shadow-[0_64px_64px_-32px_rgba(102,37,0,0.56)]
        lg:w-[220px]
      "
    >
      <UserProfileMin />

      <nav className="flex-1 flex w-full flex-row md:flex-col justify-between md:justify-start items-center md:items-stretch h-full px-2 md:px-0">
        {allowedLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => `
              relative flex items-center justify-center lg:justify-start gap-3 transition-all duration-200
              h-full md:h-auto 
              flex-1 md:flex-none
              md:p-3 md:rounded-xl lg:px-4 lg:py-3
              ${link.mobileOrder} md:order-none
              ${
                isActive
                  ? "text-grayscale-900 md:bg-primary-active md:hover:bg-primary-hover md:text-white md:shadow-md"
                  : "text-grayscale-600 md:hover:text-primary-hover"
              }
            `}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary-active rounded-full md:hidden"></span>
                )}
                <Icon
                  id={link.icon}
                  className="w-6 h-6 md:w-5 md:h-5 shrink-0"
                />
                <span className="hidden lg:block font-medium">
                  {link.label}
                </span>
              </>
            )}
          </NavLink>
        ))}

        {role?.toLowerCase() === "hr" && (
          <div className="relative order-3 md:order-none md:mt-auto flex items-center justify-center lg:justify-start flex-1 md:flex-none h-full md:h-auto">
            <NavLink
              to="/create-pulse"
              className={({ isActive }) => `
                flex items-center justify-center transition-all duration-200 h-full w-full
                ${
                  isActive
                    ? "text-grayscale-900 md:text-white"
                    : "text-grayscale-500 md:hover:bg-primary-hover md:hover:text-white"
                }
                bg-transparent
                md:bg-primary-active md:text-white md:rounded-xl md:shadow-md md:hover:bg-primary-hover
                md:!p-3 lg:!px-4 lg:!py-3 md:w-12 md:h-12 lg:w-full lg:h-auto
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary-active rounded-full md:hidden"></span>
                  )}
                  <Icon id="plus" className="w-6 h-6 md:w-5 md:h-5 shrink-0" />
                  <span className="hidden lg:block font-medium ml-2 whitespace-nowrap">
                    Додати пульс
                  </span>
                </>
              )}
            </NavLink>
          </div>
        )}
      </nav>
    </aside>
  );
};
