import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Plus } from "lucide-react";
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
  options?: Option[];
  allowCreate?: boolean;
  apiEndpoint?: string;
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
  allowCreate,
  apiEndpoint
}: Props) {
  const [internalOptions, setInternalOptions] = useState<Option[]>(options);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setInternalOptions(options);
  }, [options]);

  const createNewOption = (label: string) => {
    const field = createFieldName || "name";
    const endpoint = apiEndpoint || `/catalogs/${name.replace(/_/g, "-")}/`;

    api
      .post(endpoint, { [field]: label })
      .then((res) => {
        const newItem = res.data;
        const updated = [...internalOptions, newItem];
        setInternalOptions(updated);
        onChange({ name, value: newItem.id });
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

        <div className="flex overflow-hidden mt-[-3px] border border-gray-300 rounded-md active:rounded-bl-none">
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
            <option value="">{placeholder}</option>
            {internalOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name}
              </option>
            ))}
          </select>

          {!disabled && allowCreate !== false && (
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
