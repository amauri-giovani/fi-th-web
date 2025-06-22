import type { Company } from '../types/company';
import { MaskedInput } from './base/MaskedInput';


type Props = {
  label: string;
  name: keyof Company;
  value: string;
  disabled: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  multiline?: boolean;
};

const placeholders: Partial<Record<keyof Company, string>> = {
  name: 'Razão Social',
  fantasy_name: 'Nome Fantasia',
  cnpj: '00.000.000/0001-91',
  go_live: '01/01/1111',
  point_of_sale: 'Ponto de Venda',
  full_address: 'Rua Exemplo, 123 - Bairro - Cidade/UF',
  segment: 'Ex: Saúde, Educação, Indústria',
  benner_code: 'Código no sistema Benner',
  obt_link: 'https://exemplo.com.br/empresa',
  website: 'https://empresa.com.br',
  notes: 'Observações e particularidades...',
};

export function CompanyField({ label, name, value, disabled, onChange, multiline }: Props) {
  const placeholder = placeholders[name] || '';

  const useMaskedInput = ['cnpj', 'phone', 'mobile', 'whatsapp'].includes(name);

  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <label>{label}</label><br />
      {multiline ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          rows={3}
          style={{ width: '100%' }}
        />
      ) : useMaskedInput ? (
        <MaskedInput
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      ) : (
        <input
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          style={{ width: '100%' }}
        />
      )}
    </div>
  );
}
