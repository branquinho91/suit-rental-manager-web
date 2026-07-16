import type { RentalStatus } from "../types/rental";

const rentalStatusLabels: Record<RentalStatus, string> = {
  ACTIVE: "Ativa",
  COMPLETED: "Concluída",
  CANCELLED: "Cancelada",
};

const rentalStatusColors: Record<
  RentalStatus,
  { backgroundColor: string; borderColor: string; color: string }
> = {
  ACTIVE: {
    backgroundColor: "#dbeafe",
    borderColor: "#93c5fd",
    color: "#1e40af",
  },
  COMPLETED: {
    backgroundColor: "#dcfce7",
    borderColor: "#86efac",
    color: "#166534",
  },
  CANCELLED: {
    backgroundColor: "#fee2e2",
    borderColor: "#fca5a5",
    color: "#991b1b",
  },
};

export function getRentalStatusLabel(status: RentalStatus) {
  return rentalStatusLabels[status];
}

export function getRentalStatusColors(status: RentalStatus) {
  return rentalStatusColors[status];
}
