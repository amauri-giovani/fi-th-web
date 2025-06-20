import { useState } from "react";
import { GroupList } from "../components/GroupList";
import { CompanyForm } from "../components/CompanyForm";
import { Layout } from "@/components/layout/Layout";
import type { Group } from "../types/company";

export function CompanyGroupsPage() {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  return (
    <Layout>
      {!selectedGroup ? (
        <GroupList onSelect={setSelectedGroup} />
      ) : selectedGroup.main_company ? (
        <CompanyForm
          companyId={selectedGroup.main_company}
          groupId={selectedGroup.id}
        />
      ) : (
        <div className="max-w-3xl mx-auto bg-white border border-gray-200 p-6 rounded shadow">
          <p className="text-gray-700 mb-4">
            Este grupo ainda não tem uma empresa principal.
          </p>
          <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition">
            Adicionar empresa principal
          </button>
        </div>
      )}
    </Layout>
  );
}
