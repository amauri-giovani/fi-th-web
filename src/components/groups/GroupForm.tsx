import { useState } from "react";
import Input from "@/components/base/Input";
import Button from "@/components/base/Button";
import { createGroup } from "@/services/groupService";
import { toast } from "react-toastify";


interface Props {
  onCancel: () => void;
  onSuccess: (group: { id: number; name: string }) => void;
}


export default function GroupForm({ onCancel, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    setLoading(true);
    try {
      const group = await createGroup(trimmed);
      onSuccess(group);
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Erro ao criar grupo. Tente novamente.";
      console.error("Erro ao criar grupo:", err);
      toast.error(msg);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4 mb-6 shadow-sm">
      <div className="grid gap-4 mb-4">
        <Input
          placeholder="Nome do grupo"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setHasError(false);
          }}
          disabled={loading}
          hasError={hasError}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={loading || !name.trim()}>
          {loading ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </div>
  );
}
