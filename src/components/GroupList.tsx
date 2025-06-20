import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Group } from "../types/company";
import { useNavigate } from "react-router-dom";


export function GroupList({ onSelect }: Props) {
  const [groups, setGroups] = useState<Group[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get<Group[]>("/companies/groups/")
      .then((res) => setGroups(res.data))
      .catch((err) => console.error("Erro ao carregar grupos:", err));
  }, []);

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Grupos cadastrados</h2>
        <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition">
          Add novo grupo
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => (
          <button
            key={group.id}
            onClick={() => navigate(`/companies/groups/${group.id}`)}
            className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 text-left hover:shadow-md transition"
          >
            <h3 className="text-lg font-medium text-primary mb-1">{group.name}</h3>
            {group.main_company_name ? (
              <p className="text-sm text-gray-700">
                Empresa principal:{" "}
                <span className="font-semibold">{group.main_company_name}</span>
              </p>
            ) : (
              <p className="text-sm text-gray-500 italic">Sem empresa principal</p>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
