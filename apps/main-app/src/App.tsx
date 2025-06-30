import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Draws from "./pages/Draws";
import MainLayout from "./pages/Main";

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'draws',
        element: <Draws />
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
