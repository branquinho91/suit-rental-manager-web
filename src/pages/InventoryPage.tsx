import { useEffect, useState, type CSSProperties } from "react";
import { AddInventoryItemModal } from "../components/modals/AddInventoryItemModal";
import { InventoryItemDetailsModal } from "../components/modals/InventoryItemDetailsModal";
import { GenericButton } from "../components/buttons/GenericButton";
import { NewItemButton } from "../components/buttons/NewItemButton";
import { createInventoryItem, getInventoryItems } from "../services/inventoryService";
import { getProducts } from "../services/productService";
import type { InventoryItem, InventoryStatus } from "../types/inventory";
import type { Product } from "../types/product";
import { getInventoryStatusColors, getInventoryStatusLabel } from "../utils/inventory";
import { getProductTypeLabel } from "../utils/product";

interface InventoryData {
  products: Product[];
  inventoryItems: InventoryItem[];
}

async function getInventoryData(): Promise<InventoryData> {
  const [products, inventoryItems] = await Promise.all([getProducts(), getInventoryItems()]);

  return { products, inventoryItems };
}

export function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    getInventoryData()
      .then((data) => {
        if (!isActive) return;

        setProducts(data.products);
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

  const normalizedSearch = searchTerm.trim().toLocaleLowerCase("pt-BR");
  const filteredItems = normalizedSearch
    ? inventoryItems.filter((item) =>
        [
          item.code || "",
          item.product.name,
          getProductTypeLabel(item.product.type),
          item.product.size,
          item.product.color,
          item.status,
          getInventoryStatusLabel(item.status),
        ]
          .join(" ")
          .toLocaleLowerCase("pt-BR")
          .includes(normalizedSearch),
      )
    : inventoryItems;

  async function handleRetry() {
    setIsLoading(true);
    setLoadError(null);

    try {
      const data = await getInventoryData();
      setProducts(data.products);
      setInventoryItems(data.inventoryItems);
    } catch (error) {
      setLoadError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  function handleOpenAddModal() {
    setCreateError(null);
    setIsAddModalOpen(true);
  }

  async function handleCreateItem(productId: number) {
    setIsCreating(true);
    setCreateError(null);

    try {
      await createInventoryItem({ productId });
      const refreshedItems = await getInventoryItems();

      setInventoryItems(refreshedItems);
      setIsAddModalOpen(false);
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
          <span style={styles.eyebrow}>Estoque</span>
          <h1 style={styles.title}>Controle seu estoque</h1>
          <p style={styles.subtitle}>Gerencie as peças físicas disponíveis para locação.</p>
        </div>

        <NewItemButton label="Adicionar item" disabled={isLoading} onClick={handleOpenAddModal} />
      </header>

      <div style={styles.toolbar}>
        <div style={styles.searchField}>
          <label htmlFor="inventory-search" style={styles.searchLabel}>
            Buscar no estoque
          </label>
          <input
            id="inventory-search"
            type="search"
            value={searchTerm}
            placeholder="Código, produto, tipo, tamanho, cor ou status"
            style={styles.searchInput}
            disabled={isLoading || Boolean(loadError)}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        {!isLoading && !loadError && (
          <span style={styles.resultCount}>
            {filteredItems.length} {filteredItems.length === 1 ? "item" : "itens"}
          </span>
        )}
      </div>

      {isLoading ? (
        <PageState
          title="Carregando estoque..."
          description="Buscando produtos e unidades físicas."
        />
      ) : loadError ? (
        <div style={styles.errorState}>
          <strong style={styles.errorTitle}>Não foi possível carregar o estoque</strong>
          <p style={styles.errorDescription}>{loadError}</p>
          <GenericButton style={styles.retryButton} onClick={handleRetry}>
            Tentar novamente
          </GenericButton>
        </div>
      ) : filteredItems.length > 0 ? (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Código</th>
                <th style={styles.tableHeader}>Produto</th>
                <th style={styles.tableHeader}>Tipo</th>
                <th style={styles.tableHeader}>Tamanho</th>
                <th style={styles.tableHeader}>Cor</th>
                <th style={styles.tableHeader}>Status</th>
                <th style={styles.actionsHeader}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} style={styles.tableRow}>
                  <td style={styles.codeCell}>{item.code || "—"}</td>
                  <td style={styles.productCell}>
                    <div style={styles.productContent}>
                      <strong style={styles.productName}>{item.product.name}</strong>
                      <span style={styles.productBrand}>
                        {item.product.brand || "Marca não informada"}
                      </span>
                    </div>
                  </td>
                  <td style={styles.tableCell}>{getProductTypeLabel(item.product.type)}</td>
                  <td style={styles.tableCell}>{item.product.size}</td>
                  <td style={styles.tableCell}>{item.product.color}</td>
                  <td style={styles.tableCell}>
                    <InventoryStatusBadge status={item.status} />
                  </td>
                  <td style={styles.actionsCell}>
                    <GenericButton
                      style={styles.detailsButton}
                      onClick={() => setSelectedItem(item)}
                    >
                      Ver detalhes
                    </GenericButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : inventoryItems.length === 0 ? (
        <PageState
          title="Nenhum item no estoque"
          description="Adicione a primeira unidade física selecionando um produto existente."
        />
      ) : (
        <PageState
          title="Nenhum item encontrado"
          description="Tente buscar usando outro código, produto, tipo, tamanho, cor ou status."
        />
      )}

      {isAddModalOpen && (
        <AddInventoryItemModal
          products={products}
          isSubmitting={isCreating}
          error={createError}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleCreateItem}
        />
      )}

      {selectedItem && (
        <InventoryItemDetailsModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </section>
  );
}

interface InventoryStatusBadgeProps {
  status: InventoryStatus;
}

function InventoryStatusBadge({ status }: InventoryStatusBadgeProps) {
  const badgeStyle = {
    ...styles.statusBadge,
    ...getInventoryStatusColors(status),
  };

  return <span style={badgeStyle}>{getInventoryStatusLabel(status)}</span>;
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
    minWidth: "960px",
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
  },
  codeCell: {
    padding: "0.9rem 1rem",
    borderBottom: "1px solid #f1f5f9",
    color: "#0f172a",
    fontSize: "0.82rem",
    fontWeight: 700,
    letterSpacing: "0.03em",
    whiteSpace: "nowrap",
  },
  productCell: {
    minWidth: "230px",
    padding: "0.9rem 1rem",
    borderBottom: "1px solid #f1f5f9",
    verticalAlign: "middle",
  },
  productContent: {
    display: "flex",
    flexDirection: "column",
    gap: "0.2rem",
  },
  productName: {
    color: "#0f172a",
    fontSize: "0.85rem",
    fontWeight: 600,
  },
  productBrand: {
    color: "#64748b",
    fontSize: "0.74rem",
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
