import { type ReactNode } from "react";
import Icon from "./Icon";
import { Title } from "../Title";

interface PageHeaderProps {
  title: string;
  showLogo?: boolean;
  rightContent?: ReactNode;
}

export const PageHeader = ({
  title,
  showLogo = true,
  rightContent,
}: PageHeaderProps) => {
  return (
    <header className="flex items-center justify-between w-full mb-6 shrink-0">
      <div className="flex items-center gap-2 md:gap-3">
        {showLogo && (
          <Icon
            id="logo"
            className="w-8 h-8 text-primary-active shrink-0 transform -translate-y-0.5"
          />
        )}
        <Title
          tag="h1"
          variant="light"
          className="text-[18px] md:text-2xl text-grayscale-900 font-heading mb-0 leading-none"
        >
          {title}
        </Title>
      </div>

      {rightContent && (
        <div className="flex items-center gap-3">{rightContent}</div>
      )}
    </header>
  );
};
