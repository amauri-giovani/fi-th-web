import { useEffect, useState } from "react";
import SelectField from "./SelectField";
import { api } from "@/services/api";
import { Plus } from "lucide-react";
import IconButton from "./IconButton";


type Option = {
  id: string | number;
  name: string;
};

type Props = {
  name: string;
  value: string | number | null;
  onChange: (e: { name: string; value: string | number | null }) => void;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  options?: Option[]; // só usado para campos locais
};

// mapa interno temporário
const ENDPOINT_MAP: Record<string, string> = {
  point_of_sale: "/companies/point-of-sale/",
  payment_method: "/companies/payment-methods/",
  contract_type: "/companies/contract-types/",
};

export default function SmartSelectField({
  name,
  value,
  onChange,
  label,
  disabled = false,
  placeholder = "Selecione uma opção",
  options = [],
}: Props) {
  const isRemote = name in ENDPOINT_MAP;
  const [internalOptions, setInternalOptions] = useState<Option[]>(options);
  const [loading, setLoading] = useState(isRemote);

  const loadOptions = async () => {
    if (!isRemote) return;
    setLoading(true);

    try {
      const res = await api.get(ENDPOINT_MAP[name]);
      const data = res.data.results ?? res.data;
      setInternalOptions(data);
    } catch (err) {
      console.error(`Erro ao buscar opções para ${name}:`, err);
      setInternalOptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isRemote) loadOptions();
  }, [name]);

  const handleCreateNew = async () => {
    const label = prompt("Digite o nome do novo item:");
    if (!label) return;

    try {
      const res = await api.post(ENDPOINT_MAP[name], { [name]: label });
      const newItem = res.data;

      await loadOptions();
      onChange({ name, value: newItem.id });
    } catch (err) {
      console.error("Erro ao criar item:", err);
      alert("Erro ao criar item.");
    }
  };

  return (
    <div className="flex items-end gap-2">
      <div className="flex-1">
        <SelectField
          name={name}
          value={value}
          options={internalOptions}
          onChange={onChange}
          label={label}
          disabled={disabled || loading}
          placeholder={loading ? "Carregando..." : placeholder}
        />
      </div>

      {isRemote && (
        <IconButton
          onClick={handleCreateNew}
          title="Adicionar novo"
          icon={Plus}
        />
      )}
    </div>
  );
}
