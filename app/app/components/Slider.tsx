interface Props {
  value: number;
  onChange: (value: number) => void;
}

export const Slider: React.FC<Props> = ({ value, onChange }) => {
  return (
    <input
      type="range"
      value={value}
      min="2"
      max="20"
      className="w-full h-8 overflow-hidden cursor-pointer"
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );
};
