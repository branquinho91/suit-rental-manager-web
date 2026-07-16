import type { CSSProperties } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Sidebar } from "./components/Sidebar";
import { HomePage } from "./pages/HomePage";
import { CustomersPage } from "./pages/CustomersPage";
import { ProductsPage } from "./pages/ProductsPage";
import { InventoryPage } from "./pages/InventoryPage";
import { RentalPage } from "./pages/RentalPage";

function App() {
  return (
    <Router>
      <div style={styles.layout}>
        <Sidebar />

        <div style={styles.page}>
          <main style={styles.content}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/rentals" element={<RentalPage />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;

const styles: Record<string, CSSProperties> = {
  layout: {
    display: "flex",
    minHeight: "100vh",
  },
  page: {
    display: "flex",
    flex: 1,
    minWidth: 0,
    minHeight: "100vh",
    flexDirection: "column",
  },
  content: {
    display: "flex",
    flex: 1,
    minWidth: 0,
    padding: "2rem",
  },
};
