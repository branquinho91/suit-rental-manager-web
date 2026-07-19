import { useEffect, useState, type CSSProperties, type FormEvent, type MouseEvent } from "react";
import type { Customer } from "../../types/customer";
import type { InventoryItem } from "../../types/inventory";
import type { CreateRentalRequest } from "../../types/rental";
import { formatCurrency } from "../../utils/formatters";
import { CloseButton } from "../buttons/CloseButton";
import { GenericButton } from "../buttons/GenericButton";

interface NewRentalModalProps {
  customers: Customer[];
  availableItems: InventoryItem[];
  isSubmitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (data: CreateRentalRequest) => void;
}

export function NewRentalModal({
  customers,
  availableItems,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: NewRentalModalProps) {
  const [customerId, setCustomerId] = useState("");
  const [expectedReturnDate, setExpectedReturnDate] = useState(getTomorrowDate());
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);

  const selectedTotal = availableItems
    .filter((item) => selectedItemIds.includes(item.id))
    .reduce((total, item) => total + item.product.rentalPrice, 0);
  const isFormInvalid = !customerId || !expectedReturnDate || selectedItemIds.length === 0;

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

  function handleItemChange(itemId: number) {
    setSelectedItemIds((currentIds) =>
      currentIds.includes(itemId)
        ? currentIds.filter((id) => id !== itemId)
        : [...currentIds, itemId],
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isFormInvalid) return;

    onSubmit({
      customerId: Number(customerId),
      expectedReturnDate,
      inventoryItemIds: selectedItemIds,
    });
  }

  return (
    <div style={styles.backdrop} onClick={handleBackdropClick}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-rental-title"
        style={styles.modal}
      >
        <div style={styles.header}>
          <div>
            <span style={styles.eyebrow}>Locações</span>
            <h2 id="new-rental-title" style={styles.title}>
              Nova locação
            </h2>
            <p style={styles.description}>
              Escolha o cliente, a devolução prevista e as unidades físicas.
            </p>
          </div>

          <CloseButton icon="close" label="Fechar formulário" onClick={handleClose} />
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.formGrid}>
            <div>
              <label htmlFor="rental-customer" style={styles.inputLabel}>
                Cliente
              </label>
              <select
                id="rental-customer"
                value={customerId}
                style={styles.input}
                disabled={isSubmitting || customers.length === 0}
                required
                onChange={(event) => setCustomerId(event.target.value)}
              >
                <option value="">Selecione um cliente</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} — CPF {customer.cpf}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="expected-return-date" style={styles.inputLabel}>
                Devolução prevista
              </label>
              <input
                id="expected-return-date"
                type="date"
                value={expectedReturnDate}
                min={getTomorrowDate()}
                style={styles.input}
                disabled={isSubmitting}
                required
                onChange={(event) => setExpectedReturnDate(event.target.value)}
              />
            </div>
          </div>

          <fieldset style={styles.itemsFieldset}>
            <legend style={styles.itemsLegend}>Unidades disponíveis</legend>

            {availableItems.length > 0 ? (
              <div style={styles.itemsList}>
                {availableItems.map((item) => (
                  <label key={item.id} style={styles.itemOption}>
                    <input
                      type="checkbox"
                      checked={selectedItemIds.includes(item.id)}
                      style={styles.checkbox}
                      disabled={isSubmitting}
                      onChange={() => handleItemChange(item.id)}
                    />
                    <span style={styles.itemContent}>
                      <strong style={styles.itemName}>
                        {item.code || "Sem código"} — {item.product.name}
                      </strong>
                      <span style={styles.itemMeta}>
                        Tam. {item.product.size} · {item.product.color} ·{" "}
                        {formatCurrency(item.product.rentalPrice)}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <p style={styles.emptyMessage}>Não há unidades disponíveis para locação.</p>
            )}
          </fieldset>

          <div style={styles.summary}>
            <span>{selectedItemIds.length} item(ns) selecionado(s)</span>
            <strong>Total: {formatCurrency(selectedTotal)}</strong>
          </div>

          {customers.length === 0 && (
            <p style={styles.warningMessage}>Cadastre um cliente antes de criar a locação.</p>
          )}
          {error && <p style={styles.errorMessage}>{error}</p>}

          <div style={styles.actions}>
            <GenericButton
              style={styles.cancelButton}
              disabled={isSubmitting}
              onClick={handleClose}
            >
              Cancelar
            </GenericButton>
            <GenericButton
              type="submit"
              style={
                isSubmitting || isFormInvalid ? styles.submitButtonDisabled : styles.submitButton
              }
              disabled={isSubmitting || isFormInvalid}
            >
              {isSubmitting ? "Criando..." : "Criar locação"}
            </GenericButton>
          </div>
        </form>
      </section>
    </div>
  );
}

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const day = String(tomorrow.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
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
    display: "block",
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
  description: {
    marginTop: "0.45rem",
    color: "#64748b",
    fontSize: "0.85rem",
    lineHeight: 1.5,
  },
  form: {
    display: "flex",
    marginTop: "1.5rem",
    flexDirection: "column",
    gap: "1rem",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1rem",
  },
  inputLabel: {
    display: "block",
    marginBottom: "0.45rem",
    color: "#334155",
    fontSize: "0.8rem",
    fontWeight: 600,
  },
  input: {
    width: "100%",
    minHeight: "42px",
    padding: "0.7rem 0.85rem",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    outlineColor: "#000000",
    backgroundColor: "#ffffff",
    color: "#0f172a",
    fontFamily: "inherit",
    fontSize: "0.85rem",
  },
  itemsFieldset: {
    minWidth: 0,
    padding: "1rem",
    border: "1px solid #e2e8f0",
    borderRadius: "9px",
  },
  itemsLegend: {
    padding: "0 0.35rem",
    color: "#334155",
    fontSize: "0.8rem",
    fontWeight: 700,
  },
  itemsList: {
    display: "flex",
    maxHeight: "260px",
    flexDirection: "column",
    gap: "0.55rem",
    overflowY: "auto",
  },
  itemOption: {
    display: "flex",
    padding: "0.7rem 0.75rem",
    alignItems: "center",
    gap: "0.7rem",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    backgroundColor: "#f8fafc",
    cursor: "pointer",
  },
  checkbox: {
    width: "16px",
    height: "16px",
    flexShrink: 0,
    accentColor: "#000000",
  },
  itemContent: {
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
  emptyMessage: {
    padding: "1.5rem 0.5rem",
    color: "#64748b",
    fontSize: "0.82rem",
    textAlign: "center",
  },
  summary: {
    display: "flex",
    padding: "0.8rem 0.9rem",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    backgroundColor: "#f8fafc",
    color: "#334155",
    fontSize: "0.82rem",
    flexWrap: "wrap",
  },
  warningMessage: {
    padding: "0.75rem 0.9rem",
    border: "1px solid #fde68a",
    borderRadius: "8px",
    backgroundColor: "#fffbeb",
    color: "#92400e",
    fontSize: "0.82rem",
  },
  errorMessage: {
    padding: "0.75rem 0.9rem",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    fontSize: "0.82rem",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.75rem",
    flexWrap: "wrap",
  },
  cancelButton: {
    borderColor: "#cbd5e1",
    backgroundColor: "#ffffff",
    color: "#0f172a",
  },
  submitButton: {
    backgroundColor: "#000000",
    color: "#ffffff",
  },
  submitButtonDisabled: {
    backgroundColor: "#64748b",
    color: "#ffffff",
    cursor: "not-allowed",
    opacity: 0.65,
  },
} satisfies Record<string, CSSProperties>;
