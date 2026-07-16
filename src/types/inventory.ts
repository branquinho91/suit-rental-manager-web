import type { Product } from "./product";

export type InventoryStatus =
  | "AVAILABLE"
  | "CLEANING"
  | "INACTIVE"
  | "MAINTENANCE"
  | "RENTED";

export interface InventoryItem {
  id: number;
  code: string | null;
  status: InventoryStatus;
  product: Product;
}

export interface CreateInventoryItemRequest {
  productId: number;
}

export interface UpdateInventoryStatusRequest {
  status: InventoryStatus;
}
