type Option = {
  id: string | number;
  name: string;
};

type Props = {
  name: string;
  value: string | number | null;
  options: Option[];
  onChange: (e: { name: string; value: string | number | null }) => void;
  label?: string;
  disabled?: boolean;
  placeholder?: string | null;
};

export default function Select({
  name,
  value,
  options,
  onChange,
  label,
  disabled = false,
  placeholder = "Selecione uma opção",
}: Props) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={name}>{label}</label>}

      <select
        id={name}
        name={name}
        disabled={disabled}
        value={value ?? ""}
        onChange={(e) =>
          onChange({
            name,
            value: e.target.value === "" ? null : e.target.value,
          })
        }
        className="flex-1 px-2 py-2 text-sm bg-white border border-gray-300  rounded-md focus:outline-none disabled:bg-gray-100 active:rounded-b-none"
      >
        {placeholder !== null && (
          <option value="">{placeholder}</option>
        )}

        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
}
