import React, { type ButtonHTMLAttributes, type ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  type = "button",
  disabled = false,
  variant = "primary",
  className = "",
  children,
  onClick,
  ...rest
}) => {
  const baseStyles = "py-3.5 font-semibold transition-all shadow-sm rounded-xl";

  const variantStyles = {
    primary:
      "bg-primary-active text-white hover:bg-primary-hover active:scale-[0.98]",
    secondary:
      "bg-white text-grayscale-900 border border-light-txt hover:bg-slate-50",
  };

  const disabledStyles = disabled
    ? "bg-slate-300 text-white cursor-not-allowed pointer-events-none"
    : "";

  const combinedClasses = twMerge(
    clsx(
      baseStyles,
      disabled ? disabledStyles : variantStyles[variant],
      className,
    ),
  );

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
