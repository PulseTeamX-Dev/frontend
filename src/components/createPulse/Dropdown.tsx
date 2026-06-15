import { useState } from "react";

interface Props {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  width?: string;
}

export const Dropdown = ({
  value,
  options,
  onChange,
  width = "126px",
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectOption = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="
          h-[44px]
          px-4
          bg-[#F26E3B]
          text-white
          rounded-full
          flex
          items-center
          justify-between
          text-sm
        "
        style={{ width }}
      >
        <span>{value}</span>
        <span>⌄</span>
      </button>

      {isOpen && (
        <div
          className="
            absolute
            top-[50px]
            left-0
            w-full
            bg-white
            rounded-xl
            shadow-lg
            border
            z-50
            overflow-hidden
          "
        >
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => selectOption(option)}
              className="
                w-full
                px-4
                py-2
                text-left
                hover:bg-gray-100
              "
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};