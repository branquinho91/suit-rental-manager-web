export type ProductType =
  | "ACCESSORY"
  | "SUIT"
  | "SHIRT"
  | "TIE"
  | "VEST"
  | "SHOES"
  | "SOCKS";

export interface Product {
  id: number;
  type: ProductType;
  name: string;
  size: string;
  color: string;
  rentalPrice: number;
  brand: string | null;
  description: string | null;
}

export type CreateProductRequest = Omit<Product, "id">;
export type UpdateProductRequest = Omit<Product, "id">;
