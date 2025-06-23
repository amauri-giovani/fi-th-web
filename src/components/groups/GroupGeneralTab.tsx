import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { CompanyForm } from "../CompanyForm";
import type { Company, Group } from "@/types/company";
import Button from "../base/Button";


type Props = {
  group: Group;
};

export function GroupGeneralTab({ group }: Props) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [creatingCompany, setCreatingCompany] = useState(false);

  const fetchCompanies = () => {
    api
      .get<Company[]>(`/companies/companies/?group=${group.id}`)
      .then((res) => setCompanies(res.data))
      .catch((err) => console.error("Erro ao buscar empresas do grupo:", err));
  };

  useEffect(() => {
    fetchCompanies();
  }, [group.id]);

  const hasCompanies = companies.length > 0;
  const hasMainCompany = Boolean(group.main_company);

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
              <Button variant="primary" onClick={() => setCreatingCompany(true)}>
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
