import type { Customer } from "./customer";
import type { InventoryItem } from "./inventory";

export type RentalStatus = "ACTIVE" | "COMPLETED" | "CANCELLED";

export interface RentalItem {
  id: number;
  rentalPrice: number;
  inventoryItem: InventoryItem;
}

export interface Rental {
  id: number;
  rentalDate: string;
  expectedReturnDate: string;
  actualReturnDate: string | null;
  totalPrice: number;
  status: RentalStatus;
  customer: Customer;
  rentalItems: RentalItem[];
}

export interface CreateRentalRequest {
  customerId: number;
  expectedReturnDate: string;
  inventoryItemIds: number[];
}

export interface ChangeExpectedReturnDateRequest {
  expectedReturnDate: string;
}
