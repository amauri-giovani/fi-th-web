import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GroupTabs } from "@/components/layout/GroupTabs";
import { GroupGeneralTab } from "@/components/groups/GroupGeneralTab";
import { fetchGroupById } from "@/services/groupService";
import type { Group } from "@/types/company";
import CompaniesTab from "@/tabs/companies/Index";


const TABS = [
  "Geral",
  "VIPs",
  "Comercial",
  "Financeiro",
  "Operação",
  "Suporte",
  "Acordos",
  "Empresas",
];

export function GroupDetailsPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("Geral");
  const [group, setGroup] = useState<Group | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchGroupById(Number(id))
      .then((data) => {
        setGroup(data);
        setNotFound(false);
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          console.error("Erro ao carregar grupo:", err);
        }
      });
  }, [id]);

  if (notFound) {
    return (
      <div className="text-center text-red-600 mt-8">
        Grupo não encontrado.
      </div>
    );
  }

  if (!group) {
    return (
      <div className="p-6 text-gray-600 italic">Carregando grupo...</div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-primary mb-6">
        Grupo {group.name}
      </h1>

      <GroupTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      <div className="mt-8">
        {activeTab === "Geral" && (
          <GroupGeneralTab group={group} />
        )}

        {activeTab === "Empresas" && (
          <CompaniesTab group={group} />
        )}

        {activeTab !== "Geral" && activeTab !== "Empresas" && (
          <div className="text-gray-500 italic">
            Conteúdo da aba "{activeTab}" em construção...
          </div>
        )}
      </div>
    </div>
  );
}
