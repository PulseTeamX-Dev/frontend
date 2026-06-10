export const getBadgeClass = (pct: number) => {
  if (pct >= 70) return "bg-green-50 text-green-700 border border-green-700";
  if (pct >= 40)
    return "bg-yellow-100 text-yellow-700 border border-yellow-700";
  return "bg-red-100 text-red-700 border border-red-700";
};
