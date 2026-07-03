export const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "0,0";
  return value.toFixed(1).replace(".", ",");
};
