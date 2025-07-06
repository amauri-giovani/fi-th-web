import type { Agreement } from "./agreement";
import type { PointOfSale } from "./catalog";
import type { Company } from "./company";


export type Group = {
  id: number;
  name: string;
  go_live: string;
  main_company: {
    id: number | null;
    name: string;
    cnpj: string;
  };
  point_of_sale: PointOfSale | null;
  account_executive: {
    id: number | null;
    name: string;
  };
  companies: Company[];
  contracts_status: string;
  agreements: Agreement[];
  segment: string;
  obt_link: string;
  website: string;
  notes: string;
};
