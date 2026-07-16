import type { ProductType } from "../types/product";

const productTypeLabels: Record<ProductType, string> = {
  ACCESSORY: "Acessório",
  SUIT: "Terno",
  SHIRT: "Camisa",
  TIE: "Gravata",
  VEST: "Colete",
  SHOES: "Sapato",
  SOCKS: "Meia",
};

const productTypeInitials: Record<ProductType, string> = {
  ACCESSORY: "ACE",
  SUIT: "TER",
  SHIRT: "CAM",
  TIE: "GRA",
  VEST: "COL",
  SHOES: "SAP",
  SOCKS: "MEI",
};

export function getProductTypeLabel(type: ProductType) {
  return productTypeLabels[type];
}

export function getProductTypeInitials(type: ProductType) {
  return productTypeInitials[type];
}
