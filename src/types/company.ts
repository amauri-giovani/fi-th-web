import type { ContractData } from "./contract";


export type Company = {
  id?: number | null;
  name: string;
  fantasy_name: string;
  cnpj: string;
  full_address: string;
  segment: string;
  notes: string;
  go_live: string;
  group: {
    id: number | null;
    name: string;
  };
  contracts: ContractData[];
};
