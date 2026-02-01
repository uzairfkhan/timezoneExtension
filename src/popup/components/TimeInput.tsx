interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TimeInput({ value, onChange, placeholder }: TimeInputProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
        Time
      </label>
      <input
        type="text"
        value={value}
        onInput={(e) => onChange((e.target as HTMLInputElement).value)}
        placeholder={placeholder}
        className="input-elegant"
        autoFocus
      />
    </div>
  );
}
