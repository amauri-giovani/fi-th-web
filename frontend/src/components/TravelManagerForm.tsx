import { useState } from 'react';
import { api } from '../services/api';
import type { CompanyContact } from '../types/company';
import { ContactField } from './ContactField';


type Props = {
  contact: CompanyContact;
  companyId: number;
  onUpdate: () => void;
};

export function TravelManagerForm({ contact, companyId, onUpdate }: Props) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(contact);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    api.put(`companies/company-contacts/${form.id}/`, {
      ...form,
      is_travel_manager: true,
      company: companyId,
    }).then(() => {
      setEditMode(false);
      onUpdate();
    }).catch(err => console.error("Erro ao editar contato:", err));
  }

  function handleCancel() {
    setForm(contact);
    setEditMode(false);
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <ContactField
        label="Nome"
        name="name"
        value={form.name}
        onChange={handleChange}
        disabled={!editMode}
      />

      <ContactField
        label="Cargo"
        name="role"
        value={form.role}
        onChange={handleChange}
        disabled={!editMode}
      />

      <ContactField
        label="E-mail"
        name="email"
        value={form.email}
        onChange={handleChange}
        disabled={!editMode}
      />

      <ContactField
        label="Telefone fixo"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        disabled={!editMode}
      />

      <ContactField
        label="Celular"
        name="mobile"
        value={form.mobile}
        onChange={handleChange}
        disabled={!editMode}
      />

      <ContactField
        label="WhatsApp"
        name="whatsapp"
        value={form.whatsapp}
        onChange={handleChange}
        disabled={!editMode}
      />


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
