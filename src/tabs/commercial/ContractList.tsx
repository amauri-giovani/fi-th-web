import { useEffect, useState } from "react";
import { dateToString } from "@/utils/date";
import Button from "@/components/base/Button";
import SearchInput from "@/components/base/SearchInput";
import Select from "@/components/base/Select";
import Table from "@/components/base/Table";
import type { Company } from "@/types/company";
import type { ContractData } from "@/types/commercial";
import { CheckCircle, CircleAlert, CircleX } from "lucide-react";


type Props = {
  group: {
    companies: Company[];
  };
  onCreate: () => void;
  onEdit: (id: number) => void;
};

const statusOptions = [
  { id: "all", name: "Todos" },
  { id: "Vigente", name: "Vigente" },
  { id: "Expirando", name: "Expirando" },
  { id: "Vencido", name: "Vencido" },
];

export default function ContractList({ group, onCreate, onEdit }: Props) {
  const [contracts, setContracts] = useState<(ContractData & { company_name: string })[]>([]);
  const [filtered, setFiltered] = useState<(ContractData & { company_name: string })[]>([]);
  const [filterStatus, setFilterStatus] = useState<string | null>("all");
  const [filterCompany, setFilterCompany] = useState<string | null>("all");

  const companyOptions = [
    { id: "all", name: "Todas as empresas" },
    ...group.companies.map((company) => ({
      id: String(company.name),
      name: company.name,
    })),
  ];

  useEffect(() => {
    const allContracts: (ContractData & { company_name: string })[] = [];

    group.companies.forEach((company) => {
      company.contracts.forEach((contract) => {
        allContracts.push({
          ...contract,
          company_name: company.name,
        });
      });
    });

    setContracts(allContracts);
    setFiltered(allContracts);
  }, [group]);

  function normalize(str: string) {
    return str.replace(/\/+/g, "").toLowerCase();
  }

  function handleSearch(term: string) {
    const lower = term.toLowerCase();
    const normalized = normalize(term);

    const filteredData = contracts.filter((contract) => {
      const companyName = (contract.company_name || "").toLowerCase();
      const sigDate = dateToString(contract.signature_date);
      const expDate = dateToString(contract.expiration_date ?? "");
      const status = (contract.status || "").toLowerCase();

      const matchesSearch =
        companyName.includes(lower) ||
        status.includes(lower) ||
        normalize(sigDate).includes(normalized) ||
        normalize(expDate).includes(normalized) ||
        sigDate.includes(lower) ||
        expDate.includes(lower);

      const matchesStatus =
        filterStatus === "all" || contract.status === filterStatus;

      const matchesCompany =
        filterCompany === "all" || contract.company_name === filterCompany;

      return matchesSearch && matchesStatus && matchesCompany;
    });

    setFiltered(filteredData);
  }

  function renderStatusIcon(status: string | undefined) {
    const iconMap = {
      Vigente: <CheckCircle className="text-green-500 w-4 h-4" />,
      Expirando: <CircleAlert className="text-yellow-500 w-4 h-4" />,
      Vencido: <CircleX className="text-red-500 w-4 h-4" />,
    };

    return iconMap[status as keyof typeof iconMap] || null;
  }

  const rows = filtered.map((c) => ({
    key: c.id,
    onClick: () => onEdit(c.id),
    columns: [
      dateToString(c.signature_date),
      dateToString(c.expiration_date ?? ""),
      <div className="flex items-center gap-2">
        {c.status || "—"}
        {renderStatusIcon(c.status)}
      </div>,
      c.company_name,
    ],
  }));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Contratos</h2>
        <Button rounded onClick={onCreate}>Adicionar novo contrato</Button>
      </div>

      <div className="flex gap-4 items-center mb-4">
        <SearchInput
          onSearch={handleSearch}
          placeholder="Buscar empresa"
        />

        <div style={{ minWidth: "220px" }}>
          <Select
            name="status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(String(e.value || "all"))}
            options={statusOptions}
            placeholder={null}
          />
        </div>

        <div style={{ minWidth: "220px" }}>
          <Select
            name="company"
            value={filterCompany}
            onChange={(e) => setFilterCompany(String(e.value || "all"))}
            options={companyOptions}
            placeholder={null}
          />
        </div>
      </div>

      <Table
        headers={["Data da assinatura", "Data de vencimento", "Situação", "Empresa"]}
        rows={rows}
      />
    </div>
  );
}
