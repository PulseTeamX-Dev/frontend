// 🛠️ ФІКС: Тепер тут лежать ПОВНІ назви класів. Tailwind їх побачить і згенерує CSS!
const HEATMAP_BG_CLASSES: string[] = [
  "bg-green-500", // 1-1.5
  "bg-green-400", // 1.6-2.5
  "bg-green-300", // 2.6-3.5
  "bg-green-200", // 3.6-4
  "bg-yellow-300", // 4.1-4.5
  "bg-yellow-400", // 4.6-5.5
  "bg-yellow-500", // 5.6-6
  "bg-orange-300", // 6.1-6.5
  "bg-orange-400", // 6.6-7
  "bg-orange-500", // 7.1-7.5
  "bg-red-200", // 7.6-8
  "bg-red-300", // 8.1-8.5
  "bg-red-400", // 8.6-9.5
  "bg-red-500", // 9.6-10
];

const getStepIndex = (val: number): number => {
  if (val <= 4.0) {
    if (val <= 1.5) return 0;
    if (val <= 2.5) return 1;
    if (val <= 3.5) return 2;
    return 3;
  }
  if (val <= 6.0) {
    if (val <= 4.5) return 4;
    if (val <= 5.5) return 5;
    return 6;
  }
  if (val <= 7.5) {
    if (val <= 6.5) return 7;
    if (val <= 7.0) return 8;
    return 9;
  }
  if (val <= 8.0) return 10;
  if (val <= 8.5) return 11;
  if (val <= 9.5) return 12;
  return 13;
};

// Змінюємо назву функції, щоб вона чітко відображала, що повертає клас
export const getHeatmapClass = (
  value: number,
  isRiskMetric: boolean,
): string => {
  const val = Math.max(1, Math.min(10, value));
  let index = getStepIndex(val);

  if (!isRiskMetric) {
    index = 13 - index;
  }

  return HEATMAP_BG_CLASSES[index];
};
