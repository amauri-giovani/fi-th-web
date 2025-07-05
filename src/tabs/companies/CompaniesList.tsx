import { useEffect, useState } from "react";
import type { Company } from "@/types/company";
import type { Group } from "@/types/group";
import Button from "@/components/base/Button";
import ConfirmModal from "@/components/base/ConfirmModal";
import { api } from "@/services/api";
import { toast } from "react-toastify";
import Table from "@/components/base/Table";
import SearchInput from "@/components/base/SearchInput";


type Props = {
  companies: Company[];
  mainCompanyId: number | null;
  groupId: number;
  onSelect: (company: Company) => void;
  onUpdateMainCompany: (updatedGroup: Group) => void;
};

export default function CompaniesList({
  companies,
  mainCompanyId,
  groupId,
  onSelect,
  onUpdateMainCompany,
}: Props) {
  if (!companies || companies.length === 0) return null;
  const [modalCompany, setModalCompany] = useState<Company | null>(null);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>(companies);
  const main = filteredCompanies.find((c) => c.id === mainCompanyId);
  const others = filteredCompanies.filter((c) => c.id !== mainCompanyId);

  useEffect(() => {
    setFilteredCompanies(companies);
  }, [companies]);

  function handleSearch(term: string) {
    const lower = term.toLowerCase();

    const filtered = companies.filter((c) =>
      (c.name || "").toLowerCase().includes(lower) ||
      (c.fantasy_name || "").toLowerCase().includes(lower) ||
      (c.cnpj || "").toLowerCase().includes(lower) ||
      (c.benner_code || "").toLowerCase().includes(lower)
    );

    setFilteredCompanies(filtered);
  }

  const handleSetAsMain = async () => {
    if (!modalCompany) return;

    if (modalCompany.id === mainCompanyId) {
      toast.info("Esta empresa já é a principal do grupo.");
      setModalCompany(null);
      return;
    }

    try {
      const res = await api.patch(`/groups/${groupId}/`, {
        main_company_id: modalCompany.id,
      });
      onUpdateMainCompany?.(res.data);
      toast.success(`Empresa ${modalCompany.name} definida como principal do grupo`);
    } catch (err) {
      console.error("Erro ao trocar principal:", err);
      toast.error("Erro ao trocar empresa principal");
    } finally {
      setModalCompany(null);
    }
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
      <div className="mb-4" style={{ width: "500px" }}>
        <SearchInput onSearch={handleSearch} />
      </div>

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
