import type { CompanyContact } from '../types/contact';
import Input from './base/Input';
import { MaskedInput } from './base/MaskedInput';


type Props = {
  label: string;
  name: keyof CompanyContact;
  value: string;
  disabled: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const placeholders: Partial<Record<keyof CompanyContact, string>> = {
  name: 'Nome completo',
  role: 'Cargo',
  email: 'email@empresa.com',
  phone: '(11) 2222-2222',
  mobile: '(11) 95555-5555',
  whatsapp: '(11) 95555-5555',
};

export function ContactField({ label, name, value, disabled, onChange }: Props) {
  const placeholder = placeholders[name] || '';

  const useMaskedInput = ['phone', 'mobile', 'whatsapp'].includes(name);

  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <label>{label}</label><br />
      {useMaskedInput ? (
        <MaskedInput
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      ) : (
        <Input
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
