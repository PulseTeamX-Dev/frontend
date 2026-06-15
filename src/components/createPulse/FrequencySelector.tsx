interface Props {
  value: "weekly" | "biweekly" | "monthly";
  onChange: (value: "weekly" | "biweekly" | "monthly") => void;
}

const options = [
  {
    value: "weekly",
    label: "Щотижня",
  },
  {
    value: "biweekly",
    label: "Кожні 2 тижні",
  },
  {
    value: "monthly",
    label: "Щомісяця",
  },
] as const;

export const FrequencySelector = ({
  value,
  onChange,
}: Props) => {
  const activeIndex = options.findIndex(
    (item) => item.value === value,
  );

  return (
    <div
      className="
        relative
        w-[305px]
        h-[52px]
        rounded-[32px]
        bg-[#F5F5F5]
        p-[4px]
      "
    >
      {/* рухомий індикатор */}

      <div
        className="
          absolute
          top-[4px]
          left-[4px]
          h-[44px]
          w-[96px]
          rounded-[28px]
          bg-[#F26E3B]
          transition-all
          duration-300
        "
        style={{
          transform: `translateX(${activeIndex * 99}px)`,
        }}
      />

      {/* кнопки */}

      <div className="relative flex h-full">
        {options.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={`
              flex-1
              text-sm
              font-medium
              z-10
              transition-colors
              ${
                value === item.value
                  ? "text-white"
                  : "text-black"
              }
            `}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};