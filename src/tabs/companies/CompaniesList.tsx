import { useState } from "react";
import type { Company } from "@/types/company";
import Button from "@/components/base/Button";
import ConfirmModal from "@/components/base/ConfirmModal";
import { api } from "@/services/api";
import { toast } from "react-toastify";


type Props = {
  companies: Company[];
  mainCompanyId: number | null;
  groupId: number;
  onSelect: (company: Company) => void;
  onUpdateMainCompany: () => void;
};

export default function CompaniesList({
  companies,
  mainCompanyId,
  groupId,
  onSelect,
  onUpdateMainCompany,
}: Props) {
  const main = companies.find((c) => c.id === mainCompanyId);
  const others = companies.filter((c) => c.id !== mainCompanyId);
  const [modalCompany, setModalCompany] = useState<Company | null>(null);

  const handleSetAsMain = () => {
    console.log("Chamando API para tornar principal:", modalCompany);
    if (!modalCompany) return;

    if (modalCompany.id === mainCompanyId) {
      console.log("Empresa já é a principal, nada a fazer.");
      setModalCompany(null);
      return;
    }

    api.patch(`/companies/groups/${groupId}/`, {
      main_company: modalCompany.id,
    })
      .then(() => {
        onUpdateMainCompany();
        toast.success(`Empresa ${modalCompany.name} definida como principal`)
      })
      .catch(() => {
        toast.error("Erro ao trocar empresa principal");
      })
      .finally(() => setModalCompany(null));
  };

  function formatCNPJ(cnpj: string) {
    if (!cnpj) return "";
    const numeric = cnpj.replace(/\D/g, "");
    return numeric.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5"
    );
  }

  const renderRow = (company: Company, isMain = false) => (
    <tr
      key={company.id}
      className={`hover:bg-gray-100 cursor-pointer ${isMain ? "bg-green-100" : "bg-white"
        }`}
      onClick={() => onSelect(company)}
    >
      <td className="px-4 py-2 font-medium">
        {company.name}
        {isMain && (
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-600 text-white">
            Principal
          </span>
        )}
      </td>
      <td className="px-4 py-2">{company.fantasy_name}</td>
      <td className="px-4 py-2">{formatCNPJ(company.cnpj)}</td>
      <td className="px-4 py-2">{company.full_address}</td>
      <td className="px-4 py-2">{company.benner_code}</td>
      <td className="px-4 py-2">
        {!isMain && (
          <Button
            variant="link"
            onClick={(e) => {
              e.stopPropagation(); // impede que clique dispare o onSelect
              setModalCompany(company); // abre o modal
            }}
          >
            Tornar principal
          </Button>
        )}
      </td>
    </tr>
  );

  return (
    <>
      <div className="overflow-x-auto border border-gray-200 rounded-md">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 font-semibold">
            <tr>
              <th className="px-4 py-2">Razão social</th>
              <th className="px-4 py-2">Fantasia</th>
              <th className="px-4 py-2">CNPJ</th>
              <th className="px-4 py-2">Endereço Completo</th>
              <th className="px-4 py-2">Cod. Backoffice</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {main && renderRow(main, true)}
            {others.map((c) => renderRow(c))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        title="Definir como principal"
        message={`Deseja realmente tornar "${modalCompany?.name}" a empresa principal do grupo?`}
        isOpen={modalCompany !== null}
        onConfirm={handleSetAsMain}
        onCancel={() => setModalCompany(null)}
      />
    </>
  );
}
