import { useState, type CSSProperties } from "react";
import { Link, useLocation } from "react-router-dom";
import { CloseButton } from "./buttons/CloseButton";

const navigationItems = [
  { label: "Home", path: "/" },
  { label: "Clientes", path: "/customers" },
  { label: "Produtos", path: "/products" },
  { label: "Estoque", path: "/inventory" },
  { label: "Locações", path: "/rentals" },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { pathname } = useLocation();

  function toggleSidebar() {
    setIsOpen((currentState) => !currentState);
  }

  function getNavigationItemStyle(path: string) {
    const isActive = pathname === path;
    const isHovered = hoveredItem === path;

    if (isActive && isHovered) return styles.navigationItemActiveHover;
    if (isActive) return styles.navigationItemActive;
    if (isHovered) return styles.navigationItemHover;

    return styles.navigationItem;
  }

  return (
    <aside style={isOpen ? styles.sidebarOpen : styles.sidebarClosed}>
      <CloseButton
        icon={isOpen ? "close" : "menu"}
        label={isOpen ? "Fechar menu" : "Abrir menu"}
        expanded={isOpen}
        controls="main-navigation"
        onClick={toggleSidebar}
      />

      {isOpen && (
        <div style={styles.menuContent}>
          <h2 style={styles.title}>Suit Rental</h2>

          <nav id="main-navigation" style={styles.navigation}>
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={getNavigationItemStyle(item.path)}
                onMouseEnter={() => setHoveredItem(item.path)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </aside>
  );
}

const sharedSidebarStyles: CSSProperties = {
  flexShrink: 0,
  minHeight: "100vh",
  padding: "1rem",
  borderRight: "1px solid #ccc",
  backgroundColor: "#ccc",
  overflow: "hidden",
  transition: "width 200ms ease",
};

const sharedNavigationItemStyles: CSSProperties = {
  padding: "0.7rem 0.8rem",
  borderRadius: "8px",
  color: "#000",
  fontSize: "0.95rem",
  fontWeight: 500,
  textDecoration: "none",
  transition: "all 160ms ease",
};

const styles = {
  sidebarOpen: {
    ...sharedSidebarStyles,
    width: "220px",
  },
  sidebarClosed: {
    ...sharedSidebarStyles,
    width: "68px",
  },
  menuContent: {
    marginTop: "1rem",
  },
  title: {
    color: "#0f172a",
    fontSize: "1.25rem",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  navigation: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    marginTop: "1rem",
    whiteSpace: "nowrap",
  },
  navigationItem: {
    ...sharedNavigationItemStyles,
  },
  navigationItemHover: {
    ...sharedNavigationItemStyles,
    backgroundColor: "#e2e8f0",
    color: "#000",
    transform: "translateX(4px)",
  },
  navigationItemActive: {
    ...sharedNavigationItemStyles,
    backgroundColor: "#000",
    color: "#ffffff",
    fontWeight: 600,
    boxShadow: "0 4px 10px rgba(15, 23, 42, 0.2)",
  },
  navigationItemActiveHover: {
    ...sharedNavigationItemStyles,
    backgroundColor: "#000",
    color: "#ffffff",
    fontWeight: 600,
    boxShadow: "0 6px 14px rgba(15, 23, 42, 0.28)",
    transform: "translateX(4px)",
  },
} satisfies Record<string, CSSProperties>;
