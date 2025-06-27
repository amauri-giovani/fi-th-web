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
      <div className="flex flex-col gap-1">
        {label && <label htmlFor={name}>{label}</label>}

        <div className="flex  overflow-hidden mt-[-3px] border border-gray-300 rounded-md active:rounded-bl-none">
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
            className="flex-1 px-2 py-2 text-sm bg-white focus:outline-none disabled:bg-gray-100"
          >
            <option value="">{loading ? "Carregando..." : placeholder}</option>
            {internalOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name}
              </option>
            ))}
          </select>

          {isRemote && !disabled && (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="px-3 bg-primary text-white flex items-center justify-center hover:bg-primary/90"
              title="Adicionar novo"
            >
              <Plus size={16} />
            </button>
          )}
        </div>
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
