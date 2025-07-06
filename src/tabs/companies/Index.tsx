import { useState } from "react";
import type { Company } from "@/types/company";
import CompaniesList from "./CompaniesList";
import Button from "@/components/base/Button";
import { Undo2 } from "lucide-react";
import { toast } from "react-toastify";
import type { Group } from "@/types/group";
import CompanyForm from "@/components/CompanyForm";


type Props = {
  group: Group;
  onUpdateGroup: (updatedGroup: Group) => void;
};

export default function CompaniesTab({ group, onUpdateGroup }: Props) {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [creatingNew, setCreatingNew] = useState(false);

  const handleCreateClick = () => {
    setSelectedCompany(null);
    setCreatingNew(true);
  };

  const handleCloseForm = () => {
    setCreatingNew(false);
    setSelectedCompany(null);
    onUpdateGroup?.(group);
  };

  const handleSelectCompany = (company: Company) => {
    setSelectedCompany(company);
    setCreatingNew(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-primary">Empresas</h2>
        {(creatingNew || selectedCompany) ? (
          <Button
            rounded
            variant="inverted"
            className="flex items-center"
            onClick={handleCloseForm}
          >
            <Undo2 className="w-4 h-4 mr-2" />
            Voltar à lista de empresas
          </Button>
        ) : (
          <Button rounded onClick={handleCreateClick}>
            Adicionar nova empresa
          </Button>
        )}
      </div>

      {!creatingNew && !selectedCompany && (
        <>
          {group.companies.length > 0 ? (
            <CompaniesList
              companies={group.companies}
              mainCompanyId={(group.main_company as any)?.id ?? group.main_company}
              groupId={group.id}
              onSelect={handleSelectCompany}
              onUpdateMainCompany={onUpdateGroup}
            />
          ) : (
            <p className="text-sm italic text-gray-500 mt-2">
              Nenhuma empresa cadastrada ainda. Clique no botão Adicionar nova empresa para cadastrar.
            </p>
          )}
        </>
      )}

      {(creatingNew || selectedCompany) && (
        <div className="mt-6">
          <CompanyForm
            groupId={group.id}
            companyId={selectedCompany?.id}
            onCancelCreate={handleCloseForm}
            onSuccess={() => {
              toast.success(
                selectedCompany
                  ? "Empresa alterada com sucesso!"
                  : "Empresa criada com sucesso!"
              );
              handleCloseForm();
            }}
          />
        </div>
      )}
    </div>
  );
}
