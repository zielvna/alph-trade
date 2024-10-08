import { useEffect, useState } from "react";
import { Color } from "../enums/color";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
  scheme: Color;
  size: ButtonSize;
}

export enum ButtonSize {
  BIG,
  SMALL,
}

export const Button: React.FC<Props> = ({
  children,
  scheme,
  size,
  ...props
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const sizeClass = size === ButtonSize.BIG ? "h-[40px]" : "h-[30px]";

  return (
    <>
      {isClient && (
        <button
          className={`w-full bg-${scheme} text-white text-lg ${sizeClass}`}
          {...props}
        >
          {children}
        </button>
      )}
    </>
  );
};
