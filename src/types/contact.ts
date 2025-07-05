export type CompanyContact = {
  id: number;
  name: string;
  role: string;
  phone: string;
  mobile: string;
  whatsapp: string;
  email: string;
  is_travel_manager: boolean;
  is_billing_contact: boolean;
  is_financial_contact: boolean;
  is_commercial_contact: boolean;
  is_secretary_vip: boolean;
  is_vip: boolean;
  company?: {
    id: number,
    name: string
  };
};
