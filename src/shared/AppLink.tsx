import { Link } from "react-router-dom";

interface AppLinkProps {
  path: string;
  children: React.ReactNode;
  className?: string;
}

const AppLink = ({ path, children, className = "" }: AppLinkProps) => {
  return (
    <Link
      to={path}
      className={`py-[10px] rounded-xl w-full bg-primary-active text-white hover:bg-primary-hover ${className}`}
    >
      {children}
    </Link>
  );
};

export default AppLink;
