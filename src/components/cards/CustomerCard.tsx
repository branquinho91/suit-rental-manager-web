import type { CSSProperties } from "react";
import type { Customer } from "../../types/customer";
import { formatCpf, formatPhone, getInitials } from "../../utils/formatters";
import { GenericButton } from "../buttons/GenericButton";

interface CustomerCardProps {
  customer: Customer;
  isSelected: boolean;
  onSelect: (customer: Customer) => void;
}

export function CustomerCard({ customer, isSelected, onSelect }: CustomerCardProps) {
  return (
    <article style={isSelected ? styles.cardSelected : styles.card}>
      <div style={styles.header}>
        <span style={styles.avatar}>{getInitials(customer.name)}</span>

        <div style={styles.identity}>
          <h2 style={styles.name}>{customer.name}</h2>
          <span style={styles.email}>{customer.email || "Email não informado"}</span>
        </div>
      </div>

      <dl style={styles.summaryList}>
        <SummaryItem label="CPF" value={formatCpf(customer.cpf)} />
        <SummaryItem label="Telefone" value={formatPhone(customer.phoneNumber)} />
        <SummaryItem
          label="Localização"
          value={`${customer.address.city} - ${customer.address.state}`}
        />
      </dl>

      <GenericButton style={styles.detailsButton} onClick={() => onSelect(customer)}>
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
    width: "40px",
    height: "40px",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    backgroundColor: "#e2e8f0",
    color: "#0f172a",
    fontSize: "0.78rem",
    fontWeight: 700,
  },
  identity: {
    display: "flex",
    minWidth: 0,
    flexDirection: "column",
    gap: "0.2rem",
  },
  name: {
    color: "#0f172a",
    fontSize: "0.95rem",
  },
  email: {
    color: "#64748b",
    fontSize: "0.78rem",
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
