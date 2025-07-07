import { useEffect, useState } from "react";
import { api } from "@/services/api";
import type { CompanyContact } from "@/types/contact";
import Table from "@/components/base/Table";
import Select from "@/components/base/Select";
import SearchInput from "@/components/base/SearchInput";


type Props = {
  groupId: number;
  onSelect: (contact: CompanyContact) => void;
};

export default function ContactList({ groupId, onSelect }: Props) {
  const [contacts, setContacts] = useState<CompanyContact[]>([]);
  const [filterType, setFilterType] = useState<string | number | null>("all");
  const [filteredContacts, setFilteredContacts] = useState<CompanyContact[]>([]);

  useEffect(() => {
    setFilteredContacts(contacts);
  }, [contacts]);

  const typeOptions = [
    { id: "all", name: "Todos" },
    { id: "is_travel_manager", name: "Gestor de Viagem" },
    { id: "is_billing_contact", name: "Contato para Cobrança" },
    { id: "is_financial_contact", name: "Contato Financeiro" },
    { id: "is_commercial_contact", name: "Contato Comercial" },
    { id: "is_secretary_vip", name: "Secretária VIP" },
    { id: "is_vip", name: "VIP" },
  ];

  function handleSearch(term: string) {
    const lower = term.toLowerCase();

    const filtered = contacts.filter((contact) => {
      const matchesSearch = (
        (contact.name || "").toLowerCase().includes(lower) ||
        (contact.email || "").toLowerCase().includes(lower) ||
        (contact.role || "").toLowerCase().includes(lower) ||
        (contact.phone || "").toLowerCase().includes(lower) ||
        (contact.mobile || "").toLowerCase().includes(lower)
      );

      const matchesType =
        filterType === "all" ||
        (filterType === "is_travel_manager" && contact.is_travel_manager) ||
        (filterType === "is_billing_contact" && contact.is_billing_contact) ||
        (filterType === "is_financial_contact" && contact.is_financial_contact) ||
        (filterType === "is_commercial_contact" && contact.is_commercial_contact) ||
        (filterType === "is_secretary_vip" && contact.is_secretary_vip) ||
        (filterType === "is_vip" && contact.is_vip);

      return matchesSearch && matchesType;
    });

    setFilteredContacts(filtered);
  }

  useEffect(() => {
    api
      .get(`/contacts/?group=${groupId}`)
      .then((res) => setContacts(res.data))
      .catch((err) => console.error("Erro ao buscar contatos:", err));
  }, [groupId]);

  const rows = filteredContacts.map((contact) => ({
    key: contact.id,
    onClick: () => onSelect(contact),
    columns: [
      contact.name,
      contact.email,
      contact.mobile || contact.phone,
      contact.role,
      "-", // Usando antes para o campo de "empresa vinculada"
    ],
  }));

  return (
    <div className="mt-4">
      <div className="flex gap-4 mb-4 items-center">
        <SearchInput onSearch={handleSearch} />

        <div style={{ minWidth: "220px" }}>
          <Select
            name="contactType"
            value={filterType}
            onChange={(e) => setFilterType(e.value || null)}
            options={typeOptions}
            placeholder={null}
          />
        </div>
      </div>

      <Table
        headers={["Nome", "Email", "Telefone", "Cargo", "Empresa vinculada"]}
        rows={rows}
      />
    </div>
  );
}
