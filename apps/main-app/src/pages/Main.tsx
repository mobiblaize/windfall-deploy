import { Outlet } from "react-router-dom";
import { AppShell } from "@mantine/core";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MainLayout() {
  return (
    <AppShell padding="md">
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main bg="#fafafb" p={0} pt={197}>
        <Outlet /> 
        <Footer />
      </AppShell.Main>
    </AppShell>
  );
}
