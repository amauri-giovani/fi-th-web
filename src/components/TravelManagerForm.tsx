import { useState } from 'react';
import { api } from '../services/api';
import type { CompanyContact } from '../types/company';
import { ContactField } from './ContactField';
import Button from './base/Button';
import { toast } from 'react-toastify';


type Props = {
  contact?: CompanyContact;
  companyId: number;
  onUpdate: () => void;
  onClose?: () => void;
};

export function TravelManagerForm({ contact, companyId, onUpdate, onClose }: Props) {
  const [editMode, setEditMode] = useState(() => (contact ? false : true));
  const [form, setForm] = useState<CompanyContact>(() =>
    contact ?? {
      id: 0,
      name: '',
      role: '',
      phone: '',
      mobile: '',
      whatsapp: '',
      email: '',
      is_travel_manager: false,
      is_account_executive: false,
      is_billing_contact: false,
      company: companyId,
    }
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...form,
      is_travel_manager: true,
      company: companyId,
    };

    const endpoint = contact
      ? `companies/company-contacts/${form.id}/`
      : `companies/company-contacts/`;

    const method = contact ? api.put : api.post;

    method(endpoint, payload)
      .then(() => {
        setEditMode(false);
        onUpdate();
        onClose?.();
        toast.success("Contato salvo com sucesso")
      })
      .catch(() => toast.error("Erro ao salvar contato:"));
  }

  function handleCancel() {
    if (contact) {
      setForm(contact);
      setEditMode(false);
    } else {
      onClose?.();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <ContactField label="Nome" name="name" value={form.name} onChange={handleChange} disabled={!editMode} />
        <ContactField label="Cargo" name="role" value={form.role} onChange={handleChange} disabled={!editMode} />
        <ContactField label="E-mail" name="email" value={form.email} onChange={handleChange} disabled={!editMode} />
        <ContactField label="Telefone fixo" name="phone" value={form.phone} onChange={handleChange} disabled={!editMode} />
        <ContactField label="Celular" name="mobile" value={form.mobile} onChange={handleChange} disabled={!editMode} />
        <ContactField label="WhatsApp" name="whatsapp" value={form.whatsapp} onChange={handleChange} disabled={!editMode} />
      </div>

      <div className="mt-4 flex gap-2">
        {editMode ? (
          <>
            <Button type="submit" rounded>Salvar</Button>
            <Button variant="outline" rounded onClick={handleCancel}>Cancelar</Button>
          </>
        ) : (
          <Button rounded onClick={(e) => { e.preventDefault(); setEditMode(true); }}>Editar</Button>
        )}
      </div>
    </form>
  );
}