import { useEffect, useState } from "react";
import { api } from "../../services/api";
import type { Group } from "../../types/group";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../base/Button";
import Table from "@/components/base/Table";
import SearchInput from "@/components/base/SearchInput";
import { CheckCircle, CircleAlert, CircleX, Undo2 } from "lucide-react";
import { GroupForm } from "./GroupForm";

export function GroupList() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [creating, setCreating] = useState(false);
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    setFilteredGroups(groups);
  }, [groups]);

  const fetchGroups = () => {
    api
      .get<Group[]>("/groups/")
      .then((res) => setGroups(res.data))
      .catch((err) => console.error("Erro ao carregar grupos:", err));
  };

  function filterGroups(groups: Group[], term: string): Group[] {
    if (term.length < 3) return groups;

    const lowerTerm = term.toLowerCase();

    return groups.filter((group) => {
      const valuesToSearch = [
        group.name,
        group.main_company?.cnpj,
        group.point_of_sale?.name,
        group.account_executive?.name,
      ];

      return valuesToSearch.some((value) =>
        String(value || "").toLowerCase().includes(lowerTerm)
      );
    });
  }

  function renderStatusIcon(status: string | undefined) {
    const iconMap = {
      Vigente: <CheckCircle className="text-green-500 w-4 h-4" />,
      Expirando: <CircleAlert className="text-yellow-500 w-4 h-4" />,
      Vencido: <CircleX className="text-red-500 w-4 h-4" />,
    };

    return iconMap[status as keyof typeof iconMap] || null;
  }

  return (
    <section className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Grupos cadastrados</h2>

        {creating ? (
          <Button rounded variant="inverted" className="flex items-center" onClick={() => setCreating(false)}>
            <Undo2 className="w-4 h-4 mr-2" />
            Voltar à lista de grupos
          </Button>
        ) : (
          <Button rounded onClick={() => setCreating(true)}>
            Adicionar novo grupo
          </Button>
        )}
      </div>

      {creating ? (
        <GroupForm
          onCancelCreate={() => setCreating(false)}
          onSuccess={() => {
            fetchGroups();
            setCreating(false);
          }}
        />
      ) : (
        <>
          <div className="mb-4">
            <SearchInput onSearch={(term) => setFilteredGroups(filterGroups(groups, term))} />
          </div>

          <Table
            headers={["Grupos", "CNPJ", "Ponto de venda", "Executivo", "Situação dos contratos"]}
            rows={filteredGroups.map((group) => ({
              key: group.id!,
              onClick: () => navigate(`/groups/${group.id}`),
              columns: [
                group.name,
                group.main_company?.cnpj || "—",
                group.point_of_sale?.name || "—",
                group.account_executive?.name || "—",
                <div className="flex items-center gap-2">
                  {group.contracts_status || "—"}
                  {renderStatusIcon(group.contracts_status)}
                </div>,
              ],
            }))}
          />
        </>
      )}
    </section>
  );
}
