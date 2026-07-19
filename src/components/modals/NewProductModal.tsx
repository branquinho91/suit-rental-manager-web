import { useEffect, useState, type CSSProperties, type FormEvent, type MouseEvent } from "react";
import type { CreateProductRequest, ProductType } from "../../types/product";
import { getProductTypeLabel } from "../../utils/product";
import { CloseButton } from "../buttons/CloseButton";
import { GenericButton } from "../buttons/GenericButton";

interface NewProductModalProps {
  isSubmitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (data: CreateProductRequest) => void;
}

const productTypes: ProductType[] = ["SUIT", "SHIRT", "TIE", "VEST", "SHOES", "SOCKS", "ACCESSORY"];

export function NewProductModal({ isSubmitting, error, onClose, onSubmit }: NewProductModalProps) {
  const [type, setType] = useState<ProductType | "">("");
  const [name, setName] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [rentalPrice, setRentalPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!type) return;

    onSubmit({
      type,
      name: name.trim(),
      size: size.trim(),
      color: color.trim(),
      rentalPrice: currencyToNumber(rentalPrice),
      brand: brand.trim() || null,
      description: description.trim() || null,
    });
  }

  return (
    <div style={styles.backdrop} onClick={handleBackdropClick}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-product-title"
        style={styles.modal}
      >
        <div style={styles.header}>
          <div>
            <span style={styles.eyebrow}>Produtos</span>
            <h2 id="new-product-title" style={styles.title}>
              Novo produto
            </h2>
            <p style={styles.description}>Cadastre um novo modelo disponível para o estoque.</p>
          </div>
          <CloseButton icon="close" label="Fechar formulário" onClick={handleClose} />
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          <fieldset style={styles.fieldset} disabled={isSubmitting}>
            <legend style={styles.legend}>Dados do produto</legend>
            <div style={styles.formGrid}>
              <div>
                <label htmlFor="product-type" style={styles.inputLabel}>
                  Tipo *
                </label>
                <select
                  id="product-type"
                  value={type}
                  style={styles.input}
                  required
                  autoFocus
                  onChange={(event) => setType(event.target.value as ProductType | "")}
                >
                  <option value="">Selecione um tipo</option>
                  {productTypes.map((productType) => (
                    <option key={productType} value={productType}>
                      {getProductTypeLabel(productType)}
                    </option>
                  ))}
                </select>
              </div>

              <FormField label="Nome" id="product-name" value={name} required onChange={setName} />
              <FormField label="Marca" id="product-brand" value={brand} onChange={setBrand} />
              <FormField
                label="Tamanho"
                id="product-size"
                value={size}
                required
                onChange={setSize}
              />
              <FormField
                label="Cor"
                id="product-color"
                value={color}
                required
                onChange={setColor}
              />
              <FormField
                label="Valor da locação"
                id="product-rental-price"
                value={rentalPrice}
                inputMode="numeric"
                placeholder="R$ 0,00"
                pattern=".*[1-9].*"
                title="Informe um valor maior que zero"
                required
                onChange={(value) => setRentalPrice(formatCurrencyInput(value))}
              />
            </div>

            <div style={styles.descriptionField}>
              <label htmlFor="product-description" style={styles.inputLabel}>
                Descrição
              </label>
              <textarea
                id="product-description"
                value={description}
                rows={4}
                maxLength={500}
                style={styles.textarea}
                placeholder="Detalhes ou observações sobre o produto"
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
          </fieldset>

          {error && (
            <p role="alert" style={styles.errorMessage}>
              {error}
            </p>
          )}

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
              style={isSubmitting ? styles.submitButtonDisabled : styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Cadastrar produto"}
            </GenericButton>
          </div>
        </form>
      </section>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  id: string;
  value: string;
  type?: "text" | "number";
  min?: string;
  step?: string;
  inputMode?: "numeric" | "decimal";
  pattern?: string;
  title?: string;
  placeholder?: string;
  required?: boolean;
  onChange: (value: string) => void;
}

function FormField({
  label,
  id,
  value,
  type = "text",
  required,
  onChange,
  ...props
}: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} style={styles.inputLabel}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        {...props}
        id={id}
        type={type}
        value={value}
        required={required}
        style={styles.input}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function formatCurrencyInput(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(digits) / 100);
}

function currencyToNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  return Number(digits) / 100;
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
  title: { marginTop: "0.3rem", color: "#0f172a", fontSize: "1.35rem" },
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
  fieldset: {
    minWidth: 0,
    padding: "1rem",
    border: "1px solid #e2e8f0",
    borderRadius: "9px",
  },
  legend: {
    padding: "0 0.35rem",
    color: "#334155",
    fontSize: "0.8rem",
    fontWeight: 700,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
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
  descriptionField: { marginTop: "1rem" },
  textarea: {
    width: "100%",
    padding: "0.7rem 0.85rem",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    outlineColor: "#000000",
    backgroundColor: "#ffffff",
    color: "#0f172a",
    fontFamily: "inherit",
    fontSize: "0.85rem",
    lineHeight: 1.5,
    resize: "vertical",
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
  cancelButton: { borderColor: "#cbd5e1", backgroundColor: "#ffffff", color: "#0f172a" },
  submitButton: { backgroundColor: "#000000", color: "#ffffff" },
  submitButtonDisabled: {
    backgroundColor: "#64748b",
    color: "#ffffff",
    cursor: "not-allowed",
    opacity: 0.65,
  },
} satisfies Record<string, CSSProperties>;
