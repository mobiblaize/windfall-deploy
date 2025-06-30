import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Header from "./components/Header";
import { AppShell } from "@mantine/core";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
    // errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        // path: '',
        element: <Dashboard />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
    ],
  },
]);

function App() {
  return (
    <AppShell
      padding="md"
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main bg={'#fafafb'} p={0} pt={197}>
          <RouterProvider router={router} />
        <Footer />
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
