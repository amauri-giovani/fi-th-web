import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GroupTabs } from "@/components/layout/GroupTabs";
import { fetchGroupById } from "@/services/groupService";
import type { Group } from "@/types/group";
import CompaniesTab from "@/tabs/companies/Index";
import ContactsTab from "@/tabs/contacts/Index";
import AgreementsTab from "@/tabs/agreements/Index";
import GeneralTab from "@/tabs/general/Index";


const TABS = [
  "Geral",
  "Empresas",
  "Contatos",
  "Operação",
  "VIPs",
  "Acordos",
  "Comercial",
  "Financeiro",
  "Suporte"
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
          <GeneralTab group={group} onUpdate={setGroup} />
        )}

        {activeTab === "Empresas" && (
          <CompaniesTab group={group} />
        )}

        {activeTab === "Contatos" && (
          <ContactsTab group={group} />
        )}

        {activeTab === "Acordos" && (
          <AgreementsTab group={group} />
        )}

        {activeTab !== "Geral" && activeTab !== "Empresas" && activeTab !== "Contatos" && activeTab !== "Acordos" && (
          <div className="text-gray-500 italic">
            Conteúdo da aba "{activeTab}" em construção...
          </div>
        )}
      </div>
    </div>
  );
}
