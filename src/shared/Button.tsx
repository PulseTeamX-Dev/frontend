import React, { type ButtonHTMLAttributes, type ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  type = "button",
  disabled = false,
  className = "",
  children,
  onClick,
  ...rest
}) => {
  const baseStyles =
    "py-3.5 rounded-2xl font-semibold text-white transition-all shadow-sm text-white font-semibold";

  const stateStyles = disabled
    ? "bg-slate-300 cursor-not-allowed"
    : "bg-primary-active hover:bg-primary-hover active:scale-[0.98]";

  const combinedClasses = `${baseStyles} ${stateStyles} ${className}`.trim();

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={combinedClasses}
      {...rest}
    >
      {children}
    </button>
  );
};
