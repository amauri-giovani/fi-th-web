import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { PosPage } from "./pages/PosPage";
import { GroupDetailsPage } from "./pages/GroupDetailsPage";
import { Layout } from "./components/layout/Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GroupList } from "./components/groups/GroupList";


export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/groups" element={<GroupList />} />
        <Route path="/groups/:id" element={<GroupDetailsPage />} />
        <Route path="/pos" element={<PosPage />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Layout>
  );
}
