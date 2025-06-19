import React from 'react';
import { forwardRef } from 'react';
import { PatternFormat } from 'react-number-format';


type Props = {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};

export const CustomInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  (props, ref) => <input {...props} ref={ref} />
);

export function MaskedInput({ name, value, onChange, disabled }: Props) {
  const formatMap: Record<string, string> = {
    cnpj: '##.###.###/####-##',
    phone: '(##) ####-####',
    mobile: '(##) #####-####',
    whatsapp: '(##) #####-####',
  };

  const format = formatMap[name];

  if (!format) {
    // Fallback sem máscara
    return (
      <input
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={{ width: '100%' }}
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
      style={{ width: '100%' }}
    />
  );
}


