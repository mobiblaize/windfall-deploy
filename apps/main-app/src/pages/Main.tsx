import { Outlet, useLocation } from "react-router-dom";
import { AppShell } from "@mantine/core";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useMediaQuery, useViewportSize } from "@mantine/hooks";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSideBar";

export default function MainLayout() {
  const { width } = useViewportSize();
  const location = useLocation();

  const isAdminLogin = location.pathname.startsWith("/admin/login");
  const isAdminPage = location.pathname.startsWith("/admin");

  const headerHeight = isAdminLogin
    ? 0
    : isAdminPage
      ? 68.7
      : width <= 639
        ? 92
        : width < 1095
          ? 110
          : 196;

          const mobileBP = 1095;

  const isMobile = useMediaQuery(`(max-width: ${mobileBP}px)`);
  
  const sideMenuWidth =
    (!isAdminPage || isAdminLogin || isMobile) ? 0 : 300;

  return (
      <AppShell
        padding="md"
        layout="alt" // 👈 makes navbar take full height
        navbar={
          isAdminPage && !isAdminLogin
            ? {
                width: sideMenuWidth,
                breakpoint: mobileBP,
                collapsed: { mobile: isMobile },
              }
            : undefined
        }
        header={
          !isAdminLogin
            ? { height: headerHeight }
            : undefined
        }
      >
        <AppShell.Header>
          {isAdminPage && !isAdminLogin ? <AdminHeader /> : <Header />}
        </AppShell.Header>

        {isAdminPage && !isAdminLogin && (
          <AppShell.Navbar p={0} w={sideMenuWidth ? sideMenuWidth : undefined}>
            <AdminSidebar />
          </AppShell.Navbar>
        )}

        <AppShell.Main p={0} pt={headerHeight} ps={sideMenuWidth} bg="#fafafb">
          <Outlet />
          {!isAdminPage && <Footer />}
        </AppShell.Main>
      </AppShell>
  );
}
