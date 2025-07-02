import { useState } from "react";
import type { Company } from "@/types/company";
import Button from "@/components/base/Button";
import ConfirmModal from "@/components/base/ConfirmModal";
import { api } from "@/services/api";
import { toast } from "react-toastify";
import Table from "@/components/base/Table";


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
  if (!companies || companies.length === 0) return null;
  const main = companies.find((c) => c.id === mainCompanyId);
  const others = companies.filter((c) => c.id !== mainCompanyId);
  const [modalCompany, setModalCompany] = useState<Company | null>(null);

  const handleSetAsMain = () => {
    if (!modalCompany) return;

    if (modalCompany.id === mainCompanyId) {
      setModalCompany(null);
      return;
    }

    api.patch(`/companies/groups/${groupId}/`, {
      main_company: modalCompany.id,
    })
      .then(() => {
        onUpdateMainCompany();
        toast.success(`Empresa ${modalCompany.name} definida como principal do grupo`)
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

  const rows = [
    ...(main?.id !== undefined
      ? [{
        key: main.id,
        onClick: () => onSelect(main),
        columns: [
          <>
            {main.name}
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-600 text-white">
              Principal
            </span>
          </>,
          main.fantasy_name,
          formatCNPJ(main.cnpj),
          main.full_address,
          main.benner_code,
          <div />,
        ],
      }]
      : []),
    ...others
      .filter((c) => c.id !== undefined)
      .map((c) => ({
        key: c.id!,
        onClick: () => onSelect(c),
        columns: [
          c.name,
          c.fantasy_name,
          formatCNPJ(c.cnpj),
          c.full_address,
          c.benner_code,
          <Button
            rounded
            variant="inverted"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setModalCompany(c);
            }}
          >
            Tornar principal
          </Button>,
        ],
      })),
  ];

  return (
    <>
      <Table
        headers={["Razão social", "Fantasia", "CNPJ", "Endereço Completo", "Código Backoffice", ""]}
        rows={rows}
      />

      <ConfirmModal
        title="Definir como principal"
        message={`Deseja realmente tornar "${modalCompany?.name}" como empresa principal do grupo?`}
        isOpen={modalCompany !== null}
        onConfirm={handleSetAsMain}
        onCancel={() => setModalCompany(null)}
        cancelLabel="Não"
      />
    </>
  );
}
