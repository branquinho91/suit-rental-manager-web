import { useEffect, type CSSProperties, type MouseEvent } from "react";
import type { InventoryItem } from "../../types/inventory";
import { formatCurrency } from "../../utils/formatters";
import { getInventoryStatusColors, getInventoryStatusLabel } from "../../utils/inventory";
import { getProductTypeLabel } from "../../utils/product";
import { CloseButton } from "../buttons/CloseButton";

interface InventoryItemDetailsModalProps {
  item: InventoryItem;
  onClose: () => void;
}

export function InventoryItemDetailsModal({ item, onClose }: InventoryItemDetailsModalProps) {
  const statusColors = getInventoryStatusColors(item.status);
  const statusBadgeStyle = {
    ...styles.statusBadge,
    ...statusColors,
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
        aria-labelledby="inventory-item-details-title"
        style={styles.modal}
      >
        <div style={styles.header}>
          <div>
            <span style={styles.eyebrow}>Unidade física</span>
            <h2 id="inventory-item-details-title" style={styles.title}>
              {item.code || "Código não informado"}
            </h2>
          </div>

          <CloseButton icon="close" label="Fechar detalhes" onClick={onClose} />
        </div>

        <div style={styles.statusRow}>
          <span style={styles.statusLabel}>Status atual</span>
          <span style={statusBadgeStyle}>{getInventoryStatusLabel(item.status)}</span>
        </div>

        <div style={styles.grid}>
          <DetailItem label="Produto" value={item.product.name} wide />
          <DetailItem label="Tipo" value={getProductTypeLabel(item.product.type)} />
          <DetailItem label="Tamanho" value={item.product.size} />
          <DetailItem label="Cor" value={item.product.color} />
          <DetailItem label="Marca" value={item.product.brand || "Não informada"} />
          <DetailItem label="Valor da locação" value={formatCurrency(item.product.rentalPrice)} />
        </div>
      </section>
    </div>
  );
}

interface DetailItemProps {
  label: string;
  value: string;
  wide?: boolean;
}

function DetailItem({ label, value, wide = false }: DetailItemProps) {
  return (
    <div style={wide ? styles.itemWide : styles.item}>
      <span style={styles.itemLabel}>{label}</span>
      <span style={styles.itemValue}>{value}</span>
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
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "1.25rem",
  },
  item: {
    display: "flex",
    minWidth: 0,
    flexDirection: "column",
    gap: "0.35rem",
  },
  itemWide: {
    display: "flex",
    minWidth: 0,
    flexDirection: "column",
    gridColumn: "1 / -1",
    gap: "0.35rem",
  },
  itemLabel: {
    color: "#64748b",
    fontSize: "0.72rem",
    fontWeight: 600,
  },
  itemValue: {
    color: "#0f172a",
    fontSize: "0.9rem",
    lineHeight: 1.5,
    overflowWrap: "anywhere",
  },
  futureNote: {
    marginTop: "1.5rem",
    padding: "0.8rem 0.9rem",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    backgroundColor: "#f8fafc",
    color: "#64748b",
    fontSize: "0.78rem",
    lineHeight: 1.5,
  },
} satisfies Record<string, CSSProperties>;
