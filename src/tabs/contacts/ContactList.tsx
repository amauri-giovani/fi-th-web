import { useEffect, useState } from "react";
import { api } from "@/services/api";
import type { CompanyContact } from "@/types/company";
import { Search } from "lucide-react";
import Table from "@/components/base/Table";
import Input from "@/components/base/Input";
import SelectField from "@/components/base/SelectField";

type Props = {
  groupId: number;
  onSelect: (contact: CompanyContact) => void;
};

export default function ContactList({ groupId, onSelect }: Props) {
  const [contacts, setContacts] = useState<CompanyContact[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string | number | null>("all");

  const typeOptions = [
    { id: "all", name: "Todos os tipos" },
    { id: "is_travel_manager", name: "Gestor de Viagem" },
    { id: "is_billing_contact", name: "Contato para Cobrança" },
    { id: "is_financial_contact", name: "Contato Financeiro" },
    { id: "is_commercial_contact", name: "Contato Comercial" },
    { id: "is_secretary_vip", name: "Secretária VIP" },
    { id: "is_vip", name: "VIP" },
  ];

  const filteredContacts = contacts.filter((contact) => {
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      contact.name.toLowerCase().includes(term) ||
      contact.email.toLowerCase().includes(term) ||
      contact.role.toLowerCase().includes(term) ||
      contact.phone?.toLowerCase().includes(term) ||
      contact.mobile?.toLowerCase().includes(term);

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

  useEffect(() => {
    api
      .get(`/companies/company-contacts/?group=${groupId}`)
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
      contact.company?.name ?? "-",
    ],
  }));

  return (
    <div className="mt-4">
      <div className="flex gap-4 mb-4 items-end">
        <div style={{ width: "500px" }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            <Input
              type="text"
              placeholder="Buscar"
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={{ minWidth: "220px" }}>
          <SelectField
            name="contactType"
            value={filterType}
            onChange={(e) => setFilterType(e.value || null)}
            options={typeOptions}
            placeholder={null}
          />
        </div>
      </div>

      <Table
        headers={[
          "Nome",
          "Email",
          "Telefone",
          "Cargo",
          "Empresa vinculada",
        ]}
        rows={rows}
      />
    </div>
  );
}
