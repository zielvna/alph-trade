interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  disabled?: boolean;
}

export const Input: React.FC<Props> = ({ disabled = false, ...props }) => {
  return (
    <input
      className={`w-full h-[40px] px-2 text-lg border border-black outline-none bg-${
        disabled ? "gray" : "white"
      }`}
      disabled={disabled}
      {...props}
    />
  );
};
