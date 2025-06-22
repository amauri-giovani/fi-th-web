import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { PosPage } from "./pages/PosPage";
import { GroupSelectorPage } from "./pages/GroupSelectorPage";
import { GroupDetailsPage } from "./pages/GroupDetailsPage";
import { Layout } from "./components/layout/Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CompanyCreatePage } from "./components/CompanyCreatePage";


export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/companies/groups" element={<GroupSelectorPage />} />
        <Route path="/companies/groups/:id" element={<GroupDetailsPage />} />
        <Route path="/companies/create" element={<CompanyCreatePage />} />
        <Route path="/pos" element={<PosPage />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Layout>
  );
}
