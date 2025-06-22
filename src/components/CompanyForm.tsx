import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Company } from '../types/company';
import { CompanyField } from './CompanyField';
import { TravelManagerForm } from './TravelManagerForm';
import { format, parseISO, parse } from 'date-fns'


type Props = {
	companyId: number;
	groupId: number;
};

export function CompanyForm({ companyId, groupId }: Props) {
	const [company, setCompany] = useState<Company | null>(null);
	const [editMode, setEditMode] = useState(false);
	const [addingNewContact, setAddingNewContact] = useState(false);

	useEffect(() => {
		api.get<Company>(`companies/companies/${companyId}/`)
			.then(res => setCompany(res.data))
			.catch(err => console.error('Erro ao carregar empresa:', err));
	}, []);

	function dateToString(isoDate: string) {
		return format(parseISO(isoDate), 'dd/MM/yyyy')
	}

	function stringToDate(dateBr: string): string {
		const parsed = parse(dateBr, 'dd/MM/yyyy', new Date())
		return format(parsed, 'yyyy-MM-dd')
	}

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

	if (!company) return <p>Carregando...</p>;

	return (
		<>
			<form onSubmit={handleSubmit}>
				<h2 className="text-lg font-semibold text-gray-800 mb-4">Informações Gerais</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					<CompanyField label="Razão Social" name="name" value={company.name} onChange={handleChange} disabled={!editMode} />
					<CompanyField label="Nome Fantasia" name="fantasy_name" value={company.fantasy_name} onChange={handleChange} disabled={!editMode} />
					<CompanyField label="CNPJ" name="cnpj" value={company.cnpj} onChange={handleChange} disabled={!editMode} />
					<CompanyField label="Ponto de Venda" name="point_of_sale" value={company.point_of_sale.name} disabled={!editMode} />
					{/* <EntitySelectField label="Ponto de Venda" field="point_of_sale" value={company.point_of_sale?.id ?? null} onChangeEntity={setCompany} disabled={!editMode} /> */}
					<CompanyField label="Código Benner" name="benner_code" value={company.benner_code} onChange={handleChange} disabled={!editMode} />
					<CompanyField label="Go Live" name="go_live" value={dateToString(company.go_live)} disabled={!editMode} />
					<CompanyField label="Segmento" name="segment" value={company.segment} onChange={handleChange} disabled={!editMode} />
					<CompanyField label="Link do OBT" name="obt_link" value={company.obt_link} onChange={handleChange} disabled={!editMode} />
					<CompanyField label="Site" name="website" value={company.website || ''} onChange={handleChange} disabled={!editMode} />
					<div className="lg:col-span-3 md:col-span-2 col-span-1">
						<CompanyField label="Endereço Completo" name="full_address" value={company.full_address} onChange={handleChange} disabled={!editMode} />
					</div>
					<div className="lg:col-span-3 md:col-span-2 col-span-1">
						<CompanyField label="Observações" name="notes" value={company.notes || ''} onChange={handleChange} disabled={!editMode} multiline />
					</div>
				</div>

				<div className="mt-6 flex gap-4">
					{editMode ? (
						<>
							<button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition">Salvar</button>
							<button type="button" onClick={handleCancel} className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 transition">Cancelar</button>
						</>
					) : (
						<button type="button" onClick={enableEditing} className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition">Editar</button>
					)}
				</div>
			</form>

			{/* Seção de gestores de viagem */}
			<div className="mt-12 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
				<h3 className="text-md font-semibold text-gray-800 mb-4">Gestores de Viagem</h3>

				<div className="space-y-4">
					{company.travel_managers.length > 0 ? (
						company.travel_managers.map((contact) => (
							<TravelManagerForm
								key={contact.id}
								contact={contact}
								companyId={company.id}
								onUpdate={() =>
									api.get<Company>(`companies/companies/${companyId}/`).then(res => setCompany(res.data))
								}
							/>
						))
					) : (
						<p className="text-sm text-gray-500 italic">Nenhum gestor de viagem cadastrado.</p>
					)}

					{/* Novo gestor inline controlado por state */}
					{addingNewContact && (
						<TravelManagerForm
							companyId={company.id}
							onUpdate={() =>
								api.get<Company>(`companies/companies/${companyId}/`).then(res => {
									setCompany(res.data);
									setAddingNewContact(false);
								})
							}
							onClose={() => setAddingNewContact(false)}
						/>
					)}
				</div>

				{!addingNewContact && (
					<div className="mt-6">
						<button
							type="button"
							onClick={() => setAddingNewContact(true)}
							className="bg-purple-800 text-white px-6 py-2 rounded-full hover:bg-purple-900 transition"
						>
							Novo gestor de viagem
						</button>
					</div>
				)}
			</div>
		</>
	);
}
