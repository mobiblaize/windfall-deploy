import { Outlet, useLocation } from "react-router-dom";
import { AppShell } from "@mantine/core";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useViewportSize } from "@mantine/hooks";
import AdminHeader from "../components/AdminHeader";

export default function MainLayout() {
  const { width } = useViewportSize();
  const location = useLocation();

  // Check if path starts with /admin
  const isAdminLogin = location.pathname.startsWith("/admin/login");

  const isAdminPage = location.pathname.startsWith("/admin");

  const paddingTop = isAdminLogin ? 0 : isAdminPage ? 68.7 : width <= 639 ? 92 : width < 1095 ? 110 : 196;

  return (
    <AppShell padding="md">
      <AppShell.Header>
        {(!isAdminLogin && isAdminPage) && <AdminHeader />}
        {!isAdminPage && <Header />}
      </AppShell.Header>

      <AppShell.Main bg="#fafafb" p={0} pt={paddingTop}>
        <Outlet />
        {!isAdminPage && <Footer />}
      </AppShell.Main>
    </AppShell>
  );
}
