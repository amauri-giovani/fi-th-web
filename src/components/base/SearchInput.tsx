import Input from "@/components/base/Input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";


interface SearchInputProps {
  onSearch: (term: string) => void;
  placeholder?: string;
  width?: string;
  delay?: number;
}

export default function SearchInput({
  onSearch,
  placeholder = "Buscar",
  width = "500px",
  delay = 200,
}: SearchInputProps) {
  const [term, setTerm] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(term);
    }, delay);

    return () => clearTimeout(timeout);
  }, [term, delay, onSearch]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setTerm(e.target.value);
  }

  return (
    <div style={{ width }}>
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none"
          aria-hidden="true"
        />
        <Input
          type="text"
          placeholder={placeholder}
          className="pl-9"
          value={term}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
