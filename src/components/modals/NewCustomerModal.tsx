import {
  useEffect,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FormEvent,
  type InputHTMLAttributes,
  type MouseEvent,
} from "react";
import type { CreateCustomerRequest } from "../../types/customer";
import { formatCpf, formatPhone, formatZipCode } from "../../utils/formatters";
import { CloseButton } from "../buttons/CloseButton";
import { GenericButton } from "../buttons/GenericButton";

interface NewCustomerModalProps {
  isSubmitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (data: CreateCustomerRequest) => void;
}

type FormValues = {
  name: string;
  cpf: string;
  email: string;
  phoneNumber: string;
  phoneNumber2: string;
  addressStreet: string;
  addressNumber: string;
  addressComplement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
};

const initialValues: FormValues = {
  name: "",
  cpf: "",
  email: "",
  phoneNumber: "",
  phoneNumber2: "",
  addressStreet: "",
  addressNumber: "",
  addressComplement: "",
  neighborhood: "",
  city: "",
  state: "",
  zipCode: "",
};

export function NewCustomerModal({
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: NewCustomerModalProps) {
  const [values, setValues] = useState(initialValues);

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

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  function handleMaskedChange(event: ChangeEvent<HTMLInputElement>, maxDigits: number) {
    const { name } = event.target;
    const digits = onlyDigits(event.target.value).slice(0, maxDigits);
    const value =
      name === "cpf"
        ? formatCpf(digits)
        : name === "zipCode"
          ? formatZipCode(digits)
          : formatPhone(digits);

    setValues((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSubmit({
      name: values.name.trim(),
      cpf: onlyDigits(values.cpf),
      email: values.email.trim(),
      phoneNumber: onlyDigits(values.phoneNumber),
      phoneNumber2: values.phoneNumber2 ? onlyDigits(values.phoneNumber2) : null,
      address: {
        addressStreet: values.addressStreet.trim(),
        addressNumber: values.addressNumber.trim(),
        addressComplement: values.addressComplement.trim(),
        neighborhood: values.neighborhood.trim(),
        city: values.city.trim(),
        state: values.state.trim().toUpperCase(),
        zipCode: onlyDigits(values.zipCode),
      },
    });
  }

  return (
    <div style={styles.backdrop} onClick={handleBackdropClick}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-customer-title"
        style={styles.modal}
      >
        <div style={styles.header}>
          <div>
            <span style={styles.eyebrow}>Clientes</span>
            <h2 id="new-customer-title" style={styles.title}>
              Novo cliente
            </h2>
            <p style={styles.description}>Preencha os dados pessoais, de contato e endereço.</p>
          </div>
          <CloseButton icon="close" label="Fechar formulário" onClick={handleClose} />
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          <fieldset style={styles.fieldset} disabled={isSubmitting}>
            <legend style={styles.legend}>Dados pessoais</legend>
            <div style={styles.formGrid}>
              <FormField
                label="Nome completo"
                name="name"
                value={values.name}
                required
                autoFocus
                onChange={handleChange}
              />
              <FormField
                label="CPF"
                name="cpf"
                value={values.cpf}
                required
                inputMode="numeric"
                placeholder="000.000.000-00"
                pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"
                onChange={(event) => handleMaskedChange(event, 11)}
              />
              <FormField
                label="Email"
                name="email"
                value={values.email}
                type="email"
                required
                placeholder="cliente@email.com"
                onChange={handleChange}
              />
              <FormField
                label="Telefone principal"
                name="phoneNumber"
                value={values.phoneNumber}
                required
                inputMode="tel"
                placeholder="(00) 00000-0000"
                pattern="\(\d{2}\) \d{4,5}-\d{4}"
                onChange={(event) => handleMaskedChange(event, 11)}
              />
              <FormField
                label="Telefone secundário"
                name="phoneNumber2"
                value={values.phoneNumber2}
                inputMode="tel"
                placeholder="(00) 00000-0000"
                pattern="\(\d{2}\) \d{4,5}-\d{4}"
                onChange={(event) => handleMaskedChange(event, 11)}
              />
            </div>
          </fieldset>

          <fieldset style={styles.fieldset} disabled={isSubmitting}>
            <legend style={styles.legend}>Endereço</legend>
            <div style={styles.formGrid}>
              <FormField
                label="CEP"
                name="zipCode"
                value={values.zipCode}
                required
                inputMode="numeric"
                placeholder="00000-000"
                pattern="\d{5}-\d{3}"
                onChange={(event) => handleMaskedChange(event, 8)}
              />
              <FormField
                label="Logradouro"
                name="addressStreet"
                value={values.addressStreet}
                required
                onChange={handleChange}
              />
              <FormField
                label="Número"
                name="addressNumber"
                value={values.addressNumber}
                required
                onChange={handleChange}
              />
              <FormField
                label="Complemento"
                name="addressComplement"
                value={values.addressComplement}
                onChange={handleChange}
              />
              <FormField
                label="Bairro"
                name="neighborhood"
                value={values.neighborhood}
                required
                onChange={handleChange}
              />
              <FormField
                label="Cidade"
                name="city"
                value={values.city}
                required
                onChange={handleChange}
              />
              <FormField
                label="UF"
                name="state"
                value={values.state}
                required
                minLength={2}
                maxLength={2}
                placeholder="SP"
                onChange={handleChange}
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
              {isSubmitting ? "Salvando..." : "Cadastrar cliente"}
            </GenericButton>
          </div>
        </form>
      </section>
    </div>
  );
}

interface FormFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "style" | "name"> {
  label: string;
  name: keyof FormValues;
}

function FormField({ label, name, ...inputProps }: FormFieldProps) {
  const id = `customer-${name}`;
  return (
    <div>
      <label htmlFor={id} style={styles.inputLabel}>
        {label}
        {inputProps.required && <span aria-hidden="true"> *</span>}
      </label>
      <input {...inputProps} id={id} name={name} style={styles.input} />
    </div>
  );
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
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
    width: "min(100%, 820px)",
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
  form: { display: "flex", marginTop: "1.5rem", flexDirection: "column", gap: "1rem" },
  fieldset: { minWidth: 0, padding: "1rem", border: "1px solid #e2e8f0", borderRadius: "9px" },
  legend: { padding: "0 0.35rem", color: "#334155", fontSize: "0.8rem", fontWeight: 700 },
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
  errorMessage: {
    padding: "0.75rem 0.9rem",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    fontSize: "0.82rem",
  },
  actions: { display: "flex", justifyContent: "flex-end", gap: "0.75rem", flexWrap: "wrap" },
  cancelButton: { borderColor: "#cbd5e1", backgroundColor: "#ffffff", color: "#0f172a" },
  submitButton: { backgroundColor: "#000000", color: "#ffffff" },
  submitButtonDisabled: {
    backgroundColor: "#64748b",
    color: "#ffffff",
    cursor: "not-allowed",
    opacity: 0.65,
  },
} satisfies Record<string, CSSProperties>;
