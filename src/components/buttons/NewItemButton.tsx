import { useState, type ButtonHTMLAttributes, type CSSProperties, type MouseEvent } from "react";

type NewItemButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  label: string;
};

export function NewItemButton({
  label,
  type = "button",
  style,
  disabled = false,
  onMouseEnter,
  onMouseLeave,
  ...buttonProps
}: NewItemButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle = {
    ...styles.button,
    ...(isHovered ? styles.buttonHover : {}),
    ...(disabled ? styles.buttonDisabled : {}),
    ...style,
  };

  function handleMouseEnter(event: MouseEvent<HTMLButtonElement>) {
    if (!disabled) setIsHovered(true);
    onMouseEnter?.(event);
  }

  function handleMouseLeave(event: MouseEvent<HTMLButtonElement>) {
    setIsHovered(false);
    onMouseLeave?.(event);
  }

  return (
    <button
      {...buttonProps}
      type={type}
      style={buttonStyle}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span aria-hidden="true" style={styles.icon}>
        +
      </span>
      <span>{label}</span>
    </button>
  );
}

const styles = {
  button: {
    display: "inline-flex",
    minHeight: "38px",
    padding: "0.65rem 1rem",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    border: "1px solid #000",
    borderRadius: "8px",
    backgroundColor: "#000",
    color: "#fff",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "0.9rem",
    fontWeight: 600,
    transition: "all 160ms ease",
  },
  buttonHover: {
    backgroundColor: "#1e293b",
    boxShadow: "0 5px 12px rgba(15, 23, 42, 0.2)",
    transform: "translateY(-1px)",
  },
  buttonDisabled: {
    cursor: "not-allowed",
    opacity: 0.55,
    boxShadow: "none",
    transform: "none",
  },
  icon: {
    fontSize: "1.15rem",
    fontWeight: 500,
    lineHeight: 1,
  },
} satisfies Record<string, CSSProperties>;
