import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Company, CompanyContact } from '../types/company';
import { CompanyField } from './CompanyField';
import { TravelManagerForm } from './TravelManagerForm';


type Props = {
    companyId: number;
    groupId: number;
};


export function CompanyForm({ companyId, groupId }: Props) {
    const [company, setCompany] = useState<Company | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [showTravelModal, setShowTravelModal] = useState(false);
    const [selectedContact, setSelectedContact] = useState<CompanyContact | null>(null);

    useEffect(() => {
        api.get<Company>(`companies/companies/${companyId}/`)
            .then(res => setCompany(res.data))
            .catch(err => console.error('Erro ao carregar empresa:', err));
    }, []);

    function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;
        setCompany(prev => prev ? { ...prev, [name]: value } : prev);
    }

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        if (!company) return;

        api.put(`companies/companies/${company.id}/`, { ...company, group_id: groupId })
            .then(() => setEditMode(false))
            .catch(err => console.error('Erro ao salvar empresa:', err));
    }

    function enableEditing(event: React.FormEvent) {
        event.preventDefault();
        setEditMode(true);
    }

    function handleCancel() {
        api.get<Company>(`companies/companies/${companyId}/`)
            .then(res => {
                setCompany(res.data);
                setEditMode(false);
            })
            .catch(err => console.error('Erro ao cancelar edição:', err));
    }

    function handleSubmitTravelManager(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);

        const payload = {
            name: data.get("name"),
            role: data.get("role"),
            phone: data.get("phone"),
            mobile: data.get("mobile"),
            whatsapp: data.get("whatsapp"),
            email: data.get("email"),
            is_travel_manager: true,
            company: company?.id,
        };

        const endpoint = selectedContact
            ? `companies/company-contacts/${selectedContact.id}/`
            : "companies/company-contacts/";

        const method = selectedContact ? api.put : api.post;

        method(endpoint, payload)
            .then(() => {
                setShowTravelModal(false);
                setSelectedContact(null);
                return api.get<Company>(`companies/companies/${companyId}/`);
            })
            .then(res => setCompany(res.data))
            .catch(err => console.error("Erro ao salvar contato:", err));
    }

    if (!company) return <p>Carregando...</p>;

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h2>Cadastro do Cliente</h2>

                <CompanyField label="Razão Social" name="name" value={company.name} onChange={handleChange} disabled={!editMode} />
                <CompanyField label="Nome Fantasia" name="fantasy_name" value={company.fantasy_name} onChange={handleChange} disabled={!editMode} />
                <CompanyField label="CNPJ" name="cnpj" value={company.cnpj} onChange={handleChange} disabled={!editMode} />
                <CompanyField label="Endereço Completo" name="full_address" value={company.full_address} onChange={handleChange} disabled={!editMode} />
                <CompanyField label="Segmento" name="segment" value={company.segment} onChange={handleChange} disabled={!editMode} />
                <CompanyField label="Código Benner" name="benner_code" value={company.benner_code} onChange={handleChange} disabled={!editMode} />
                <CompanyField label="Link do OBT" name="obt_link" value={company.obt_link} onChange={handleChange} disabled={!editMode} />
                <CompanyField label="Site" name="website" value={company.website || ''} onChange={handleChange} disabled={!editMode} />
                <CompanyField label="Observações" name="notes" value={company.notes || ''} onChange={handleChange} disabled={!editMode} multiline />

                <div style={{ marginTop: '1rem' }}>
                    {editMode ? (
                        <>
                            <button type="submit">Salvar</button>
                            <button type="button" onClick={handleCancel}>Cancelar</button>
                        </>
                    ) : (
                        <button type="button" onClick={enableEditing}>Editar</button>
                    )}
                </div>
            </form>

            <div style={{ marginTop: '2rem' }}>
                <h3>Gestores de Viagem</h3>

                {company.travel_managers.length > 0 ? (
                    company.travel_managers.map((contact) => (
                        <TravelManagerForm
                            key={contact.id}
                            contact={contact}
                            companyId={company.id}
                            onUpdate={() =>
                                api.get<Company>(`companies/companies/${companyId}/`)
                                    .then(res => setCompany(res.data))
                            }
                        />
                    ))
                ) : (
                    <p>Nenhum gestor de viagem cadastrado.</p>
                )}

                <button type="button" onClick={() => setShowTravelModal(true)}>
                    Novo gestor de viagem
                </button>
            </div>

            {showTravelModal && (
                <div style={{ background: '#00000088', padding: '1rem' }}>
                    <h4>Novo Gestor de Viagem</h4>
                    <TravelManagerForm
                        companyId={company.id}
                        onUpdate={() => api.get<Company>(`companies/companies/${companyId}/`).then(res => setCompany(res.data))}
                        onClose={() => setShowTravelModal(false)}
                    />
                </div>
            )}
        </>
    );
}
