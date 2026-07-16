import { useEffect, useState, type CSSProperties } from "react";
import { GenericButton } from "../components/buttons/GenericButton";
import { NewItemButton } from "../components/buttons/NewItemButton";
import { NewRentalModal } from "../components/modals/NewRentalModal";
import { RentalDetailsModal } from "../components/modals/RentalDetailsModal";
import { getCustomers } from "../services/customerService";
import { getInventoryItems } from "../services/inventoryService";
import { createRental, getRentals } from "../services/rentalService";
import type { Customer } from "../types/customer";
import type { InventoryItem } from "../types/inventory";
import type { CreateRentalRequest, Rental, RentalStatus } from "../types/rental";
import { formatCurrency, formatDate } from "../utils/formatters";
import { getRentalStatusColors, getRentalStatusLabel } from "../utils/rental";

interface RentalPageData {
  rentals: Rental[];
  customers: Customer[];
  inventoryItems: InventoryItem[];
}

async function getRentalPageData(): Promise<RentalPageData> {
  const [rentals, customers, inventoryItems] = await Promise.all([
    getRentals(),
    getCustomers(),
    getInventoryItems(),
  ]);

  return { rentals, customers, inventoryItems };
}

export function RentalPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [isNewRentalModalOpen, setIsNewRentalModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    getRentalPageData()
      .then((data) => {
        if (!isActive) return;

        setRentals(data.rentals);
        setCustomers(data.customers);
        setInventoryItems(data.inventoryItems);
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

  const availableItems = inventoryItems.filter((item) => item.status === "AVAILABLE");
  const normalizedSearch = searchTerm.trim().toLocaleLowerCase("pt-BR");
  const orderedRentals = [...rentals].sort((first, second) => second.id - first.id);
  const filteredRentals = normalizedSearch
    ? orderedRentals.filter((rental) =>
        [
          rental.id.toString(),
          rental.customer.name,
          rental.customer.cpf,
          rental.status,
          getRentalStatusLabel(rental.status),
          rental.rentalDate,
          rental.expectedReturnDate,
          ...rental.rentalItems.flatMap((item) => [
            item.inventoryItem.code || "",
            item.inventoryItem.product.name,
          ]),
        ]
          .join(" ")
          .toLocaleLowerCase("pt-BR")
          .includes(normalizedSearch),
      )
    : orderedRentals;

  async function handleRetry() {
    setIsLoading(true);
    setLoadError(null);

    try {
      const data = await getRentalPageData();
      setRentals(data.rentals);
      setCustomers(data.customers);
      setInventoryItems(data.inventoryItems);
    } catch (error) {
      setLoadError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  function handleOpenNewRentalModal() {
    setCreateError(null);
    setIsNewRentalModalOpen(true);
  }

  async function handleCreateRental(data: CreateRentalRequest) {
    setIsCreating(true);
    setCreateError(null);

    try {
      await createRental(data);
      const [refreshedRentals, refreshedInventory] = await Promise.all([
        getRentals(),
        getInventoryItems(),
      ]);

      setRentals(refreshedRentals);
      setInventoryItems(refreshedInventory);
      setIsNewRentalModalOpen(false);
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
          <span style={styles.eyebrow}>Locações</span>
          <h1 style={styles.title}>Gerencie suas locações</h1>
          <p style={styles.subtitle}>
            Acompanhe retiradas, devoluções, clientes e peças locadas.
          </p>
        </div>

        <NewItemButton
          label="Nova locação"
          disabled={isLoading || Boolean(loadError)}
          onClick={handleOpenNewRentalModal}
        />
      </header>

      <div style={styles.toolbar}>
        <div style={styles.searchField}>
          <label htmlFor="rental-search" style={styles.searchLabel}>
            Buscar locação
          </label>
          <input
            id="rental-search"
            type="search"
            value={searchTerm}
            placeholder="Número, cliente, CPF, item, código ou status"
            style={styles.searchInput}
            disabled={isLoading || Boolean(loadError)}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        {!isLoading && !loadError && (
          <span style={styles.resultCount}>
            {filteredRentals.length} {filteredRentals.length === 1 ? "locação" : "locações"}
          </span>
        )}
      </div>

      {isLoading ? (
        <PageState
          title="Carregando locações..."
          description="Buscando locações, clientes e itens disponíveis."
        />
      ) : loadError ? (
        <div style={styles.errorState}>
          <strong style={styles.errorTitle}>Não foi possível carregar as locações</strong>
          <p style={styles.errorDescription}>{loadError}</p>
          <GenericButton style={styles.retryButton} onClick={handleRetry}>
            Tentar novamente
          </GenericButton>
        </div>
      ) : filteredRentals.length > 0 ? (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Locação</th>
                <th style={styles.tableHeader}>Cliente</th>
                <th style={styles.tableHeader}>Retirada</th>
                <th style={styles.tableHeader}>Devolução prevista</th>
                <th style={styles.tableHeader}>Itens</th>
                <th style={styles.tableHeader}>Total</th>
                <th style={styles.tableHeader}>Status</th>
                <th style={styles.actionsHeader}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredRentals.map((rental) => (
                <tr key={rental.id} style={styles.tableRow}>
                  <td style={styles.idCell}>#{rental.id}</td>
                  <td style={styles.customerCell}>
                    <div style={styles.customerContent}>
                      <strong style={styles.customerName}>{rental.customer.name}</strong>
                      <span style={styles.customerCpf}>CPF {rental.customer.cpf}</span>
                    </div>
                  </td>
                  <td style={styles.tableCell}>{formatDate(rental.rentalDate)}</td>
                  <td style={styles.tableCell}>{formatDate(rental.expectedReturnDate)}</td>
                  <td style={styles.tableCell}>{rental.rentalItems.length}</td>
                  <td style={styles.totalCell}>{formatCurrency(rental.totalPrice)}</td>
                  <td style={styles.tableCell}>
                    <RentalStatusBadge status={rental.status} />
                  </td>
                  <td style={styles.actionsCell}>
                    <GenericButton
                      style={styles.detailsButton}
                      onClick={() => setSelectedRental(rental)}
                    >
                      Ver detalhes
                    </GenericButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : rentals.length === 0 ? (
        <PageState
          title="Nenhuma locação cadastrada"
          description="Crie a primeira locação selecionando um cliente e itens disponíveis."
        />
      ) : (
        <PageState
          title="Nenhuma locação encontrada"
          description="Tente buscar usando outro número, cliente, CPF, item, código ou status."
        />
      )}

      {isNewRentalModalOpen && (
        <NewRentalModal
          customers={customers}
          availableItems={availableItems}
          isSubmitting={isCreating}
          error={createError}
          onClose={() => setIsNewRentalModalOpen(false)}
          onSubmit={handleCreateRental}
        />
      )}

      {selectedRental && (
        <RentalDetailsModal
          rental={selectedRental}
          onClose={() => setSelectedRental(null)}
        />
      )}
    </section>
  );
}

interface RentalStatusBadgeProps {
  status: RentalStatus;
}

function RentalStatusBadge({ status }: RentalStatusBadgeProps) {
  const badgeStyle = {
    ...styles.statusBadge,
    ...getRentalStatusColors(status),
  };

  return <span style={badgeStyle}>{getRentalStatusLabel(status)}</span>;
}

interface PageStateProps {
  title: string;
  description: string;
}

function PageState({ title, description }: PageStateProps) {
  return (
    <div style={styles.pageState}>
      <strong style={styles.pageStateTitle}>{title}</strong>
      <p style={styles.pageStateDescription}>{description}</p>
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
    width: "min(100%, 520px)",
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
  tableContainer: {
    marginTop: "1rem",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    minWidth: "1080px",
    borderCollapse: "collapse",
  },
  tableHeader: {
    padding: "0.8rem 1rem",
    borderBottom: "1px solid #e2e8f0",
    backgroundColor: "#f8fafc",
    color: "#64748b",
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textAlign: "left",
    textTransform: "uppercase",
  },
  actionsHeader: {
    padding: "0.8rem 1rem",
    borderBottom: "1px solid #e2e8f0",
    backgroundColor: "#f8fafc",
    color: "#64748b",
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textAlign: "right",
    textTransform: "uppercase",
  },
  tableRow: {
    backgroundColor: "#ffffff",
  },
  tableCell: {
    padding: "0.9rem 1rem",
    borderBottom: "1px solid #f1f5f9",
    color: "#475569",
    fontSize: "0.82rem",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
  },
  idCell: {
    padding: "0.9rem 1rem",
    borderBottom: "1px solid #f1f5f9",
    color: "#0f172a",
    fontSize: "0.82rem",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  customerCell: {
    minWidth: "210px",
    padding: "0.9rem 1rem",
    borderBottom: "1px solid #f1f5f9",
    verticalAlign: "middle",
  },
  customerContent: {
    display: "flex",
    flexDirection: "column",
    gap: "0.2rem",
  },
  customerName: {
    color: "#0f172a",
    fontSize: "0.85rem",
    fontWeight: 600,
  },
  customerCpf: {
    color: "#64748b",
    fontSize: "0.74rem",
  },
  totalCell: {
    padding: "0.9rem 1rem",
    borderBottom: "1px solid #f1f5f9",
    color: "#0f172a",
    fontSize: "0.82rem",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  actionsCell: {
    padding: "0.9rem 1rem",
    borderBottom: "1px solid #f1f5f9",
    textAlign: "right",
    whiteSpace: "nowrap",
  },
  statusBadge: {
    display: "inline-flex",
    padding: "0.28rem 0.58rem",
    border: "1px solid",
    borderRadius: "999px",
    fontSize: "0.7rem",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  detailsButton: {
    minHeight: "auto",
    padding: "0.5rem 0.7rem",
    borderColor: "#cbd5e1",
    backgroundColor: "#ffffff",
    color: "#0f172a",
    fontSize: "0.76rem",
  },
  pageState: {
    marginTop: "1rem",
    padding: "3.5rem 1.5rem",
    border: "1px dashed #cbd5e1",
    borderRadius: "10px",
    backgroundColor: "#f8fafc",
    textAlign: "center",
  },
  pageStateTitle: {
    display: "block",
    color: "#0f172a",
    fontSize: "1rem",
  },
  pageStateDescription: {
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
