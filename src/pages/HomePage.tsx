import { Layout } from "@/components/layout/Layout";

export function HomePage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-gray-800">Bem-vindo à Home</h1>
      <p className="text-gray-600 mt-2">
        Clique em "Grupos" para visualizar os grupos.
      </p>
    </div>
  );
}
