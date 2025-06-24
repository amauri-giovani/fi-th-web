import { useEffect, useState } from "react";
import SelectField from "./SelectField";
import { api } from "@/services/api";
import { Plus } from "lucide-react";
import IconButton from "./IconButton";
import InputModal from "./InputModal";
import { toast } from "react-toastify";


type Option = {
  id: string | number;
  name: string;
};

type Props = {
  name: string;
  value: string | number | null;
  onChange: (e: { name: string; value: string | number | null }) => void;
  label?: string;
  createFieldName?: string;
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
  createFieldName,
  disabled = false,
  placeholder = "Selecione uma opção",
  options = [],
}: Props) {
  const isRemote = name in ENDPOINT_MAP;
  const [internalOptions, setInternalOptions] = useState<Option[]>(options);
  const [loading, setLoading] = useState(isRemote);
  const [modalOpen, setModalOpen] = useState(false);

  const loadOptions = async () => {
    if (!isRemote) return;
    setLoading(true);

    try {
      const res = await api.get(ENDPOINT_MAP[name]);
      const data = res.data.results ?? res.data;
      setInternalOptions(data);
    } catch (err) {
      setInternalOptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isRemote) loadOptions();
  }, [name]);

  const createNewOption = (label: string) => {
    const field = createFieldName || "name";
    api.post(ENDPOINT_MAP[name], { [field]: label })
      .then((res) => {
        const newItem = res.data;
        loadOptions().then(() => {
          onChange({ name, value: newItem.id });
        });
        toast.success("Item criado com sucesso!");
      })
      .catch((err) => {
        toast.error(err.response?.data?.detail || "Erro ao criar item");
      })
      .finally(() => setModalOpen(false));
  };

  return (
    <>
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

        {isRemote && !disabled && (
          <IconButton
            onClick={() => setModalOpen(true)}
            title="Adicionar novo"
            icon={Plus}
          />
        )}
      </div>
      <InputModal
        title="Novo item"
        isOpen={modalOpen}
        onCancel={() => setModalOpen(false)}
        onConfirm={(value) => createNewOption(value)}
        placeholder="Digite o nome do novo item"
      />
    </>
  );
}
