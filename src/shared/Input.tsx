import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import Icon from "./Icon";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: boolean;
  leftIcon?: string;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      success,
      leftIcon,
      rightIcon,
      className = "",
      disabled,
      id,
      ...props
    },
    ref,
  ) => {
    const getBorderClasses = () => {
      if (error) return "border-error focus:border-error";
      if (success) return "border-success focus:border-success";
      // Додали group-hover, щоб бордер реагував, навіть якщо навели на іконку
      return "border-light-txt focus:border-yellow-500 caret-yellow-700 group-hover:border-yellow-500";
    };

    const getBackgroundClasses = () => {
      if (disabled) return "bg-slate-50 text-light-txt cursor-not-allowed";
      return "bg-white text-grayscale-700";
    };

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-light-txt mb-2"
          >
            {label}
          </label>
        )}

        {/* ДОДАНО: клас group, щоб відслідковувати фокус інпуту для іконки */}
        <div className="relative flex items-center group">
          {leftIcon && (
            <span
              className={`absolute left-4 transition-colors ${
                error
                  ? "text-error"
                  : success
                    ? "text-success"
                    : // ДОДАНО: іконка стає жовтою при фокусі або ховері на всій групі
                      "text-light-txt group-focus-within:text-yellow-500 group-hover:text-yellow-500"
              }`}
            >
              <Icon id={leftIcon} className="fill-current w-5 h-5" />
            </span>
          )}

          <input
            ref={ref}
            id={id}
            disabled={disabled}
            className={`w-full py-3 border rounded-2xl outline-none transition-all placeholder-light-txt
              ${leftIcon ? "pl-12" : "pl-4"} 
              ${rightIcon ? "pr-12" : "pr-4"} 
              ${getBorderClasses()} 
              ${getBackgroundClasses()}
            `}
            {...props}
          />

          {rightIcon && (
            <span className="absolute right-4 flex items-center">
              {rightIcon}
            </span>
          )}
        </div>

        {(error || helperText) && (
          <div
            className={`flex items-start gap-1.5 mt-2 text-xs pl-1 font-medium ${
              error ? "text-error" : success ? "text-success" : "text-light-txt"
            }`}
          >
            <Icon
              id={
                error
                  ? "alert-circle"
                  : success
                    ? "check-circle"
                    : "alert-circle"
              }
              className="w-4 h-4 shrink-0"
            />
            <span>{error || helperText}</span>
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
