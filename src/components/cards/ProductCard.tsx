import type { CSSProperties } from "react";
import type { Product } from "../../types/product";
import { formatCurrency } from "../../utils/formatters";
import { getProductTypeInitials, getProductTypeLabel } from "../../utils/product";
import { GenericButton } from "../buttons/GenericButton";

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onSelect: (product: Product) => void;
}

export function ProductCard({ product, isSelected, onSelect }: ProductCardProps) {
  return (
    <article style={isSelected ? styles.cardSelected : styles.card}>
      <div style={styles.header}>
        <span style={styles.avatar}>{getProductTypeInitials(product.type)}</span>

        <div style={styles.identity}>
          <span style={styles.type}>{getProductTypeLabel(product.type)}</span>
          <h2 style={styles.name}>{product.name}</h2>
          <span style={styles.brand}>{product.brand || "Marca não informada"}</span>
        </div>
      </div>

      <dl style={styles.summaryList}>
        <SummaryItem label="Tamanho" value={product.size} />
        <SummaryItem label="Cor" value={product.color} />
        <SummaryItem label="Valor da locação" value={formatCurrency(product.rentalPrice)} />
      </dl>

      <GenericButton style={styles.detailsButton} onClick={() => onSelect(product)}>
        Ver detalhes
      </GenericButton>
    </article>
  );
}

interface SummaryItemProps {
  label: string;
  value: string;
}

function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <div style={styles.summaryItem}>
      <dt style={styles.summaryLabel}>{label}</dt>
      <dd style={styles.summaryValue}>{value}</dd>
    </div>
  );
}

const sharedCardStyles: CSSProperties = {
  display: "flex",
  width: "100%",
  maxWidth: "360px",
  minWidth: 0,
  padding: "1.15rem",
  borderRadius: "10px",
  backgroundColor: "#ffffff",
  flexDirection: "column",
};

const styles = {
  card: {
    ...sharedCardStyles,
    border: "1px solid #e2e8f0",
  },
  cardSelected: {
    ...sharedCardStyles,
    border: "1px solid #000000",
    boxShadow: "0 6px 18px rgba(15, 23, 42, 0.1)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  avatar: {
    display: "inline-flex",
    width: "42px",
    height: "42px",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9px",
    backgroundColor: "#e2e8f0",
    color: "#0f172a",
    fontSize: "0.72rem",
    fontWeight: 700,
  },
  identity: {
    display: "flex",
    minWidth: 0,
    flexDirection: "column",
    gap: "0.12rem",
  },
  type: {
    color: "#64748b",
    fontSize: "0.68rem",
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  name: {
    color: "#0f172a",
    fontSize: "0.95rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  brand: {
    color: "#64748b",
    fontSize: "0.76rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  summaryList: {
    display: "flex",
    margin: "1rem 0",
    flexDirection: "column",
    gap: "0.65rem",
  },
  summaryItem: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: "1rem",
  },
  summaryLabel: {
    color: "#64748b",
    fontSize: "0.75rem",
  },
  summaryValue: {
    color: "#334155",
    fontSize: "0.8rem",
    fontWeight: 500,
    textAlign: "right",
  },
  detailsButton: {
    width: "100%",
    minHeight: "auto",
    marginTop: "auto",
    padding: "0.6rem 0.75rem",
    fontSize: "0.8rem",
  },
} satisfies Record<string, CSSProperties>;
