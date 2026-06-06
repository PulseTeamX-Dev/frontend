interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "survey";
}

export const Button = ({
  variant = "primary",
  children,
  className,
  ...props
}: ButtonProps) => {
  // Базовий Tailwind для кнопки
  const baseStyles = "px-4 py-2 rounded font-medium transition-colors";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
    survey:
      "px-12 py-3.5 rounded-xl text-base shadow-sm min-w-[200px] text-white bg-primary hover:bg-primary-hover active:bg-primary-active active:scale-[0.98] cursor-pointerdisabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60 disabled:scale-100",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
};
