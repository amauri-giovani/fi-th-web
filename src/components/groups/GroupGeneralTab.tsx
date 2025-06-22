import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { CompanyForm } from "../CompanyForm";
import type { Company, Group } from "@/types/company";
import { useNavigate } from "react-router-dom";


type Props = {
  group: Group;
};

export function GroupGeneralTab({ group }: Props) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const navigate = useNavigate();

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
    <div>
      <div className="mb-6">
        {!hasCompanies ? (
          <p className="text-sm text-gray-500 italic">
            Esse grupo ainda não possui empresas cadastradas. Crie uma empresa e atribua como principal.
          </p>
        ) : !hasMainCompany ? (
          <p className="text-sm text-gray-500 italic">
            Esse grupo possui empresas, mas nenhuma definida como principal. Selecione uma para atribuir.
          </p>
        ) : (
          <CompanyForm groupId={group.id} companyId={group.main_company} />
        )}
      </div>

      <div className="mt-8">
        <button
          onClick={() => navigate(`/companies/create?group=${group.id}`)}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition"
        >
          Criar empresa
        </button>
      </div>
    </div>
  );
}
