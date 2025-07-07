import { useState } from "react";
import type { Group } from "@/types/group";
import ContractList from "./ContractList";


interface Props {
  group: Group;
}

export default function ContractsTab({ group }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  function handleCreate() {
    setSelectedId(0);
  }

  function handleEdit(id: number) {
    setSelectedId(id);
  }

  return (
    <div className="space-y-4">
      <ContractList group={group} onCreate={handleCreate} onEdit={handleEdit} />
    </div>
  );
}
