import { useEffect, type CSSProperties, type MouseEvent } from "react";
import type { Product } from "../../types/product";
import { formatCurrency } from "../../utils/formatters";
import { getProductTypeLabel } from "../../utils/product";
import { CloseButton } from "../buttons/CloseButton";

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
}

export function ProductDetailsModal({ product, onClose }: ProductDetailsModalProps) {
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
        aria-labelledby="product-details-title"
        style={styles.modal}
      >
        <div style={styles.header}>
          <div>
            <span style={styles.label}>{getProductTypeLabel(product.type)}</span>
            <h2 id="product-details-title" style={styles.title}>
              {product.name}
            </h2>
          </div>

          <CloseButton icon="close" label="Fechar detalhes" onClick={onClose} />
        </div>

        <div style={styles.grid}>
          <DetailItem label="Marca" value={product.brand || "Não informada"} />
          <DetailItem label="Tamanho" value={product.size} />
          <DetailItem label="Cor" value={product.color} />
          <DetailItem label="Valor da locação" value={formatCurrency(product.rentalPrice)} />
          <DetailItem
            label="Descrição"
            value={product.description || "Nenhuma descrição cadastrada"}
            wide
          />
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
  label: {
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
  grid: {
    display: "grid",
    marginTop: "1.5rem",
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
} satisfies Record<string, CSSProperties>;
