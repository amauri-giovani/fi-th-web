import { useEffect, useState } from "react";
import { api } from "../../services/api";
import type { Group } from "../../types/company";
import { useNavigate } from "react-router-dom";
import GroupForm from "@/components/groups/GroupForm";
import { toast } from "react-toastify";


export function GroupList() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const navigate = useNavigate();

  const fetchGroups = () => {
    api
      .get<Group[]>("/companies/groups/")
      .then((res) => setGroups(res.data))
      .catch((err) => console.error("Erro ao carregar grupos:", err));
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Grupos cadastrados</h2>
        <button
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition"
          onClick={() => setShowGroupForm(true)}
        >
          + Novo grupo
        </button>
      </div>

      {showGroupForm && (
        <GroupForm
          onCancel={() => setShowGroupForm(false)}
          onSuccess={() => {
            setShowGroupForm(false);
            fetchGroups();
            toast.success("Grupo criado com sucesso!");
          }}
        />
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-200 text-gray-600 font-medium">
            <tr>
              <th className="px-4 py-3">Grupos</th>
              <th className="px-4 py-3">CNPJ</th>
              <th className="px-4 py-3">Posto de venda</th>
              <th className="px-4 py-3">Vencimento de contrato</th>
              <th className="px-4 py-3">Executivo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {groups.map((group) => (
              <tr
                key={group.id}
                onClick={() => navigate(`/companies/groups/${group.id}`)}
                className="cursor-pointer odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
              >
                <td className="px-4 py-3 text-primary font-medium">{group.name}</td>
                <td className="px-4 py-3">{group.main_company?.cnpj || "—"}</td>
                <td className="px-4 py-3">{group.main_company?.point_of_sale || "—"}</td>
                <td className="px-4 py-3">{group.main_company?.contract_expiration || "—"}</td>
                <td className="px-4 py-3">{group.main_company?.executive || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
