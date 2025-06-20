import { useState } from 'react';
import { api } from '../services/api';
import type { CompanyContact } from '../types/company';
import { ContactField } from './ContactField';


type Props = {
  contact?: CompanyContact;
  companyId: number;
  onUpdate: () => void;
  onClose?: () => void;
};

export function TravelManagerForm({ contact, companyId, onUpdate, onClose }: Props) {
  const [editMode, setEditMode] = useState(contact ? false : true);
  const [form, setForm] = useState<CompanyContact>(
    contact ?? {
      id: 0,
      name: '',
      role: '',
      phone: '',
      mobile: '',
      whatsapp: '',
      email: '',
      is_travel_manager: true,
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
        onClose?.(); // fecha o modal se existir
      })
      .catch((err) => console.error("Erro ao salvar contato:", err));
  }

  function handleCancel() {
    if (contact) {
      setForm(contact);
      setEditMode(false);
    } else {
      onClose?.(); // cancelando criação
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <ContactField label="Nome" name="name" value={form.name} onChange={handleChange} disabled={!editMode} />
      <ContactField label="Cargo" name="role" value={form.role} onChange={handleChange} disabled={!editMode} />
      <ContactField label="E-mail" name="email" value={form.email} onChange={handleChange} disabled={!editMode} />
      <ContactField label="Telefone fixo" name="phone" value={form.phone} onChange={handleChange} disabled={!editMode} />
      <ContactField label="Celular" name="mobile" value={form.mobile} onChange={handleChange} disabled={!editMode} />
      <ContactField label="WhatsApp" name="whatsapp" value={form.whatsapp} onChange={handleChange} disabled={!editMode} />

      {editMode ? (
        <>
          <button type="submit">Salvar</button>
          <button type="button" onClick={handleCancel}>Cancelar</button>
        </>
      ) : (
        <button type="button" onClick={() => setEditMode(true)}>Editar</button>
      )}
    </form>
  );
}
