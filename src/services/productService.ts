import type { Product } from "../types/product";
import { apiRequest } from "./apiClient";

export function getProducts() {
  return apiRequest<Product[]>("/products");
}
