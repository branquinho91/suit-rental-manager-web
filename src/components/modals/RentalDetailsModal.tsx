import { useEffect, type CSSProperties, type MouseEvent } from "react";
import type { Rental } from "../../types/rental";
import { formatCurrency, formatDate, formatPhone } from "../../utils/formatters";
import { getRentalStatusColors, getRentalStatusLabel } from "../../utils/rental";
import { CloseButton } from "../buttons/CloseButton";

interface RentalDetailsModalProps {
  rental: Rental;
  onClose: () => void;
}

export function RentalDetailsModal({ rental, onClose }: RentalDetailsModalProps) {
  const statusStyle = {
    ...styles.statusBadge,
    ...getRentalStatusColors(rental.status),
  };

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  return (
    <div style={styles.backdrop} onClick={handleBackdropClick}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="rental-details-title"
        style={styles.modal}
      >
        <div style={styles.header}>
          <div>
            <span style={styles.eyebrow}>Locação #{rental.id}</span>
            <h2 id="rental-details-title" style={styles.title}>
              {rental.customer.name}
            </h2>
          </div>

          <CloseButton icon="close" label="Fechar detalhes" onClick={onClose} />
        </div>

        <div style={styles.statusRow}>
          <span style={styles.statusLabel}>Status atual</span>
          <span style={statusStyle}>{getRentalStatusLabel(rental.status)}</span>
        </div>

        <div style={styles.grid}>
          <DetailItem label="Data da locação" value={formatDate(rental.rentalDate)} />
          <DetailItem
            label="Devolução prevista"
            value={formatDate(rental.expectedReturnDate)}
          />
          <DetailItem
            label="Devolução realizada"
            value={rental.actualReturnDate ? formatDate(rental.actualReturnDate) : "—"}
          />
        </div>

        <div style={styles.customerSection}>
          <span style={styles.sectionLabel}>Cliente</span>
          <div style={styles.customerGrid}>
            <DetailItem label="Nome" value={rental.customer.name} />
            <DetailItem label="CPF" value={rental.customer.cpf} />
            <DetailItem label="Email" value={rental.customer.email || "Não informado"} />
            <DetailItem label="Telefone" value={formatPhone(rental.customer.phoneNumber)} />
          </div>
        </div>

        <div style={styles.itemsSection}>
          <div style={styles.itemsHeader}>
            <span style={styles.sectionLabel}>Itens da locação</span>
            <span style={styles.itemCount}>
              {rental.rentalItems.length} {rental.rentalItems.length === 1 ? "item" : "itens"}
            </span>
          </div>

          <div style={styles.itemsList}>
            {rental.rentalItems.map((rentalItem) => (
              <div key={rentalItem.id} style={styles.rentalItem}>
                <div style={styles.itemIdentity}>
                  <strong style={styles.itemName}>
                    {rentalItem.inventoryItem.product.name}
                  </strong>
                  <span style={styles.itemMeta}>
                    {rentalItem.inventoryItem.code || "Sem código"} · Tam. {rentalItem.inventoryItem.product.size} ·{" "}
                    {rentalItem.inventoryItem.product.color}
                  </span>
                </div>
                <strong style={styles.itemPrice}>
                  {formatCurrency(rentalItem.rentalPrice)}
                </strong>
              </div>
            ))}
          </div>

          <div style={styles.totalRow}>
            <span style={styles.totalLabel}>Valor total</span>
            <strong style={styles.totalValue}>
              {formatCurrency(rental.totalPrice)}
            </strong>
          </div>
        </div>
      </section>
    </div>
  );
}

interface DetailItemProps {
  label: string;
  value: string;
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div style={styles.detailItem}>
      <span style={styles.detailLabel}>{label}</span>
      <span style={styles.detailValue}>{value}</span>
    </div>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "flex",
    padding: "1.5rem",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15, 23, 42, 0.68)",
    backdropFilter: "blur(2px)",
  },
  modal: {
    width: "min(100%, 760px)",
    maxHeight: "calc(100vh - 3rem)",
    padding: "1.5rem",
    border: "1px solid #cbd5e1",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    boxShadow: "0 24px 60px rgba(0, 0, 0, 0.28)",
    overflowY: "auto",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "1rem",
  },
  eyebrow: {
    color: "#64748b",
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  title: {
    marginTop: "0.3rem",
    color: "#0f172a",
    fontSize: "1.35rem",
  },
  statusRow: {
    display: "flex",
    marginTop: "1.5rem",
    paddingBottom: "1rem",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    borderBottom: "1px solid #e2e8f0",
  },
  statusLabel: {
    color: "#64748b",
    fontSize: "0.78rem",
    fontWeight: 600,
  },
  statusBadge: {
    display: "inline-flex",
    padding: "0.3rem 0.6rem",
    border: "1px solid",
    borderRadius: "999px",
    fontSize: "0.72rem",
    fontWeight: 700,
  },
  grid: {
    display: "grid",
    marginTop: "1.25rem",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "1rem",
  },
  detailItem: {
    display: "flex",
    minWidth: 0,
    flexDirection: "column",
    gap: "0.3rem",
  },
  detailLabel: {
    color: "#64748b",
    fontSize: "0.72rem",
    fontWeight: 600,
  },
  detailValue: {
    color: "#0f172a",
    fontSize: "0.88rem",
    lineHeight: 1.45,
    overflowWrap: "anywhere",
  },
  customerSection: {
    marginTop: "1.5rem",
    paddingTop: "1.25rem",
    borderTop: "1px solid #e2e8f0",
  },
  sectionLabel: {
    color: "#334155",
    fontSize: "0.78rem",
    fontWeight: 700,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  customerGrid: {
    display: "grid",
    marginTop: "0.9rem",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "1rem",
  },
  itemsSection: {
    marginTop: "1.5rem",
    paddingTop: "1.25rem",
    borderTop: "1px solid #e2e8f0",
  },
  itemsHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
  },
  itemCount: {
    color: "#64748b",
    fontSize: "0.76rem",
  },
  itemsList: {
    display: "flex",
    marginTop: "0.9rem",
    flexDirection: "column",
    gap: "0.55rem",
  },
  rentalItem: {
    display: "flex",
    padding: "0.75rem 0.85rem",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    backgroundColor: "#f8fafc",
  },
  itemIdentity: {
    display: "flex",
    minWidth: 0,
    flexDirection: "column",
    gap: "0.2rem",
  },
  itemName: {
    color: "#0f172a",
    fontSize: "0.82rem",
    fontWeight: 600,
  },
  itemMeta: {
    color: "#64748b",
    fontSize: "0.74rem",
  },
  itemPrice: {
    flexShrink: 0,
    color: "#0f172a",
    fontSize: "0.82rem",
  },
  totalRow: {
    display: "flex",
    marginTop: "1rem",
    padding: "0.9rem 1rem",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    backgroundColor: "#f1f5f9",
  },
  totalLabel: {
    color: "#475569",
    fontSize: "0.78rem",
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  totalValue: {
    color: "#0f172a",
    fontSize: "1rem",
    fontWeight: 800,
  },
} satisfies Record<string, CSSProperties>;
