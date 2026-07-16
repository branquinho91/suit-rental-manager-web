import { useState, type CSSProperties } from "react";

type SocialLink = "github" | "linkedin";

export function Footer() {
  const [hoveredLink, setHoveredLink] = useState<SocialLink | null>(null);

  function getLinkStyle(link: SocialLink) {
    return hoveredLink === link ? styles.socialLinkHover : styles.socialLink;
  }

  return (
    <footer style={styles.footer}>
      <p style={styles.credit}>
        Developed by <strong style={styles.author}>Gustavo Branquinho</strong>
      </p>

      <nav aria-label="Redes sociais" style={styles.socialLinks}>
        <a
          href="https://github.com/branquinho91"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="GitHub de Gustavo Branquinho"
          style={getLinkStyle("github")}
          onMouseEnter={() => setHoveredLink("github")}
          onMouseLeave={() => setHoveredLink(null)}
        >
          <GitHubIcon />
          <span>branquinho91</span>
        </a>

        <a
          href="https://www.linkedin.com/in/gustavobranquinho2/"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="LinkedIn de Gustavo Branquinho"
          style={getLinkStyle("linkedin")}
          onMouseEnter={() => setHoveredLink("linkedin")}
          onMouseLeave={() => setHoveredLink(null)}
        >
          <LinkedInIcon />
          <span>gustavobranquinho2</span>
        </a>
      </nav>
    </footer>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" style={styles.icon} aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 .7a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.23c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18a4.64 4.64 0 0 1 1.23 3.22c0 4.61-2.81 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58A12 12 0 0 0 12 .7Z"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" style={styles.icon} aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V8.98h3.42v1.57h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.29ZM5.32 7.41a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.04H3.54V8.98H7.1v11.47ZM22.23 0H1.77A1.75 1.75 0 0 0 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46A1.75 1.75 0 0 0 24 22.27V1.73C24 .77 23.21 0 22.23 0Z"
      />
    </svg>
  );
}

const sharedLinkStyles: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4rem",
  padding: "0.35rem 0.5rem",
  borderRadius: "6px",
  color: "#475569",
  fontSize: "0.8rem",
  fontWeight: 500,
  textDecoration: "none",
  transition: "all 160ms ease",
};

const styles = {
  footer: {
    position: "sticky",
    bottom: 0,
    zIndex: 10,
    display: "flex",
    minHeight: "52px",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    padding: "0.5rem 2rem",
    borderTop: "1px solid #e2e8f0",
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    boxShadow: "0 -4px 12px rgba(15, 23, 42, 0.04)",
    backdropFilter: "blur(8px)",
    flexWrap: "wrap",
  },
  credit: {
    color: "#64748b",
    fontSize: "0.8rem",
  },
  author: {
    color: "#0f172a",
    fontWeight: 600,
  },
  socialLinks: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
  },
  socialLink: {
    ...sharedLinkStyles,
  },
  socialLinkHover: {
    ...sharedLinkStyles,
    backgroundColor: "#e2e8f0",
    color: "#000000",
    transform: "translateY(-2px)",
  },
  icon: {
    width: "17px",
    height: "17px",
    flexShrink: 0,
  },
} satisfies Record<string, CSSProperties>;
