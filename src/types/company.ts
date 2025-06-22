export type Group = {
  id: number;
  name: string;
  slug: string;
  main_company: number | null;
  main_company_name: string | null;
};

export type PointOfSale = {
  id: number;
  name: string;
  slug: string;
};

export type Company = {
  id?: number;
  name: string;
  fantasy_name: string;
  cnpj: string;
  full_address: string;
  segment: string;
  benner_code: string;
  obt_link: string;
  website: string;
  notes: string;
  go_live: string;
  point_of_sale: PointOfSale | null;
  travel_managers: CompanyContact[];
  group: {
    id: number;
    name: string;
    slug: string;
  };
};

export type CompanyContact = {
  id: number;
  name: string;
  role: string;
  phone: string;
  mobile: string;
  whatsapp: string;
  email: string;
  is_travel_manager: boolean;
  is_account_executive: boolean;
  is_billing_contact: boolean;
  company: number;
};
