import { useEffect, useState, type CSSProperties } from "react";
import { ProductDetailsModal } from "../components/modals/ProductDetailsModal";
import { GenericButton } from "../components/buttons/GenericButton";
import { NewItemButton } from "../components/buttons/NewItemButton";
import { ProductCard } from "../components/cards/ProductCard";
import { getProducts } from "../services/productService";
import type { Product } from "../types/product";
import { getProductTypeLabel } from "../utils/product";

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    getProducts()
      .then((data) => {
        if (isActive) setProducts(data);
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
  const filteredProducts = normalizedSearch
    ? products.filter((product) =>
        [
          product.name,
          product.brand || "",
          product.color,
          product.size,
          getProductTypeLabel(product.type),
        ]
          .join(" ")
          .toLocaleLowerCase("pt-BR")
          .includes(normalizedSearch),
      )
    : products;

  async function handleRetry() {
    setIsLoading(true);
    setLoadError(null);

    try {
      setProducts(await getProducts());
    } catch (error) {
      setLoadError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section style={styles.page}>
      <header style={styles.header}>
        <div>
          <span style={styles.eyebrow}>Produtos</span>
          <h1 style={styles.title}>Gerencie seus produtos</h1>
          <p style={styles.subtitle}>
            Consulte modelos, tamanhos, cores e valores de locação.
          </p>
        </div>

        <NewItemButton
          label="Novo produto"
          disabled={isLoading}
          onClick={() => alert("Implementar criação de produto")}
        />
      </header>

      <div style={styles.toolbar}>
        <div style={styles.searchField}>
          <label htmlFor="product-search" style={styles.searchLabel}>
            Buscar produto
          </label>
          <input
            id="product-search"
            type="search"
            value={searchTerm}
            placeholder="Nome, tipo, marca, tamanho ou cor"
            style={styles.searchInput}
            disabled={isLoading || Boolean(loadError)}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        {!isLoading && !loadError && (
          <span style={styles.resultCount}>
            {filteredProducts.length} {filteredProducts.length === 1 ? "produto" : "produtos"}
          </span>
        )}
      </div>

      {isLoading ? (
        <PageState title="Carregando produtos..." description="Buscando produtos cadastrados." />
      ) : loadError ? (
        <div style={styles.errorState}>
          <strong style={styles.errorTitle}>Não foi possível carregar os produtos</strong>
          <p style={styles.errorDescription}>{loadError}</p>
          <GenericButton style={styles.retryButton} onClick={handleRetry}>
            Tentar novamente
          </GenericButton>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div style={styles.productGrid}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isSelected={selectedProduct?.id === product.id}
              onSelect={setSelectedProduct}
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <PageState
          title="Nenhum produto cadastrado"
          description="Os produtos cadastrados aparecerão aqui."
        />
      ) : (
        <PageState
          title="Nenhum produto encontrado"
          description="Tente buscar usando outro nome, tipo, marca, tamanho ou cor."
        />
      )}

      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
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
  productGrid: {
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
