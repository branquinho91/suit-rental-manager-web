import type { Customer } from "../types/customer";
import { apiRequest } from "./apiClient";

export function getCustomers() {
  return apiRequest<Customer[]>("/customers");
}
