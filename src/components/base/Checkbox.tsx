import React from 'react';


type CheckboxProps = {
  label?: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};

export default function Checkbox({ label, name, checked, onChange, disabled }: CheckboxProps) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-gray-700">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="form-checkbox text-indigo-600 rounded"
      />
      {label && <span>{label}</span>}
    </label>
  );
}
