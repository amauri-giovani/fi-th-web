import type { ProductType, Provider } from "./catalog";


export interface Agreement {
  id: number;
  product_type: ProductType;
  provider: Provider;
  code: string;
  expiration_date: string;
  notes?: string;
}
