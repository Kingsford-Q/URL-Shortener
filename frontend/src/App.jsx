import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { RequireAuth, RequireAdmin } from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import LinkDetailPage from "./pages/LinkDetailPage";
import ProtectedLinkPage from "./pages/ProtectedLinkPage";
import LinkStatusPage from "./pages/LinkStatusPage";
import AdminPage from "./pages/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/protected/:shortCode" element={<ProtectedLinkPage />} />
        <Route path="/link-status" element={<LinkStatusPage />} />

        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/links/:id" element={<LinkDetailPage />} />
        </Route>

        <Route element={<RequireAdmin />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
