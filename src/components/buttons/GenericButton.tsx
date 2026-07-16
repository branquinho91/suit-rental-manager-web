import { useState, type ButtonHTMLAttributes, type CSSProperties, type MouseEvent } from "react";

type GenericButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function GenericButton({
  type = "button",
  children,
  style,
  onClick,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onMouseUp,
  ...buttonProps
}: GenericButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const buttonStyle = {
    ...styles.button,
    ...style,
    ...(isHovered ? styles.buttonHover : {}),
    ...(isPressed ? styles.buttonPressed : {}),
  };

  function handleMouseEnter(event: MouseEvent<HTMLButtonElement>) {
    setIsHovered(true);
    onMouseEnter?.(event);
  }

  function handleMouseLeave(event: MouseEvent<HTMLButtonElement>) {
    setIsHovered(false);
    setIsPressed(false);
    onMouseLeave?.(event);
  }

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    setIsHovered(false);
    setIsPressed(false);

    if (event.detail > 0) event.currentTarget.blur();

    onClick?.(event);
  }

  function handleMouseDown(event: MouseEvent<HTMLButtonElement>) {
    setIsPressed(true);
    onMouseDown?.(event);

    if (!event.defaultPrevented) event.preventDefault();
  }

  function handleMouseUp(event: MouseEvent<HTMLButtonElement>) {
    setIsPressed(false);
    onMouseUp?.(event);
  }

  return (
    <button
      {...buttonProps}
      type={type}
      style={buttonStyle}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
    >
      {children}
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
    backgroundColor: "#fff",
    color: "#000",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "0.9rem",
    fontWeight: 600,
    transition: "all 160ms ease",
  },
  buttonHover: {
    borderColor: "#cbd5e1",
    backgroundColor: "#e2e8f0",
    color: "#0f172a",
    boxShadow: "0 4px 10px rgba(15, 23, 42, 0.12)",
    transform: "translateY(-1px)",
  },
  buttonPressed: {
    borderColor: "#000000",
    backgroundColor: "#000000",
    color: "#ffffff",
    boxShadow: "0 2px 5px rgba(15, 23, 42, 0.22)",
    transform: "translateY(0)",
  },
} satisfies Record<string, CSSProperties>;
