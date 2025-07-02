import { useEffect, useState } from "react";
import { api } from "@/services/api";
import type { Company, Group } from "@/types/company";
import { CompanyForm } from "@/components/CompanyForm";
import CompaniesList from "./CompaniesList";
import Button from "@/components/base/Button";
import { Undo2 } from "lucide-react";
import { toast } from "react-toastify";

type Props = {
  group: Group;
};

export default function CompaniesTab({ group }: Props) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [creatingNew, setCreatingNew] = useState(false);

  const fetchCompanies = () => {
    api
      .get<Company[]>(`/companies/companies/?group=${group.id}`)
      .then((res) => setCompanies(res.data))
      .catch((err) =>
        console.error("Erro ao buscar empresas do grupo:", err)
      );
  };

  useEffect(() => {
    fetchCompanies();
  }, [group.id]);

  const handleCreateClick = () => {
    setSelectedCompany(null);
    setCreatingNew(true);
  };

  const handleCloseForm = () => {
    setCreatingNew(false);
    setSelectedCompany(null);
    fetchCompanies();
  };

  const handleSelectCompany = (company: Company) => {
    setSelectedCompany(company);
    setCreatingNew(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Empresas</h2>
        {creatingNew || selectedCompany ? (
          <Button rounded variant="inverted" className="flex items-center" onClick={() => {
            setCreatingNew(false);
            setSelectedCompany(null);
          }}>
            <Undo2 className="w-4 h-4 mr-2" />
            Voltar à lista de empresas
          </Button>
        ) : (
          <Button rounded onClick={handleCreateClick}>Adicionar nova empresa</Button>
        )}
      </div>


      {!creatingNew && !selectedCompany && (
        <CompaniesList
          companies={companies}
          mainCompanyId={group.main_company}
          groupId={group.id}
          onSelect={handleSelectCompany}
          onUpdateMainCompany={() => {
            api.get(`/companies/groups/${group.id}/`).then((res) => {
              group.main_company = res.data.main_company;
              fetchCompanies();
            });
          }}
        />
      )}

      {(creatingNew || selectedCompany) && (
        <div className="mt-6">
          <CompanyForm
            groupId={group.id}
            companyId={selectedCompany?.id}
            onCancelCreate={handleCloseForm}
            onSuccess={(updatedCompany) => {
              api.get(`/companies/groups/${group.id}/`).then((res) => {
                group.main_company = res.data.main_company;
                fetchCompanies();
                setCreatingNew(false);
                setSelectedCompany(null);
                const isEdit = !!updatedCompany.id && !!selectedCompany;
                toast.success(isEdit ? "Empresa alterada com sucesso!" : "Empresa criada com sucesso!");
              });
            }}
          />
        </div>
      )}
    </div>
  );
}
