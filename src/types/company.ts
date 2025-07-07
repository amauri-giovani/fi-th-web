import type { ContractData } from "./commercial";


type GroupField = number | { id: number; name: string };

export type Company = {
  id?: number;
  name: string;
  fantasy_name: string;
  cnpj: string;
  full_address: string;
  benner_code: string;
  notes: string;
  group: GroupField;
  contracts: ContractData[];
};
