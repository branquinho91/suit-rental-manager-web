import type { CreateInventoryItemRequest, InventoryItem } from "../types/inventory";
import { apiRequest } from "./apiClient";

export function getInventoryItems() {
  return apiRequest<InventoryItem[]>("/inventory-items");
}

export function createInventoryItem(data: CreateInventoryItemRequest) {
  return apiRequest<InventoryItem>("/inventory-items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
