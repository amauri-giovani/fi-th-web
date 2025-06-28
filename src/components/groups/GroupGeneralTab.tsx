import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { CompanyForm } from "../CompanyForm";
import type { Company, Group } from "@/types/company";
import Button from "../base/Button";
import { toast } from "react-toastify";


type Props = {
  group: Group;
  setActiveTab: (tab: string) => void;
};

export function GroupGeneralTab({ group, setActiveTab }: Props) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [creatingCompany, setCreatingCompany] = useState(false);
  const [ready, setReady] = useState(false);

  const fetchCompanies = () => {
    api
      .get<Company[]>(`/companies/companies/?group=${group.id}`)
      .then((res) => setCompanies(res.data))
      .catch(() => toast.error("Erro ao buscar empresas do grupo:"));
  };

  useEffect(() => {
    setReady(false);
    fetchCompanies();

    const timeout = setTimeout(() => {
      setReady(true);
    }, 500);

    return () => clearTimeout(timeout);
  }, [group.id]);

  const hasCompanies = companies.length > 0;
  const hasMainCompany = Boolean(group.main_company);

  if (!ready) return null;

  return (
    <div className="mb-6">
      {!hasCompanies ? (
        <>
          <p className="text-sm text-gray-500 italic">
            Esse grupo ainda não possui empresas cadastradas. Crie uma empresa e atribua como principal.
          </p>

          {creatingCompany ? (
            <div className="mt-4">
              <CompanyForm
                groupId={group.id}
                onCancelCreate={() => setCreatingCompany(false)}
              />
            </div>
          ) : (
            <div className="mt-4">
              <Button rounded variant="primary" onClick={() => setActiveTab("Empresas")}>
                Criar empresa
              </Button>
            </div>
          )}
        </>
      ) : !hasMainCompany ? (
        <p className="text-sm text-gray-500 italic">
          Esse grupo possui empresas, mas nenhuma definida como principal. Selecione uma para atribuir.
        </p>
      ) : (
        <CompanyForm groupId={group.id} companyId={group.main_company ?? undefined} />
      )}
    </div>
  );
}
