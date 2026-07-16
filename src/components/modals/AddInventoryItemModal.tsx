import { useEffect, useState, type CSSProperties, type FormEvent, type MouseEvent } from "react";
import type { Product } from "../../types/product";
import { CloseButton } from "../buttons/CloseButton";
import { GenericButton } from "../buttons/GenericButton";

interface AddInventoryItemModalProps {
  products: Product[];
  isSubmitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (productId: number) => void;
}

export function AddInventoryItemModal({
  products,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: AddInventoryItemModalProps) {
  const [selectedProductId, setSelectedProductId] = useState("");

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (selectedProductId) onSubmit(Number(selectedProductId));
  }

  return (
    <div style={styles.backdrop} onClick={handleBackdropClick}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-inventory-item-title"
        style={styles.modal}
      >
        <div style={styles.header}>
          <div>
            <span style={styles.eyebrow}>Estoque</span>
            <h2 id="add-inventory-item-title" style={styles.title}>
              Adicionar item
            </h2>
            <p style={styles.description}>Selecione o produto referente à nova unidade física.</p>
          </div>

          <CloseButton icon="close" label="Fechar formulário" onClick={onClose} />
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          <div>
            <label htmlFor="inventory-product" style={styles.inputLabel}>
              Produto
            </label>
            <select
              id="inventory-product"
              value={selectedProductId}
              style={styles.select}
              disabled={isSubmitting || products.length === 0}
              required
              onChange={(event) => setSelectedProductId(event.target.value)}
            >
              <option value="">Selecione um produto</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} — Tam. {product.size} — {product.color}
                </option>
              ))}
            </select>

            {products.length === 0 && (
              <p style={styles.helperText}>Nenhum produto disponível para seleção.</p>
            )}
          </div>

          {error && <p style={styles.errorMessage}>{error}</p>}

          <div style={styles.actions}>
            <GenericButton style={styles.cancelButton} disabled={isSubmitting} onClick={onClose}>
              Cancelar
            </GenericButton>
            <GenericButton
              type="submit"
              style={
                isSubmitting || !selectedProductId
                  ? styles.submitButtonDisabled
                  : styles.submitButton
              }
              disabled={isSubmitting || !selectedProductId}
            >
              {isSubmitting ? "Adicionando..." : "Adicionar ao estoque"}
            </GenericButton>
          </div>
        </form>
      </section>
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
  inputLabel: {
    display: "block",
    marginBottom: "0.45rem",
    color: "#334155",
    fontSize: "0.8rem",
    fontWeight: 600,
  },
  select: {
    width: "100%",
    padding: "0.75rem 0.9rem",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    outlineColor: "#000000",
    backgroundColor: "#ffffff",
    color: "#0f172a",
    fontFamily: "inherit",
    fontSize: "0.9rem",
  },
  helperText: {
    marginTop: "0.45rem",
    color: "#b45309",
    fontSize: "0.78rem",
  },
  generatedInfo: {
    padding: "0.8rem 0.9rem",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    backgroundColor: "#f8fafc",
    color: "#475569",
    fontSize: "0.8rem",
    lineHeight: 1.5,
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
    marginTop: "0.25rem",
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
