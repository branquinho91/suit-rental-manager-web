import type { InventoryStatus } from "../types/inventory";

const statusLabels: Record<InventoryStatus, string> = {
  AVAILABLE: "Disponível",
  RENTED: "Alugado",
  CLEANING: "Limpeza",
  MAINTENANCE: "Manutenção",
  INACTIVE: "Inativo",
};

const statusColors: Record<
  InventoryStatus,
  { backgroundColor: string; borderColor: string; color: string }
> = {
  AVAILABLE: {
    backgroundColor: "#dcfce7",
    borderColor: "#86efac",
    color: "#166534",
  },
  RENTED: {
    backgroundColor: "#dbeafe",
    borderColor: "#93c5fd",
    color: "#1e40af",
  },
  CLEANING: {
    backgroundColor: "#fef3c7",
    borderColor: "#fcd34d",
    color: "#92400e",
  },
  MAINTENANCE: {
    backgroundColor: "#ffedd5",
    borderColor: "#fdba74",
    color: "#9a3412",
  },
  INACTIVE: {
    backgroundColor: "#e2e8f0",
    borderColor: "#cbd5e1",
    color: "#475569",
  },
};

export function getInventoryStatusLabel(status: InventoryStatus) {
  return statusLabels[status];
}

export function getInventoryStatusColors(status: InventoryStatus) {
  return statusColors[status];
}
