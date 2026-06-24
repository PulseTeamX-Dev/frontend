export const getScaleButtonColors = (
  value: number,
  isSelected: boolean,
  colorDirection: "red_to_green" | "green_to_red" | "centered" = "red_to_green",
): string => {
  // 1. Спочатку визначаємо "сутність" оцінки для конкретної кнопки (це добре, нейтрально чи погано)
  let tone: "good" | "neutral" | "bad";

  if (colorDirection === "green_to_red") {
    // 1-3 — добре (зелений), 4-6 — нейтрально (помаранчевий), 7-10 — погано (червоний)
    tone = value <= 3 ? "good" : value <= 7 ? "neutral" : "bad";
  } else if (colorDirection === "centered") {
    // Краї погані (червоні), середина хороша (зелена)
    tone = value >= 4 && value <= 7 ? "good" : "bad";
  } else {
    // Дефолтний red_to_green: 1-3 — погано (червоний), 4-6 — нейтрально (помаранчевий), 7-10 — добре (зелений)
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
