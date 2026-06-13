export const formatTxt = (trend: number) => {
  const formatted = Math.abs(trend).toFixed(1).replace(".", ",");
  return trend > 0 ? `+${formatted}` : trend < 0 ? `-${formatted}` : "0,0";
};
