import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { GroupTabs } from "@/components/layout/GroupTabs";
import { CompanyForm } from "@/components/CompanyForm";
import { TravelManagerForm } from "@/components/TravelManagerForm";
import { api } from "@/services/api"; // ou seu client http
import type { Group } from "@/types/company";


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

  useEffect(() => {
    if (id) {
      api
        .get(`/companies/groups/${id}/`)
        .then((res) => setGroup(res.data))
        .catch((err) => console.error("Erro ao buscar grupo", err));
    }
  }, [id]);

  if (!group) {
    return (
      <Layout>
        <div className="p-6 text-gray-600 italic">Carregando grupo...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary mb-6">
          Grupo {group.name}
        </h1>

        <GroupTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

        <div className="mt-8">
          {activeTab === "Geral" && (
            <>
              <CompanyForm
                groupId={group.id}
                companyId={group.main_company}
              />
              <div className="mt-8">
                <TravelManagerForm groupId={group.id} />
              </div>
            </>
          )}
          {activeTab !== "Geral" && (
            <div className="text-gray-500 italic">
              Conteúdo da aba "{activeTab}" em construção...
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
