import { useEffect, useState } from "react";
import { api } from "@/services/api";
import type { Group } from "@/types/group";
import Input from "@/components/base/Input";
import Button from "@/components/base/Button";
import SmartSelectField from "@/components/base/SmartSelectField";
import { MaskedInput } from "@/components/base/MaskedInput";
import { toast } from "react-toastify";
import { dateToString, stringToDate } from "@/utils/date";


type Props = {
  group?: Group;
  groupId?: number;
  onCancelCreate?: () => void;
  onSuccess?: (group: Group) => void;
};

export function GroupForm({ groupId, group: initialGroup, onCancelCreate, onSuccess }: Props) {
  const [group, setGroup] = useState<Group | null>(() =>
    initialGroup
      ? { ...initialGroup, go_live: dateToString(initialGroup.go_live) }
      : groupId
        ? null
        : {
          id: 0,
          name: "",
          go_live: "",
          main_company: { id: 0, name: "", cnpj: "" },
          point_of_sale: null,
          account_executive: { id: 0, name: "" },
          companies: [],
          contracts_status: "",
          segment: "",
          obt_link: "",
          website: "",
          notes: ""
        }
  );

  const [editMode, setEditMode] = useState(() => !initialGroup);
  const [formContext, setFormContext] = useState<{
    point_of_sale_options: { id: number; name: string }[];
    account_executive_options: { id: number; name: string }[];
  }>({ point_of_sale_options: [], account_executive_options: [] });

  const currentPointOfSaleOption = group?.point_of_sale?.id
    ? [{ id: group.point_of_sale.id, name: group.point_of_sale.name }]
    : [];

  const currentAccountExecutiveOption = group?.account_executive?.id
    ? [{ id: group.account_executive.id, name: group.account_executive.name }]
    : [];

  useEffect(() => {
    if (!editMode) return;

    api
      .get("/catalogs/form-context/?fields=point_of_sale,account_executive")
      .then((res) => {
        setFormContext(res.data);
      })
      .catch((err) => {
        console.error("Erro ao carregar opções:", err);
        toast.error("Erro ao carregar opções do formulário.");
      });
  }, [editMode]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setGroup((prev) => prev ? { ...prev, [name]: value } : prev);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!group) return;

    const validId = (val: any): number | null =>
      val != null && Number(val) > 0 ? Number(val) : null;

    const payload: any = {
      ...group,
      go_live: stringToDate(group.go_live),
      point_of_sale_id: validId(group.point_of_sale?.id),
      account_executive_id: validId(group.account_executive?.id),
      main_company_id: validId(group.main_company?.id),
    };

    const request = groupId
      ? api.patch(`/groups/${groupId}/`, payload)
      : api.post("/groups/", payload);

    request
      .then((res) => {
        const saved = { ...res.data, go_live: dateToString(res.data.go_live) };
        setGroup(saved);
        setEditMode(false);
        toast.success(groupId ? "Grupo atualizado com sucesso!" : "Grupo criado com sucesso!");
        onSuccess?.(saved);
      })
      .catch((err) => {
        toast.error("Erro ao salvar grupo.");
        console.error("Erro ao salvar grupo:", err);
      });
  }

  function handleCancel() {
    if (initialGroup) {
      setGroup({
        ...initialGroup,
        go_live: dateToString(initialGroup.go_live),
      });
      setEditMode(false);
    } else {
      onCancelCreate?.();
    }
  }

  if (!group) return <p>Carregando...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Nome do Grupo"
          name="name"
          value={group.name}
          onChange={handleChange}
          disabled={!editMode}
        />

        <div>
          <label>Go Live</label>
          <MaskedInput
            name="go_live"
            value={group.go_live}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>

        <SmartSelectField
          label="Ponto de Venda"
          name="point_of_sale"
          value={group.point_of_sale?.id ?? null}
          onChange={({ name, value }) =>
            setGroup((prev) => prev ? { ...prev, [name]: { id: value, name: "" } } : prev)
          }
          options={editMode ? formContext.point_of_sale_options : currentPointOfSaleOption}
          disabled={!editMode}
        />

        <SmartSelectField
          label="Executivo de contas"
          name="account_executive"
          value={group.account_executive?.id ?? null}
          onChange={({ name, value }) =>
            setGroup((prev) => prev ? { ...prev, [name]: { id: value, name: "" } } : prev)
          }
          options={editMode ? formContext.account_executive_options : currentAccountExecutiveOption}
          disabled={!editMode}
          allowCreate={false}
        />

        <Input
          label="Segmento"
          name="segment"
          value={group.segment}
          onChange={handleChange}
          disabled={!editMode}
        />

        <Input
          label="Link OBT"
          name="obt_link"
          value={group.obt_link}
          onChange={handleChange}
          disabled={!editMode}
        />

      </div>

      <div className="flex gap-4 mt-6">
        {editMode ? (
          <>
            <Button type="submit" rounded>Salvar</Button>
            <Button variant="outline" rounded onClick={handleCancel}>Cancelar</Button>
          </>
        ) : (
          <Button rounded onClick={(e) => { e.preventDefault(); setEditMode(true); }}>Editar</Button>
        )}
      </div>
    </form>
  );
}
