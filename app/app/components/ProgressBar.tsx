import { useEffect, useRef } from "react";

interface Props {
  number: number;
  disabled: boolean;
}

export const ProgressBar: React.FC<Props> = ({ number, disabled }) => {
  const progress = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (progress.current) {
      progress.current.style.width = `${number}%`;
    }
  }, [number]);

  return (
    <div className={`w-full h-[10px] ${disabled ? "bg-gray" : "bg-red"}`}>
      <div
        className={`h-[10px] ${disabled ? "bg-gray" : "bg-green"}`}
        ref={progress}
      ></div>
    </div>
  );
};
