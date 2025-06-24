import type { ButtonHTMLAttributes } from "react";


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "link" | "inverted";
}

export default function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const baseStyles = "px-4 py-2 rounded transition";

  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90",
    secondary: "bg-primary text-white",
    outline: "border border-gray-300 text-gray-800 bg-white hover:bg-gray-100",
    link: "text-blue-600 hover:underline bg-transparent p-0",
    inverted: "bg-white text-primary border border-primary font-semibold rounded-md shadow-sm hover:bg-gray-100 transition"
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
