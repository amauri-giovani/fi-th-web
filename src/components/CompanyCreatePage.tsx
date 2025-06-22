// src/pages/CompanyCreatePage.tsx
import { useSearchParams } from 'react-router-dom';
import { CompanyForm } from '../components/CompanyForm';


export function CompanyCreatePage() {
  const [searchParams] = useSearchParams();
  const groupId = Number(searchParams.get('group'));

  return <CompanyForm companyId={0} groupId={groupId} />;
}
