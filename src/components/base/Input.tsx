import { forwardRef } from "react";


interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}


const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { hasError, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={`w-full px-3 py-2 rounded-md shadow-sm text-sm
        focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
        ${hasError ? "border border-red-500 ring-2 ring-red-500" : "border border-gray-300"}`}
      {...props}
    />
  );
});


export default Input;
