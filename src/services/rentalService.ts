import type { CreateRentalRequest, Rental } from "../types/rental";
import { apiRequest } from "./apiClient";

export function getRentals() {
  return apiRequest<Rental[]>("/rentals");
}

export function createRental(data: CreateRentalRequest) {
  return apiRequest<Rental>("/rentals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export function completeRental(id: number) {
  return apiRequest<Rental>(`/rentals/${id}/complete`, {
    method: "PATCH",
  });
}

export function cancelRental(id: number) {
  return apiRequest<Rental>(`/rentals/${id}/cancel`, {
    method: "PATCH",
  });
}
