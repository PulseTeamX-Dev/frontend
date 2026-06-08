import { Link } from "react-router-dom";
import { useAppSelector } from "../../hooks/useReduxTypes";
import Icon from "../../shared/Icon";
import { selectAuthRole } from "../../redux/auth/selectors";
import AppLink from "../../shared/AppLink";

const NAV_CONFIG = [
  {
    path: "/dashboard",
    label: "Огляд",
    icon: "grid",
    roles: ["hr", "team_lead"],
  },
  {
    path: "/signals",
    label: "Сигнали",
    icon: "bell",
    roles: ["hr", "team_lead"],
  },
  { path: "/comments", label: "Коментарі", icon: "chat-blank", roles: ["hr"] },
  {
    path: "/settings",
    label: "Налаштування",
    icon: "settings",
    roles: ["hr", "team_lead"],
  },
];

export const Sidebar = () => {
  const role = useAppSelector(selectAuthRole);

  const allowedLinks = NAV_CONFIG.filter(
    (link) => role && link.roles.includes(role.toLowerCase()),
  );

  return (
    <aside className="w-[250px] bg-white border-r border-gray-200 h-screen p-4 flex flex-col shrink-0">
      <div className="mb-8">
        <p className="font-bold text-gray-700">Тут буде інфа</p>
      </div>

      <nav className="flex flex-col gap-2">
        {allowedLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 text-gray-700 transition-colors"
          >
            <Icon id={link.icon} className="w-5 h-5" />
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>

      {role?.toLowerCase() === "hr" && (
        <AppLink path="/create-pulse" className="mt-auto">
          <div className="flex items-center justify-center gap-2">
            <Icon id="plus" className="w-6 h-6" />
            <p>Додати пульс</p>
          </div>
        </AppLink>
      )}
    </aside>
  );
};
