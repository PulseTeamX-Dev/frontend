export const getScaleButtonColors = (value: number, isSelected: boolean): string => {
  // 1-3: Зелена зона (Лад і спокій)
  if (value <= 3) {
    return isSelected
     ? "bg-[#48FF94] border-[#48FF94] text-white shadow-md scale-105"
    : "border-[#48FF94] text-[#48FF94] hover:bg-[#48FF94]/10";
     
  }

  // 5-7: Жовта зона (Нормально)
  if (value <= 6) {
    return isSelected
      ? "bg-[#FFD043] border-[#FFD043] text-white shadow-md scale-105"
      : "border-[#FFD043] text-[#FFD043] hover:bg-[#FFD043]/10";
  }

  // 8-10:  Червона зона (Виснаження)
  return isSelected
    ? "bg-[#FF7272] border-[#FF7272] text-white shadow-md scale-105"
      : "border-[#FF7272] text-[#FF7272] hover:bg-[#FF7272]/10";
};