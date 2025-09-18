
import type { ButtonProps } from "../types/types";


export function Button({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  className = "cursor-pointer",
  type = "button",
  fullWidth = false,
}: ButtonProps) {
  const base = "px-3 py-1 rounded font-medium cursor-pointer  disabled:opacity-60";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    success: "bg-green-600 text-white hover:bg-green-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outline: "border text-gray-700 hover:bg-gray-50",
  };

  const width = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${width} ${className}`}
    >
      {children}
    </button>
  );
}
