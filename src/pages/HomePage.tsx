import type { CSSProperties } from "react";
import suitMaleLogo from "../img/suit_male_logo.jpg";

export function HomePage() {
  return (
    <section style={styles.page}>
      <div style={styles.welcome}>
        <img src={suitMaleLogo} alt="Terno Masculino" style={styles.image} />
        <span style={styles.appName}>Suit Rental</span>
        <h1 style={styles.title}>Bem-vindo!</h1>
        <p style={styles.description}>Seu espaço para organizar a locação de ternos</p>
      </div>
    </section>
  );
}

const styles = {
  page: {
    display: "flex",
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    maxWidth: "100%",
    height: "auto",
  },
  welcome: {
    maxWidth: "560px",
    textAlign: "center",
  },
  appName: {
    display: "block",
    marginBottom: "0.75rem",
    color: "#64748b",
    fontSize: "0.75rem",
    fontWeight: 600,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
  },
  title: {
    color: "#0f172a",
    fontSize: "clamp(2rem, 5vw, 3rem)",
    lineHeight: 1.1,
  },
  description: {
    marginTop: "1rem",
    color: "#64748b",
    fontSize: "1rem",
    lineHeight: 1.6,
  },
} satisfies Record<string, CSSProperties>;
