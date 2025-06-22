import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Company } from '../types/company';
import { CompanyField } from './CompanyField';
import { TravelManagerForm } from './TravelManagerForm';
import { format, parseISO, parse } from 'date-fns';
import SmartSelectField from './base/SmartSelectField';
import { MaskedInput } from './base/MaskedInput';


type Props = {
	companyId?: number;
	groupId: number;
	onCancelCreate?: () => void;
};

export function CompanyForm({ companyId, groupId, onCancelCreate }: Props) {
	const [company, setCompany] = useState<Company | null>(() =>
		companyId
			? null
			: {
				id: undefined,
				name: '',
				fantasy_name: '',
				cnpj: '',
				full_address: '',
				segment: '',
				benner_code: '',
				obt_link: '',
				website: '',
				notes: '',
				go_live: '',
				point_of_sale: null,
				group: {
					id: groupId,
					name: '',
					slug: '',
				},
				travel_managers: [],
			}
	);

	const [editMode, setEditMode] = useState(companyId ? false : true);
	const [addingNewContact, setAddingNewContact] = useState(false);

	useEffect(() => {
		if (!companyId) return;

		api.get<Company>(`companies/companies/${companyId}/`)
			.then(res => {
				const data = res.data;

				// ⚠️ Corrigir aqui
				data.go_live = dateToString(data.go_live);
				setCompany(data);
			})
			.catch(err => console.error('Erro ao carregar empresa:', err));
	}, [companyId]);

	function dateToString(isoDate?: string) {
		if (!isoDate || isNaN(Date.parse(isoDate))) return '';
		return format(parseISO(isoDate), 'dd/MM/yyyy');
	}

	function stringToDate(dateBr: string): string {
		console.log("dateBr =", dateBr)
		if (!dateBr || dateBr.trim() === '') {
			return ''; // ou null, dependendo do que a API aceita
		}

		const parsed = parse(dateBr, 'dd/MM/yyyy', new Date());
		console.log("parsed_dateBr =", parsed)

		// Verifica se a data é válida antes de formatar
		if (isNaN(parsed.getTime())) {
			return '';
		}

		return format(parsed, 'yyyy-MM-dd');
	}

	function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		const { name, value } = event.target;
		setCompany((prev) => (prev ? { ...prev, [name]: value } : prev));
	}

	function handleSubmit(event: React.FormEvent) {
		event.preventDefault();
		if (!company) return;
		const payload: any = {
			...company,
			group: company.group?.id ?? groupId,
			point_of_sale_id: company.point_of_sale?.id ?? null,
			go_live: stringToDate(company.go_live),
		};

		delete payload.point_of_sale;
		delete payload.travel_managers;

		console.log('Payload final:', payload);

		const request = company.id
			? api.put(`companies/companies/${company.id}/`, payload)
			: api.post('companies/companies/', payload);

		request
			.then((res) => {
				setCompany(res.data);
				setEditMode(false);
			})
			.catch((err) => {
				console.error('Erro ao salvar empresa:', err);
				// Aqui você pode fazer um toast ou alert amigável
			});
	}

	function handleCancel() {
		if (companyId) {
			api
				.get<Company>(`companies/companies/${companyId}/`)
				.then((res) => {
					setCompany(res.data);
					setEditMode(false);
				});
		} else {
			onCancelCreate?.();
		}
	}

	if (!company) return <p>Carregando...</p>;

	return (
		<>
			<form onSubmit={handleSubmit}>
				<h2 className="text-lg font-semibold text-gray-800 mb-4">
					Informações Gerais {company.group?.name && <span className="text-sm text-gray-500">({company.group.name})</span>}
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					<CompanyField label="Razão Social" name="name" value={company.name} onChange={handleChange} disabled={!editMode} />
					<CompanyField label="Nome Fantasia" name="fantasy_name" value={company.fantasy_name} onChange={handleChange} disabled={!editMode} />
					<CompanyField label="CNPJ" name="cnpj" value={company.cnpj} onChange={handleChange} disabled={!editMode} />
					<SmartSelectField
						name="point_of_sale"
						label="Ponto de Venda"
						value={company.point_of_sale?.id ?? null}
						onChange={({ name, value }) =>
							setCompany((prev) =>
								prev ? { ...prev, [name]: { id: value, name: '' } } : prev
							)
						}
						disabled={!editMode}
					/>
					<CompanyField label="Código Benner" name="benner_code" value={company.benner_code} onChange={handleChange} disabled={!editMode} />
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Go Live</label>
						<MaskedInput
							name="go_live"
							value={company.go_live}
							onChange={handleChange}
							disabled={!editMode}
						/>
					</div>
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
						<button
							type="button"
							onClick={(e) => {
								e.preventDefault();
								setEditMode(true);
							}}
							className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition"
						>
							Editar
						</button>
					)}
				</div>
			</form>

			{company.id && (
				<div className="mt-12 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
					<h3 className="text-md font-semibold text-gray-800 mb-4">Gestores de Viagem</h3>
					<div className="space-y-4">
						{company.travel_managers.length > 0 ? (
							company.travel_managers.map((contact) => (
								<TravelManagerForm
									key={contact.id}
									contact={contact}
									companyId={company.id!}
									onUpdate={() =>
										api.get<Company>(`companies/companies/${company.id}/`).then((res) => setCompany(res.data))
									}
								/>
							))
						) : (
							<p className="text-sm text-gray-500 italic">Nenhum gestor de viagem cadastrado.</p>
						)}

						{addingNewContact && (
							<TravelManagerForm
								companyId={company.id!}
								onUpdate={() =>
									api.get<Company>(`companies/companies/${company.id}/`).then((res) => {
										setCompany(res.data);
										setAddingNewContact(false);
									})
								}
								onClose={() => setAddingNewContact(false)}
							/>
						)}
					</div>

					{!addingNewContact && company.id && (
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
			)}
		</>
	);
}
