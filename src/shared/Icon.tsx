import sprite from "../assets/symbol-defs.svg";

export interface IconProps {
  id: string;
  width?: string;
  height?: string;
  className?: string;
}

const Icon = ({
  id,
  width = "24px",
  height = "24px",
  className = "",
}: IconProps) => {
  return (
    <svg className={className} width={width} height={height}>
      <use href={`${sprite}#${id}`} />
    </svg>
  );
};

export default Icon;
