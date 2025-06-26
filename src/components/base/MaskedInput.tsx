import React, { forwardRef } from "react";
import { PatternFormat } from "react-number-format";
import Input from "./Input";

type Props = {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  hasError?: boolean;
  placeholder?: string;
};

const CustomInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <Input ref={ref} {...props} className={className} />
  )
);

export function MaskedInput({ name, value, onChange, disabled, hasError, placeholder }: Props) {
  const formatMap: Record<string, string> = {
    cnpj: "##.###.###/####-##",
    phone: "(##) ####-####",
    mobile: "(##) #####-####",
    whatsapp: "(##) #####-####",
    go_live: "##/##/####",
  };

  const format = formatMap[name];

  const baseClassName = `
    w-full px-3 py-2 rounded-md shadow-sm text-sm
    focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
    ${hasError ? "border border-red-500 ring-2 ring-red-500" : "border border-gray-300"}
  `;

  if (!format) {
    return (
      <Input
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        hasError={hasError}
        placeholder={placeholder}
      />
    );
  }

  return (
    <PatternFormat
      name={name}
      value={value}
      onValueChange={(values) => {
        const syntheticEvent = {
          target: {
            name,
            value: values.value, // envia sem máscara
          },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }}
      disabled={disabled}
      format={format}
      mask="_"
      customInput={CustomInput}
      className={baseClassName}
      placeholder={placeholder}
    />
  );
}
