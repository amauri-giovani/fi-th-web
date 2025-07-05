import type { Group } from "@/types/group";
import { GroupForm } from "@/components/groups/GroupForm";

type Props = {
  group: Group;
  onUpdate?: (updated: Group) => void;
};

export default function GeneralTab({ group, onUpdate }: Props) {
  const hasCompanies = group.companies.length > 0;
  const hasMainCompany = Boolean(group.main_company?.id);

  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       const groupRes = await api.get<Group>(`/groups/${groupId}/`);
  //       setGroup(groupRes.data);
  //     } catch (error) {
  //       console.error("Erro ao carregar dados do grupo:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   useEffect(() => {
  //     if (groupId) fetchData();
  //   }, [groupId]);

  //   const [loading, setLoading] = useState(true);
  //   if (loading || !group) return <Loader />;

  return (
    <div className="space-y-6">
      <section className="border rounded-xl p-4 bg-white shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Informações do Grupo</h2>
        </div>

        <GroupForm
          group={group}
          onSuccess={(updated) => {
            onUpdate?.(updated);
          }}
          onCancelCreate={() => {
            onUpdate?.(group);
          }}
        />
      </section>

      {!hasCompanies ? (
        <p className="text-sm italic text-gray-500">
          Esse grupo ainda não possui empresas cadastradas. Crie uma empresa e atribua como principal.
        </p>
      ) : !hasMainCompany ? (
        <p className="text-sm italic text-gray-500">
          Esse grupo possui empresas, mas nenhuma definida como principal. Selecione uma para atribuir.
        </p>
      ) : (
        <div className="space-y-1 text-sm">
          <p>
            <strong>Empresa principal:</strong> {group.main_company.name}
          </p>
        </div>
      )}
    </div>
  );
}
