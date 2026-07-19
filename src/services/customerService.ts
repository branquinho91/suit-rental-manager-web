import type { CreateCustomerRequest, Customer } from "../types/customer";
import { apiRequest } from "./apiClient";

export function getCustomers() {
  return apiRequest<Customer[]>("/customers");
}

export function createCustomer(data: CreateCustomerRequest) {
  return apiRequest<Customer>("/customers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
