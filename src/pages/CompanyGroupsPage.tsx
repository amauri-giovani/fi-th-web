import { useState } from 'react';
import { GroupList } from '../components/GroupList';
import { CompanyForm } from '../components/CompanyForm';
import type { Group } from '../types/company';

export function CompanyGroupsPage() {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  return (
    <div>
      {!selectedGroup ? (
        <GroupList onSelect={setSelectedGroup} />
      ) : selectedGroup.main_company ? (
        <CompanyForm
          companyId={selectedGroup.main_company}
          groupId={selectedGroup.id}
        />

      ) : (
        <div>
          <p>Este grupo ainda não tem uma empresa principal.</p>
          <button>Adicionar empresa principal</button>
        </div>
      )}
    </div>
  );
}
