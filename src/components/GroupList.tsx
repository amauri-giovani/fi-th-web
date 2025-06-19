import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Group } from '../types/company';

type Props = {
  onSelect: (group: Group) => void;
};

export function GroupList({ onSelect }: Props) {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    api.get<Group[]>('/companies/groups/')
      .then(res => setGroups(res.data))
      .catch(err => console.error('Erro ao carregar grupos:', err));
  }, []);

  return (
    <div>
      <h2>Grupos</h2>
      <ul>
        {groups.map(group => (
          <li key={group.id} style={{ marginBottom: '1rem' }}>
            <button onClick={() => onSelect(group)}>
              {group.name}
            </button>
            {group.main_company_name ? (
              <p style={{ margin: 0 }}>Empresa principal: <strong>{group.main_company_name}</strong></p>
            ) : (
              <p style={{ margin: 0, fontStyle: 'italic' }}>Sem empresa principal</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
