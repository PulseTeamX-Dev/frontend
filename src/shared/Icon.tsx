import sprite from "../assets/symbol-defs.svg";

export interface IconProps {
  id: string;
  width?: string;
  height?: string;
  fill?: string;
  stroke?: string;
  className?: string;
}

const Icon = ({
  id,
  width = "24px",
  height = "24px",
  fill = "#666",
  stroke,
  className = "",
}: IconProps) => {
  return (
    <svg
      className={`fill-${fill} stroke-${stroke || "none"} ${className}`}
      width={width}
      height={height}
    >
      <use href={`${sprite}#${id}`} />
    </svg>
  );
};

export default Icon;
