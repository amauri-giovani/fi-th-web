import Table from "@/components/base/Table";
import type { Agreement } from "@/types/agreement";
import { useState, useEffect } from "react";
import SearchInput from "@/components/base/SearchInput";
import Button from "@/components/base/Button";


type Props = {
  agreements: Agreement[];
  onSelect: (agreement: Agreement) => void;
  onCreate: (productTypeId: number) => void;
};

const SECTIONS = [
  { slug: "aereo", title: "Companhias aéreas", id: 1 },
  { slug: "hotel", title: "Hotéis", id: 3 },
  { slug: "veiculo", title: "Locadoras", id: 2 },
];

export default function AgreementList({ agreements, onSelect, onCreate }: Props) {
  const [filtered, setFiltered] = useState<Agreement[]>(agreements);

  useEffect(() => {
    setFiltered(agreements);
  }, [agreements]);

  function handleSearch(term: string) {
    const lower = term.toLowerCase();
    const filteredData = agreements.filter((a) =>
      a.provider.name.toLowerCase().includes(lower) ||
      a.code.toLowerCase().includes(lower) ||
      (a.notes || "").toLowerCase().includes(lower)
    );
    setFiltered(filteredData);
  }

  return (
    <div>
      <div className="mb-4" style={{ width: "500px" }}>
        <SearchInput onSearch={handleSearch} />
      </div>

      {SECTIONS.map(({ slug, title, id }) => {
        const items = filtered.filter((a) => a.product_type.slug === slug);

        const rows = items.map((a) => ({
          key: a.id,
          onClick: () => onSelect(a),
          columns: [
            <div className="truncate" title={a.provider.name}>{a.provider.name}</div>,
            <div className="truncate" title={a.code}>{a.code}</div>,
            a.expiration_date,
            <div className="truncate" title={a.notes}>{a.notes || "-"}</div>,
            <div className="flex justify-end gap-2">
              <button>✏️</button>
              <button>👁️</button>
            </div>,
          ],
        }));

        return (
          <div key={slug} className="mb-10 bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{title}</h3>
              <Button
                rounded
                onClick={() =>
                  onCreate(id)
                }
              >
                Adicionar acordo
              </Button>
            </div>

            <Table
              headers={["Provedor", "Código de acordo", "Vencimento de acordo", "Observações", ""]}
              rows={rows}
              columnClasses={[
                "w-[15%]",
                "w-[15%]",
                "w-[15%]",
                "w-auto pr-12",
                "w-[40px] text-right",
              ]}
            />

            {rows.length === 0 && (
              <p className="text-sm text-gray-500 italic mt-2">
                Nenhum acordo encontrado.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
