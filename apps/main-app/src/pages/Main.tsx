import { Outlet } from "react-router-dom";
import { AppShell } from "@mantine/core";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useViewportSize } from "@mantine/hooks";

export default function MainLayout() {
  const { width } = useViewportSize();

  // Tailwind-style breakpoints:
  // <= 639px       => 92px
  // 640px - 767px  => 110px
  // >= 768px       => 196px
  const paddingTop =
    width <= 639 ? 92 : width < 1095 ? 110 : 196;

  return (
    <AppShell padding="md">
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main bg="#fafafb" p={0} pt={paddingTop}>
        <Outlet />
        <Footer />
      </AppShell.Main>
    </AppShell>
  );
}
