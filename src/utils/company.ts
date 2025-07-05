import type { Company } from "@/types/company";

export function getGroupName(group: Company["group"]): string {
  return typeof group === "object" ? group.name : "";
}

export function getGroupId(group: Company["group"]): number {
  return typeof group === "object" ? group.id : group;
}

export function serializeCompany(company: Company): Omit<Company, "group"> & { group: number } {
  return {
    ...company,
    group: getGroupId(company.group),
  };
}
