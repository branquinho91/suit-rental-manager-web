import type { CreateProductRequest, Product } from "../types/product";
import { apiRequest } from "./apiClient";

export function getProducts() {
  return apiRequest<Product[]>("/products");
}

export function createProduct(data: CreateProductRequest) {
  return apiRequest<Product>("/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
