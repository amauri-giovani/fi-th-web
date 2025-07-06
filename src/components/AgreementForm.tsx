import { useEffect, useState } from "react";
import Input from "@/components/base/Input";
import Button from "@/components/base/Button";
import { toast } from "react-toastify";
import type { Agreement } from "@/types/agreement";
import { api } from "@/services/api";
import SmartSelectField from "@/components/base/SmartSelectField";


interface Props {
  groupId: number;
  agreement: Agreement;
  onCancel: () => void;
  onSuccess: (agreement: Agreement) => void;
}

export default function AgreementForm({ groupId, agreement, onCancel, onSuccess }: Props) {
  const [editMode, setEditMode] = useState(agreement.id === 0);
  const [formData, setFormData] = useState<Agreement>(agreement);
  const isEdit = agreement.id !== 0;

  const [formContext, setFormContext] = useState<{
    provider_options: { id: number; name: string }[];
  }>({ provider_options: [] });

  const currentProviderOption =
    formData?.provider?.id && formData?.provider?.name
      ? [{ id: formData.provider.id, name: formData.provider.name }]
      : [];

  useEffect(() => {
    if (!editMode) return;

    api.get("/catalogs/form-context/?fields=provider")
      .then((res) => {
        setFormContext((prev) => ({
          ...prev,
          provider_options: res.data.provider_options || [],
        }));
      })
      .catch((err) => {
        console.error("Erro ao carregar opções de provider:", err);
        toast.error("Erro ao carregar opções do formulário.");
      });
  }, [editMode]);

  const handleChange = (field: keyof Agreement, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const payload = {
      code: formData.code,
      expiration_date: formData.expiration_date,
      notes: formData.notes,
      group: groupId,
      provider_id: formData.provider.id,
      product_type_id: formData.product_type.id,
    };

    try {
      const res = isEdit
        ? await api.put<Agreement>(`/agreements/${formData.id}/`, payload)
        : await api.post<Agreement>("/agreements/", payload);

      toast.success(`Acordo ${isEdit ? "alterado" : "criado"} com sucesso!`);
      onSuccess(res.data);
    } catch (err) {
      console.error("Erro ao salvar acordo:", err);
      toast.error("Erro ao salvar acordo");
    }
  };

  function handleCancel() {
    if (isEdit) {
      api
        .get<Agreement>(`/agreements/${formData.id}/`)
        .then((res) => {
          setFormData(res.data);
          setEditMode(false);
        })
        .catch((err) => {
          toast.error("Erro ao recarregar acordo.");
          console.error("Erro ao recarregar acordo:", err);
          onCancel();
        });
    } else {
      onCancel();
    }
  }

  return (
    <div>
      <div className="grid grid-cols-12 gap-4 mb-4">
        <div className="col-span-5">
          <SmartSelectField
            label="Provedor"
            name="provider"
            value={formData.provider?.id ?? null}
            onChange={({ name, value }) =>
              setFormData((prev) => prev ? { ...prev, [name]: { id: value, name: "" } } : prev)
            }
            options={editMode ? formContext.provider_options : currentProviderOption}
            disabled={!editMode}
            apiEndpoint="/catalogs/providers/"
          />
        </div>

        <div className="col-span-4">
          <Input
            label="Código"
            value={formData.code}
            onChange={(e) => handleChange("code", e.target.value)}
            disabled={!editMode}
          />
        </div>
        <div className="col-span-3">
          <Input
            label="Vencimento"
            type="date"
            value={formData.expiration_date}
            onChange={(e) => handleChange("expiration_date", e.target.value)}
            disabled={!editMode}
          />
        </div>
      </div>

      <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
      <textarea
        name="notes"
        value={formData.notes || ""}
        onChange={(e) => handleChange("notes", e.target.value)}
        disabled={!editMode}
        placeholder="Observações do acordo"
        rows={4}
        style={{ width: "100%" }}
        className="px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
      />

      <div className="mt-6 flex gap-4">
        {editMode ? (
          <>
            <Button rounded onClick={handleSubmit}>Salvar</Button>
            <Button variant="outline" rounded onClick={handleCancel}>Cancelar</Button>
          </>
        ) : (
          <>
            <Button rounded onClick={(e) => { e.preventDefault(); setEditMode(true); }}>Editar</Button>
          </>
        )}
      </div>
    </div>
  );
}
