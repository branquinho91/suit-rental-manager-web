import { useEffect, useState, type CSSProperties } from "react";
import { CustomerDetailsModal } from "../components/modals/CustomerDetailsModal";
import { NewCustomerModal } from "../components/modals/NewCustomerModal";
import { GenericButton } from "../components/buttons/GenericButton";
import { NewItemButton } from "../components/buttons/NewItemButton";
import { CustomerCard } from "../components/cards/CustomerCard";
import { createCustomer, getCustomers } from "../services/customerService";
import type { CreateCustomerRequest, Customer } from "../types/customer";

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    getCustomers()
      .then((data) => {
        if (isActive) setCustomers(data);
      })
      .catch((error: unknown) => {
        if (isActive) setLoadError(getErrorMessage(error));
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const normalizedSearch = searchTerm.trim().toLocaleLowerCase("pt-BR");
  const filteredCustomers = normalizedSearch
    ? customers.filter((customer) =>
        [customer.name, customer.cpf, customer.email, customer.phoneNumber, customer.address.city]
          .join(" ")
          .toLocaleLowerCase("pt-BR")
          .includes(normalizedSearch),
      )
    : customers;
  const sortedCustomers = [...filteredCustomers].sort((a, b) => b.id - a.id);

  async function handleRetry() {
    setIsLoading(true);
    setLoadError(null);

    try {
      setCustomers(await getCustomers());
    } catch (error) {
      setLoadError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  function handleOpenNewCustomerModal() {
    setCreateError(null);
    setIsNewCustomerModalOpen(true);
  }

  async function handleCreateCustomer(data: CreateCustomerRequest) {
    setIsCreating(true);
    setCreateError(null);

    try {
      await createCustomer(data);
      setCustomers(await getCustomers());
      setIsNewCustomerModalOpen(false);
    } catch (error) {
      setCreateError(getErrorMessage(error));
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <section style={styles.page}>
      <header style={styles.header}>
        <div>
          <span style={styles.eyebrow}>Clientes</span>
          <h1 style={styles.title}>Gerencie seus clientes</h1>
          <p style={styles.subtitle}>Consulte dados pessoais, contatos e endereços cadastrados.</p>
        </div>

        <NewItemButton
          label="Novo cliente"
          disabled={isLoading}
          onClick={handleOpenNewCustomerModal}
        />
      </header>

      <div style={styles.toolbar}>
        <div style={styles.searchField}>
          <label htmlFor="customer-search" style={styles.searchLabel}>
            Buscar cliente
          </label>
          <input
            id="customer-search"
            type="search"
            value={searchTerm}
            placeholder="Nome, CPF, email, telefone ou cidade"
            style={styles.searchInput}
            disabled={isLoading || Boolean(loadError)}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        {!isLoading && !loadError && (
          <span style={styles.resultCount}>
            {filteredCustomers.length} {filteredCustomers.length === 1 ? "cliente" : "clientes"}
          </span>
        )}
      </div>

      {isLoading ? (
        <PageState title="Carregando clientes..." description="Buscando clientes cadastrados." />
      ) : loadError ? (
        <div style={styles.errorState}>
          <strong style={styles.errorTitle}>Não foi possível carregar os clientes</strong>
          <p style={styles.errorDescription}>{loadError}</p>
          <GenericButton style={styles.retryButton} onClick={handleRetry}>
            Tentar novamente
          </GenericButton>
        </div>
      ) : sortedCustomers.length > 0 ? (
        <div style={styles.customerGrid}>
          {sortedCustomers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              isSelected={selectedCustomer?.id === customer.id}
              onSelect={setSelectedCustomer}
            />
          ))}
        </div>
      ) : customers.length === 0 ? (
        <PageState
          title="Nenhum cliente cadastrado"
          description="Os clientes cadastrados aparecerão aqui."
        />
      ) : (
        <PageState
          title="Nenhum cliente encontrado"
          description="Tente buscar usando outro nome, CPF, email ou telefone."
        />
      )}

      {selectedCustomer && (
        <CustomerDetailsModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}

      {isNewCustomerModalOpen && (
        <NewCustomerModal
          isSubmitting={isCreating}
          error={createError}
          onClose={() => setIsNewCustomerModalOpen(false)}
          onSubmit={handleCreateCustomer}
        />
      )}
    </section>
  );
}

interface PageStateProps {
  title: string;
  description: string;
}

function PageState({ title, description }: PageStateProps) {
  return (
    <div style={styles.emptyState}>
      <strong style={styles.emptyTitle}>{title}</strong>
      <p style={styles.emptyDescription}>{description}</p>
    </div>
  );
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Ocorreu um erro inesperado.";
}

const styles = {
  page: {
    width: "100%",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "1.5rem",
    flexWrap: "wrap",
  },
  eyebrow: {
    display: "block",
    marginBottom: "0.5rem",
    color: "#64748b",
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
  },
  title: {
    color: "#0f172a",
    fontSize: "1.8rem",
    lineHeight: 1.2,
  },
  subtitle: {
    marginTop: "0.5rem",
    color: "#64748b",
    fontSize: "0.95rem",
    lineHeight: 1.5,
  },
  toolbar: {
    display: "flex",
    marginTop: "2rem",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "1rem",
    flexWrap: "wrap",
  },
  searchField: {
    width: "min(100%, 460px)",
  },
  searchLabel: {
    display: "block",
    marginBottom: "0.45rem",
    color: "#334155",
    fontSize: "0.8rem",
    fontWeight: 600,
  },
  searchInput: {
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
  resultCount: {
    color: "#64748b",
    fontSize: "0.85rem",
    fontWeight: 500,
  },
  customerGrid: {
    display: "grid",
    marginTop: "1rem",
    gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 360px))",
    gap: "1rem",
  },
  emptyState: {
    marginTop: "1rem",
    padding: "3.5rem 1.5rem",
    border: "1px dashed #cbd5e1",
    borderRadius: "10px",
    backgroundColor: "#f8fafc",
    textAlign: "center",
  },
  emptyTitle: {
    display: "block",
    color: "#0f172a",
    fontSize: "1rem",
  },
  emptyDescription: {
    marginTop: "0.5rem",
    color: "#64748b",
    fontSize: "0.85rem",
  },
  errorState: {
    marginTop: "1rem",
    padding: "2.5rem 1.5rem",
    border: "1px solid #fecaca",
    borderRadius: "10px",
    backgroundColor: "#fef2f2",
    textAlign: "center",
  },
  errorTitle: {
    display: "block",
    color: "#991b1b",
    fontSize: "1rem",
  },
  errorDescription: {
    marginTop: "0.5rem",
    color: "#b91c1c",
    fontSize: "0.84rem",
  },
  retryButton: {
    marginTop: "1rem",
    backgroundColor: "#000000",
    color: "#ffffff",
  },
} satisfies Record<string, CSSProperties>;
