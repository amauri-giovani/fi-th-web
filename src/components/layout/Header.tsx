import { Bell } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white shadow px-6 py-4 flex items-center justify-end">
      <div className="flex items-center gap-4">
        <Bell className="text-gray-500" />
        <span className="text-sm text-gray-700">Olá, Bianca Nascimento</span>
      </div>
    </header>
  );
}

