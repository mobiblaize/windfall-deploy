import { Outlet, useLocation } from "react-router-dom";
import { AppShell } from "@mantine/core";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useMediaQuery, useViewportSize } from "@mantine/hooks";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSideBar";
import StructuredData from "../components/StructuredData";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "WindFall Raffle",
  "url": "https://homewindfall.com",
  "logo": "https://homewindfall.com/favicon.png",
  "description": "Participate in exciting raffles and win incredible prizes. Join WindFall Raffle today!",
  "sameAs": []
};

export default function MainLayout() {
  const { width } = useViewportSize();
  const location = useLocation();

  const adminAuthRoutes = [
    "/admin/login",
    "/admin/reset-password",
    "/admin/verify-email",
    "/admin/change-password",
  ];


  const isAdminAuth = adminAuthRoutes.some((path) =>
    location.pathname.startsWith(path)
  );
  const isAdminPage = location.pathname.startsWith("/admin");

  const headerHeight = isAdminAuth
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
    (!isAdminPage || isAdminAuth || isMobile) ? 0 : 320;

  return (
      <>
        <StructuredData data={organizationSchema} />
        <AppShell
        padding="md"
        layout="alt" // 👈 makes navbar take full height
        navbar={
          isAdminPage && !isAdminAuth
            ? {
                width: sideMenuWidth,
                breakpoint: mobileBP,
                collapsed: { mobile: isMobile },
              }
            : undefined
        }
        header={
          !isAdminAuth
            ? { height: headerHeight }
            : undefined
        }
      >
        {!isAdminAuth && <AppShell.Header>
          {isAdminPage ? <AdminHeader /> : <Header />}
        </AppShell.Header>}

        {isAdminPage && !isAdminAuth && (
          <AppShell.Navbar p={0} w={sideMenuWidth ? sideMenuWidth : undefined}>
            <AdminSidebar />
          </AppShell.Navbar>
        )}

        <AppShell.Main p={0} pt={headerHeight} ps={sideMenuWidth} bg="#fafafb">
          <Outlet />
          {!isAdminPage && <Footer />}
        </AppShell.Main>
      </AppShell>
      </>
  );
}
