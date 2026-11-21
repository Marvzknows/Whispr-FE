import { Route, Routes } from "react-router";
import { GuestOnly, RequireAuth, RequireRole } from "./auth/guards";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import AdminPage from "./pages/AdminPage";
import { NotFoundPage } from "./pages/ErrorPages";
import SamplePage from "./pages/SamplePage";

export default function App() {
  return (
    <Routes>
      {/* Public, but only for logged-out users */}
      <Route element={<GuestOnly />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Authentication required */}
      <Route element={<RequireAuth />}>
        <Route element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="/sample" element={<SamplePage />} />

          {/* Authorization: ADMIN only */}
          <Route element={<RequireRole roles={["ADMIN"]} />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}