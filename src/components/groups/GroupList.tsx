import { useEffect, useState } from "react";
import { api } from "../../services/api";
import type { Company, Group } from "../../types/company";
import { useNavigate } from "react-router-dom";
import GroupForm from "@/components/groups/GroupForm";
import { toast } from "react-toastify";
import { format, parseISO } from "date-fns";
import Button from "../base/Button";
import { CheckCircle, CircleAlert, CircleX } from "lucide-react";
import Table from "@/components/base/Table";
import SearchInput from "@/components/base/SearchInput";


export function GroupList() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);

  useEffect(() => {
    setFilteredGroups(groups);
  }, [groups]);

  const fetchGroups = () => {
    api
      .get<Group[]>("/companies/groups/")
      .then((res) => setGroups(res.data))
      .catch((err) => console.error("Erro ao carregar grupos:", err));
  };

  function filterGroups(groups: Group[], term: string): Group[] {
    if (term.length < 3) return groups;

    const lowerTerm = term.toLowerCase();

    return groups.filter((group) => {
      const company = group.companies?.find(c => c.id === group.main_company);

      const valuesToSearch = [
        group.name,
        company?.cnpj,
        company?.point_of_sale?.name,
        dateToString(company?.current_contract?.expiration_date),
        company?.account_executive?.name,
      ];

      return valuesToSearch.some((value) =>
        String(value || "").toLowerCase().includes(lowerTerm)
      );
    });
  }

  function dateToString(isoDate?: string) {
    if (!isoDate || isNaN(Date.parse(isoDate))) return "";
    return format(parseISO(isoDate), "dd/MM/yyyy");
  }

  function renderStatusIcon(status: string | undefined) {
    const iconMap = {
      Vigente: <CheckCircle className="text-green-500 w-4 h-4" />,
      Expirando: <CircleAlert className="text-yellow-500 w-4 h-4" />,
      Vencido: <CircleX className="text-red-500 w-4 h-4" />,
    };

    return iconMap[status as keyof typeof iconMap] || null;
  }

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <section className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Grupos cadastrados</h2>
        <Button rounded onClick={() => setShowGroupForm(true)}>
          Adicionar novo grupo
        </Button>
      </div>

      {showGroupForm && (
        <GroupForm
          onCancel={() => setShowGroupForm(false)}
          onSuccess={() => {
            setShowGroupForm(false);
            fetchGroups();
            toast.success("Grupo criado com sucesso!");
          }}
        />
      )}
      
      <div className="mb-4" >
        <SearchInput onSearch={(term) => setFilteredGroups(filterGroups(groups, term))} />
      </div>

      <Table
        headers={["Grupos", "CNPJ", "Posto de venda", "Vencimento de contrato", "Executivo"]}
        rows={filteredGroups.map((group) => {
          const mainCompany = group.companies?.find(
            (company: Company) => company.id === group.main_company
          );
          return {
            key: group.id,
            onClick: () => navigate(`/companies/groups/${group.id}`),
            columns: [
              group.name,
              mainCompany?.cnpj || "—",
              mainCompany?.point_of_sale?.name || "—",
              <div className="flex items-center gap-2">
                {dateToString(mainCompany?.current_contract?.expiration_date) || "—"}
                {renderStatusIcon(mainCompany?.current_contract?.status)}
              </div>,
              mainCompany?.account_executive?.name || "—",
            ],
          };
        })}
      />
    </section>
  );
}
