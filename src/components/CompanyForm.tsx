import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Company } from "../types/company";
import { CompanyField } from "./CompanyField";
import Button from "./base/Button";
import ConfirmModal from "./base/ConfirmModal";
import { toast } from "react-toastify";


type Props = {
	companyId?: number;
	groupId: number;
	onCancelCreate?: () => void;
	onSuccess?: (company: Company) => void;
};

export default function CompanyForm({ companyId, groupId, onCancelCreate, onSuccess }: Props) {
	const [company, setCompany] = useState<Company | null>(() =>
		companyId
			? null
			: {
				name: "",
				fantasy_name: "",
				cnpj: "",
				full_address: "",
				benner_code: "",
				notes: "",
				group: groupId,
				contracts: [],
			}
	);

	const [editMode, setEditMode] = useState(companyId ? false : true);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [newCompanyId, setnewCompanyId] = useState<number | null>(null);

	useEffect(() => {
		if (!companyId) return;

		api.get<Company>(`/companies/${companyId}/`)
			.then(res => {
				const data = res.data;
				setCompany(data);
			})
			.catch(err => console.error("Erro ao carregar empresa:", err));
	}, [companyId]);

	function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		const { name, value } = event.target;
		setCompany((prev) => (prev ? { ...prev, [name]: value } : prev));
	}

	function handleSubmit(event: React.FormEvent) {
		event.preventDefault();
		if (!company) return;
		const payload: any = {
			...company,
			group_id: typeof company.group === "object" && company.group !== null
				? company.group.id
				: groupId
		};

		delete payload.travel_managers;

		const request = company.id
			? api.put(`companies/${company.id}/`, payload)
			: api.post("companies/", payload);

		request
			.then((res) => {
				const newCompany = {
					...res.data
				};
				setCompany(newCompany);
				setEditMode(false);

				if (!companyId) {
					api.get(`/groups/${groupId}/`).then((groupRes) => {
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
			.patch(`/groups/${groupId}/`, { main_company: newCompanyId })
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
			api.get<Company>(`companies/${companyId}/`)
				.then((res) => {
					const data = res.data;
					setCompany(data);
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
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					<CompanyField label="CNPJ" name="cnpj" value={company.cnpj} onChange={handleChange} disabled={!editMode} />
					<CompanyField label="Razão Social" name="name" value={company.name} onChange={handleChange} disabled={!editMode} />
					<CompanyField label="Nome Fantasia" name="fantasy_name" value={company.fantasy_name} onChange={handleChange} disabled={!editMode} />
					<CompanyField label="Código Benner" name="benner_code" value={company.benner_code} onChange={handleChange} disabled={!editMode} />
					<div className="lg:col-span-4 md:col-span-2 col-span-1">
						<CompanyField label="Endereço Completo" name="full_address" value={company.full_address} onChange={handleChange} disabled={!editMode} />
					</div>
					<div className="lg:col-span-4 md:col-span-2 col-span-1">
						<CompanyField label="Observações" name="notes" value={company.notes || ""} onChange={handleChange} disabled={!editMode} multiline />
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

			<ConfirmModal
				title="Definir como principal"
				message={`Deseja tornar "${company.name}" como empresa principal do grupo?`}
				isOpen={showConfirmModal}
				onConfirm={handleSetAsMainCompany}
				onCancel={() => {
					setShowConfirmModal(false);
					setnewCompanyId(null);
					onSuccess?.(company!);
				}}
				cancelLabel="Não"
			/>
		</>
	);
}
