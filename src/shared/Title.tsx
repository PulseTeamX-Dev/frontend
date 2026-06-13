import { type ReactNode } from "react";

type TitleTag = "h1" | "h2" | "h3" | "h4";
type TitleVariant = "bold" | "light";

interface TitleProps {
  tag?: TitleTag;
  variant?: TitleVariant;
  children: ReactNode;
  className?: string;
}

export const Title = ({
  tag = "h1",
  variant = "bold",
  children,
  className = "",
}: TitleProps) => {
  const baseStyles = "text-grayscale-900 mb-2";

  const stylesByTag: Record<TitleTag, string> = {
    h1: "text-2xl md:text-2xl",
    h2: "text-[20px] md:text-[18px]",
    h3: "text-base",
    h4: "text-sm",
  };

  const variantsStyles = {
    h1: {
      bold: "font-bold leading-6 md:leading-8",
      light: "font-light leading-6 md:leading-8",
    },
    h2: {
      bold: "font-bold leading-tight",
      light: "font-light leading-tight",
    },
    h3: { bold: "font-bold", light: "font-light" },
    h4: { bold: "font-bold", light: "font-light" },
  };

  const specificVariantStyle = variantsStyles[tag][variant];
  const tagSizeStyle = stylesByTag[tag];

  const combinedClasses =
    `${baseStyles} ${tagSizeStyle} ${specificVariantStyle} ${className}`.trim();

  const Component = tag;

  return <Component className={combinedClasses}>{children}</Component>;
};
