import type { ButtonHTMLAttributes } from "react";


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "link" | "inverted";
  size?: "sm" | "md" | "lg";
  rounded?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  rounded = false,
  ...props
}: ButtonProps) {
  const sizeStyles = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-5 py-2.5"
  };
  const baseStyles = `${sizeStyles[size]} ${rounded ? "rounded-full" : "rounded"} transition`;
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90",
    secondary: "bg-primary text-white",
    outline: "border border-gray-300 text-gray-800 bg-white hover:bg-gray-100",
    link: "text-blue-600 hover:underline bg-transparent p-0",
    inverted: "bg-white text-primary border border-primary font-semibold shadow-sm hover:bg-gray-100 transition"
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
