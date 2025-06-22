import { useState } from "react";
import { GroupList } from "@/components/groups/GroupList";
import { CompanyForm } from "../components/CompanyForm";
import { TravelManagerForm } from "../components/TravelManagerForm";
import { Layout } from "@/components/layout/Layout";
import { GroupTabs } from "@/components/layout/GroupTabs";
import type { Group } from "../types/company";


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

export function CompanyGroupsPage() {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [activeTab, setActiveTab] = useState("Geral");

  return (
    <Layout>
      {!selectedGroup ? (
        <GroupList onSelect={setSelectedGroup} />
      ) : (
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary mb-6">
            Grupo {selectedGroup.name}
          </h1>

          <GroupTabs
            tabs={TABS}
            active={activeTab}
            onChange={setActiveTab}
          />

          <div className="mt-8">
            {activeTab === "Geral" && (
              <>
                <CompanyForm
                  groupId={selectedGroup.id}
                  companyId={selectedGroup.main_company}
                />
                <div className="mt-8">
                  <TravelManagerForm groupId={selectedGroup.id} />
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
      )}
    </Layout>
  );
}
