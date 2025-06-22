import { api } from "./api";
import type { Group } from "@/types/company";


export async function fetchGroupById(id: number): Promise<Group> {
  const response = await api.get<Group>(`/companies/groups/${id}`);
  return response.data;
}

export async function createGroup(name: string): Promise<Group> {
  const response = await api.post<Group>("/companies/groups/", { name });
  return response.data;
}
