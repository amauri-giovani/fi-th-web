import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { CompanyGroupsPage } from "./pages/CompanyGroupsPage";
import { PosPage } from "./pages/PosPage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/companies/groups" element={<CompanyGroupsPage />} />
      <Route path="/pos" element={<PosPage />} />
    </Routes>
  );
}
