export const getScaleButtonColors = (
  value: number,
  isSelected: boolean,
  colorDirection: "red_to_green" | "green_to_red" | "centered" = "red_to_green",
): string => {
  let tone: "good" | "neutral" | "bad";

  if (colorDirection === "green_to_red") {
    tone = value <= 3 ? "good" : value <= 7 ? "neutral" : "bad";
  } else if (colorDirection === "centered") {
    tone = value >= 4 && value <= 7 ? "good" : "bad";
  } else {
    tone = value <= 3 ? "bad" : value <= 7 ? "neutral" : "good";
  }

  if (isSelected) {
    const activeClasses = {
      good: "border-[3px] border-[#51F184] bg-[#51F184] text-[#444444] shadow-sm",
      neutral:
        "border-[3px] border-[#F8CD0E] bg-[#F9D73E] text-[#444444] shadow-sm",
      bad: "border-[3px] border-[#ED2B26] bg-[#F15551] text-[#444444] shadow-sm",
    };

    return activeClasses[tone];
  }

  const inactiveClasses = {
    good: "border-[3px] border-[#51F184] bg-white text-[#444444] hover:bg-[#A8F8C2] transition-colors",

    neutral:
      "border-[3px] border-[#F8CD0E] bg-white text-[#444444] hover:bg-[#FCEB9F] transition-colors",

    bad: "border-[3px] border-[#ED2B26] bg-white text-[#444444] hover:bg-[#F8AAA8] transition-colors",
  };

  return inactiveClasses[tone];
};
