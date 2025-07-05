export type ContractData = {
  id: number;
  company: number;
  signature_date: string;
  adjustment_date: string;
  adjustment_index: string;
  validity_period: string;
  expiration_alert: number;
  expiration_date: string | null;
  alert_contract: string | null;
  status: string;
  notes: string;
};
