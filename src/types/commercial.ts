export type ContractData = {
  id: number;
  company: number;
  signature_date: string;
  expiration_date: string | null;
  adjustment_date: string;
  adjustment_index: string;
  validity_period: string;
  expiration_alert: number;
  alert_contract: string | null;
  status: "Vigente" | "A Vencer" | "Vencido";
  notes: string;
};
