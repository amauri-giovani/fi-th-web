import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/services/api";
import Button from "./base/Button";
import { ContactField } from "./ContactField";
import Checkbox from "./base/Checkbox";
import type { CompanyContact } from "@/types/company";


interface Props {
  companyId: number;
  contact?: CompanyContact;
  onCancel?: () => void;
  onSaved?: () => void;
  highlighted?: boolean;
}

export default function CompanyContactForm({
  companyId,
  contact,
  onCancel,
  onSaved,
  highlighted = false,
}: Props) {
  const [form, setForm] = useState<Partial<CompanyContact>>({});
  const [editMode, setEditMode] = useState(!contact);
  const [isHighlighted, setIsHighlighted] = useState(highlighted);

  useEffect(() => {
    setForm(contact ?? {});
    setEditMode(!contact);
  }, [contact]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const buildPayload = () => {
    const {
      id,
      company,
      ...rest
    } = form;

    return {
      ...rest,
      company_id: companyId,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = buildPayload();

    try {
      if (contact?.id) {
        await api.put(`/companies/company-contacts/${contact.id}/`, payload);
        toast.success("Contato atualizado com sucesso");
      } else {
        await api.post(`/companies/company-contacts/`, payload);
        toast.success("Contato criado com sucesso");
      }

      setEditMode(false);
      setIsHighlighted(false);
      onSaved?.();
    } catch (err) {
      console.error("Erro ao salvar contato:", err);
      toast.error("Erro ao salvar contato");
    }
  };

  const handleCancel = () => {
    contact ? setEditMode(false) : onCancel?.();
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    setEditMode(true);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`mb-6 bg-white border p-4 rounded-lg shadow-sm ${isHighlighted ? "border-green-400" : "border-gray-200"
        }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ContactField label="Nome" name="name" value={form.name || ""} onChange={handleChange} disabled={!editMode} />
        <ContactField label="Cargo" name="role" value={form.role || ""} onChange={handleChange} disabled={!editMode} />
        <ContactField label="E-mail" name="email" value={form.email || ""} onChange={handleChange} disabled={!editMode} />
        <ContactField label="Telefone fixo" name="phone" value={form.phone || ""} onChange={handleChange} disabled={!editMode} />
        <ContactField label="Celular" name="mobile" value={form.mobile || ""} onChange={handleChange} disabled={!editMode} />
        <ContactField label="WhatsApp" name="whatsapp" value={form.whatsapp || ""} onChange={handleChange} disabled={!editMode} />
      </div>

      <div className="flex flex-col gap-2 mt-4 text-sm text-gray-700">
        <Checkbox label="Gestor de Viagem" name="is_travel_manager" checked={!!form.is_travel_manager} onChange={handleChange} disabled={!editMode} />
        <Checkbox label="Contato para Cobrança" name="is_billing_contact" checked={!!form.is_billing_contact} onChange={handleChange} disabled={!editMode} />
        <Checkbox label="Contato Financeiro" name="is_financial_contact" checked={!!form.is_financial_contact} onChange={handleChange} disabled={!editMode} />
        <Checkbox label="Contato Comercial" name="is_commercial_contact" checked={!!form.is_commercial_contact} onChange={handleChange} disabled={!editMode} />
        <Checkbox label="Secretária VIP" name="is_secretary_vip" checked={!!form.is_secretary_vip} onChange={handleChange} disabled={!editMode} />
        <Checkbox label="VIP" name="is_vip" checked={!!form.is_vip} onChange={handleChange} disabled={!editMode} />
      </div>

      <div className="mt-4 flex gap-2">
        {editMode ? (
          <>
            <Button type="submit" rounded>Salvar</Button>
            <Button variant="outline" rounded onClick={handleCancel}>Cancelar</Button>
          </>
        ) : (
          <Button rounded onClick={handleEdit}>Editar</Button>
        )}
      </div>
    </form>
  );
}
