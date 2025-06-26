import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Company } from '../types/company';
import { CompanyField } from './CompanyField';
import { TravelManagerForm } from './TravelManagerForm';
import { format, parseISO, parse } from 'date-fns';
import SmartSelectField from './base/SmartSelectField';
import { MaskedInput } from './base/MaskedInput';
import Button from './base/Button';
import ConfirmModal from './base/ConfirmModal';
import { toast } from "react-toastify";


type Props = {
	companyId?: number;
	groupId: number;
	onCancelCreate?: () => void;
	onSuccess?: (company: Company) => void;
};

export function CompanyForm({ companyId, groupId, onCancelCreate, onSuccess }: Props) {
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
					slug: ''
				},
				travel_managers: [],
				account_executive: {
					id: 0,
					name: ""
				},
				current_contract: {
					expiration_date: ""
				}
			}
	);

	const [editMode, setEditMode] = useState(companyId ? false : true);
	const [addingNewContact, setAddingNewContact] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [newCompanyId, setnewCompanyId] = useState<number | null>(null);

	useEffect(() => {
		if (!companyId) return;

		api.get<Company>(`companies/companies/${companyId}/`)
			.then(res => {
				const data = res.data;
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
		if (!dateBr || dateBr.trim() === '') return '';

		let parsed;

		if (/^\d{8}$/.test(dateBr)) {
			const day = dateBr.slice(0, 2);
			const month = dateBr.slice(2, 4);
			const year = dateBr.slice(4, 8);
			parsed = new Date(`${year}-${month}-${day}`);
		} else {
			parsed = parse(dateBr, 'dd/MM/yyyy', new Date());
		}

		if (isNaN(parsed.getTime())) return '';

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
			group_id: company.group?.id ?? groupId,
			point_of_sale_id: company.point_of_sale?.id ?? null,
			go_live: stringToDate(company.go_live),
		};

		delete payload.point_of_sale;
		delete payload.travel_managers;

		const request = company.id
			? api.put(`companies/companies/${company.id}/`, payload)
			: api.post('companies/companies/', payload);

		request
			.then((res) => {
				const newCompany = res.data;
				setCompany(newCompany);
				setEditMode(false);

				if (!companyId) {
					api.get(`/companies/groups/${groupId}/`).then((groupRes) => {
						if (!groupRes.data.main_company) {
							setnewCompanyId(newCompany.id);
							setShowConfirmModal(true);
						} else {
							onSuccess?.(newCompany);
						}
					});
				} else {
					onSuccess?.(newCompany);
				}
			})
			.catch((err) => {
				const msg = err.response?.data?.detail || "Erro ao salvar empresa. Tente novamente.";
				toast.error(msg);
			});
	}

	function handleSetAsMainCompany() {
		if (!newCompanyId) {
			return;
		}
		api
			.patch(`/companies/groups/${groupId}/`, { main_company: newCompanyId })
			.then(() => {
				onSuccess?.(company!);
				console.log("Empresa definida como principal com sucesso");
				toast.success("Empresa definida como principal com sucesso");
			})
			.catch((err) => {
				console.error("Erro ao definir empresa como principal:", err);
				toast.error("Erro ao definir empresa como principal:");
			})
			.finally(() => {
				setnewCompanyId(null);
				setShowConfirmModal(false);
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
						createFieldName="name"
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
						<label>Go Live</label>
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
							<Button type="submit" rounded>Salvar</Button>
							<Button variant="outline" rounded onClick={handleCancel}>Cancelar</Button>
						</>
					) : (
						<>
							<Button rounded onClick={(e) => { e.preventDefault(); setEditMode(true); }}>Editar</Button>
						</>
					)}
				</div>
			</form>

			{company.id && (
				<div className="mt-12 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">

					<div className="flex justify-between items-center mb-4">
						<h3 className="text-md font-semibold text-gray-800">Gestores de Viagem</h3>
						{!addingNewContact && company.id && (
							<Button rounded onClick={() => setAddingNewContact(true)}>Novo gestor de viagem</Button>
						)}
					</div>

					<div className="space-y-4">
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
					</div>
				</div>
			)}
			<ConfirmModal
				title="Definir como principal"
				message={`Deseja realmente tornar "${company.name}" a empresa principal do grupo?`}
				isOpen={showConfirmModal}
				onConfirm={handleSetAsMainCompany}
				onCancel={() => {
					setShowConfirmModal(false);
					setnewCompanyId(null);
					onSuccess?.(company!);
				}}
			/>
		</>
	);
}
