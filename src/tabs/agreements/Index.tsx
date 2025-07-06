import { useState } from "react";
import type { Group } from "@/types/group";
import type { Agreement } from "@/types/agreement";
import AgreementList from "./AgreementList";
import AgreementForm from "@/components/AgreementForm";
import Button from "@/components/base/Button";
import { Undo2 } from "lucide-react";


type Props = {
  group: Group;
  onUpdate: () => void;
};

export default function AgreementsTab({ group, onUpdate }: Props) {
  const [selectedAgreement, setSelectedAgreement] = useState<Agreement | null>(null);
  const [newProductTypeId, setNewProductTypeId] = useState<number | null>(null);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-primary">Acordos</h2>

        {(selectedAgreement || newProductTypeId) && (
          <Button
            rounded
            variant="inverted"
            className="flex items-center"
            onClick={() => {
              setSelectedAgreement(null);
              setNewProductTypeId(null);
            }}
          >
            <Undo2 className="w-4 h-4 mr-2" />
            Voltar à lista de acordos
          </Button>
        )}
      </div>

      {selectedAgreement || newProductTypeId ? (
        <AgreementForm
          groupId={group.id}
          agreement={selectedAgreement || {
            id: 0,
            provider: { id: 0, name: "", slug: "" },
            product_type: { id: newProductTypeId!, name: "", slug: "" },
            code: "",
            expiration_date: "",
            notes: ""
          }}
          onCancel={() => {
            setSelectedAgreement(null);
            setNewProductTypeId(null);
          }}
          onSuccess={(a) => {
            setSelectedAgreement(null);
            setNewProductTypeId(null);
            onUpdate();
          }}
        />
      ) : (
        <AgreementList
          agreements={group.agreements}
          onSelect={setSelectedAgreement}
          onCreate={(id) => setNewProductTypeId(id)}
        />
      )}
    </div>
  );
}
