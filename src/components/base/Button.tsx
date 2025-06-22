import type { ButtonHTMLAttributes } from "react";


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
}

export default function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  const baseStyles = "px-4 py-2 rounded text-sm font-medium transition";

  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90",
    outline: "border border-gray-300 text-gray-800 bg-white hover:bg-gray-100",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className || ""}`}
      {...props}
    />
  );
}
