import { useState, type CSSProperties } from "react";

interface CloseButtonProps {
  icon: "close" | "menu";
  label: string;
  onClick: () => void;
  expanded?: boolean;
  controls?: string;
}

export function CloseButton({ icon, label, onClick, expanded, controls }: CloseButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle =
    icon === "close"
      ? isHovered
        ? styles.closeButtonHover
        : styles.closeButton
      : isHovered
        ? styles.menuButtonHover
        : styles.menuButton;

  return (
    <button
      type="button"
      style={buttonStyle}
      aria-label={label}
      aria-expanded={expanded}
      aria-controls={controls}
      title={label}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {icon === "close" ? "\u00d7" : "\u2630"}
    </button>
  );
}

const sharedButtonStyles: CSSProperties = {
  display: "block",
  width: "36px",
  height: "36px",
  border: "1px solid #000",
  borderRadius: "8px",
  backgroundColor: "#fff",
  color: "#475569",
  boxShadow: "0 1px 2px rgba(15, 23, 42, 0.08)",
  cursor: "pointer",
  lineHeight: 1,
  transition: "all 160ms ease",
};

const sharedHoverStyles: CSSProperties = {
  borderColor: "#000",
  backgroundColor: "#e2e8f0",
  color: "#000",
  boxShadow: "0 4px 10px rgba(15, 23, 42, 0.18)",
  transform: "scale(1.08)",
};

const styles = {
  closeButton: {
    ...sharedButtonStyles,
    marginLeft: "auto",
    fontSize: "1.5rem",
  },
  closeButtonHover: {
    ...sharedButtonStyles,
    ...sharedHoverStyles,
    marginLeft: "auto",
    fontSize: "1.5rem",
  },
  menuButton: {
    ...sharedButtonStyles,
    margin: "0 auto",
    fontSize: "1.25rem",
  },
  menuButtonHover: {
    ...sharedButtonStyles,
    ...sharedHoverStyles,
    margin: "0 auto",
    fontSize: "1.25rem",
  },
} satisfies Record<string, CSSProperties>;
