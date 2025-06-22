import { useEffect, useState } from "react";
import { api } from "@/services/api";
import type { Company } from "@/types/company";

const entityEndpoints: Record<keyof Company, string> = {
  point_of_sale: "/companies/points-of-sale/",
  // future keys:
  // payment_method: "/finance/payment-methods/",
  // cost_center: "/finance/cost-centers/",

  // defaults (not implemented)
  id: "",
  name: "",
  fantasy_name: "",
  cnpj: "",
  full_address: "",
  segment: "",
  benner_code: "",
  obt_link: "",
  website: "",
  notes: "",
  go_live: "",
  travel_managers: "",
  group: "",
};

type Props = {
  label: string;
  field: keyof Company;
  value: number | null;
  onChangeEntity: React.Dispatch<React.SetStateAction<Company | null>>;
  disabled: boolean;
};

export function EntitySelectField({ label, field, value, onChangeEntity, disabled }: Props) {
  const [options, setOptions] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const endpoint = entityEndpoints[field];
    if (!endpoint) return;

    api.get(endpoint)
      .then((res) => setOptions(res.data))
      .catch((err) => console.error(`Erro ao buscar ${field}:`, err));
  }, [field]);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = Number(e.target.value);
    onChangeEntity(prev => prev ? { ...prev, [field]: id } : prev);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={value ?? ''}
        onChange={handleChange}
        disabled={disabled}
        className="w-full border border-gray-300 rounded px-3 py-2"
      >
        <option value="">Selecione...</option>
        {options.map(opt => (
          <option key={opt.id} value={opt.id}>{opt.name}</option>
        ))}
      </select>
    </div>
  );
}
