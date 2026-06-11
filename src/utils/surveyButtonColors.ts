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

  // 2. Тепер мапимо ці сутності на реальні класи CSS
  if (isSelected) {
    const activeClasses = {
      good: "bg-green-500 text-white border-green-500 shadow-md shadow-green-500/20",
      neutral:
        "bg-orange-400 text-white border-orange-400 shadow-md shadow-orange-400/20",
      bad: "bg-red-500 text-white border-red-500 shadow-md shadow-red-500/20",
    };
    return activeClasses[tone];
  }

  const inactiveClasses = {
    good: "border-green-200 text-green-500 bg-transparent hover:bg-green-50 hover:border-green-400",
    neutral:
      "border-orange-200 text-orange-500 bg-transparent hover:bg-orange-50 hover:border-orange-400",
    bad: "border-red-200 text-red-500 bg-transparent hover:bg-red-50 hover:border-red-400",
  };
  return inactiveClasses[tone];
};
