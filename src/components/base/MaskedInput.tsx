import React from 'react';
import { forwardRef } from 'react';
import { PatternFormat } from 'react-number-format';
import Input from './Input';


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
    go_live: '##/##/####',
  };

  const format = formatMap[name];

  if (!format) {
    return (
      <Input
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
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


