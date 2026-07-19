import { useEffect, type CSSProperties, type MouseEvent } from "react";
import type { Rental } from "../../types/rental";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { CloseButton } from "../buttons/CloseButton";
import { GenericButton } from "../buttons/GenericButton";

export type RentalAction = "complete" | "cancel";

interface RentalActionModalProps {
  rental: Rental;
  action: RentalAction;
  isSubmitting: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function RentalActionModal({
  rental,
  action,
  isSubmitting,
  error,
  onClose,
  onConfirm,
}: RentalActionModalProps) {
  const isCancellation = action === "cancel";
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isSubmitting) onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSubmitting, onClose]);

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget && !isSubmitting) onClose();
  }

  function handleClose() {
    if (!isSubmitting) onClose();
  }

  return (
    <div style={styles.backdrop} onClick={handleBackdropClick}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="rental-action-title"
        aria-describedby="rental-action-description"
        style={styles.modal}
      >
        <div style={styles.header}>
          <div>
            <span style={styles.eyebrow}>Locação #{rental.id}</span>
            <h2 id="rental-action-title" style={styles.title}>
              {isCancellation ? "Cancelar locação" : "Registrar devolução"}
            </h2>
            <p id="rental-action-description" style={styles.description}>
              {isCancellation
                ? `Confirme o cancelamento da locação de ${rental.customer.name}.`
                : `Confirme o recebimento dos itens locados por ${rental.customer.name}.`}
            </p>
          </div>
          <CloseButton icon="close" label="Fechar confirmação" onClick={handleClose} />
        </div>

        <div style={styles.summaryGrid}>
          <SummaryItem label="Cliente" value={rental.customer.name} />
          <SummaryItem label="Devolução prevista" value={formatDate(rental.expectedReturnDate)} />
          <SummaryItem label="Quantidade de itens" value={String(rental.rentalItems.length)} />
          <SummaryItem label="Valor total" value={formatCurrency(rental.totalPrice)} />
        </div>

        <div style={styles.itemsSection}>
          <span style={styles.sectionLabel}>Itens que serão liberados no estoque</span>
          <ul style={styles.itemsList}>
            {rental.rentalItems.map((rentalItem) => (
              <li key={rentalItem.id} style={styles.item}>
                <strong style={styles.itemName}>{rentalItem.inventoryItem.product.name}</strong>
                <span style={styles.itemMeta}>
                  {rentalItem.inventoryItem.code || "Sem código"} · Tam.{" "}
                  {rentalItem.inventoryItem.product.size} · {rentalItem.inventoryItem.product.color}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p style={styles.notice}>
          {isCancellation
            ? "Ao confirmar, a locação será cancelada e os itens voltarão a ficar disponíveis. Essa ação não pode ser desfeita."
            : "Ao confirmar, a locação será concluída e os itens voltarão a ficar disponíveis."}
        </p>

        {error && (
          <p role="alert" style={styles.errorMessage}>
            {error}
          </p>
        )}

        <div style={styles.actions}>
          <GenericButton style={styles.cancelButton} disabled={isSubmitting} onClick={handleClose}>
            Cancelar
          </GenericButton>
          <GenericButton
            style={
              isSubmitting
                ? styles.confirmButtonDisabled
                : isCancellation
                  ? styles.cancelRentalButton
                  : styles.confirmButton
            }
            disabled={isSubmitting}
            onClick={onConfirm}
          >
            {isSubmitting
              ? isCancellation
                ? "Cancelando..."
                : "Registrando..."
              : isCancellation
                ? "Confirmar cancelamento"
                : "Confirmar devolução"}
          </GenericButton>
        </div>
      </section>
    </div>
  );
}

interface SummaryItemProps {
  label: string;
  value: string;
}

function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <div style={styles.summaryItem}>
      <span style={styles.summaryLabel}>{label}</span>
      <strong style={styles.summaryValue}>{value}</strong>
    </div>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 1100,
    display: "flex",
    padding: "1.5rem",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15, 23, 42, 0.68)",
    backdropFilter: "blur(2px)",
  },
  modal: {
    width: "min(100%, 620px)",
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
    display: "block",
    color: "#64748b",
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  title: { marginTop: "0.3rem", color: "#0f172a", fontSize: "1.35rem" },
  description: { marginTop: "0.45rem", color: "#64748b", fontSize: "0.85rem", lineHeight: 1.5 },
  summaryGrid: {
    display: "grid",
    marginTop: "1.25rem",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "0.75rem",
  },
  summaryItem: {
    display: "flex",
    padding: "0.75rem",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    backgroundColor: "#f8fafc",
    flexDirection: "column",
    gap: "0.25rem",
  },
  summaryLabel: { color: "#64748b", fontSize: "0.72rem" },
  summaryValue: { color: "#0f172a", fontSize: "0.82rem" },
  itemsSection: { marginTop: "1rem" },
  sectionLabel: {
    display: "block",
    marginBottom: "0.5rem",
    color: "#334155",
    fontSize: "0.78rem",
    fontWeight: 700,
  },
  itemsList: {
    display: "flex",
    maxHeight: "190px",
    padding: 0,
    flexDirection: "column",
    gap: "0.5rem",
    listStyle: "none",
    overflowY: "auto",
  },
  item: {
    display: "flex",
    padding: "0.7rem 0.75rem",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    flexDirection: "column",
    gap: "0.2rem",
  },
  itemName: { color: "#0f172a", fontSize: "0.8rem" },
  itemMeta: { color: "#64748b", fontSize: "0.72rem" },
  notice: {
    marginTop: "1rem",
    padding: "0.75rem 0.9rem",
    border: "1px solid #bfdbfe",
    borderRadius: "8px",
    backgroundColor: "#eff6ff",
    color: "#1e40af",
    fontSize: "0.8rem",
    lineHeight: 1.5,
  },
  errorMessage: {
    marginTop: "0.75rem",
    padding: "0.75rem 0.9rem",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    fontSize: "0.82rem",
  },
  actions: {
    display: "flex",
    marginTop: "1rem",
    justifyContent: "flex-end",
    gap: "0.75rem",
    flexWrap: "wrap",
  },
  cancelButton: { borderColor: "#cbd5e1", backgroundColor: "#ffffff", color: "#0f172a" },
  confirmButton: { borderColor: "#166534", backgroundColor: "#166534", color: "#ffffff" },
  cancelRentalButton: { borderColor: "#b91c1c", backgroundColor: "#b91c1c", color: "#ffffff" },
  confirmButtonDisabled: {
    borderColor: "#64748b",
    backgroundColor: "#64748b",
    color: "#ffffff",
    cursor: "not-allowed",
    opacity: 0.65,
  },
} satisfies Record<string, CSSProperties>;
